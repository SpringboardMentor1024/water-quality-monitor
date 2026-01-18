from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database import SessionLocal
from models import (
    WaterStation,
    Reports,
    Alerts,
    Users,
    ReportStatusEnum,
    AlertStatusEnum
)

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
