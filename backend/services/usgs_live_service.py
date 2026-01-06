# backend/services/usgs_live_service.py

import requests
from datetime import datetime

USGS_BASE_URL = "https://waterservices.usgs.gov/nwis/iv/"

# USGS parameter mapping (USE LOWERCASE)
PARAMETER_MAP = {
    "ph": "00400",
    "do": "00300",          # Dissolved Oxygen
    "temperature": "00010"
}

def fetch_live_usgs_data(site_id: str, parameter: str):
    """
    Fetch live water quality data from USGS
    """

    # 1️⃣ normalize parameter
    parameter = parameter.lower()

    if parameter not in PARAMETER_MAP:
        return None

    params = {
        "format": "json",
        "sites": site_id,
        "parameterCd": PARAMETER_MAP[parameter]
    }

    try:
        response = requests.get(USGS_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
    except Exception:
        return None

    data = response.json()

    # 2️⃣ safely extract data
    time_series = data.get("value", {}).get("timeSeries", [])
    if not time_series:
        return None

    values = time_series[0].get("values", [])[0].get("value", [])
    if not values:
        return None

    latest = values[-1]

    # 3️⃣ return clean live data
    return {
        "site_id": site_id,
        "parameter": parameter,
        "value": float(latest["value"]),
        "recorded_at": datetime.fromisoformat(
            latest["dateTime"].replace("Z", "+00:00")
        )
    }
