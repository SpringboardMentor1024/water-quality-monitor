from database import Base, engine
from models import Users, WaterStation, CPCBWaterQuality, EPAWaterQuality, WHO_WaterStats  # CHANGED: included all models

# This will create all tables defined in models.py
Base.metadata.create_all(bind=engine)

print("Tables created successfully!")
