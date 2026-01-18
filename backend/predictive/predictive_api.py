from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import numpy as np
import joblib
import os

from database import SessionLocal
from models import StationReadings, WaterStation, ParameterEnum

router = APIRouter(prefix="/predictive", tags=["predictive"])

# Load trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")
model = joblib.load(MODEL_PATH)

# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/analyze")
def analyze_all_stations(db: Session = Depends(get_db)):
    results = []
    cutoff_date = datetime.utcnow() - timedelta(days=30)

    stations = db.query(WaterStation).all()

    for station in stations:
        readings = db.query(StationReadings).filter(
            StationReadings.station_id == station.id,
            StationReadings.recorded_at >= cutoff_date,
            StationReadings.parameter.in_([
                ParameterEnum.pH,
                ParameterEnum.DO,
                ParameterEnum.turbidity
            ])
        ).all()

        if not readings:
            continue

        # Group readings
        values = {"pH": [], "DO": [], "turbidity": []}

        for r in readings:
            values[r.parameter.value].append(float(r.value))

        if not all(values.values()):
            continue

        avg_ph = np.mean(values["pH"])
        avg_do = np.mean(values["DO"])
        avg_turb = np.mean(values["turbidity"])

        X = np.array([[avg_ph, avg_do, avg_turb]])

        base_prob = float(model.predict_proba(X)[0][1]) * 100

        # Rule-based adjustment (real data only)
        severity = 0

        if avg_ph < 6.5 or avg_ph > 8.5:
            severity += 20
        if avg_do < 5:
            severity += 25
        if avg_turb > 5:
            severity += 30

        probability = min(base_prob + severity, 100)

        if probability >= 75:
            risk = "HIGH"
        elif probability >= 40:
            risk = "MODERATE"
        else:
            risk = "LOW"

        results.append({
            "station_id": station.id,
            "station_name": station.name,
            "risk_level": risk,
            "probability": round(probability, 2),

            # ✅ THIS IS THE IMPORTANT PART
            "avg_ph": round(avg_ph, 2),
            "avg_do": round(avg_do, 2),
            "avg_turbidity": round(avg_turb, 2),

            "predicted_on": datetime.utcnow()
        })

    return results
