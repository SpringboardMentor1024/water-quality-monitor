from sqlalchemy import Column, Integer, String, Float
from database import Base

class WaterStation(Base):
    __tablename__ = "waterstations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    ph = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
