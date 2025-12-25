# backend/services/data_fallback_service.py

from typing import Optional, Dict, Any, List
import asyncio
from concurrent.futures import ThreadPoolExecutor
import os
import pandas as pd
import json

from services.epa_wqp_service import fetch_us_stations_by_state
from services.who_gho_service import fetch_water_indicator

executor = ThreadPoolExecutor(max_workers=5)


# -------------------------
# Utility: Run blocking I/O
# -------------------------
async def run_blocking(func, *args, **kwargs):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(executor, lambda: func(*args, **kwargs))


# -------------------------
# Normalizers
# -------------------------
def normalize_station(station: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "station_id": station.get("MonitoringLocationIdentifier")
                      or station.get("id"),
        "name": station.get("MonitoringLocationName", "Unknown Station"),
        "latitude": station.get("LatitudeMeasure") or station.get("latitude"),
        "longitude": station.get("LongitudeMeasure") or station.get("longitude"),
        "location": station.get("LocationDescription") or station.get("location"),
        "managed_by": station.get("OrganizationFormalName") or station.get("managed_by"),
    }


def normalize_indicator(record: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "indicator": record.get("IndicatorName"),
        "year": record.get("TimeDim"),
        "value": record.get("NumericValue"),
        "country": record.get("SpatialDim"),
    }


# -------------------------
# Main Fallback Service
# -------------------------
async def get_water_data(source: str, params: Dict) -> Optional[Dict[str, Any]]:
    """
    Unified water data fetch:
    1️⃣ Live API
    2️⃣ Local CSV/JSON fallback
    """
    source = source.lower()
    base_dir = os.path.dirname(os.path.dirname(__file__))

    # =========================
    # EPA (US Stations)
    # =========================
    if source == "epa":
        state = params.get("state")
        if not state:
            return {"source": "EPA", "mode": "error", "message": "State code required", "count": 0, "data": []}

        # Try live API
        try:
            live_data = await run_blocking(fetch_us_stations_by_state, state)
            if live_data and "results" in live_data:
                normalized = [normalize_station(s) for s in live_data["results"]]
                return {"source": "EPA", "mode": "live_api", "count": len(normalized), "data": normalized}
        except Exception as e:
            print("EPA live fetch failed:", e)

        # Local fallback (geojson)
        local_file = os.path.join(base_dir, "data", "wqp", f"stations_US_{state}.geojson")
        if os.path.exists(local_file):
            try:
                with open(local_file, "r") as f:
                    data = json.load(f)
                    normalized = [normalize_station(s) for s in data.get("features", [])]
                    return {"source": "EPA", "mode": "local_fallback", "count": len(normalized), "data": normalized}
            except Exception as e:
                print("EPA local fallback failed:", e)

        return {"source": "EPA", "mode": "unavailable", "count": 0, "data": []}

    # =========================
    # WHO (Indicators)
    # =========================
    if source == "who":
        indicator = params.get("indicator")
        country = params.get("country")

        if not indicator or not country:
            return {"source": "WHO", "mode": "error", "message": "Indicator and country required", "count": 0, "data": []}

        # Try live API
        try:
            raw_data = await run_blocking(fetch_water_indicator, indicator, country)
            if raw_data:
                normalized = [normalize_indicator(r) for r in raw_data]
                return {"source": "WHO", "mode": "live_api", "count": len(normalized), "data": normalized}
        except Exception as e:
            print("WHO live fetch failed:", e)

        # Local fallback CSV
        local_csv = os.path.join(base_dir, "data", "who", f"{indicator}_{country}.csv")
        if os.path.exists(local_csv):
            try:
                df = pd.read_csv(local_csv, encoding="utf-8-sig")
                df.columns = df.columns.str.strip()
                records = df.to_dict(orient="records")
                return {"source": "WHO", "mode": "local_fallback", "count": len(records), "data": records}
            except Exception as e:
                print("WHO local fallback failed:", e)

        return {"source": "WHO", "mode": "unavailable", "count": 0, "data": []}

    # =========================
    # CPCB (India CSV)
    # =========================
    if source == "cpcb":
        location_filter = params.get("location", "").lower()
        csv_file = os.path.join(base_dir, "data", "cpcb", "water_quality_of_river_beas-2014.csv")

        if not os.path.exists(csv_file):
            return {"source": "CPCB", "mode": "error", "message": "CSV not found", "count": 0, "data": []}

        try:
            df = pd.read_csv(csv_file, encoding="utf-8-sig")
        except UnicodeDecodeError:
            df = pd.read_csv(csv_file, encoding="latin1")

        df.columns = df.columns.str.strip()
        if location_filter and "LOCATIONS" in df.columns:
            df = df[df["LOCATIONS"].str.lower().str.contains(location_filter)]

        records = df.to_dict(orient="records")
        return {"source": "CPCB", "mode": "csv_fallback", "count": len(records), "data": records}

    return None
