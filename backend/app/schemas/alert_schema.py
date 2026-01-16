from pydantic import BaseModel, model_validator
from typing import Optional
from datetime import datetime
from enum import Enum

# ==========================================
# ENUMS
# ==========================================
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
    type: AlertType 
    message: str
    location: Optional[str] = None
    station_id: Optional[int] = None

# ==========================================
# OUTPUT SCHEMA (Returning Data)
# ==========================================
class AlertResponse(BaseModel):
    id: int
    message: str
    severity: str
    acknowledged: bool
    created_at: datetime

    # 🟢 AI & DASHBOARD FIELDS
    category: Optional[AlertCategory] = None  
    type: Optional[AlertType] = None          
    action_taken: Optional[str] = None        

    # 🟢 LOCATION INFO
    location: Optional[str] = None  
    station_id: Optional[int] = None
    
    # 🟢 FLATTENED STATION DATA
    # These store data pulled from the related 'WaterStation' object
    station_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True

    # 🟢 THE MAGIC FIX: AUTO-POPULATE STATION DETAILS
    # This function runs before the JSON is sent. 
    # It checks if the 'station' relationship exists and copies data from it.
    @model_validator(mode='before')
    def flatten_station_info(cls, data):
        # 'data' is the SQLAlchemy Alert object here
        # Check if it has a 'station' relationship attached
        if hasattr(data, 'station') and data.station:
            # If the fields are missing in the Alert, grab them from the Station
            # Note: We assign these temporarily to the object so Pydantic can read them
            if not getattr(data, 'station_name', None):
                data.station_name = data.station.name
            
            if not getattr(data, 'latitude', None):
                data.latitude = data.station.latitude
                
            if not getattr(data, 'longitude', None):
                data.longitude = data.station.longitude
        
        return data