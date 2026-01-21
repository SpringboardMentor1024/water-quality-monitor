from typing import Optional
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
    unknown = "unknown"


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
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


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
    parameter: str
    value: str


class SearchOut(SearchCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# -------------------------
# ALERTS
# -------------------------

class AlertTypeEnum(str, Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"


class AlertStatusEnum(str, Enum):
    active = "active"
    resolved = "resolved"


class AlertCreate(BaseModel):
    type: AlertTypeEnum
    message: str
    location: str
    status: AlertStatusEnum = AlertStatusEnum.active


class AlertOut(AlertCreate):
    id: int
    issued_at: datetime
    status: AlertStatusEnum

    class Config:
        orm_mode = True


# -------------------------
# NGOs
# -------------------------

class NGOCreate(BaseModel):
    user_id: int
    name: str
    location: str


class NGOOut(NGOCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# -------------------------
# PROJECTS
# -------------------------

class ProjectCreate(BaseModel):
    ngo_id: int
    name: str
    description: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class ProjectOut(ProjectCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# -------------------------
# COLLABORATIONS
# -------------------------

class CollaborationStatusEnum(str, Enum):
    active = "active"
    completed = "completed"


class CollaborationCreate(BaseModel):
    project_id: int
    ngo_id: int
    partner_ngo_id: int


class CollaborationOut(CollaborationCreate):
    id: int
    status: CollaborationStatusEnum
    created_at: datetime

    class Config:
        orm_mode = True


# =========================================================
# ✅ ADDED CODE ONLY (FOR COLLABORATION UI VIEW)
# =========================================================

class CollaborationView(BaseModel):
    id: int
    project_description: str
    partner_ngo_name: str
    active_stations: int
    status: str

    class Config:
        orm_mode = True
