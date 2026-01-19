from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models

router = APIRouter()

@router.get("/api/history/{station_name}")
def get_history(station_name: str, db: Session = Depends(get_db)):
    readings = (
        db.query(models.WaterReading)
        .filter(
            func.trim(func.lower(models.WaterReading.station_name))
            == func.trim(func.lower(station_name))
        )
        .order_by(models.WaterReading.recorded_at)
        .all()
    )

    return [
        {
            "time": r.recorded_at,

            "ph": float(r.ph),
            "turbidity": float(r.turbidity),
            "temperature": float(r.temperature),

            "arsenic": float(r.arsenic) if r.arsenic is not None else None,
            "dissolved_oxygen": float(r.dissolved_oxygen) if r.dissolved_oxygen is not None else None,
            "nitrate": float(r.nitrate) if r.nitrate is not None else None,
            "fluoride": float(r.fluoride) if r.fluoride is not None else None,
        }
        for r in readings
    ]
