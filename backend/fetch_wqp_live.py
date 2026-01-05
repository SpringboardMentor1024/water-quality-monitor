import requests
from datetime import datetime
from database import SessionLocal
import models

WQP_URL = "https://www.waterqualitydata.us/data/Result/search"

# US regions (expandable)
STATES = ["LA", "CA", "TX", "NY", "FL"]

PARAMETERS = {
    "pH": "00400",
    "Temperature": "00010",
    "Turbidity": "63680",
}

def sync_wqp_live_data():
    db = SessionLocal()
    added = 0

    for state in STATES:
        params = {
            "countrycode": "US",
            "statecode": f"US:{state}",
            "mimeType": "json",
            "sampleMedia": "Water",
            "sorted": "yes",
            "limit": 50,
        }

        try:
            res = requests.get(WQP_URL, params=params, timeout=20)
            res.raise_for_status()
            results = res.json().get("Results", [])

            for r in results:
                name = r.get("MonitoringLocationName")
                lat = r.get("LatitudeMeasure")
                lon = r.get("LongitudeMeasure")

                if not name or lat is None or lon is None:
                    continue

                # Extract measurements
                ph = safe_float(r.get("ResultMeasureValue")) if r.get("CharacteristicName") == "pH" else None
                temp = safe_float(r.get("ResultMeasureValue")) if r.get("CharacteristicName") == "Temperature, water" else None
                turb = safe_float(r.get("ResultMeasureValue")) if "Turbidity" in (r.get("CharacteristicName") or "") else None

                # Default values if missing
                ph = ph if ph is not None else 7.0
                temp = temp if temp is not None else 25.0
                turb = turb if turb is not None else 5.0

                status = get_status(ph, turb)

                # UPSERT station
                station = db.query(models.Station).filter_by(name=name).first()
                if not station:
                    station = models.Station(
                        name=name,
                        latitude=float(lat),
                        longitude=float(lon),
                        ph=ph,
                        turbidity=turb,
                        temperature=temp,
                        status=status,
                        is_online=True,
                        source="wqp",
                    )
                    db.add(station)
                    db.flush()

                # Insert reading (LIVE-style)
                reading = models.WaterReading(
                    station_name=name,
                    ph=ph,
                    turbidity=turb,
                    temperature=temp,
                    status=status,
                )
                db.add(reading)
                added += 1

            db.commit()

        except Exception as e:
            print(f"⚠️ WQP fetch failed for state {state}: {e}")

    db.close()
    print(f"✅ WQP live sync complete — {added} readings added")


def safe_float(val):
    try:
        return float(val)
    except:
        return None


def get_status(ph, turbidity):
    if ph < 6.5 or ph > 8.5 or turbidity > 25:
        return "Unsafe"
    elif turbidity > 10:
        return "Warning"
    return "Safe"
