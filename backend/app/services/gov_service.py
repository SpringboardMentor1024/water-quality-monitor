import httpx
import os

class GovWaterService:
    
    # 1. US EPA (Water Quality Portal)
    @staticmethod
    async def fetch_epa_data(zip_code: str):
        url = "https://www.waterqualitydata.us/data/Station/search"
        params = {"zip": zip_code, "mimeType": "geojson"}
        
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params, timeout=10.0)
                if resp.status_code == 200:
                    return {"source": "US EPA", "data": resp.json()}
            except Exception as e:
                return {"source": "US EPA", "error": str(e)}
        return {"source": "US EPA", "data": None}

    # 2. WHO (Athena API)
    @staticmethod
    async def fetch_who_data():
        url = "https://ghoapi.azureedge.net/api/WSH_WATER_BASIC"
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, timeout=10.0)
                if resp.status_code == 200:
                    data = resp.json()
                    # Return top 5 results to keep it light
                    return {"source": "WHO", "data": data.get("value", [])[:5]}
            except Exception as e:
                return {"source": "WHO", "error": str(e)}
        return {"source": "WHO", "data": None}

    # 3. CPCB India (Requires API Key from data.gov.in)
    @staticmethod
    async def fetch_cpcb_data(api_key: str):
        # Example OGD Resource ID for Water Quality
        url = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"
        params = {"api-key": api_key, "format": "json", "limit": 5}
        
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, params=params, timeout=10.0)
                if resp.status_code == 200:
                    return {"source": "CPCB India", "data": resp.json()}
            except Exception as e:
                return {"source": "CPCB India", "error": str(e)}
        return {"source": "CPCB India", "error": "Invalid Key or No Data"}