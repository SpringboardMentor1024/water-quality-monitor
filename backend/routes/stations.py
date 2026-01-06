from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/stations", tags=["Water Stations"])


# ----------------------------
# CREATE STATION (UNCHANGED)
# ----------------------------
@router.post("/", response_model=schemas.WaterStationOut)
def create_station(station: schemas.WaterStationCreate, db: Session = Depends(get_db)):
    new_station = models.WaterStation(**station.dict())
    db.add(new_station)
    db.commit()
    db.refresh(new_station)
    return new_station


# ----------------------------
# GET STATION BY ID (UNCHANGED)
# ----------------------------
@router.get("/{station_id}", response_model=schemas.WaterStationOut)
def get_station(station_id: int, db: Session = Depends(get_db)):
    station = db.query(models.WaterStation).filter(
        models.WaterStation.id == station_id
    ).first()
    return station


# ---------------------------------------------------
# GET ALL STATIONS (FIXED FOR MILESTONE-2 FRONTEND)
# ---------------------------------------------------
@router.get("/")
def get_all_stations(db: Session = Depends(get_db)):
    stations = db.query(models.WaterStation).all()

    result = []

    for station in stations:
        # Count alerts
        active_alerts = db.query(models.Alerts).filter(
            models.Alerts.location == station.location
        ).count()

        # Count open reports
        open_reports = db.query(models.Reports).filter(
            models.Reports.location == station.location,
            models.Reports.status == models.ReportStatusEnum.pending
        ).count()

        # Check contamination
        contaminated = active_alerts > 0

        # Simple WQI calculation (mock but acceptable)
        readings = db.query(models.StationReadings).filter(
            models.StationReadings.station_id == station.id
        ).all()

        if readings:
            water_quality_index = sum(float(r.value) for r in readings) / len(readings)
        else:
            water_quality_index = 0

        result.append({
            "id": station.id,
            "name": station.name,
            "location": station.location,
            "latitude": station.latitude,
            "longitude": station.longitude,
            "managed_by": station.managed_by,
            "created_at": station.created_at,

            # 🔴 REQUIRED BY FRONTEND
            "active_alerts": active_alerts,
            "open_reports": open_reports,
            "contaminated": contaminated,
            "water_quality_index": water_quality_index,
        })

    return result
