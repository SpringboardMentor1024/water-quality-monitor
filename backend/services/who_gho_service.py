import requests

WHO_BASE_URL = "https://ghoapi.azureedge.net/api"

def fetch_who_indicator(indicator: str):
    url = f"{WHO_BASE_URL}/{indicator}"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json().get("value", [])
