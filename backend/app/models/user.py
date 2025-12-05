from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base
import enum

# 1. Define the Python Enum for User Roles
# This restricts the values to exactly what is in your requirements.
class UserRole(str, enum.Enum):
    citizen = "citizen"
    ngo = "ngo"
    authority = "authority"
    admin = "admin"

# 2. Define the User Table Class
class User(Base):
    # Must match the table name in database_setup.sql
    __tablename__ = "Users"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False) # Stores the HASHED password
    
    # Role Column using the Enum defined above
    role = Column(Enum(UserRole), default=UserRole.citizen, nullable=False)
    
    # Location
    location = Column(String, nullable=True)
    
    # Timestamp
    created_at = Column(TIMESTAMP, server_default=func.now())