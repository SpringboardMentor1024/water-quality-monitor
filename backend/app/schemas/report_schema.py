from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportCreate(BaseModel):
    title: str
    location: str
    description: Optional[str] = None
    water_source: Optional[str] = None
    photo_url: Optional[str] = None


class ReportUpdate(BaseModel):
    status: str                  # "verified" or "rejected"
    moderation_notes: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    title: str
    location: str
    description: Optional[str]
    water_source: Optional[str]
    photo_url: Optional[str]
    status: str
    user_id: Optional[int]
    moderation_notes: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
