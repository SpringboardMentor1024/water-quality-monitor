from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

# ✅ IMPORTANT: package-style imports
import models
import schemas
from database import engine, get_db
from auth import router as auth_router
from alert import router as alert_router
from history import router as history_router
from alert_predictive import router as alert_predictive_router



from fetch_wqp_data import sync_wqp_data
from fetch_wqp_live import sync_wqp_live_data


# ---------------------------------
# CREATE DATABASE TABLES
# ---------------------------------
models.Base.metadata.create_all(bind=engine)

# ---------------------------------
# APP INIT
# ---------------------------------
app = FastAPI(title="Water Quality Monitor API")

# ---------------------------------
# ROUTERS
# ---------------------------------
app.include_router(auth_router)
app.include_router(alert_router)
app.include_router(history_router)
app.include_router(alert_predictive_router)

# ---------------------------------
# CORS
# ---------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------
# ROOT
# ---------------------------------
@app.get("/")
def root():
    return {"message": "Water Quality Monitor backend is running"}

# ---------------------------------
# HELPER: AUTO ALERT CREATION
# ---------------------------------
def create_alert_if_needed(report, db: Session):
    if report.status in ["Warning", "Unsafe"]:
        message = (
            f"{report.station_name} water quality is {report.status}. "
            f"pH: {report.ph}, Turbidity: {report.turbidity}, "
            f"Temperature: {report.temperature}°C"
        )

        alert = models.Alert(
            station_name=report.station_name,
            status=report.status,
            message=message
        )
        db.add(alert)

# ---------------------------------
# STATIONS APIs
# ---------------------------------
@app.post("/api/stations", response_model=schemas.StationResponse)
def create_station(
    station: schemas.StationCreate,
    db: Session = Depends(get_db)
):
    new_station = models.Station(**station.model_dump())
    db.add(new_station)
    db.commit()
    db.refresh(new_station)
    return new_station


@app.get("/api/stations", response_model=list[schemas.StationResponse])
def get_stations(
    status: str | None = None,
    source: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Station)

    if status:
        query = query.filter(models.Station.status == status)

    if source:
        query = query.filter(models.Station.source == source)

    return query.all()

# ---------------------------------
# REPORTS APIs
# ---------------------------------
@app.post("/api/reports", response_model=schemas.ReportResponse)
def create_report(
    report: schemas.ReportCreate,
    db: Session = Depends(get_db)
):
    new_report = models.WaterReading(**report.model_dump())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # auto alert
    create_alert_if_needed(new_report, db)
    db.commit()

    # update station snapshot
    station = (
        db.query(models.Station)
        .filter(models.Station.name == new_report.station_name)
        .first()
    )
    if station:
        station.ph = new_report.ph
        station.turbidity = new_report.turbidity
        station.temperature = new_report.temperature
        station.arsenic = new_report.arsenic
        station.dissolved_oxygen = new_report.dissolved_oxygen
        station.nitrate = new_report.nitrate
        station.fluoride = new_report.fluoride
        station.status = new_report.status
        db.commit()

    return new_report


@app.get("/api/reports", response_model=list[schemas.ReportResponse])
def get_reports(
    station: str | None = None,
    status: str | None = None,
    source: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.WaterReading)

    if station:
        query = query.filter(
            models.WaterReading.station_name.ilike(f"%{station}%")
        )

    if status:
        query = query.filter(models.WaterReading.status == status)

    if source:
        query = query.filter(models.WaterReading.source == source)

    return query.order_by(
        models.WaterReading.recorded_at.desc()
    ).all()

# ---------------------------------
# ANALYTICS APIs
# ---------------------------------
@app.get("/api/analytics/stations")
def get_station_analytics(db: Session = Depends(get_db)):
    results = (
        db.query(
            models.WaterReading.station_name,
            func.avg(models.WaterReading.ph).label("avg_ph"),
            func.avg(models.WaterReading.turbidity).label("avg_turbidity"),
            func.avg(models.WaterReading.temperature).label("avg_temperature"),
            func.avg(models.WaterReading.arsenic).label("avg_arsenic"),
            func.avg(models.WaterReading.dissolved_oxygen).label("avg_do"),
        )
        .group_by(models.WaterReading.station_name)
        .all()
    )

    return [
        {
            "station_name": r.station_name,
            "avg_ph": float(r.avg_ph or 0),
            "avg_turbidity": float(r.avg_turbidity or 0),
            "avg_temperature": float(r.avg_temperature or 0),
            "avg_arsenic": float(r.avg_arsenic or 0),
            "avg_do": float(r.avg_do or 0),
        }
        for r in results
    ]

# ---------------------------------
# ALERTS APIs
# ---------------------------------
@app.get("/api/alerts", response_model=list[schemas.AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(models.Alert).order_by(
        models.Alert.created_at.desc()
    ).all()

# ---------------------------------
# EXTERNAL DATA SYNC APIs
# ---------------------------------
@app.post("/api/sync/india")
def sync_india_data():
    from backend.fetch_india_data import populate_india_data
    populate_india_data()
    return {"message": "Indian water data synced successfully"}


@app.post("/api/sync/wqp")
def sync_wqp():
    sync_wqp_data()
    return {"message": "WQP data synced successfully"}


@app.post("/api/sync/wqp/live")
def sync_wqp_live():
    sync_wqp_live_data()
    return {"message": "WQP live data synced successfully"}

