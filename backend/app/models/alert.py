"""
Water Quality Monitor - Alert Database Model
Defines the structure for sensor-triggered alerts and warnings.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime, timezone

class Alert(Base):
    __tablename__ = "alerts"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Key linking to the WaterStation table
    station_id = Column(Integer, ForeignKey("water_stations.id"))
    
    # Alert Details
    parameter = Column(String(100))  # e.g., "pH", "Turbidity", "Dissolved Oxygen"
    value = Column(Float)            # The sensor value that triggered the alert
    severity = Column(String(50))    # e.g., "WARNING", "CRITICAL"
    message = Column(String(255))    # Descriptive text for the user
    
    # Status Management
    acknowledged = Column(Boolean, default=False)
    
    # Timestamp (Defaulted to UTC)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship to the Station model
    # Note: Using the string "WaterStation" prevents circular import issues
    station = relationship("WaterStation", back_populates="alerts")
