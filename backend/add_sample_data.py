#!/usr/bin/env python3
"""
Add Sample Data to Database
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import sessionmaker
from database import engine
import models

def add_sample_data():
    print("Adding sample data to database...")
    
    # Create session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Add sample water stations
        stations = [
            models.WaterStation(
                name="Delhi Water Station",
                location="Delhi, India",
                latitude=28.6139,
                longitude=77.2090,
                managed_by="Delhi Water Board"
            ),
            models.WaterStation(
                name="Mumbai Coastal Station",
                location="Mumbai, Maharashtra",
                latitude=19.0760,
                longitude=72.8777,
                managed_by="Mumbai Municipal Corporation"
            ),
            models.WaterStation(
                name="Bangalore Lake Station",
                location="Bangalore, Karnataka",
                latitude=12.9716,
                longitude=77.5946,
                managed_by="Bangalore Water Supply"
            )
        ]
        
        for station in stations:
            existing = session.query(models.WaterStation).filter(
                models.WaterStation.name == station.name
            ).first()
            if not existing:
                session.add(station)
                print(f"Added station: {station.name}")
        
        session.commit()
        
        # Get station IDs for readings
        station_ids = [s.id for s in session.query(models.WaterStation).all()]
        
        # Add sample readings
        if station_ids:
            readings = [
                models.StationReading(
                    station_id=station_ids[0],
                    parameter=models.WaterParameter.pH,
                    value=7.2
                ),
                models.StationReading(
                    station_id=station_ids[0],
                    parameter=models.WaterParameter.temperature,
                    value=25.5
                ),
                models.StationReading(
                    station_id=station_ids[0],
                    parameter=models.WaterParameter.turbidity,
                    value=2.1
                )
            ]
            
            for reading in readings:
                session.add(reading)
            
            print(f"Added {len(readings)} sample readings")
        
        # Add sample alerts
        alerts = [
            models.Alert(
                type=models.AlertType.contamination,
                message="High bacteria levels detected in water sample",
                location="Delhi Water Station"
            ),
            models.Alert(
                type=models.AlertType.boil_notice,
                message="pH levels outside safe range - boil water before use",
                location="Mumbai Coastal Station"
            ),
            models.Alert(
                type=models.AlertType.outage,
                message="Station connection lost - investigating issue",
                location="Bangalore Lake Station"
            )
        ]
        
        for alert in alerts:
            existing = session.query(models.Alert).filter(
                models.Alert.message == alert.message
            ).first()
            if not existing:
                session.add(alert)
                print(f"Added alert: {alert.type.value}")
        
        session.commit()
        print("✅ Sample data added successfully!")
        
        # Show summary
        station_count = session.query(models.WaterStation).count()
        reading_count = session.query(models.StationReading).count()
        alert_count = session.query(models.Alert).count()
        
        print(f"\nDatabase Summary:")
        print(f"Water Stations: {station_count}")
        print(f"Station Readings: {reading_count}")
        print(f"Alerts: {alert_count}")
        
    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    add_sample_data()