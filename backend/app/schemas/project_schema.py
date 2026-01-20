from pydantic import BaseModel
from datetime import date

class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    start_date: date
    end_date: date
    ngo_id: int

class ProjectResponse(ProjectCreate):
    id: int

    class Config:
        from_attributes = True
