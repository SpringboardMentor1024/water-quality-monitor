# app/routers/stations.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.core.database import get_db
from app.models.station import WaterStation
from app.models.readings import WaterQuality2011

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get("/", response_model=List[Dict[str, Any]])
def list_stations(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    stations = db.query(WaterStation).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "location": s.location,
            "latitude": float(s.latitude),
            "longitude": float(s.longitude),
            "status": s.status,
        }
        for s in stations
    ]


@router.get("/water-quality/2011/{station_name}")
def get_water_quality_2011(
    station_name: str,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    station = (
        db.query(WaterStation)
        .filter(WaterStation.name == station_name)
        .first()
    )
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    rows: List[WaterQuality2011] = (
        db.query(WaterQuality2011)
        .filter(WaterQuality2011.station_id == station.id)
        .all()
    )

    water_data: List[Dict[str, float]] = [
        {
            "temp_min": float(r.temp_min) if r.temp_min is not None else None,
            "temp_max": float(r.temp_max) if r.temp_max is not None else None,
            "temp_mean": float(r.temp_mean) if r.temp_mean is not None else None,
            "do_min": float(r.do_min) if r.do_min is not None else None,
            "do_max": float(r.do_max) if r.do_max is not None else None,
            "do_mean": float(r.do_mean) if r.do_mean is not None else None,
            "ph_min": float(r.ph_min) if r.ph_min is not None else None,
            "ph_max": float(r.ph_max) if r.ph_max is not None else None,
            "ph_mean": float(r.ph_mean) if r.ph_mean is not None else None,
            "cond_min": float(r.cond_min) if r.cond_min is not None else None,
            "cond_max": float(r.cond_max) if r.cond_max is not None else None,
            "cond_mean": float(r.cond_mean) if r.cond_mean is not None else None,
            "bod_min": float(r.bod_min) if r.bod_min is not None else None,
            "bod_max": float(r.bod_max) if r.bod_max is not None else None,
            "bod_mean": float(r.bod_mean) if r.bod_mean is not None else None,
            "nitrate_min": float(r.nitrate_min) if r.nitrate_min is not None else None,
            "nitrate_max": float(r.nitrate_max) if r.nitrate_max is not None else None,
            "nitrate_mean": float(r.nitrate_mean) if r.nitrate_mean is not None else None,
            "fecal_coliform_min": float(r.fecal_coliform_min) if r.fecal_coliform_min is not None else None,
            "fecal_coliform_max": float(r.fecal_coliform_max) if r.fecal_coliform_max is not None else None,
            "fecal_coliform_mean": float(r.fecal_coliform_mean) if r.fecal_coliform_mean is not None else None,
            "total_coliform_min": float(r.total_coliform_min) if r.total_coliform_min is not None else None,
            "total_coliform_max": float(r.total_coliform_max) if r.total_coliform_max is not None else None,
            "total_coliform_mean": float(r.total_coliform_mean) if r.total_coliform_mean is not None else None,
            "fluoride_min": float(r.fluoride_min) if r.fluoride_min is not None else None,
            "fluoride_max": float(r.fluoride_max) if r.fluoride_max is not None else None,
            "fluoride_mean": float(r.fluoride_mean) if r.fluoride_mean is not None else None,
        }
        for r in rows
    ]

    return {
        "station": {
            "id": station.id,
            "name": station.name,
            "location": station.location,
            "latitude": float(station.latitude),
            "longitude": float(station.longitude),
            "status": station.status,
        },
        "water_quality_2011": water_data,
    }


@router.get("/debug")
def debug_stations(db: Session = Depends(get_db)) -> Dict[str, Any]:
    stations = db.query(WaterStation).all()
    station_names = [s.name for s in stations]
    water_quality_count = db.query(WaterQuality2011).count()

    return {
        "stations_count": len(stations),
        "station_names": station_names,
        "water_quality_2011_records": water_quality_count,
    }
