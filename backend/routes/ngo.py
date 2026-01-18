from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import Body
from database import SessionLocal
from models import (
    WaterStation,
    StationReadings,
    Reports,
    Alerts,
    Users,
    ReportStatusEnum,
    AlertStatusEnum
)
from fastapi import Query
router = APIRouter(prefix="/ngo", tags=["NGO"])


# -------------------- DB Dependency --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- NGO DASHBOARD --------------------
@router.get("/dashboard")
def get_ngo_dashboard(db: Session = Depends(get_db)):
    """
    Aggregated NGO dashboard data.
    Fully backend-driven (NO hardcoded data).
    """

    # -------------------- STATS --------------------
    assigned_stations = db.query(WaterStation).count()

    pending_reports = (
        db.query(Reports)
        .filter(Reports.status == ReportStatusEnum.pending)
        .count()
    )

    critical_alerts = (
        db.query(Alerts)
        .filter(Alerts.status == AlertStatusEnum.active)
        .count()
    )

    # ⚠️ Projects table NOT implemented yet → truthful zero
    active_projects = 0

    # -------------------- STATIONS --------------------
    stations = []
    for station in db.query(WaterStation).all():
        stations.append({
            "id": station.id,
            "name": station.name,
            "location": station.location,
            "latitude": float(station.latitude) if station.latitude else None,
            "longitude": float(station.longitude) if station.longitude else None
        })

    # -------------------- RECENT REPORTS --------------------
    recent_reports = []
    reports = (
        db.query(Reports, Users)
        .join(Users, Reports.user_id == Users.id)
        .order_by(Reports.created_at.desc())
        .limit(10)
        .all()
    )

    for report, user in reports:
        recent_reports.append({
            "id": report.id,
            "stationName": report.location,
            "submittedBy": user.name,
            "status": report.status.value,
            "createdAt": report.created_at
        })

    # -------------------- RESPONSE --------------------
    return {
        "stats": {
            "activeProjects": active_projects,
            "assignedStations": assigned_stations,
            "pendingReports": pending_reports,
            "criticalAlerts": critical_alerts
        },
        "projects": [],   # ❌ Project entity not yet available
        "stations": stations,
        "recentReports": recent_reports
    }
# -------------------- NGO STATIONS (PROJECT-WISE) --------------------
# -------------------- NGO STATIONS (PROJECT-WISE) --------------------
@router.get("/stations")
def get_ngo_stations(
    project_id: int = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(WaterStation)

    if project_id is not None:
        query = query.filter(WaterStation.project_id == int(project_id))

    stations = query.all()

    return [
        {
            "id": s.id,
            "name": s.name,
            "location": s.location,
            "latitude": float(s.latitude) if s.latitude else None,
            "longitude": float(s.longitude) if s.longitude else None,
            "managed_by": s.managed_by,
            "project_id": s.project_id
        }
        for s in stations
    ]
from fastapi import HTTPException

@router.get("/stations/{station_id}")
def get_station_details(
    station_id: int,
    db: Session = Depends(get_db)
):
    station = (
        db.query(WaterStation)
        .filter(WaterStation.id == station_id)
        .first()
    )

    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    return {
        "id": station.id,
        "name": station.name,
        "location": station.location,
        "latitude": float(station.latitude) if station.latitude else None,
        "longitude": float(station.longitude) if station.longitude else None,
        "managed_by": station.managed_by,
        "project_id": station.project_id
    }
@router.get("/stations/{station_id}/reports")
def get_station_reports(
    station_id: int,
    db: Session = Depends(get_db)
):
    station = (
        db.query(WaterStation)
        .filter(WaterStation.id == station_id)
        .first()
    )

    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    reports = (
        db.query(Reports)
        .filter(Reports.location == station.location)
        .all()
    )

    return [
        {
            "id": r.id,
            "description": r.description,
            "status": r.status.value if r.status else "pending",
            "created_at": r.created_at
        }
        for r in reports
    ]
@router.get("/stations/{station_id}/parameters")
def get_station_parameters(
    station_id: int,
    db: Session = Depends(get_db)
):
    readings = (
        db.query(StationReadings)
        .filter(StationReadings.station_id == station_id)
        .order_by(StationReadings.recorded_at.desc())
        .all()
    )

    return [
        {
            "parameter": r.parameter.value,
            "value": float(r.value),
            "recorded_at": r.recorded_at
        }
        for r in readings
    ]
# -------------------- STATION READINGS (PARAMETERS) --------------------
@router.get("/stations/{station_id}/readings")
def get_station_readings(
    station_id: int,
    db: Session = Depends(get_db)
):
    readings = (
        db.query(StationReadings)
        .filter(StationReadings.station_id == station_id)
        .order_by(StationReadings.recorded_at.desc())
        .all()
    )

    return [
        {
            "parameter": r.parameter.value,
            "value": float(r.value),
            "recorded_at": r.recorded_at
        }
        for r in readings
    ]
@router.post("/reports")
def create_report(
    payload: dict,
    db: Session = Depends(get_db)
):
    station_id = payload.get("stationId")
    description = payload.get("description")
    water_source = payload.get("water_source")

    station = db.query(WaterStation).filter(
        WaterStation.id == int(station_id)
    ).first()

    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    report = Reports(
    user_id=1,                      # temporary user
    station_id=station.id,          # ✅ THIS LINE FIXES IT
    location=station.location,
    description=description,
    water_source=water_source,
    status=ReportStatusEnum.pending,
    created_at=datetime.utcnow()
)


    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "message": "Report submitted",
        "id": report.id
    }
@router.put("/reports/{report_id}/status")
def update_report_status(
    report_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db)
):
    status = payload.get("status")

    if status not in ["pending", "verified", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    report = db.query(Reports).filter(Reports.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = ReportStatusEnum(status)
    db.commit()

    return {
        "message": "Report status updated",
        "id": report.id,
        "status": report.status.value
    }
