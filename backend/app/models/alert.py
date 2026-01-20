from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    # Station info
    station_id = Column(Integer, nullable=True)
    station_name = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    latitude = Column(String(50), nullable=True)
    longitude = Column(String(50), nullable=True)

    # Alert info
    message = Column(String(255), nullable=False)
    severity = Column(String(50), default="WARNING")
    type = Column(String(50), nullable=True)
    category = Column(String(50), default="current")

    # Status
    acknowledged = Column(Boolean, default=False)
    action_taken = Column(Text, nullable=True)

    created_at = Column(DateTime, server_default=func.now())
