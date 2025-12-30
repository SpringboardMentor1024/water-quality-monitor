# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from database import get_db
# import models, schemas

# router = APIRouter(prefix="/readings", tags=["Station Readings"])


# # Add a new reading to a station
# @router.post("/", response_model=schemas.StationReadingOut)
# def add_reading(data: schemas.StationReadingCreate, db: Session = Depends(get_db)):
#     new_reading = models.StationReadings(**data.dict())
#     db.add(new_reading)
#     db.commit()
#     db.refresh(new_reading)
#     return new_reading


# # Get all readings for a specific station
# @router.get("/{station_id}")
# def get_station_readings(station_id: int, db: Session = Depends(get_db)):
#     readings = db.query(models.StationReadings).filter(
#         models.StationReadings.station_id == station_id
#     ).all()
#     return readings
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
import pandas as pd

router = APIRouter(prefix="/readings", tags=["Station Readings"])


# Add a new reading to a station
@router.post("/", response_model=schemas.StationReadingOut)
def add_reading(data: schemas.StationReadingCreate, db: Session = Depends(get_db)):
    new_reading = models.StationReadings(**data.dict())
    db.add(new_reading)
    db.commit()
    db.refresh(new_reading)
    return new_reading


# Get all readings for a specific station
@router.get("/{station_id}")
def get_station_readings(station_id: int, db: Session = Depends(get_db)):
    # 1️⃣ Try local DB first
    readings = db.query(models.StationReadings).filter(
        models.StationReadings.station_id == station_id
    ).all()

    if readings:
        return readings

    # 2️⃣ Fallback to CPCB CSV
    try:
        df = pd.read_csv("data/merged_readings.csv")
        df = df[df["station_id"] == station_id]

        fallback_readings = []
        for _, row in df.iterrows():
            fallback_readings.append({
                "station_id": station_id,
                "parameter": row["parameter"],
                "value": row["value"],
                "recorded_at": row["recorded_at"]
            })

        return fallback_readings

    except Exception:
        return []
