from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, Numeric
from database import Base
import enum
from datetime import datetime

# Enum for user roles
class UserRole(enum.Enum):
    citizen = "citizen"
    ngo = "ngo"
    authority = "authority"
    admin = "admin"

# Users table
class Users(Base):
    __tablename__ = "Users"  # Capital U, matches database table

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    location = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

# WaterStation table
class WaterStation(Base):
    __tablename__ = "WaterStation"  # Capital W and S, matches database table

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    latitude = Column(Numeric)
    longitude = Column(Numeric)
    managed_by = Column(String(255))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
