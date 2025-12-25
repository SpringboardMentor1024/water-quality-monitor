import requests
from typing import Optional, List, Dict

WHO_BASE_URL = "https://ghoapi.azureedge.net/api/WaterSanitation"

def fetch_water_indicator(indicator: str, country: str) -> Optional[List[Dict]]:
    """
    Fetch WHO water indicator data.
    """
    if not indicator or not country:
        return None

    params = {
        "$filter": f"Indicator eq '{indicator}' and SpatialDim eq '{country}'"
    }

    try:
        response = requests.get(WHO_BASE_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("value", [])
    except Exception as e:
        print("WHO fetch error:", e)
        return None
