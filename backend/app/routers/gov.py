from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.gov_service import GovWaterService
from app.models.searches import Search, SearchParameter

router = APIRouter(tags=["Government Data"])

@router.get("/external/water-quality")
async def get_external_data(
    location: str, 
    db: Session = Depends(get_db)
):
    # Fetch from all sources
    epa_data = await GovWaterService.fetch_epa_data(location)
    who_data = await GovWaterService.fetch_who_data()
    
    # Log the search in DB (Optional, but good for tracking)
    # Note: Assuming user_id=1 for guest/demo if not using authentication here
    new_search = Search(
        user_id=1, 
        parameter=SearchParameter.region, 
        value=location
    )
    db.add(new_search)
    db.commit()

    return {
        "epa_summary": epa_data,
        "who_summary": who_data
    }