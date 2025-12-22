from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.orm import relationship 
from sqlalchemy.sql import func
from app.core.database import Base

class WaterStation(Base):
    __tablename__ = "water_stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    latitude = Column(Numeric, nullable=False)
    longitude = Column(Numeric, nullable=False)
    managed_by = Column(String, nullable=True)
    
    # 🟢 NEW: Added to match Frontend "Active" status
    status = Column(String, default="Active") 

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to Readings
    readings = relationship("StationReading", back_populates="station")