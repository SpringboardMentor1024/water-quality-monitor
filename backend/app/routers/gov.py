from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.gov_service import GovWaterService
from app.models.station import WaterStation  

router = APIRouter(tags=["Government Data"])

# =========================================================
# 🟢 SMART MAP VIEWPORT (The "Explorer" Logic)
# =========================================================
@router.get("/external/map-view")
async def get_map_view_data(
    north: float, south: float, east: float, west: float, 
    db: Session = Depends(get_db)
):
    """
    Called when the user moves the map.
    Detects the country based on coordinates and fetches new data if needed.
    """
    stations_data = []

    # 1. 🇬🇧 UK DETECTION (Lat: 50 to 60, Long: -10 to 2)
    if 50.0 <= north <= 60.0 and -10.0 <= west <= 2.0:
        print(f"📍 Map View: Detected UK Region (Bounds: {north}, {west})")
        center_lat = (north + south) / 2
        center_lon = (east + west) / 2
        stations_data = await GovWaterService.fetch_uk_data(center_lat, center_lon, dist=40)

    # 2. 🇨🇦 CANADA DETECTION (Lat: 42+, Long: -140 to -50)
    elif north > 42.0 and west < -50.0 and north < 80.0:
        # Check specific box for Toronto area
        if 43.0 <= north <= 46.0 and -82.0 <= west <= -78.0:
             print("📍 Map View: Detected Canada (Toronto Area)")
             stations_data = await GovWaterService.fetch_canada_data()
        else:
            # Border areas might default to USA logic
            stations_data = await GovWaterService.fetch_usa_bbox(north, south, east, west)

    # 3. 🇮🇳 INDIA DETECTION (Lat: 8 to 37, Long: 68 to 97)
    elif 8.0 <= north <= 37.0 and 68.0 <= west <= 97.0:
        print("📍 Map View: Detected India Region")
        center_lat = (north + south) / 2
        center_lon = (east + west) / 2
        stations_data = await GovWaterService.generate_mock_data(center_lat, center_lon, "India Live", 5)

    # 4. 🇺🇸 DEFAULT: USA (The US EPA API is the most robust)
    else:
        # print("📍 Map View: Defaulting to USA Search") 
        stations_data = await GovWaterService.fetch_usa_bbox(north, south, east, west)

    # --- SAVE RESULTS TO DB ---
    if not stations_data:
        return []

    return save_stations_to_db_list(db, stations_data)


# =========================================================
# 🛠️ HELPERS
# =========================================================

def save_stations_to_db_list(db: Session, stations_list: list):
    """
    Saves new stations to the database and returns the list of objects.
    This ensures the Frontend sees the data immediately.
    """
    saved_objects = []
    for data in stations_list:
        # Check if station already exists to prevent duplicates
        existing = db.query(WaterStation).filter(WaterStation.name == data["name"]).first()
        
        if not existing:
            new_station = WaterStation(
                name=data["name"], 
                location=data["location"], 
                latitude=data["latitude"],
                longitude=data["longitude"],
                managed_by=data["managed_by"],
                status="Active"
            )
            db.add(new_station)
            db.commit()
            db.refresh(new_station)
            saved_objects.append(new_station)
        else:
            saved_objects.append(existing)
            
    return saved_objects

# =========================================================
# ⚠️ UTILITIES (For Development/Testing)
# =========================================================

@router.delete("/external/reset-database")
def reset_database(db: Session = Depends(get_db)):
    """
    Wipes all stations. Useful if you want to restart the demo fresh.
    """
    try:
        db.query(WaterStation).delete()
        db.commit()
        return {"message": "Database cleared."}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}