from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertCreate(BaseModel):
    type: str
    message: str
    location: Optional[str] = None
    station_id: Optional[int] = None

class AlertResponse(BaseModel):
    id: int
    message: str
    severity: str
    acknowledged: bool
    created_at: datetime
    station_name: Optional[str] = None
    location: Optional[str] = None  
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True
