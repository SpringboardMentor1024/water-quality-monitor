"""
Water Quality Monitor - Alert Database Model
Updated for Milestone 3 Specifications.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum

# 🟢 1. Define the Enum (Strict Validation)
# This restricts the database to only accept these 3 specific types.
class AlertType(str, enum.Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"

# 🟢 2. Define the Table
class Alert(Base):
    __tablename__ = "alerts"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Alert Type (Enforced by Enum)
    type = Column(Enum(AlertType), nullable=False)
    
    # Message (Text allows for detailed warnings)
    message = Column(Text, nullable=False)
    
    # Location (String allows for "Chennai", "Zone 1", "Sector 7")
    location = Column(String, nullable=False)
    
    # Issued At (Automatic Timestamp)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())