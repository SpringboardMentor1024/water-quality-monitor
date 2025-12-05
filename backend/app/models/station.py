from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class WaterStation(Base):
    # This must match the table name in your database_setup.sql
    __tablename__ = "WaterStations"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Details
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    
    # GPS Coordinates
    # We use Numeric(10, 6) to match the precision in your SQL script
    # Example: 12.123456 (6 decimal places is standard for GPS)
    latitude = Column(Numeric(10, 6), nullable=True)
    longitude = Column(Numeric(10, 6), nullable=True)
    
    # Ownership info
    # In the PDF schema, this is a Varchar, not a Foreign Key
    managed_by = Column(String, nullable=True)
    
    # Timestamp
    created_at = Column(TIMESTAMP, server_default=func.now())