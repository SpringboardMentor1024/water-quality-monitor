from fastapi import APIRouter, Depends
from app.services.gov_service import GovWaterService
from app.core.database import get_db
from sqlalchemy.orm import Session
# Import your Search model to log the query
from app.models.searches import Search, SearchParameter 

router = APIRouter(prefix="/external", tags=["Government Data"])

@router.get("/fetch-water-quality")
async def get_water_quality(
    location_value: str, 
    source_type: str = "all",
    db: Session = Depends(get_db)
    # Add current_user dependency here if you want to link search to a user
):
    """
    Fetches data from EPA, WHO, CPCB and logs the search in DB.
    """
    
    # 1. Fetch Data
    results = {}
    
    if source_type in ["all", "epa"]:
        results["epa"] = await GovWaterService.fetch_epa_data(location_value)
    
    if source_type in ["all", "who"]:
        results["who"] = await GovWaterService.fetch_who_data()
        
    if source_type in ["all", "cpcb"]:
        # Ideally, get this from os.getenv("CPCB_API_KEY")
        results["cpcb"] = await GovWaterService.fetch_cpcb_data("YOUR_API_KEY")

    # 2. Log this search to the Database (As per requirement)
    # Note: If you don't have a user_id, you might need to make user_id nullable or handle guest searches
    new_search = Search(
        user_id=1, # Replace with actual user ID from token
        parameter=SearchParameter.region, # Logic to detect parameter type can be added
        value=location_value
    )
    db.add(new_search)
    db.commit()

    return results