# backend/routes_stations.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import schemas, crud, auth
from .auth import get_db, get_current_user

router = APIRouter(prefix="/stations", tags=["stations"])

@router.post("/", response_model=schemas.WaterStationOut)
def create_station_endpoint(station: schemas.WaterStationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    created = crud.create_station(db, owner_id=current_user.id, station=station)
    return created

@router.get("/", response_model=List[schemas.WaterStationOut])
def list_stations_endpoint(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return crud.list_stations(db)

@router.get("/{station_id}", response_model=schemas.WaterStationOut)
def get_station_endpoint(station_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    st = crud.get_station(db, station_id)
    if not st:
        raise HTTPException(status_code=404, detail="Station not found")
    return st

@router.put("/{station_id}", response_model=schemas.WaterStationOut)
def update_station_endpoint(station_id: int, updates: schemas.WaterStationBase, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    st = crud.get_station(db, station_id)
    if not st:
        raise HTTPException(status_code=404, detail="Station not found")
    if st.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    updated = crud.update_station(db, st, updates.model_dump())
    return updated

@router.delete("/{station_id}")
def delete_station_endpoint(station_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    st = crud.get_station(db, station_id)
    if not st:
        raise HTTPException(status_code=404, detail="Station not found")
    if st.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    crud.delete_station(db, st)
    return {"detail": "deleted"}
