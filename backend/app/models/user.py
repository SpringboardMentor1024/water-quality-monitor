from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.orm import relationship  # 👈 Import Relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

# 1. User Role Enum
class UserRole(str, enum.Enum):
    citizen = "citizen"
    ngo = "ngo"
    authority = "authority"
    admin = "admin"

# 2. User Table Class
class User(Base):
    # 🔴 FIX 1: Change "Users" to "users" (lowercase) 
    # This matches the ForeignKey("users.id") in reports.py
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    # Basic Information
    name = Column(String, nullable=False) # or 'username' depending on your schema
    email = Column(String, unique=True, nullable=False, index=True)
    
    # 🔴 FIX 2: Rename 'password' to 'hashed_password'
    # The auth.py file I gave you expects 'hashed_password'
    hashed_password = Column(String, nullable=False) 
    
    role = Column(Enum(UserRole), default=UserRole.citizen, nullable=False)
    location = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # 🔴 FIX 3: Add Relationships
    # These are required so you can access user.reports and user.searches
    reports = relationship("Report", back_populates="user")
    searches = relationship("Search", back_populates="user")