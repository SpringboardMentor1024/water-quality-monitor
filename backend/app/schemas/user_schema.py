from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


# 1. Base Schema
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.citizen
    location: Optional[str] = None


# 2. Registration Schema
class UserCreate(UserBase):
    password: str = Field(..., max_length=72)


# 3. Login Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)


# 4. User Response Schema
class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# 5. Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# 6. NEW: Login Response (Token + User Details)
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
