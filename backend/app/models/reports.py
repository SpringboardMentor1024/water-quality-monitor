import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ReportStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # 🟢 NEW: Added to match Frontend "Subject/Title"
    title = Column(String, nullable=True)
    
    # 🟢 NEW: Added to match Frontend "Moderation Notes"
    moderation_notes = Column(Text, nullable=True)

    photo_url = Column(String, nullable=True)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    water_source = Column(String, nullable=True)
    status = Column(Enum(ReportStatus), default=ReportStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to User
    user = relationship("User", back_populates="reports")