# backend/routes_sensors.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import schemas, crud
from .auth import get_db, get_current_user

router = APIRouter(prefix="/readings", tags=["readings"])

@router.post("/", response_model=schemas.SensorReadingOut)
def push_reading(reading: schemas.SensorReadingCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    station = crud.get_station(db, reading.station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    # If device pushes without user, current_user may be present — we still allow if owner or admin
    if station.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed to push reading for this station")
    reading.user_id = current_user.id
    created = crud.add_reading(db, reading)
    return created

@router.get("/station/{station_id}", response_model=List[schemas.SensorReadingOut])
def get_readings(station_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    station = crud.get_station(db, station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return crud.get_readings_for_station(db, station_id)

@router.get("/station/{station_id}/latest", response_model=schemas.SensorReadingOut)
def get_latest(station_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    latest = crud.get_latest_reading(db, station_id)
    if not latest:
        raise HTTPException(status_code=404, detail="No readings found")
    return latest
