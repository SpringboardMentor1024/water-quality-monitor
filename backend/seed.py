from database import SessionLocal
from models import Station

db = SessionLocal()

stations = [
    Station(name="Yamuna River – Delhi", latitude=28.6139, longitude=77.2090, ph=5.8, turbidity=14.2, temperature=29.5, status="Unsafe"),
    Station(name="Ganga River – Haridwar", latitude=29.9457, longitude=78.1642, ph=6.9, turbidity=4.1, temperature=24.3, status="Safe"),
    Station(name="Cooum River – Chennai", latitude=13.0827, longitude=80.2707, ph=6.1, turbidity=11.5, temperature=30.1, status="Warning"),
    Station(name="Hussain Sagar – Hyderabad", latitude=17.4239, longitude=78.4738, ph=6.5, turbidity=7.9, temperature=28.4, status="Warning"),
]

db.add_all(stations)
db.commit()
db.close()

print("India stations seeded 🌍")
