from sqlalchemy.orm import Session
from app.models.station import WaterStation
from app.schemas.station_schema import StationCreate

class StationService:
    
    # 1. Get List of Stations (For the Map)
    # Allows pagination (skip/limit) so the map doesn't crash if there are 10,000 stations.
    @staticmethod
    def get_stations(db: Session, skip: int = 0, limit: int = 100):
        return db.query(WaterStation).offset(skip).limit(limit).all()

    # 2. Get Single Station (For Details Popup)
    @staticmethod
    def get_station(db: Session, station_id: int):
        return db.query(WaterStation).filter(WaterStation.id == station_id).first()

    # 3. Create a Station (Admin Feature)
    @staticmethod
    def create_station(db: Session, station: StationCreate):
        # Convert the Pydantic schema (StationCreate) into a Database Model (WaterStation)
        db_station = WaterStation(
            name=station.name,
            location=station.location,
            latitude=station.latitude,
            longitude=station.longitude,
            managed_by=station.managed_by
        )
        
        # Save to DB
        db.add(db_station)
        db.commit()
        db.refresh(db_station) # Refresh to get the auto-generated ID
        
        return db_station