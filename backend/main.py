from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .database import engine, get_db

# This command creates the database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Water Quality Monitor API")

# --- Middleware ---
# Allow requests from your frontend (adjust origins if your frontend is on a different URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.post("/api/readings", response_model=schemas.WaterReading, status_code=201)
def create_reading(reading: schemas.WaterReadingCreate, db: Session = Depends(get_db)):
    """
    Creates a new water quality reading.
    """
    db_reading = models.WaterReading(**reading.dict())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading


@app.get("/api/readings", response_model=List[schemas.WaterReading])
def get_all_readings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieves all water quality readings from the database, ordered by the most recent.
    """
    readings = db.query(models.WaterReading).order_by(models.WaterReading.recorded_at.desc()).offset(skip).limit(limit).all()
    return readings

@app.get("/")
def read_root():
    return {"message": "Welcome to the Water Quality Monitor API!"}