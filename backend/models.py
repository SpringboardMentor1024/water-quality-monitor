# backend/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # "user" or "admin"
    stations = relationship("WaterStation", back_populates="owner")
    readings = relationship("SensorReading", back_populates="user")

class WaterStation(Base):
    __tablename__ = "waterstations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False)
    ph_level = Column(Float, default=7.0)
    turbidity = Column(Float, default=0.0)
    chlorine = Column(Float, default=0.0)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="stations")
    readings = relationship("SensorReading", back_populates="station")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("waterstations.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # optional if device pushes directly
    timestamp = Column(DateTime, default=datetime.utcnow)
    ph_level = Column(Float, nullable=True)
    turbidity = Column(Float, nullable=True)
    chlorine = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    gas_level = Column(Float, nullable=True)
    heart_rate = Column(Float, nullable=True)
    bp_systolic = Column(Float, nullable=True)
    bp_diastolic = Column(Float, nullable=True)

    station = relationship("WaterStation", back_populates="readings")
    user = relationship("User", back_populates="readings")
