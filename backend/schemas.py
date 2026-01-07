from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from enum import Enum

class AlertType(str, Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"

class AlertPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class ReportStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

class WaterParameter(str, Enum):
    pH = "pH"
    turbidity = "turbidity"
    DO = "DO"
    lead = "lead"
    arsenic = "arsenic"
    temperature = "temperature"
    bacteria = "bacteria"

class SearchParameter(str, Enum):
    Region = "Region"
    Country = "Country"
    State = "State"
    Water_Station_Name = "Water Station Name"
    Water_Station_ID = "Water Station ID"


# Schema for creating a new reading (used in POST request body)
class WaterReadingCreate(BaseModel):
    ph: Decimal
    turbidity: Decimal
    temperature: Decimal

# Schema for reading data from the database (used in GET response)
class WaterReading(WaterReadingCreate):
    id: int
    recorded_at: datetime

    # Pydantic v2: use ConfigDict to allow ORM objects -> model parsing
    model_config = ConfigDict(from_attributes=True)

# --- User & Auth Schemas ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str

# --- Alert Schemas ---

class AlertCreate(BaseModel):
    type: AlertType
    message: str
    location: str

class AlertResponse(AlertCreate):
    id: int
    issued_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Water Station Schemas ---

class WaterStationCreate(BaseModel):
    name: str
    location: str
    latitude: Decimal
    longitude: Decimal
    managed_by: str

class WaterStationResponse(WaterStationCreate):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Station Reading Schemas ---

class StationReadingCreate(BaseModel):
    station_id: int
    parameter: WaterParameter
    value: Decimal

class StationReadingResponse(StationReadingCreate):
    id: int
    recorded_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Report Schemas ---

class ReportCreate(BaseModel):
    photo_url: Optional[str] = None
    location: str
    description: str
    water_source: str

class ReportUpdate(BaseModel):
    status: ReportStatus

class ReportResponse(ReportCreate):
    id: int
    user_id: int
    status: ReportStatus
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Search Schemas ---

class SearchCreate(BaseModel):
    parameter: SearchParameter
    value: str

class SearchResponse(SearchCreate):
    id: int
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)