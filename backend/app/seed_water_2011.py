# app/seed_water_2011.py
from app.core.database import SessionLocal
from app.models.station import WaterStation
from app.models.readings import WaterQuality2011


def seed_water_for_station(
    db,
    station_name: str,
    values: dict,
):
    station = (
        db.query(WaterStation)
        .filter(WaterStation.name == station_name)
        .first()
    )

    if not station:
        print(f"Station '{station_name}' not found, skipping")
        return

    record = WaterQuality2011(
        station_id=station.id,
        **values,
    )

    db.add(record)
    db.commit()
    print(f"✅ Seeded 2011 data for {station_name}")


def seed_all():
    db = SessionLocal()

    seed_water_for_station(
        db,
        "Ganga River Station",
        {
            "temp_min": 24.5,
            "temp_max": 29.3,
            "temp_mean": 26.7,
            "do_min": 4.2,
            "do_max": 6.8,
            "do_mean": 5.5,
            "ph_min": 7.1,
            "ph_max": 8.2,
            "ph_mean": 7.6,
            "cond_min": 250,
            "cond_max": 420,
            "cond_mean": 335,
            "bod_min": 2.1,
            "bod_max": 4.5,
            "bod_mean": 3.2,
            "nitrate_min": 0.5,
            "nitrate_max": 1.8,
            "nitrate_mean": 1.1,
            "fecal_coliform_min": 500,
            "fecal_coliform_max": 2200,
            "fecal_coliform_mean": 1350,
            "total_coliform_min": 1200,
            "total_coliform_max": 4500,
            "total_coliform_mean": 2850,
            "fluoride_min": 0.3,
            "fluoride_max": 0.8,
            "fluoride_mean": 0.55,
        },
    )

    seed_water_for_station(
        db,
        "Hussain Sagar Station",
        {
            "temp_min": 25.0,
            "temp_max": 30.2,
            "temp_mean": 27.1,
            "do_min": 3.8,
            "do_max": 6.2,
            "do_mean": 4.9,
            "ph_min": 7.0,
            "ph_max": 8.0,
            "ph_mean": 7.4,
            "cond_min": 300,
            "cond_max": 480,
            "cond_mean": 390,
            "bod_min": 3.0,
            "bod_max": 5.2,
            "bod_mean": 4.0,
            "nitrate_min": 0.7,
            "nitrate_max": 2.0,
            "nitrate_mean": 1.3,
            "fecal_coliform_min": 800,
            "fecal_coliform_max": 2800,
            "fecal_coliform_mean": 1800,
            "total_coliform_min": 2000,
            "total_coliform_max": 6000,
            "total_coliform_mean": 3500,
            "fluoride_min": 0.4,
            "fluoride_max": 0.9,
            "fluoride_mean": 0.6,
        },
    )

    seed_water_for_station(
        db,
        "Kompally Groundwater Station",
        {
            "temp_min": 24.0,
            "temp_max": 28.0,
            "temp_mean": 26.0,
            "do_min": 4.5,
            "do_max": 7.0,
            "do_mean": 5.8,
            "ph_min": 7.2,
            "ph_max": 8.1,
            "ph_mean": 7.6,
            "cond_min": 350,
            "cond_max": 550,
            "cond_mean": 430,
            "bod_min": 1.5,
            "bod_max": 3.5,
            "bod_mean": 2.4,
            "nitrate_min": 0.4,
            "nitrate_max": 1.5,
            "nitrate_mean": 0.9,
            "fecal_coliform_min": 300,
            "fecal_coliform_max": 1500,
            "fecal_coliform_mean": 900,
            "total_coliform_min": 1000,
            "total_coliform_max": 4000,
            "total_coliform_mean": 2500,
            "fluoride_min": 0.2,
            "fluoride_max": 0.7,
            "fluoride_mean": 0.45,
        },
    )

    seed_water_for_station(
        db,
        "Musi River Station",
        {
            "temp_min": 25.3,
            "temp_max": 30.5,
            "temp_mean": 27.4,
            "do_min": 3.5,
            "do_max": 6.0,
            "do_mean": 4.6,
            "ph_min": 6.9,
            "ph_max": 7.9,
            "ph_mean": 7.3,
            "cond_min": 320,
            "cond_max": 510,
            "cond_mean": 410,
            "bod_min": 3.2,
            "bod_max": 5.8,
            "bod_mean": 4.3,
            "nitrate_min": 0.8,
            "nitrate_max": 2.2,
            "nitrate_mean": 1.4,
            "fecal_coliform_min": 900,
            "fecal_coliform_max": 3000,
            "fecal_coliform_mean": 1900,
            "total_coliform_min": 2300,
            "total_coliform_max": 6500,
            "total_coliform_mean": 3800,
            "fluoride_min": 0.35,
            "fluoride_max": 0.85,
            "fluoride_mean": 0.6,
        },
    )

    db.close()
    print("✅ Done seeding all stations")


if __name__ == "__main__":
    seed_all()
