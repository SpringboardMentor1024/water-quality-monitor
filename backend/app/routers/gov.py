from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.gov_service import GovWaterService
from app.models.searches import Search, SearchParameter
import os


router = APIRouter(tags=["Government Data"])


@router.get("/external/water-quality")
async def get_external_data(
    location: str,
    db: Session = Depends(get_db),
):
    # Fetch from US EPA (by location/ZIP) and WHO summary
    epa_data = await GovWaterService.fetch_epa_data(location)
    who_data = await GovWaterService.fetch_who_data()

    # Log the search
    new_search = Search(
        user_id=1,  # TODO: replace with real user id from auth
        parameter=SearchParameter.region,
        value=location,
    )
    db.add(new_search)
    db.commit()

    return {
        "epa_summary": epa_data,
        "who_summary": who_data,
    }


@router.get("/external/india-aqi")
async def get_india_aqi(
    state: str | None = None,
    city: str | None = None,
    db: Session = Depends(get_db),
):
    api_key = os.getenv("DATA_GOV_API_KEY")
    result = await GovWaterService.fetch_cpcb_data(
        api_key=api_key,
        state=state,
        city=city,
    )

    # Optional: log this search as well
    search_value = ", ".join(v for v in [state, city] if v)
    if search_value:
        new_search = Search(
            user_id=1,
            parameter=SearchParameter.region,
            value=search_value,
        )
        db.add(new_search)
        db.commit()

    return result
