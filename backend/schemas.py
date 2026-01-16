from pydantic import BaseModel, ConfigDict
from typing import Optional
from decimal import Decimal
from datetime import datetime

print("🔥 LOADED SCHEMAS FILE:", __file__)

# -----------------------------
# STATIONS
# -----------------------------
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


# -----------------------------
# REPORTS
# -----------------------------
class ReportCreate(BaseModel):
    station_name: str

    ph: Decimal
    turbidity: Decimal
    temperature: Decimal

    arsenic: Optional[Decimal] = None
    dissolved_oxygen: Optional[Decimal] = None
    nitrate: Optional[Decimal] = None
    fluoride: Optional[Decimal] = None

    status: str
    source: Optional[str] = "manual"


class ReportResponse(ReportCreate):
    id: int
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------
# ALERTS
# -----------------------------
class AlertResponse(BaseModel):
    id: int
    station_name: str
    status: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -----------------------------
# AUTH
# -----------------------------
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    user_id: int
    role: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str


class RegisterResponse(BaseModel):
    message: str
