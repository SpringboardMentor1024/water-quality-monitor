from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class WaterStation(Base):
    __tablename__ = "water_stations"

    # --------------------
    # Primary Details
    # --------------------
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    location = Column(String(200), nullable=False)

    # --------------------
    # Geo Coordinates
    # --------------------
    latitude = Column(Numeric(10, 8), nullable=False)
    longitude = Column(Numeric(11, 8), nullable=False)

    # --------------------
    # Management Info
    # --------------------
    managed_by = Column(String(100), nullable=True)
    status = Column(String(20), default="Active")

    # --------------------
    # Metadata
    # --------------------
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # --------------------
    # Relationships
    # --------------------
    # Time-series sensor readings
    readings = relationship(
        "StationReading",
        back_populates="station",
        cascade="all, delete-orphan"
    )

    # Alerts generated for this station
    alerts = relationship(
        "Alert",
        back_populates="station",
        cascade="all, delete-orphan"
    )

    # --------------------
    # Debug Helper
    # --------------------
    def __repr__(self):
        return f"<WaterStation(id={self.id}, name={self.name}, status={self.status})>"
