# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from database import SessionLocal
# from models.waterstation import WaterStation
# from schemas.waterstation import WaterStationCreate, WaterStationResponse

# router = APIRouter(
#     prefix="/stations",
#     tags=["stations"]
# )

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.post("/", response_model=WaterStationResponse)
# def create_station(station: WaterStationCreate, db: Session = Depends(get_db)):
#     db_station = WaterStation(**station.dict())
#     db.add(db_station)
#     db.commit()
#     db.refresh(db_station)
#     return db_station
























from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.waterstation import WaterStation
from schemas.waterstation import WaterStationCreate, WaterStationResponse
from routers.dependencies import get_current_user

router = APIRouter(prefix="/stations", tags=["stations"])

@router.get("/", response_model=list[WaterStationResponse])
def list_stations(db: Session = Depends(get_db)):
    return db.query(WaterStation).all()

@router.post("/", response_model=WaterStationResponse)
def create_station(station: WaterStationCreate, db: Session = Depends(get_db), _: object = Depends(get_current_user)):
    db_station = WaterStation(**station.dict())
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station
