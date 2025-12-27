# app/seed_data.py
from app.core.database import SessionLocal
from app.models.station import WaterStation
from app.models.readings import WaterQuality2011

def seed_data():
    db = SessionLocal()
    
    # Add test station
    station = WaterStation(
        name="Kurnool Station",
        location="Tungabhadra River, Kurnool",
        latitude="15.8283",
        longitude="78.0373",
        managed_by="APPCB",
        status="Active"
    )
    db.add(station)
    db.commit()
    db.refresh(station)
    
    # Add 2011 data
    data_2011 = WaterQuality2011(
        station_id=station.id,
        temp_min=24.5, temp_max=29.2, temp_mean=26.8,
        do_min=4.2, do_max=6.8, do_mean=5.5,
        ph_min=7.1, ph_max=8.3, ph_mean=7.7,
        cond_min=250, cond_max=420, cond_mean=335,
        bod_min=2.1, bod_max=4.5, bod_mean=3.2,
        nitrate_min=0.5, nitrate_max=1.8, nitrate_mean=1.1,
        fecal_coliform_min=500, fecal_coliform_max=2200, fecal_coliform_mean=1350,
        total_coliform_min=1200, total_coliform_max=4500, total_coliform_mean=2850,
        fluoride_min=0.3, fluoride_max=0.8, fluoride_mean=0.55
    )
    db.add(data_2011)
    db.commit()
    
    print("✅ Seeded: Kurnool Station + 2011 data")
    db.close()

if __name__ == "__main__":
    seed_data()
