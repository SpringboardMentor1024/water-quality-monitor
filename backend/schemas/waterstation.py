from pydantic import BaseModel

class WaterStationCreate(BaseModel):
    name: str
    location: str
    ph: float
    temperature: float

class WaterStationResponse(BaseModel):
    id: int
    name: str
    location: str
    ph: float
    temperature: float

    class Config:
        orm_mode = True
