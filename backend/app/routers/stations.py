from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.station import WaterStation
from app.models.readings import StationReading

router = APIRouter(
    prefix="/stations",   # 🔥 IMPORTANT: PLURAL
    tags=["Stations"]
)

# =====================================================
# GET ALL STATIONS (EXISTING / OPTIONAL)
# =====================================================
@router.get("/")
def get_all_stations(db: Session = Depends(get_db)):
    return db.query(WaterStation).all()


# =====================================================
# GET SINGLE STATION (EXISTING)
# =====================================================
@router.get("/{station_id}")
def get_station(station_id: int, db: Session = Depends(get_db)):
    station = db.query(WaterStation).filter(WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return station


# =====================================================
# 🔥 NEW: GET STATION READINGS (THIS FIXES NGO ISSUE)
# =====================================================
@router.get("/{station_id}/readings")
def get_station_readings(
    station_id: int,
    db: Session = Depends(get_db)
):
    readings = (
        db.query(StationReading)
        .filter(StationReading.station_id == station_id)
        .order_by(StationReading.recorded_at.desc())
        .all()
    )

    return readings
