from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from decimal import Decimal
from datetime import datetime
from enum import Enum

# =====================================================
# STATIONS
# =====================================================
class StationCreate(BaseModel):
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    ph: Decimal
    turbidity: Decimal
    temperature: Decimal

    arsenic: Optional[Decimal] = None
    dissolved_oxygen: Optional[Decimal] = None
    nitrate: Optional[Decimal] = None
    fluoride: Optional[Decimal] = None

    status: str


class StationResponse(StationCreate):
    id: int
    is_online: bool
    source: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# =====================================================
# SENSOR / SYSTEM REPORTS
# =====================================================
class ReportCreate(BaseModel):
    location: str
    description: str
    water_source: str
    photo_url: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    location: str
    description: str
    water_source: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# =====================================================
# ALERTS
# =====================================================
class AlertResponse(BaseModel):
    id: int
    station_name: str
    status: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# =====================================================
# AUTH
# =====================================================
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    user_id: int
    role: str
    access_token: str
    token_type: str
    message: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str


class RegisterResponse(BaseModel):
    message: str

# =====================================================
# NGO
# =====================================================
class NGOProfileResponse(BaseModel):
    name: str
    email: str
    region: str
    description: Optional[str] = None


class NGOProjectResponse(BaseModel):
    id: int
    name: str
    description: str
    due_date: str


class NGOStationResponse(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float

# =====================================================
# USER REPORTING (CITIZEN REPORTS)
# =====================================================
class UserReportCreate(BaseModel):
    location: str
    description: str
    water_source: str
    photo_url: Optional[str] = None


class ReportStatusEnum(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class UserReportResponse(BaseModel):
    id: int
    user_id: int
    photo_url: Optional[str]
    location: str
    description: str
    water_source: str
    status: ReportStatusEnum
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# =====================================================
# ✅ STEP 1 ADDITION — APPROVE / REJECT SCHEMA
# =====================================================
class ReportStatusUpdate(BaseModel):
    status: ReportStatusEnum


# =====================================================
# ✅ NEW ADDITION — USER PROFILE RESPONSE
# =====================================================
class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    name: Optional[str] = None
    phone: Optional[str] = None
    profile_pic: Optional[str] = None  # Add this field
    

    model_config = ConfigDict(from_attributes=True)
