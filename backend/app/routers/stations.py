from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_  # 🟢 Import 'and_' for coordinate logic
from typing import List, Optional

from app.core.database import get_db
from app.schemas.station_schema import StationCreate, StationResponse
from app.schemas.reading_schema import ReadingResponse
from app.services.station_service import StationService
from app.models.readings import StationReading
from app.models.station import WaterStation 

router = APIRouter(
    prefix="/stations",
    tags=["Water Stations"]
)

# 1. Get All Stations (Search & Map Viewport 🔍)
@router.get("/", response_model=List[StationResponse])
def read_stations(
    skip: int = 0, 
    limit: int = 500, 
    search: Optional[str] = Query(None, description="Search by City, Zip, or Name"),
    # 🟢 NEW: Viewport Filters (Optional)
    north: Optional[float] = Query(None, description="Top Latitude"),
    south: Optional[float] = Query(None, description="Bottom Latitude"),
    east: Optional[float] = Query(None, description="Right Longitude"),
    west: Optional[float] = Query(None, description="Left Longitude"),
    db: Session = Depends(get_db)
):
    """
    Get stations from the local DB.
    - Can filter by Search Text (e.g., 'Chennai')
    - Can filter by Map Bounds (North, South, East, West) to show only visible pins.
    """
    query = db.query(WaterStation)

    # A. Text Search Filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                WaterStation.name.ilike(search_term),
                WaterStation.location.ilike(search_term)
            )
        )

    # B. 🟢 Map Viewport Filter (Bounding Box)
    # If the frontend sends map corners, only return stations inside that box.
    if north and south and east and west:
        query = query.filter(
            and_(
                WaterStation.latitude <= north,
                WaterStation.latitude >= south,
                WaterStation.longitude <= east,
                WaterStation.longitude >= west
            )
        )
    
    # Return Results
    return query.offset(skip).limit(limit).all()

# 2. Get Single Station Details (Unchanged)
@router.get("/{station_id}", response_model=StationResponse)
def read_station(station_id: int, db: Session = Depends(get_db)):
    db_station = StationService.get_station(db, station_id=station_id)
    if db_station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return db_station

# 3. Get Station Readings (Unchanged)
@router.get("/{station_id}/readings", response_model=List[ReadingResponse])
def get_station_readings(station_id: int, db: Session = Depends(get_db)):
    readings = db.query(StationReading).filter(
        StationReading.station_id == station_id
    ).order_by(StationReading.recorded_at.desc()).limit(50).all()
    
    return readings

# 4. Create New Station (Unchanged)
@router.post("/", response_model=StationResponse, status_code=status.HTTP_201_CREATED)
def create_station(station: StationCreate, db: Session = Depends(get_db)):
    return StationService.create_station(db=db, station=station)