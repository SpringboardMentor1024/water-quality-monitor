from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.station_schema import StationCreate, StationResponse
from app.schemas.reading_schema import ReadingResponse # 🟢 Import the new schema
from app.services.station_service import StationService
from app.models.readings import StationReading # 🟢 Import the Reading Model

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

# 3. Get Station Readings (For Charts 📊)
# This endpoint fetches the last 50 readings for a specific station
@router.get("/{station_id}/readings", response_model=List[ReadingResponse])
def get_station_readings(station_id: int, db: Session = Depends(get_db)):
    readings = db.query(StationReading).filter(
        StationReading.station_id == station_id
    ).order_by(StationReading.recorded_at.desc()).limit(50).all()
    
    return readings

# 4. Create New Station
@router.post("/", response_model=StationResponse, status_code=status.HTTP_201_CREATED)
def create_station(station: StationCreate, db: Session = Depends(get_db)):
    return StationService.create_station(db=db, station=station)