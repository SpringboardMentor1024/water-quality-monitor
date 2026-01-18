from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import numpy as np
import joblib
import os

from database import SessionLocal
from models import StationReadings, WaterStation, ParameterEnum

router = APIRouter(prefix="/predictive", tags=["predictive"])

# Load trained model (uses only pH, DO, Turbidity)
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
                ParameterEnum.turbidity,
                ParameterEnum.iron,
                ParameterEnum.arsenic,
                ParameterEnum.lead
            ])
        ).all()

        if not readings:
            continue

        # Group readings
        values = {key: [] for key in ["pH", "DO", "turbidity", "iron", "arsenic", "lead"]}

        for r in readings:
            values[r.parameter.value].append(float(r.value))

        if not all(values.values()):
            continue

        # Calculate averages
        avg_ph = np.mean(values["pH"])
        avg_do = np.mean(values["DO"])
        avg_turb = np.mean(values["turbidity"])
        avg_iron = np.mean(values["iron"])
        avg_arsenic = np.mean(values["arsenic"])
        avg_lead = np.mean(values["lead"])

        # Predictive model (only pH, DO, Turbidity)
        X = np.array([[avg_ph, avg_do, avg_turb]])
        base_prob = float(model.predict_proba(X)[0][1]) * 100

        # ------------------------
        # Rule-based severity (proportional)
        # ------------------------
        severity = 0

        # pH
        if avg_ph < 6.5:
            severity += (6.5 - avg_ph) * 20
        elif avg_ph > 8.5:
            severity += (avg_ph - 8.5) * 20

        # Dissolved Oxygen
        if avg_do < 5:
            severity += (5 - avg_do) * 15

        # Turbidity
        if avg_turb > 5:
            severity += (avg_turb - 5) * 10

        # Iron
        if avg_iron > 0.3:
            severity += ((avg_iron - 0.3) / 0.1) * 15  # proportionate

        # Arsenic
        if avg_arsenic > 0.01:
            severity += ((avg_arsenic - 0.01) / 0.01) * 20

        # Lead
        if avg_lead > 0.01:
            severity += ((avg_lead - 0.01) / 0.01) * 20

        # Combine model probability + severity
        probability = min(base_prob + severity, 100)

        # Assign risk level
        if probability >= 75:
            risk = "HIGH"
        elif probability >= 40:
            risk = "MODERATE"
        else:
            risk = "LOW"

        # Append results
        results.append({
            "station_id": station.id,
            "station_name": station.name,
            "risk_level": risk,
            "probability": round(probability, 2),
            "avg_ph": round(avg_ph, 2),
            "avg_do": round(avg_do, 2),
            "avg_turbidity": round(avg_turb, 2),
            "avg_iron": round(avg_iron, 3),
            "avg_arsenic": round(avg_arsenic, 4),
            "avg_lead": round(avg_lead, 4),
            "predicted_on": datetime.utcnow()
        })

    return results
