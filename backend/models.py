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

# ============= NGO COLLABORATION ENTITIES =============

class NGO(Base):
    __tablename__ = "ngos"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    contact_phone = Column(String, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
    # Relationships
    projects = relationship("Project", secondary="project_ngos", back_populates="ngos")
    stations = relationship("NGOStation", back_populates="ngo")
    collaborations = relationship("Collaboration", back_populates="ngo")


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="Active", nullable=False)  # Active, Completed, Paused
    due_date = Column(DateTime, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
    # Relationships
    ngos = relationship("NGO", secondary="project_ngos", back_populates="projects")
    stations = relationship("NGOStation", back_populates="project")


class ProjectNGO(Base):
    """Junction table for many-to-many relationship between Project and NGO"""
    __tablename__ = "project_ngos"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )


class Collaboration(Base):
    __tablename__ = "collaborations"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    contract_details = Column(Text, nullable=True)
    status = Column(String, default="Active", nullable=False)  # Active, Completed, Terminated
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
    # Relationships
    ngo = relationship("NGO", back_populates="collaborations")
    project = relationship("Project")


class NGOStation(Base):
    """Tracks which water stations are assigned to NGOs for specific projects"""
    __tablename__ = "ngo_stations"
    
    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=False)
    assigned_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    unassigned_date = Column(DateTime, nullable=True)
    
    # Relationships
    ngo = relationship("NGO", back_populates="stations")
    project = relationship("Project", back_populates="stations")
    station = relationship("WaterStation")


class Prediction(Base):
    """ML-based predictive alerts"""
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=False)
    parameter = Column(Enum(WaterParameter), nullable=False)
    current_value = Column(Numeric(10, 4), nullable=False)
    predicted_value = Column(Numeric(10, 4), nullable=False)
    probability = Column(Numeric(5, 2), nullable=False)  # 0-100
    expected_alert_date = Column(DateTime, nullable=True)
    trend = Column(String, nullable=False)  # Increasing, Decreasing, Stable
    risk_level = Column(String, nullable=False)  # High, Medium, Low
    review_content = Column(Text, nullable=True)
    confidence_score = Column(Numeric(5, 2), nullable=False)  # 0-100
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )
    
    # Relationship
    station = relationship("WaterStation")
