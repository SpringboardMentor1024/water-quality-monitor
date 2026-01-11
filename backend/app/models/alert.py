from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    # Optional – not required for public alerts
    station_id = Column(Integer, ForeignKey("water_stations.id"), nullable=True)

    parameter = Column(String(100), nullable=True)
    value = Column(Float, nullable=True)

    severity = Column(String(50), default="WARNING")
    message = Column(String(255), nullable=False)

    acknowledged = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
