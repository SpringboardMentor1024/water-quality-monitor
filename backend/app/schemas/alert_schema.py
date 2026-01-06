from pydantic import BaseModel
from datetime import datetime
from app.models.alert import AlertType  # 🟢 Import the Enum from your model to ensure consistency

# 1. Base Schema (Shared Data)
class AlertBase(BaseModel):
    type: AlertType   # This enforces: 'boil_notice', 'contamination', or 'outage'
    message: str
    location: str     # e.g., "Chennai - Zone 5"

# 2. Create Schema (What the user POSTs)
class AlertCreate(AlertBase):
    pass 

# 3. Response Schema (What the API returns)
class AlertResponse(AlertBase):
    id: int
    issued_at: datetime

    class Config:
        # This tells Pydantic to read data from the SQLAlchemy ORM model
        from_attributes = True