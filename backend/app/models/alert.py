"""
Water Quality Monitor - Alert Database Model
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, Enum as DbEnum
# 🟢 1. IMPORT RELATIONSHIP
from sqlalchemy.orm import relationship 
from sqlalchemy.sql import func
from app.core.database import Base
import enum 

class AlertCategory(str, enum.Enum):
    current = "current"       
    predictive = "predictive" 

class AlertType(str, enum.Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"
    system_warning = "system_warning" 

class Alert(Base):
    __tablename__ = "alerts"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Relations & Data
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=True)
    
    # 🟢 2. ADD THIS RELATIONSHIP LINE
    # This allows the Alert to access 'station.name' and 'station.latitude' automatically
    station = relationship("WaterStation") 

    location = Column(String, nullable=True) 
    parameter = Column(String(100), nullable=True) 
    value = Column(Float, nullable=True)           

    # Categories
    category = Column(DbEnum(AlertCategory), default=AlertCategory.current)
    type = Column(DbEnum(AlertType), default=AlertType.system_warning)

    # Details
    severity = Column(String(50), default="WARNING")
    message = Column(String(255), nullable=False)
    action_taken = Column(Text, nullable=True)

    # Metadata
    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())