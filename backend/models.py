from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, Numeric, Text, ForeignKey
from database import Base
import enum
from datetime import datetime


# ------------------------
# ENUMS
# ------------------------

# Enum for user roles
class UserRole(enum.Enum):
    citizen = "citizen"
    ngo = "ngo"
    authority = "authority"
    admin = "admin"


class ReportStatusEnum(enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class ParameterEnum(enum.Enum):
    pH = "pH"
    turbidity = "turbidity"
    DO = "DO"
    lead = "lead"
    arsenic = "arsenic"
    ecoli = "e.coli"
    iron = "iron"
    unknown = "unknown"  # ✅ MUST MATCH schemas



class SearchParamEnum(enum.Enum):
    region = "Region"
    country = "Country"
    state = "State"
    station_name = "Water Station Name"
    station_id = "Water Station ID"


# ------------------------
# TABLES
# ------------------------

# Users table
class Users(Base):
    __tablename__ = "Users"  # matches your existing table

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    location = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


# WaterStation table
class WaterStation(Base):
    __tablename__ = "WaterStation"  # matches your existing table

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    latitude = Column(Numeric)
    longitude = Column(Numeric)
    managed_by = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


# ------------------------
# BE1 ENTITIES (Your Task)
# ------------------------

# Station Readings Table
class StationReadings(Base):
    __tablename__ = "StationReadings"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("WaterStation.id"))
    parameter = Column(Enum(ParameterEnum))
    value = Column(Numeric)
    recorded_at = Column(TIMESTAMP, default=datetime.utcnow)


# Reports Table
class Reports(Base):
    __tablename__ = "Reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"))
    photo_url = Column(String(255))
    location = Column(String(255))
    description = Column(Text)
    water_source = Column(String(255))
    status = Column(Enum(ReportStatusEnum), default=ReportStatusEnum.pending)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


# Searches Table
class Searches(Base):
    __tablename__ = "Searches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"))
    parameter = Column(String(50))   # ✅ CHANGE HERE
    value = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)


# ------------------------
# Alerts Table
# ------------------------
class AlertTypeEnum(enum.Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"

class AlertStatusEnum(enum.Enum):
    active = "active"
    resolved = "resolved"


class Alerts(Base):
    __tablename__ = "Alerts"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(AlertTypeEnum), nullable=False)
    message = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    issued_at = Column(TIMESTAMP, default=datetime.utcnow)

    # ✅ NEW
    status = Column(
        Enum(AlertStatusEnum),
        default=AlertStatusEnum.active,
        nullable=False
    )
# ------------------------
# NGOs Table
# ------------------------
class NGOs(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)

    # Link NGO to Users table (one-to-one)
    user_id = Column(
        Integer,
        ForeignKey("Users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    name = Column(String(255), nullable=False)
    location = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

# ------------------------
# Projects Table
# ------------------------
class Projects(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    ngo_id = Column(
        Integer,
        ForeignKey("ngos.id", ondelete="CASCADE"),
        nullable=False
    )

    name = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(TIMESTAMP)
    end_date = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
# ------------------------
# Collaborations Table
# ------------------------
class CollaborationStatusEnum(enum.Enum):
    active = "active"
    completed = "completed"


class Collaborations(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False
    )

    ngo_id = Column(
        Integer,
        ForeignKey("ngos.id", ondelete="CASCADE"),
        nullable=False
    )

    partner_ngo_id = Column(
        Integer,
        ForeignKey("ngos.id", ondelete="CASCADE"),
        nullable=False
    )

    status = Column(
        Enum(CollaborationStatusEnum),
        default=CollaborationStatusEnum.active,
        nullable=False
    )

    created_at = Column(TIMESTAMP, default=datetime.utcnow)
