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
    parameter = Column(Enum(SearchParamEnum))
    value = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

