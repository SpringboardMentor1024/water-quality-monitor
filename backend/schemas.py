from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from decimal import Decimal
from typing import Optional


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