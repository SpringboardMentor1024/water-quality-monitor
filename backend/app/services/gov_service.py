import httpx


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

    # 3. India real-time AQI (CPCB via data.gov.in)
    import httpx


class GovWaterService:
    # ... EPA and WHO methods stay above ...

    @staticmethod
    async def fetch_cpcb_data(
        api_key: str,
        state: str | None = None,
        city: str | None = None,
        limit: int = 50,
    ):
        """
        Fetch real-time air-quality data for India from data.gov.in.

        Returns data with fields:
        country, state, city, station, last_update, latitude, longitude,
        pollutant_id, pollutant_min, pollutant_max, pollutant_avg.
        """
        base_url = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"

        # Do NOT send state/city as query params to data.gov.in
        params: dict[str, str | int] = {
            "api-key": api_key,
            "format": "json",
            "limit": limit,
        }

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(base_url, params=params, timeout=10.0)
                resp.raise_for_status()
                payload = resp.json()

                # data.gov.in wraps data under "records"
                records = payload.get("records", [])

                # Shape into a cleaner list
                stations = [
                    {
                        "country": r.get("country"),
                        "state": r.get("state"),
                        "city": r.get("city"),
                        "station": r.get("station"),
                        "last_update": r.get("last_update"),
                        "latitude": float(r["latitude"]) if r.get("latitude") else None,
                        "longitude": float(r["longitude"]) if r.get("longitude") else None,
                        "pollutant_id": r.get("pollutant_id"),
                        "pollutant_min": r.get("min_value"),
                        "pollutant_max": r.get("max_value"),
                        "pollutant_avg": r.get("avg_value"),
                    }
                    for r in records
                ]

                # Filter locally by state and city if provided
                if state:
                    stations = [s for s in stations if s["state"] == state]
                if city:
                    stations = [s for s in stations if s["city"] == city]

                return {"source": "CPCB India", "stations": stations}

            except Exception as e:
                return {"source": "CPCB India", "error": str(e)}
