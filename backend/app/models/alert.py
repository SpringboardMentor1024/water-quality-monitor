<<<<<<< HEAD
"""
Water Quality Monitor - Alert Database Model
Updated for Predictive Analysis & Remediation Steps
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, Enum as DbEnum
=======
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
from sqlalchemy.sql import func
from app.core.database import Base

<<<<<<< HEAD
# 🟢 1. Define Enums for Strict Categorization
class AlertCategory(str, enum.Enum):
    current = "current"       # Option A: Happening NOW (Threshold breach)
    predictive = "predictive" # Option B: Predicted to happen (Trend Analysis)

class AlertType(str, enum.Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"
    system_warning = "system_warning" # Used for sensor trends

=======
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

<<<<<<< HEAD
    # ✅ Preserved your existing fields
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=True)
    
    # 🟢 NEW: Location (Crucial Fix for the Error)
    location = Column(String, nullable=True) 

    parameter = Column(String(100), nullable=True) # e.g., "pH", "Turbidity"
    value = Column(Float, nullable=True)           # e.g., 8.9, 5.5

    # 🟢 NEW: Category (Real vs Predicted)
    category = Column(DbEnum(AlertCategory), default=AlertCategory.current)

    # 🟢 NEW: Type (Standardized Event Type)
    type = Column(DbEnum(AlertType), default=AlertType.system_warning)

    # Severity & Message (Existing)
    severity = Column(String(50), default="WARNING")
    message = Column(String(255), nullable=False)

    # 🟢 NEW: Recommendation / Steps to Solve
    # This stores the "Expert Knowledge" advice (e.g., "Add alkaline neutralizer")
    action_taken = Column(Text, nullable=True)

    # Metadata
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
=======
    # Optional – not required for public alerts
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=True)

    parameter = Column(String(100), nullable=True)
    value = Column(Float, nullable=True)

    severity = Column(String(50), default="WARNING")
    message = Column(String(255), nullable=False)

    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
