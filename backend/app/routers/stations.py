from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.station_schema import StationCreate, StationResponse
from app.services.station_service import StationService

router = APIRouter(
    prefix="/stations",
    tags=["Water Stations"]
)

# 1. Get All Stations
@router.get("/", response_model=List[StationResponse])
def read_stations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return StationService.get_stations(db, skip=skip, limit=limit)

# 2. Get Single Station
@router.get("/{station_id}", response_model=StationResponse)
def read_station(station_id: int, db: Session = Depends(get_db)):
    db_station = StationService.get_station(db, station_id=station_id)
    if db_station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return db_station

# 3. Create New Station
@router.post("/", response_model=StationResponse, status_code=status.HTTP_201_CREATED)
def create_station(station: StationCreate, db: Session = Depends(get_db)):
    return StationService.create_station(db=db, station=station)