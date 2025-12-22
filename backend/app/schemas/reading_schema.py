from pydantic import BaseModel
from datetime import datetime

class ReadingBase(BaseModel):
    ph: float
    turbidity: float
    dissolved_oxygen: float
    # Add other fields if your model has them (e.g., temperature)

class ReadingResponse(ReadingBase):
    id: int
    station_id: int
    recorded_at: datetime

    class Config:
        from_attributes = True