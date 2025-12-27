# app/models/readings.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    ForeignKey,
    Float,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base
import enum


# ---------------- Existing models ---------------- #


class StationReading(Base):
    __tablename__ = "station_readings"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("water_stations.id"))
    parameter = Column(String, nullable=False)  # pH, turbidity, etc.
    value = Column(Numeric, nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    station = relationship("WaterStation", back_populates="readings")


class ReportStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    title = Column(String, nullable=True)
    moderation_notes = Column(String, nullable=True)

    photo_url = Column(String, nullable=True)
    location = Column(String, nullable=False)
    description = Column(String, nullable=True)
    water_source = Column(String, nullable=True)
    status = Column(Enum(ReportStatus), default=ReportStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="reports")


# ---------------- NEW: 2011 water-quality model ---------------- #


class WaterQuality2011(Base):
    __tablename__ = "water_quality_2011"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=False)

    # Temperature
    temp_min = Column(Float)
    temp_max = Column(Float)
    temp_mean = Column(Float)

    # Dissolved Oxygen
    do_min = Column(Float)
    do_max = Column(Float)
    do_mean = Column(Float)

    # pH
    ph_min = Column(Float)
    ph_max = Column(Float)
    ph_mean = Column(Float)

    # Conductivity
    cond_min = Column(Float)
    cond_max = Column(Float)
    cond_mean = Column(Float)

    # BOD
    bod_min = Column(Float)
    bod_max = Column(Float)
    bod_mean = Column(Float)

    # Nitrate + Nitrite
    nitrate_min = Column(Float)
    nitrate_max = Column(Float)
    nitrate_mean = Column(Float)

    # Fecal coliform
    fecal_coliform_min = Column(Float)
    fecal_coliform_max = Column(Float)
    fecal_coliform_mean = Column(Float)

    # Total coliform
    total_coliform_min = Column(Float)
    total_coliform_max = Column(Float)
    total_coliform_mean = Column(Float)

    # Fluoride
    fluoride_min = Column(Float)
    fluoride_max = Column(Float)
    fluoride_mean = Column(Float)

    station = relationship("WaterStation", back_populates="water_quality_2011")
