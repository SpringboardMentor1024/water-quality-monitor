import requests

def fetch_wqp_data(state: str = "CA", limit: int = 20):
    url = "https://www.waterqualitydata.us/data/Station/search"
    params = {
        "statecode": f"US:{state}",
        "mimeType": "json",
        "limit": limit
    }
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()
