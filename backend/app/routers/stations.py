"""
Water Quality Monitor - Station Management Router
Handles CRUD operations, dashboard stats, station details, and time-series data.
"""

from datetime import datetime, timedelta, timezone
import random
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_

from app.core.database import get_db
from app.models.station import WaterStation
from app.models.readings import StationReading
from app.models.alert import Alert  # 🟢 Fixed Import (alerts plural)
from app.schemas.station_schema import StationResponse

router = APIRouter(prefix="/stations", tags=["Stations"])

# ---------------------------------------------------
# 1. DASHBOARD STATS (For Home Page)
# ---------------------------------------------------
@router.get("/dashboard/stats")
def dashboard_stats(hours: int = Query(24, ge=1, le=720), db: Session = Depends(get_db)):
    """
    Returns aggregate statistics for the dashboard cards.
    """
    total_stations = db.query(func.count(WaterStation.id)).scalar() or 0
    
    # Count Active Alerts
    active_alerts = db.query(Alert).count() # Simplified for now, or filter by status if you have it
    
    # Calculate Averages (pH & Turbidity)
    avg_ph = db.query(func.avg(StationReading.value)) \
        .filter(StationReading.parameter.ilike("ph")) \
        .scalar()

    avg_turb = db.query(func.avg(StationReading.value)) \
        .filter(StationReading.parameter.ilike("turbidity")) \
        .scalar()

    return {
        "totalStations": total_stations,
        "activeAlerts": active_alerts,
        "warnings": 0, # You can implement severity logic later
        "normal": max(0, total_stations - active_alerts),
        "unknown": 0 if total_stations > 0 else 1,
        "avgPh": round(float(avg_ph), 2) if avg_ph else 7.2,
        "avgTurbidity": round(float(avg_turb), 2) if avg_turb else 5.0,
        "lastSync": datetime.now(timezone.utc).isoformat(),
        "lookbackHours": hours,
    }

# ---------------------------------------------------
# 2. GET STATIONS (Smart Map & Search)
# ---------------------------------------------------
@router.get("/", response_model=List[StationResponse])
def read_stations(
    skip: int = 0, 
    limit: int = 500, 
    search: Optional[str] = Query(None, description="Search by City or Name"),
    north: Optional[float] = Query(None),
    south: Optional[float] = Query(None),
    east: Optional[float] = Query(None),
    west: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Returns stations. Supports Text Search AND Map Viewport Filtering.
    """
    query = db.query(WaterStation)

    # A. Text Search Filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                WaterStation.name.ilike(search_term),
                WaterStation.location.ilike(search_term)
            )
        )

    # B. Map Viewport Filter (Smart Map)
    if north and south and east and west:
        query = query.filter(
            and_(
                WaterStation.latitude <= north,
                WaterStation.latitude >= south,
                WaterStation.longitude <= east,
                WaterStation.longitude >= west
            )
        )
    
    return query.offset(skip).limit(limit).all()

# ---------------------------------------------------
# 3. GET STATION DETAILS (Analysis Page)
# ---------------------------------------------------
@router.get("/{station_id}", response_model=StationResponse)
def get_station_details(station_id: int, db: Session = Depends(get_db)):
    """
    Returns detailed info for a single station, including latest simulated readings.
    """
    station = db.query(WaterStation).filter(WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    # Fetch latest readings from DB
    readings = (
        db.query(StationReading)
        .filter(StationReading.station_id == station_id)
        .order_by(StationReading.recorded_at.desc())
        .limit(20)
        .all()
    )

    rm = {r.parameter.lower(): float(r.value) for r in readings}

    # Construct Response with Fallback Simulation
    return {
        "id": station.id,
        "name": station.name,
        "location": station.location,
        "latitude": station.latitude,
        "longitude": station.longitude,
        "status": station.status or "Active",
        "managed_by": station.managed_by or "Government",
        "created_at": station.created_at,
        "last_updated": "Just now",
        # Simulate data if DB is empty for demo purposes
        "latest_readings": {
            "ph": rm.get("ph", round(random.uniform(6.8, 7.5), 2)),
            "temperature": rm.get("temperature", round(random.uniform(18, 25), 1)),
            "dissolved_oxygen": rm.get("do", round(random.uniform(6, 8), 2)),
            "turbidity": rm.get("turbidity", round(random.uniform(2, 10), 2)),
            "tds": rm.get("tds", round(random.uniform(200, 500), 0)),
            "e_coli": rm.get("e_coli", round(random.uniform(0, 5), 0)),
        },
    }

# ---------------------------------------------------
# 4. STATION TIME-SERIES (Charts)
# ---------------------------------------------------
@router.get("/{station_id}/series")
def get_station_series(
    station_id: int,
    points: int = Query(12, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """
    Returns historical data points for drawing charts (Sparklines).
    """
    readings = (
        db.query(StationReading)
        .filter(StationReading.station_id == station_id)
        .order_by(StationReading.recorded_at.desc())
        .limit(points * 3)
        .all()
    )

    # If no real data -> Return Simulated Chart Data
    if not readings:
        now = datetime.now(timezone.utc)
        return {
            "station_id": station_id,
            "timestamps": [(now - timedelta(hours=i)).isoformat() for i in range(points)][::-1],
            "series": {
                "ph": [round(random.uniform(6.8, 7.4), 2) for _ in range(points)],
                "turbidity": [round(random.uniform(3, 15), 1) for _ in range(points)],
                "do": [round(random.uniform(5, 9), 1) for _ in range(points)],
            },
        }

    # Format Real Data
    timestamps, ph_vals, turb_vals, do_vals = [], [], [], []

    for r in reversed(readings[:points]):
        timestamps.append(r.recorded_at.isoformat())
        p = r.parameter.lower()
        if p == "ph":
            ph_vals.append(float(r.value))
        elif p == "turbidity":
            turb_vals.append(float(r.value))
        elif p in ("do", "oxygen"):
            do_vals.append(float(r.value))

    return {
        "station_id": station_id,
        "timestamps": timestamps,
        "series": {
            "ph": ph_vals,
            "turbidity": turb_vals,
            "do": do_vals,
        },
    }