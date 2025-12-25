from fastapi import APIRouter, Query
from typing import Optional
from services.data_fallback_service import get_water_data

router = APIRouter(prefix="/readings", tags=["Station Readings"])


@router.get("/")
async def get_readings(
    source: str = Query(..., description="Data source: who | local"),
    station_id: Optional[int] = Query(None, description="Station ID for local readings"),
    indicator: Optional[str] = Query(None, description="WHO indicator code"),
    country: Optional[str] = Query(None, description="Country code (WHO)")
):
    """
    Unified readings endpoint.
    """
    params = {
        "station_id": station_id,
        "indicator": indicator,
        "country": country
    }
    data = await get_water_data(source, params)
    if not data:
        return {"source": source, "mode": "unavailable", "count": 0, "data": []}
    return data
