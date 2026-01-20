from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# =========================
# 🔹 CREATE ALERT (POST)
# =========================
class AlertCreate(BaseModel):
    type: str
    message: str
    location: Optional[str] = None
    station_id: Optional[int] = None


# =========================
# 🔹 READ ALERT (GET)
# =========================
class AlertResponse(BaseModel):
    id: int
    message: Optional[str]
    severity: Optional[str]
    acknowledged: bool
    created_at: datetime

    category: Optional[str]
    type: Optional[str]
    action_taken: Optional[str]

    location: Optional[str]
    station_id: Optional[int]
    station_name: Optional[str]

    # IMPORTANT: DB stores these as VARCHAR
    latitude: Optional[str]
    longitude: Optional[str]

    class Config:
        from_attributes = True
