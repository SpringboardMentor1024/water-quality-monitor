from sqlalchemy import Column, Integer, Numeric, TIMESTAMP, String, Boolean, DateTime, text, ForeignKey, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

# Create Base class
Base = declarative_base()

class AlertType(enum.Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"

class AlertPriority(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class ReportStatus(enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

class WaterParameter(enum.Enum):
    pH = "pH"
    turbidity = "turbidity"
    DO = "DO"
    lead = "lead"
    arsenic = "arsenic"
    temperature = "temperature"
    bacteria = "bacteria"

class SearchParameter(enum.Enum):
    Region = "Region"
    Country = "Country"
    State = "State"
    Water_Station_Name = "Water Station Name"
    Water_Station_ID = "Water Station ID"

class WaterReading(Base):
    __tablename__ = "water_readings"

    id = Column(Integer, primary_key=True, index=True)
    ph = Column(Numeric(4, 2), nullable=False)
    turbidity = Column(Numeric(6, 2), nullable=False)
    temperature = Column(Numeric(5, 2), nullable=False)
    recorded_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
class PasswordReset(Base):
    __tablename__ = "password_resets"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    token_hash = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(AlertType), nullable=False)
    message = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    issued_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

class WaterStation(Base):
    __tablename__ = "water_stations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)
    managed_by = Column(String, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
    # Relationship
    readings = relationship("StationReading", back_populates="station")

class StationReading(Base):
    __tablename__ = "station_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=False)
    parameter = Column(Enum(WaterParameter), nullable=False)
    value = Column(Numeric(10, 4), nullable=False)
    recorded_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
    # Relationship
    station = relationship("WaterStation", back_populates="readings")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Allow null for anonymous reports
    photo_url = Column(String, nullable=True)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    water_source = Column(String, nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.pending, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
    # Relationship
    user = relationship("User")

class Search(Base):
    __tablename__ = "searches"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parameter = Column(Enum(SearchParameter), nullable=False)
    value = Column(String, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
    # Relationship
    user = relationship("User")
