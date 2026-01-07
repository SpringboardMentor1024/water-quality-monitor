#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import engine
import models
from datetime import datetime, timedelta
from decimal import Decimal

def seed_all_data():
    db = Session(bind=engine)
    
    try:
        # Clear existing data
        db.query(models.Alert).delete()
        db.query(models.StationReading).delete()
        db.query(models.WaterStation).delete()
        db.query(models.Report).delete()
        
        # Add Water Stations
        stations = [
            {
                "name": "Downtown Treatment Plant",
                "location": "123 Main St, Downtown",
                "latitude": Decimal("40.7128"),
                "longitude": Decimal("-74.0060"),
                "managed_by": "City Water Department"
            },
            {
                "name": "River Delta Station",
                "location": "456 River Rd, Industrial District",
                "latitude": Decimal("40.7589"),
                "longitude": Decimal("-73.9851"),
                "managed_by": "Environmental Agency"
            },
            {
                "name": "Lake Reservoir Monitor",
                "location": "789 Lake Ave, Recreation Area",
                "latitude": Decimal("40.7831"),
                "longitude": Decimal("-73.9712"),
                "managed_by": "Parks Department"
            }
        ]
        
        station_objects = []
        for station_data in stations:
            station = models.WaterStation(**station_data)
            db.add(station)
            station_objects.append(station)
        
        db.commit()
        
        # Add Station Readings
        for station in station_objects:
            readings = [
                {"station_id": station.id, "parameter": models.WaterParameter.pH, "value": Decimal("7.2")},
                {"station_id": station.id, "parameter": models.WaterParameter.turbidity, "value": Decimal("2.5")},
                {"station_id": station.id, "parameter": models.WaterParameter.DO, "value": Decimal("8.1")},
                {"station_id": station.id, "parameter": models.WaterParameter.temperature, "value": Decimal("22.5")},
            ]
            
            for reading_data in readings:
                reading = models.StationReading(**reading_data)
                db.add(reading)
        
        # Add Alerts
        alerts = [
            {
                "type": models.AlertType.contamination,
                "message": "High Turbidity Detected - Levels exceed 10 NTU",
                "location": "Downtown Treatment Plant"
            },
            {
                "type": models.AlertType.boil_notice,
                "message": "Low Dissolved Oxygen - Critical levels detected",
                "location": "River Delta Station"
            },
            {
                "type": models.AlertType.outage,
                "message": "System Maintenance - Temporary service interruption",
                "location": "Lake Reservoir Monitor"
            }
        ]
        
        for alert_data in alerts:
            alert = models.Alert(**alert_data)
            db.add(alert)
        
        # Add Sample Reports (without user_id for now)
        reports = [
            {
                "location": "Central Park Lake",
                "description": "Water appears cloudy with unusual odor",
                "water_source": "Lake",
                "status": models.ReportStatus.pending
            },
            {
                "location": "Hudson River Pier 45",
                "description": "Dead fish observed floating on surface",
                "water_source": "River",
                "status": models.ReportStatus.verified
            }
        ]
        
        # Skip reports for now since they require user_id
        # for report_data in reports:
        #     report = models.Report(**report_data)
        #     db.add(report)
        
        db.commit()
        
        print("✅ Successfully seeded all data:")
        print(f"   📍 Water Stations: {db.query(models.WaterStation).count()}")
        print(f"   📊 Station Readings: {db.query(models.StationReading).count()}")
        print(f"   🚨 Alerts: {db.query(models.Alert).count()}")
        print(f"   📝 Reports: Skipped (require user authentication)")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🌱 Seeding database with sample data...")
    seed_all_data()
    print("✅ Database seeding complete!")