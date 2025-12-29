from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.gov_service import GovWaterService
from app.models.station import WaterStation
import asyncio

# =========================================================
# 🏗️ EXPANDED GLOBAL COVERAGE (Max Safe Limit)
# =========================================================
async def fetch_initial_data():
    """
    Fetches data from dozens of major hubs to create a 'Fully Populated' map feel
    without hitting API Rate Limits.
    """
    print("🚀 STARTUP: Populating Map with Massive Global Dataset...")
    db = SessionLocal()
    
    try:
        # 🇺🇸 USA: Coverage for every region (Northeast, South, Midwest, West)
        usa_hubs = [
            # --- Northeast ---
            ("New York, NY", 40.7128, -74.0060),
            ("Boston, MA", 42.3601, -71.0589),
            ("Philadelphia, PA", 39.9526, -75.1652),
            ("Washington DC", 38.9072, -77.0369),
            ("Baltimore, MD", 39.2904, -76.6122),
            ("Pittsburgh, PA", 40.4406, -79.9959),
            ("Buffalo, NY", 42.8864, -78.8784),

            # --- Southeast ---
            ("Miami, FL", 25.7617, -80.1918),
            ("Orlando, FL", 28.5383, -81.3792),
            ("Atlanta, GA", 33.7490, -84.3880),
            ("Charlotte, NC", 35.2271, -80.8431),
            ("Nashville, TN", 36.1627, -86.7816),
            ("New Orleans, LA", 29.9511, -90.0715),
            ("Jacksonville, FL", 30.3322, -81.6557),
            ("Richmond, VA", 37.5407, -77.4360),

            # --- Midwest ---
            ("Chicago, IL", 41.8781, -87.6298),
            ("Detroit, MI", 42.3314, -83.0458),
            ("Minneapolis, MN", 44.9778, -93.2650),
            ("St. Louis, MO", 38.6270, -90.1994),
            ("Kansas City, MO", 39.0997, -94.5786),
            ("Cleveland, OH", 41.4993, -81.6944),
            ("Indianapolis, IN", 39.7684, -86.1581),
            ("Milwaukee, WI", 43.0389, -87.9065),

            # --- South Central (Texas/Okla) ---
            ("Houston, TX", 29.7604, -95.3698),
            ("Dallas, TX", 32.7767, -96.7970),
            ("Austin, TX", 30.2672, -97.7431),
            ("San Antonio, TX", 29.4241, -98.4936),
            ("Oklahoma City, OK", 35.4676, -97.5164),

            # --- Mountain West ---
            ("Denver, CO", 39.7392, -104.9903),
            ("Salt Lake City, UT", 40.7608, -111.8910),
            ("Phoenix, AZ", 33.4484, -112.0740),
            ("Las Vegas, NV", 36.1699, -115.1398),
            ("Albuquerque, NM", 35.0844, -106.6504),

            # --- Pacific West ---
            ("Los Angeles, CA", 34.0522, -118.2437),
            ("San Francisco, CA", 37.7749, -122.4194),
            ("San Diego, CA", 32.7157, -117.1611),
            ("Seattle, WA", 47.6062, -122.3321),
            ("Portland, OR", 45.5152, -122.6784),
            ("Sacramento, CA", 38.5816, -121.4944),
            ("Honolulu, HI", 21.3069, -157.8583) # Bonus: Hawaii!
        ]

        print(f"   👉 Syncing {len(usa_hubs)} USA Hubs...")
        for city, lat, lon in usa_hubs:
            # Fetch just 4 stations per city to keep speed high but coverage wide
            data = await GovWaterService.fetch_usa_region(lat, lon, miles=10)
            save_data_grouped(db, data[:4], "USA", city)

        # 🇬🇧 UK: Coverage for England, Scotland, Wales, N. Ireland
        uk_hubs = [
            ("London", 51.5074, -0.1278),
            ("Manchester", 53.4808, -2.2426),
            ("Birmingham", 52.4862, -1.8904),
            ("Leeds", 53.8008, -1.5491),
            ("Liverpool", 53.4084, -2.9916),
            ("Glasgow (Scot)", 55.8642, -4.2518),
            
            # --- North & Yorkshire ---
            ("Newcastle", 54.9783, -1.6178),
            ("Sheffield", 53.3811, -1.4701),
            ("Hull", 53.7457, -0.3367),
            ("York", 53.9591, -1.0815),
            
            # --- Midlands ---
            ("Nottingham", 52.9548, -1.1581),
            ("Leicester", 52.6369, -1.1398),
            ("Coventry", 52.4068, -1.5197),
            ("Stoke-on-Trent", 53.0027, -2.1794),
            
            # --- South & West ---
            ("Bristol", 51.4545, -2.5879),
            ("Southampton", 50.9097, -1.4044),
            ("Portsmouth", 50.8198, -1.0880),
            ("Plymouth", 50.3755, -4.1427),
            ("Oxford", 51.7520, -1.2577),
            ("Cambridge", 52.2053, 0.1218),
            
            # --- Wales & Others ---
            ("Cardiff (Wales)", 51.4816, -3.1791),
            ("Swansea (Wales)", 51.6214, -3.9436),
            ("Edinburgh (Scot)", 55.9533, -3.1883),
            ("Belfast (NI)", 54.5973, -5.9301)
        ]

        print(f"   👉 Syncing {len(uk_hubs)} UK Hubs...")
        for city, lat, lon in uk_hubs:
            data = await GovWaterService.fetch_uk_data(lat, lon, dist=15)
            save_data_grouped(db, data[:4], "UK", city)

        # 🇨🇦 CANADA: Major Provinces (Simulated)
        can_hubs = [
            ("Toronto", 43.6510, -79.3470),
            ("Vancouver", 49.2827, -123.1207),
            ("Montreal", 45.5017, -73.5673),
            ("Ottawa", 45.4215, -75.6972),
            ("Calgary", 51.0447, -114.0719),
            ("Edmonton", 53.5461, -113.4938)
        ]

        print(f"   👉 Syncing {len(can_hubs)} Canada Hubs...")
        for city, lat, lon in can_hubs:
            data = await GovWaterService.generate_mock_data(lat, lon, city, 4)
            save_data_grouped(db, data, "Canada", city)

        # 🇮🇳 INDIA: Major Metros (Simulated)
        ind_hubs = [
            ("Chennai", 13.0827, 80.2707),
            ("Mumbai", 19.0760, 72.8777),
            ("Delhi", 28.6139, 77.2090),
            ("Bangalore", 12.9716, 77.5946),
            ("Hyderabad", 17.3850, 78.4867),
            ("Kolkata", 22.5726, 88.3639)
        ]

        print(f"   👉 Syncing {len(ind_hubs)} India Hubs...")
        for city, lat, lon in ind_hubs:
            data = await GovWaterService.generate_mock_data(lat, lon, city, 4)
            save_data_grouped(db, data, "India", city)

        print("✅ STARTUP COMPLETE: Global Map Fully Populated!")
        
    except Exception as e:
        print(f"❌ STARTUP FAILED: {e}")
    finally:
        db.close()

# =========================================================
# 🛠️ HELPER
# =========================================================
def save_data_grouped(db: Session, stations_list: list, country: str, region: str):
    if not stations_list:
        return
    
    count = 0
    formatted_location = f"{country}, {region}"

    for data in stations_list:
        existing = db.query(WaterStation).filter(WaterStation.name == data["name"]).first()
        if not existing:
            new_station = WaterStation(
                name=data["name"],
                location=formatted_location,
                latitude=data["latitude"],
                longitude=data["longitude"],
                managed_by=data["managed_by"],
                status="Active"
            )
            db.add(new_station)
            count += 1
            
    db.commit()
    # Optional: Only print if you want to see detailed logs
    if count > 0:
        print(f"      ✅ {region}: Added {count} stations")

# =========================================================
# ⏰ SCHEDULER
# =========================================================
def auto_fetch_job_wrapper():
    print("⏰ DAILY SCHEDULE: Starting Global Update...")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(fetch_initial_data())
    loop.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(auto_fetch_job_wrapper, 'interval', hours=24)
    scheduler.start()