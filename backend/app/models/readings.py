from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class StationReading(Base):
    __tablename__ = "station_readings"

    id = Column(Integer, primary_key=True, index=True)
    # Ensure "water_stations.id" matches the actual table name in waterstation.py
    station_id = Column(Integer, ForeignKey("water_stations.id")) 
    parameter = Column(String, nullable=False)  # pH, turbidity, etc.
    value = Column(Numeric, nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    station = relationship("WaterStation", back_populates="readings")