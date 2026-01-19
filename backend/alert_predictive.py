from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models

router = APIRouter(
    prefix="/alerts/predictive",
    tags=["Predictive Alerts"]
)

@router.get("")
def get_predictive_alerts(db: Session = Depends(get_db)):
    results = (
        db.query(
            models.WaterReading.station_name,
            func.avg(models.WaterReading.ph).label("ph"),
            func.avg(models.WaterReading.turbidity).label("turbidity"),
            func.avg(models.WaterReading.dissolved_oxygen).label("do"),
            func.avg(models.WaterReading.nitrate).label("nitrate"),
            func.avg(models.WaterReading.arsenic).label("arsenic"),
            func.avg(models.WaterReading.fluoride).label("fluoride"),
        )
        .group_by(models.WaterReading.station_name)
        .all()
    )

    alerts = []

    for r in results:
        ph = float(r.ph or 0)
        turb = float(r.turbidity or 0)
        do = float(r.do or 0)
        nitrate = float(r.nitrate or 0)
        arsenic = float(r.arsenic or 0)
        fluoride = float(r.fluoride or 0)

        risk = "Safe"
        reasons = []

        # ---------- CRITICAL ----------
        if turb > 20:
            risk = "Critical"; reasons.append("Extremely high turbidity")
        if ph < 6 or ph > 9:
            risk = "Critical"; reasons.append("Dangerous pH level")
        if do and do < 3:
            risk = "Critical"; reasons.append("Very low dissolved oxygen")
        if nitrate > 70:
            risk = "Critical"; reasons.append("Excess nitrate contamination")
        if arsenic > 0.05:
            risk = "Critical"; reasons.append("Toxic arsenic level")
        if fluoride > 2:
            risk = "Critical"; reasons.append("Excess fluoride detected")

        # ---------- WARNING ----------
        if risk != "Critical":
            if turb >= 10:
                risk = "Warning"; reasons.append("Elevated turbidity")
            if ph < 6.5 or ph > 8.5:
                risk = "Warning"; reasons.append("pH approaching unsafe range")
            if do and 3 <= do <= 5:
                risk = "Warning"; reasons.append("Moderate dissolved oxygen")
            if 45 <= nitrate <= 70:
                risk = "Warning"; reasons.append("High nitrate concentration")
            if 0.01 <= arsenic <= 0.05:
                risk = "Warning"; reasons.append("Arsenic nearing unsafe level")
            if 1.5 <= fluoride <= 2:
                risk = "Warning"; reasons.append("High fluoride level")

        alerts.append({
            "station": r.station_name,
            "risk_level": risk,
            "reason": ", ".join(reasons) if reasons else "All parameters normal",
            "avg_ph": round(ph, 2),
            "avg_turbidity": round(turb, 2),
            "avg_do": round(do, 2),
            "avg_nitrate": round(nitrate, 2),
            "avg_arsenic": round(arsenic, 3),
            "avg_fluoride": round(fluoride, 2),
        })

    return alerts
