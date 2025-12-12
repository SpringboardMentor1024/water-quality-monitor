from sqlalchemy import Column, Integer, Numeric, TIMESTAMP, text
from .database import Base

class WaterReading(Base):
    __tablename__ = "water_readings"

    id = Column(Integer, primary_key=True, index=True)
    ph = Column(Numeric(4, 2), nullable=False)
    turbidity = Column(Numeric(6, 2), nullable=False)
    temperature = Column(Numeric(5, 2), nullable=False)
    recorded_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

