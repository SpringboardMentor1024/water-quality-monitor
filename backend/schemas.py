# backend/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# User
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    role: str
    class Config:
        from_attributes = True

# WaterStation
class WaterStationBase(BaseModel):
    name: str
    location: str
    ph_level: Optional[float] = None
    turbidity: Optional[float] = None
    chlorine: Optional[float] = None

class WaterStationCreate(WaterStationBase):
    pass

class WaterStationOut(WaterStationBase):
    id: int
    owner_id: Optional[int] = None
    class Config:
        from_attributes = True

# SensorReading
class SensorReadingBase(BaseModel):
    ph_level: Optional[float] = None
    turbidity: Optional[float] = None
    chlorine: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    gas_level: Optional[float] = None
    heart_rate: Optional[float] = None
    bp_systolic: Optional[float] = None
    bp_diastolic: Optional[float] = None

class SensorReadingCreate(SensorReadingBase):
    station_id: int
    user_id: Optional[int] = None

class SensorReadingOut(SensorReadingBase):
    id: int
    timestamp: datetime
    station_id: int
    user_id: Optional[int] = None

    class Config:
        from_attributes = True

# Token response
class Token(BaseModel):
    access_token: str
    token_type: str
