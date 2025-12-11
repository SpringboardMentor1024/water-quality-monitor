# backend/crud.py
from sqlalchemy.orm import Session
from . import models, schemas, auth
from typing import Optional

# Users
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Stations
def create_station(db: Session, owner_id: int, station: schemas.WaterStationCreate):
    db_station = models.WaterStation(**station.model_dump(), owner_id=owner_id)  # model_dump for pydantic v2
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station

def get_station(db: Session, station_id: int):
    return db.query(models.WaterStation).filter(models.WaterStation.id == station_id).first()

def list_stations(db: Session):
    return db.query(models.WaterStation).all()

def update_station(db: Session, station: models.WaterStation, updates: dict):
    for key, value in updates.items():
        setattr(station, key, value)
    db.commit()
    db.refresh(station)
    return station

def delete_station(db: Session, station: models.WaterStation):
    db.delete(station)
    db.commit()
    return

# Sensor readings
def add_reading(db: Session, reading: schemas.SensorReadingCreate):
    db_reading = models.SensorReading(**reading.model_dump())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

def get_readings_for_station(db: Session, station_id: int):
    return db.query(models.SensorReading).filter(models.SensorReading.station_id == station_id).order_by(models.SensorReading.timestamp.desc()).all()

def get_latest_reading(db: Session, station_id: int):
    return db.query(models.SensorReading).filter(models.SensorReading.station_id == station_id).order_by(models.SensorReading.timestamp.desc()).first()
