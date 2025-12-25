import requests
from typing import Optional, Dict

WQP_BASE_URL = "https://www.waterqualitydata.us/data/Station/search"

def fetch_us_stations_by_state(state_code: str, save_to_file: bool = False) -> Optional[Dict]:
    """
    Fetch US water stations for a given state from EPA WQP API.
    """
    params = {
        "statecode": f"US:{state_code}",
        "mimeType": "json"
    }
    try:
        response = requests.get(WQP_BASE_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print("EPA fetch error:", e)
        return None

    if save_to_file:
        import json
        with open(f"epa_{state_code}.json", "w") as f:
            json.dump(data, f)

    return data
