from pydantic import BaseModel, ConfigDict
from datetime import datetime
from decimal import Decimal

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