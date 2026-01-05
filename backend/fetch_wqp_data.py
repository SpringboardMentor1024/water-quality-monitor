import requests
from sqlalchemy.orm import Session
from database import get_db
import models

WQP_URL = "https://www.waterqualitydata.us/data/Result/search"
MAX_RECORDS = 20


# ---------------------------------
# STATUS LOGIC
# ---------------------------------
def calculate_status(ph: float, turbidity: float) -> str:
    if ph < 6.0 or ph > 8.5 or turbidity > 25:
        return "Unsafe"
    elif turbidity > 10:
        return "Warning"
    return "Safe"


# ---------------------------------
# MAIN SYNC FUNCTION
# ---------------------------------
def sync_wqp_data():
    db: Session = next(get_db())

    params = {
        "countrycode": "US",
        "characteristicName": "pH,Temperature, water,Turbidity",
        "mimeType": "json",
        "sorted": "no"
    }

    # ---------------------------------
    # FETCH DATA (WITH FALLBACK)
    # ---------------------------------
    try:
        response = requests.get(WQP_URL, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        print("🌐 Live WQP data fetched")

    except Exception:
        print("⚠️ WQP unreachable — using fallback demo data")
        data = [
            {
                "MonitoringLocationName": "Mississippi River - Baton Rouge",
                "MonitoringLocationLatitude": "30.4515",
                "MonitoringLocationLongitude": "-91.1871",
                "CharacteristicName": "pH",
                "ResultMeasureValue": "7.2"
            },
            {
                "MonitoringLocationName": "Mississippi River - Baton Rouge",
                "MonitoringLocationLatitude": "30.4515",
                "MonitoringLocationLongitude": "-91.1871",
                "CharacteristicName": "Turbidity",
                "ResultMeasureValue": "6.5"
            },
            {
                "MonitoringLocationName": "Colorado River - Hoover Dam",
                "MonitoringLocationLatitude": "36.0156",
                "MonitoringLocationLongitude": "-114.7378",
                "CharacteristicName": "pH",
                "ResultMeasureValue": "7.8"
            },
            {
                "MonitoringLocationName": "Colorado River - Hoover Dam",
                "MonitoringLocationLatitude": "36.0156",
                "MonitoringLocationLongitude": "-114.7378",
                "CharacteristicName": "Temperature, water",
                "ResultMeasureValue": "22.4"
            }
        ]

    inserted = 0

    # ---------------------------------
    # PROCESS RECORDS
    # ---------------------------------
    for item in data:
        if inserted >= MAX_RECORDS:
            break

        station_name = item.get("MonitoringLocationName")
        characteristic = item.get("CharacteristicName", "").lower()
        raw_value = item.get("ResultMeasureValue")

        if not station_name or not raw_value:
            continue

        try:
            value = float(raw_value)
        except ValueError:
            continue

        # ---------------------------------
        # LAT / LON EXTRACTION
        # ---------------------------------
        lat_raw = item.get("MonitoringLocationLatitude")
        lon_raw = item.get("MonitoringLocationLongitude")

        try:
            lat = float(lat_raw)
            lon = float(lon_raw)
        except (TypeError, ValueError):
            lat = 0.0
            lon = 0.0

        # ---------------------------------
        # FIND OR CREATE STATION
        # ---------------------------------
        station = (
            db.query(models.Station)
            .filter(models.Station.name == station_name)
            .first()
        )

        if not station:
            station = models.Station(
                name=station_name,
                latitude=lat,
                longitude=lon,
                ph=7.0,
                turbidity=5.0,
                temperature=25.0,
                status="Safe",
                is_online=True,
                source="wqp"
            )
            db.add(station)
            db.commit()
            db.refresh(station)

        # ---------------------------------
        # UPDATE COORDINATES IF MISSING
        # ---------------------------------
        if station.latitude is None and lat is not None:
             station.latitude = lat
             station.longitude = lon


        # ---------------------------------
        # CURRENT VALUES
        # ---------------------------------
        ph = float(station.ph)
        turbidity = float(station.turbidity)
        temperature = float(station.temperature)

        if "ph" in characteristic:
            ph = value
        elif "turbidity" in characteristic:
            turbidity = value
        elif "temperature" in characteristic:
            temperature = value

        status = calculate_status(ph, turbidity)

        # ---------------------------------
        # SAVE WATER READING
        # ---------------------------------
        reading = models.WaterReading(
            station_name=station.name,
            ph=ph,
            turbidity=turbidity,
            temperature=temperature,
            status=status,
            source="wqp"
        )

        db.add(reading)

        # ---------------------------------
        # UPDATE STATION SNAPSHOT
        # ---------------------------------
        station.ph = ph
        station.turbidity = turbidity
        station.temperature = temperature
        station.status = status

        inserted += 1

    db.commit()
    print(f"✅ WQP sync completed ({inserted} records)")


# ---------------------------------
# STANDALONE RUN
# ---------------------------------
if __name__ == "__main__":
    sync_wqp_data()
