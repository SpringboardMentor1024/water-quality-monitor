from fastapi import APIRouter, Query
from typing import Optional
from services.data_fallback_service import get_water_data
import asyncio

router = APIRouter(prefix="/stations", tags=["Water Stations"])


@router.get("/")
async def list_stations(
    source: str = Query(..., description="Data source: epa | cpcb"),
    state: Optional[str] = Query(None, description="US State code for EPA"),
    location: Optional[str] = Query(None, description="Location filter for CPCB")
):
    """
    Fetch stations for frontend map.
    Priority: Government API / CSV > Local DB fallback
    """
    params = {"state": state, "location": location}
    data = await get_water_data(source, params)
    if not data:
        return {"source": source, "mode": "unavailable", "count": 0, "data": []}
    return data
