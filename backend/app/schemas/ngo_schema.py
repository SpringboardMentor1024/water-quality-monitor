from pydantic import BaseModel, EmailStr
from typing import Optional

class NGOCreate(BaseModel):
    name: str
    email: EmailStr
    contact_person: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

class NGOResponse(NGOCreate):
    id: int

    class Config:
        from_attributes = True
