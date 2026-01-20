from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import func

# ---------------- CORE IMPORTS ----------------
import models
import schemas
from database import engine, get_db

# ---------------- APP INIT ----------------
app = FastAPI(title="Water Quality Monitor API")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ------------------- CORS -------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ROUTERS ----------------
from auth import router as auth_router
from alert import router as alert_router
from history import router as history_router
from alert_predictive import router as alert_predictive_router
from user_reports import router as user_reports_router
from ngo import router as ngo_router          # ✅ NGO PROJECTS + STATIONS
from collaboration import router as collaboration_router  # if exists

# ---------------- DB INIT ----------------
models.Base.metadata.create_all(bind=engine)

# ---------------- REGISTER ROUTERS ----------------
app.include_router(auth_router)
app.include_router(alert_router)
app.include_router(history_router)
app.include_router(alert_predictive_router)
app.include_router(user_reports_router)
app.include_router(ngo_router)              # ✅ THIS ENABLES /api/ngo/*
app.include_router(collaboration_router)    # optional

# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "Water Quality Monitor backend is running"}

# ---------------- STATIONS ----------------
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

# ---------------- SENSOR READINGS ----------------
@app.post("/api/reports", response_model=schemas.ReportResponse)
def create_sensor_report(
    report: schemas.ReportCreate,
    db: Session = Depends(get_db)
):
    new_report = models.WaterReading(**report.model_dump())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

# ---------------- ANALYTICS ----------------
@app.get("/api/analytics/stations")
def get_station_analytics(db: Session = Depends(get_db)):
    results = (
        db.query(
            models.WaterReading.station_name,
            func.avg(models.WaterReading.ph).label("avg_ph"),
            func.avg(models.WaterReading.turbidity).label("avg_turbidity"),
            func.avg(models.WaterReading.temperature).label("avg_temperature"),
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
        }
        for r in results
    ]

# ---------------- ALERTS ----------------
@app.get("/api/alerts", response_model=list[schemas.AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return (
        db.query(models.Alert)
        .order_by(models.Alert.created_at.desc())
        .all()
    )