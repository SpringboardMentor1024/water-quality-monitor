from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertCreate(BaseModel):
    type: str
    message: str
    location: Optional[str] = None

class AlertResponse(BaseModel):
    id: int
    message: str
    severity: str
    acknowledged: bool
    created_at: datetime

    class Config:
        from_attributes = True
