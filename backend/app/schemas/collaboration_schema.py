from pydantic import BaseModel
from typing import Optional


# --------------------
# Create Schema
# --------------------
class CollaborationCreate(BaseModel):
    ngo_id: int
    project_id: int
    role: Optional[str] = None


# --------------------
# Response Schema
# --------------------
class CollaborationResponse(BaseModel):
    id: int
    ngo_id: int
    project_id: int
    role: Optional[str] = None

    class Config:
        from_attributes = True
