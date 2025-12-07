from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.waterstation import WaterStation
from schemas.waterstation import WaterStationCreate, WaterStationResponse

router = APIRouter(
    prefix="/stations",
    tags=["stations"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=WaterStationResponse)
def create_station(station: WaterStationCreate, db: Session = Depends(get_db)):
    db_station = WaterStation(**station.dict())
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station
