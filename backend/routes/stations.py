from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/stations", tags=["Water Stations"])


# Create a new water station
@router.post("/", response_model=schemas.WaterStationOut)
def create_station(station: schemas.WaterStationCreate, db: Session = Depends(get_db)):
    new_station = models.WaterStation(**station.dict())
    db.add(new_station)
    db.commit()
    db.refresh(new_station)
    return new_station


# Get a station by ID
@router.get("/{station_id}", response_model=schemas.WaterStationOut)
def get_station(station_id: int, db: Session = Depends(get_db)):
    station = db.query(models.WaterStation).filter(models.WaterStation.id == station_id).first()
    return station

