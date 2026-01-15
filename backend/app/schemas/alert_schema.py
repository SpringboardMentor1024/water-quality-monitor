from pydantic import BaseModel
from typing import Optional
from datetime import datetime
<<<<<<< HEAD
from enum import Enum

# 🟢 Define Enums in Schema too (or import from models if preferred)
class AlertCategory(str, Enum):
    current = "current"
    predictive = "predictive"

class AlertType(str, Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"
    system_warning = "system_warning"

# ==========================================
# INPUT SCHEMA (Creating Alerts)
# ==========================================
class AlertCreate(BaseModel):
    type: AlertType # 🟢 Validates input is one of the allowed types
=======

class AlertCreate(BaseModel):
    type: str
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
    message: str
    location: Optional[str] = None
    station_id: Optional[int] = None

<<<<<<< HEAD
# ==========================================
# OUTPUT SCHEMA (Returning Data)
# ==========================================
=======
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
class AlertResponse(BaseModel):
    id: int
    message: str
    severity: str
    acknowledged: bool
    created_at: datetime
<<<<<<< HEAD

    # 🟢 NEW AI FIELDS (Crucial for Dashboard)
    category: Optional[AlertCategory] = None  # "current" vs "predictive"
    type: Optional[AlertType] = None          # "contamination", etc.
    action_taken: Optional[str] = None        # The "Steps to Solve" recommendation

    # Location Info
    location: Optional[str] = None  
    station_id: Optional[int] = None
    
    # Note: These will only be filled if you specifically join tables in your query
    station_name: Optional[str] = None
=======
    station_name: Optional[str] = None
    location: Optional[str] = None  
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True
<<<<<<< HEAD

# ==========================================
=======
>>>>>>> 69213e5bcaa462445faf874fdc22dea33238c46e
