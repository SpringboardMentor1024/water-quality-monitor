import random
from datetime import datetime, timedelta
from database import SessionLocal
from models import WaterStation, StationReadings

# Number of days to seed
DAYS = 30

# Example ranges for parameters
PH_RANGE = (6.0, 8.5)
OXYGEN_RANGE = (4.0, 10.0)
TURBIDITY_RANGE = (0.0, 10.0)

def random_ph():
    return round(random.uniform(*PH_RANGE), 2)

def random_oxygen():
    return round(random.uniform(*OXYGEN_RANGE), 2)

def random_turbidity():
    return round(random.uniform(*TURBIDITY_RANGE), 2)

def seed():
    db = SessionLocal()
    stations = db.query(WaterStation).all()
    
    if not stations:
        print("No water stations found. Add stations first!")
        return

    now = datetime.now()
    for station in stations:
        for i in range(DAYS):
            timestamp = now - timedelta(days=i)
            
            # pH
            db.add(StationReadings(
                station_id=station.id,
                parameter='pH',
                value=random_ph(),
                recorded_at=timestamp
            ))
            
            # Dissolved Oxygen
            db.add(StationReadings(
                station_id=station.id,
                parameter='DO',
                value=random_oxygen(),
                recorded_at=timestamp
            ))

            # Turbidity
            db.add(StationReadings(
                station_id=station.id,
                parameter='turbidity',
                value=random_turbidity(),
                recorded_at=timestamp
            ))

    db.commit()
    db.close()
    print(f"Seeded {DAYS} days of readings for {len(stations)} stations.")

if __name__ == "__main__":
    seed()
