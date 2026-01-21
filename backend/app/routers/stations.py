from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from collections import defaultdict

from app.core.database import get_db
from app.models.station import WaterStation
from app.models.readings import StationReading

router = APIRouter(
    prefix="/stations",
    tags=["Stations"]
)

# =====================================================
# GET ALL STATIONS
# =====================================================
@router.get("/")
def get_all_stations(db: Session = Depends(get_db)):
    return db.query(WaterStation).all()


# =====================================================
# GET SINGLE STATION
# =====================================================
@router.get("/{station_id}")
def get_station(station_id: int, db: Session = Depends(get_db)):
    station = db.query(WaterStation).filter(WaterStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return station


# =====================================================
# GET RAW READINGS (DEBUG / OPTIONAL)
# =====================================================
@router.get("/{station_id}/readings")
def get_station_readings(station_id: int, db: Session = Depends(get_db)):
    return (
        db.query(StationReading)
        .filter(StationReading.station_id == station_id)
        .order_by(StationReading.recorded_at.desc())
        .all()
    )


# =====================================================
# 🔥 GET STATION SERIES (CRITICAL FOR ANALYTICS)
# =====================================================
@router.get("/{station_id}/series")
def get_station_series(station_id: int, db: Session = Depends(get_db)):
    """
    Returns time-series data grouped by hour.
    Output format matches frontend exactly.
    """

    readings = (
        db.query(
            func.date_trunc("hour", StationReading.recorded_at).label("ts"),
            StationReading.parameter,
            StationReading.value
        )
        .filter(StationReading.station_id == station_id)
        .order_by("ts")
        .all()
    )

    if not readings:
        return {
            "timestamps": [],
            "series": {
                "ph": [],
                "turbidity": [],
                "do": []
            }
        }

    grouped = defaultdict(dict)

    for ts, param, value in readings:
        grouped[ts][param] = float(value)

    timestamps = sorted(grouped.keys())

    ph_values = []
    turbidity_values = []
    do_values = []

    for ts in timestamps:
        ph_values.append(grouped[ts].get("ph"))
        turbidity_values.append(grouped[ts].get("turbidity"))
        do_values.append(grouped[ts].get("do"))

    return {
        "timestamps": [ts.isoformat() for ts in timestamps],
        "series": {
            "ph": ph_values,
            "turbidity": turbidity_values,
            "do": do_values
        }
    }


# =====================================================
# 🔧 DEV ONLY: GENERATE REAL SENSOR READINGS
# =====================================================
@router.post("/generate-live-readings/{station_id}")
def generate_live_readings(station_id: int, db: Session = Depends(get_db)):
    """
    Generates REALISTIC sensor data and stores it in DB.
    Can be called periodically to simulate live sensors.
    """

    now = datetime.utcnow()

    readings = [
        StationReading(
            station_id=station_id,
            parameter="ph",
            value=round(6.5 + (8.5 - 6.5) * 0.5, 2),
            recorded_at=now
        ),
        StationReading(
            station_id=station_id,
            parameter="turbidity",
            value=round(1.0 + (5.0 - 1.0) * 0.5, 2),
            recorded_at=now
        ),
        StationReading(
            station_id=station_id,
            parameter="do",
            value=round(4.5 + (8.0 - 4.5) * 0.5, 2),
            recorded_at=now
        )
    ]

    db.add_all(readings)
    db.commit()

    return {
        "message": "✅ Live sensor readings generated",
        "station_id": station_id,
        "timestamp": now.isoformat()
    }
