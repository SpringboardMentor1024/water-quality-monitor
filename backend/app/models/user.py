from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
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
    # This matches the ForeignKey("users.id") in other models
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Information
    name = Column(String, nullable=False)  # or 'username' depending on your schema
    email = Column(String, unique=True, nullable=False, index=True)

    # Auth
    hashed_password = Column(String, nullable=False)

    role = Column(Enum(UserRole), default=UserRole.citizen, nullable=False)
    location = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    reports = relationship("Report", back_populates="user")
    # Temporarily removed Search relationship to avoid mapper error
    # searches = relationship("Search", back_populates="user")
