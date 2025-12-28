from database import get_db
from sqlalchemy.orm import Session
import models

def populate_india_data():
    db: Session = next(get_db())

    # Example Indian water stations with real lat/lon
    stations = [
        {
            "name": "Yamuna River - Delhi",
            "latitude": 28.6139,
            "longitude": 77.2090,
            "ph": 7.2,
            "turbidity": 2.5,
            "temperature": 25.1,
            "status": "Safe"
        },
        {
            "name": "Ganga River - Varanasi",
            "latitude": 25.3176,
            "longitude": 82.9739,
            "ph": 6.8,
            "turbidity": 5.4,
            "temperature": 26.3,
            "status": "Warning"
        },
        {
            "name": "Godavari River - Nashik",
            "latitude": 19.9975,
            "longitude": 73.7898,
            "ph": 7.0,
            "turbidity": 3.1,
            "temperature": 24.0,
            "status": "Safe"
        },
        {
            "name": "Krishna River - Vijayawada",
            "latitude": 16.5062,
            "longitude": 80.6480,
            "ph": 6.5,
            "turbidity": 6.2,
            "temperature": 27.4,
            "status": "Unsafe"
        },
        {
            "name": "Cauvery River - Erode",
            "latitude": 11.3410,
            "longitude": 77.7172,
            "ph": 7.1,
            "turbidity": 2.9,
            "temperature": 25.6,
            "status": "Safe"
        },
        {
            "name": "Mahanadi River - Sambalpur",
            "latitude": 21.4700,
            "longitude": 83.9700,
            "ph": 6.9,
            "turbidity": 4.7,
            "temperature": 26.0,
            "status": "Warning"
        },
        {
            "name": "Brahmaputra River - Guwahati",
            "latitude": 26.1445,
            "longitude": 91.7362,
            "ph": 7.3,
            "turbidity": 3.4,
            "temperature": 25.9,
            "status": "Safe"
        },
        {
            "name": "Narmada River - Jabalpur",
            "latitude": 23.1815,
            "longitude": 79.9864,
            "ph": 7.0,
            "turbidity": 4.2,
            "temperature": 25.2,
            "status": "Safe"
        },
        {
            "name": "Sabarmati River - Ahmedabad",
            "latitude": 23.0225,
            "longitude": 72.5714,
            "ph": 6.7,
            "turbidity": 5.0,
            "temperature": 27.1,
            "status": "Warning"
        },
        {
            "name": "Beas River - Manali",
            "latitude": 32.2396,
            "longitude": 77.1887,
            "ph": 7.4,
            "turbidity": 1.9,
            "temperature": 18.5,
            "status": "Safe"
        },
    ]

    # Clear existing data (optional)
    db.query(models.Station).delete()
    db.commit()

    for s in stations:
        station = models.Station(
            name=s["name"],
            latitude=s["latitude"],
            longitude=s["longitude"],
            ph=s["ph"],
            turbidity=s["turbidity"],
            temperature=s["temperature"],
            status=s["status"],
            is_online=True,
        )
        db.add(station)
        db.commit()
        db.refresh(station)

        reading = models.WaterReading(
            station_name=s["name"],
            ph=s["ph"],
            turbidity=s["turbidity"],
            temperature=s["temperature"],
            status=s["status"],
        )
        db.add(reading)

    db.commit()
    print("✅ Sample Indian water stations successfully added to database.")


if __name__ == "__main__":
    populate_india_data()
