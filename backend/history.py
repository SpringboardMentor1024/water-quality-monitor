from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter()

@router.get("/api/history/{station_name}")
def get_history(station_name: str, db: Session = Depends(get_db)):
    readings = (
        db.query(models.WaterReading)
        .filter(models.WaterReading.station_name == station_name)
        .order_by(models.WaterReading.recorded_at)
        .all()
    )

    return [
        {
            "time": r.recorded_at,
            "ph": float(r.ph),
            "turbidity": float(r.turbidity),
            "temperature": float(r.temperature)
        }
        for r in readings
    ]
