from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

# Define the Enum for status
class ReportStatusEnum(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

# Base Schema (Fields shared by Input and Output)
class ReportBase(BaseModel):
    # 🟢 NEW: Added to match the "Subject/Title" input in your UI
    title: Optional[str] = None 
    location: str
    description: Optional[str] = None
    water_source: Optional[str] = None
    photo_url: Optional[str] = None

# Schema for CREATING a report (Input from Frontend)
class ReportCreate(ReportBase):
    pass

# Schema for RETURNING a report (Output from API)
class ReportResponse(ReportBase):
    id: int
    user_id: int
    status: ReportStatusEnum
    
    # 🟢 NEW: Added to match "Moderation Notes (Read-Only)" in your UI
    # We add it here (not in Base) so users cannot *create* their own moderation notes.
    moderation_notes: Optional[str] = None 
    
    created_at: datetime

    class Config:
        from_attributes = True