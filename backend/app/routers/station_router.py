from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.station_schema import StationOut, StationCreate
from app.services.station_service import StationService

router = APIRouter(
    prefix="/stations",
    tags=["Stations"],
)

@router.get("/", response_model=List[StationOut])
def read_stations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return StationService.get_stations(db, skip=skip, limit=limit)

@router.get("/{station_id}", response_model=StationOut)
def read_station(station_id: int, db: Session = Depends(get_db)):
    station = StationService.get_station(db, station_id)
    if not station:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Station not found")
    return station

@router.post("/", response_model=StationOut, status_code=status.HTTP_201_CREATED)
def create_station(station: StationCreate, db: Session = Depends(get_db)):
    return StationService.create_station(db, station)
