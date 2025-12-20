from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

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
    readings = db.query(models.StationReadings).filter(
        models.StationReadings.station_id == station_id
    ).all()
    return readings
