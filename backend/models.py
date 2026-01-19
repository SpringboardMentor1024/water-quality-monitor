from sqlalchemy import (
    Column,
    Integer,
    Numeric,
    String,
    Boolean,
    TIMESTAMP,
    DateTime,
    ForeignKey,
    Enum,
    Text,
    text,              # ✅ FIXED: required for server_default
)
from database import Base
from datetime import datetime
import enum


# =====================================================
# ENUMS
# =====================================================
class ReportStatus(enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


# =====================================================
# USERS (AUTH)
# =====================================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)   # admin / ngo / user
    ngo_id = Column(Integer, nullable=True)


# =====================================================
# REPORTS (USER SUBMISSIONS)
# =====================================================
class ReportStatus(enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    photo_url = Column(String, nullable=True)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    water_source = Column(String, nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)

# =====================================================
# WATER READINGS (VERIFIED / SENSOR DATA)
# =====================================================
class WaterReading(Base):
    __tablename__ = "water_readings"

    id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String, nullable=False)

    ph = Column(Numeric(4, 2), nullable=False)
    turbidity = Column(Numeric(6, 2), nullable=False)
    temperature = Column(Numeric(5, 2), nullable=False)

    arsenic = Column(Numeric(6, 4), nullable=True)
    dissolved_oxygen = Column(Numeric(5, 2), nullable=True)
    nitrate = Column(Numeric(6, 2), nullable=True)
    fluoride = Column(Numeric(5, 2), nullable=True)

    status = Column(String, nullable=False)  # Safe / Warning / Unsafe
    source = Column(String, default="manual")

    recorded_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )


# =====================================================
# STATIONS (CURRENT SNAPSHOT)
# =====================================================
class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    latitude = Column(Numeric(9, 6), nullable=False)
    longitude = Column(Numeric(9, 6), nullable=False)

    ph = Column(Numeric(4, 2), nullable=False)
    turbidity = Column(Numeric(6, 2), nullable=False)
    temperature = Column(Numeric(5, 2), nullable=False)

    arsenic = Column(Numeric(6, 4), nullable=True)
    dissolved_oxygen = Column(Numeric(5, 2), nullable=True)
    nitrate = Column(Numeric(6, 2), nullable=True)
    fluoride = Column(Numeric(5, 2), nullable=True)

    status = Column(String, nullable=False)   # Safe / Warning / Unsafe
    is_online = Column(Boolean, default=True)
    source = Column(String, default="manual")


# =====================================================
# ALERTS
# =====================================================
class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String, nullable=False)
    status = Column(String, nullable=False)   # Warning / Unsafe
    message = Column(String, nullable=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )


# =====================================================
# NGOs
# =====================================================
class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    region = Column(String, nullable=False)
    description = Column(String, nullable=True)


# =====================================================
# PROJECTS
# =====================================================
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    due_date = Column(String, nullable=False)


# =====================================================
# NGO ↔ PROJECT COLLABORATION
# =====================================================
class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, nullable=False)
    project_id = Column(Integer, nullable=False)


# =====================================================
# NGO ↔ STATION ASSIGNMENT
# =====================================================
class StationAssignment(Base):
    __tablename__ = "station_assignments"

    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, nullable=False)
    station_id = Column(Integer, nullable=False)
    project_id = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
