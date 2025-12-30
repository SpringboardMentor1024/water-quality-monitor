from pydantic import BaseModel
from datetime import datetime
from enum import Enum


# -------------------------
# ENUMS
# -------------------------

class ReportStatusEnum(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class ParameterEnum(str, Enum):
    pH = "pH"
    turbidity = "turbidity"
    DO = "DO"
    lead = "lead"
    arsenic = "arsenic"
    ecoli = "e.coli"
    iron = "iron"


class SearchParamEnum(str, Enum):
    region = "Region"
    country = "Country"
    state = "State"
    station_name = "Water Station Name"
    station_id = "Water Station ID"


# -------------------------
# WATER STATIONS
# -------------------------

class WaterStationCreate(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    managed_by: str


class WaterStationOut(WaterStationCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# -------------------------
# STATION READINGS
# -------------------------

class StationReadingCreate(BaseModel):
    station_id: int
    parameter: ParameterEnum
    value: float


class StationReadingOut(StationReadingCreate):
    id: int
    recorded_at: datetime

    class Config:
        orm_mode = True


# -------------------------
# REPORTS
# -------------------------

class ReportCreate(BaseModel):
    user_id: int
    photo_url: str
    location: str
    description: str
    water_source: str


class ReportOut(ReportCreate):
    id: int
    status: ReportStatusEnum
    created_at: datetime

    class Config:
        orm_mode = True


# -------------------------
# SEARCH LOGS
# -------------------------

class SearchCreate(BaseModel):
    user_id: int
    parameter: str   # ✅ FIX
    value: str




class SearchOut(SearchCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True