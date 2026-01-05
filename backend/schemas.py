from pydantic import BaseModel, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import Optional

# -----------------------------
# REPORTS SCHEMAS
# -----------------------------

class ReportCreate(BaseModel):
    station_name: str
    ph: Decimal
    turbidity: Decimal
    temperature: Decimal
    status: str
    source: Optional[str] = "manual"   # NEW: manual | wqp | india_api


class ReportResponse(ReportCreate):
    id: int
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -----------------------------
# STATIONS SCHEMAS
# -----------------------------

class StationCreate(BaseModel):
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    ph: Decimal
    turbidity: Decimal
    temperature: Decimal
    status: str


class StationResponse(BaseModel):
    id: int
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    ph: Decimal
    turbidity: Decimal
    temperature: Decimal
    status: str
    is_online: bool
    source: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


    model_config = ConfigDict(from_attributes=True)

# -----------------------------
# ALERTS SCHEMAS
# -----------------------------

class AlertResponse(BaseModel):
    id: int
    station_name: str
    status: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -----------------------------
# AUTH SCHEMAS
# -----------------------------

class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    user_id: int
    role: str

# -----------------------------
# REGISTER SCHEMAS
# -----------------------------

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str   # "ngo" or "user"


class RegisterResponse(BaseModel):
    message: str
