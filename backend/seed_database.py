#!/usr/bin/env python3
"""
Database seeding script for Water Quality Monitor
Populates the database with sample data for testing
"""
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
from datetime import datetime, timedelta
import random

def seed_database():
    print("🌱 Seeding database with sample data...")
    
    # Create all tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Sample water stations
        stations_data = [
            {
                "name": "River Delta Station Alpha",
                "location": "Sacramento, California",
                "latitude": 38.5816,
                "longitude": -121.4944,
                "managed_by": "California Water Board"
            },
            {
                "name": "Lake Monitoring Station Beta",
                "location": "Austin, Texas",
                "latitude": 30.2672,
                "longitude": -97.7431,
                "managed_by": "Texas Environmental Agency"
            },
            {
                "name": "Coastal Water Station Gamma",
                "location": "Miami, Florida",
                "latitude": 25.7617,
                "longitude": -80.1918,
                "managed_by": "Florida DEP"
            },
            {
                "name": "Mountain Stream Station Delta",
                "location": "Denver, Colorado",
                "latitude": 39.7392,
                "longitude": -104.9903,
                "managed_by": "Colorado Water Quality Division"
            },
            {
                "name": "Urban Water Station Epsilon",
                "location": "New York, New York",
                "latitude": 40.7128,
                "longitude": -74.0060,
                "managed_by": "NYC Environmental Protection"
            }
        ]
        
        # Create stations
        created_stations = []
        for station_data in stations_data:
            # Check if station already exists
            existing = db.query(models.WaterStation).filter(
                models.WaterStation.name == station_data["name"]
            ).first()
            
            if not existing:
                station = models.WaterStation(**station_data)
                db.add(station)
                db.commit()
                db.refresh(station)
                created_stations.append(station)
                print(f"✅ Created station: {station.name}")
            else:
                created_stations.append(existing)
                print(f"⚠️ Station already exists: {existing.name}")
        
        # Generate sample readings for each station
        parameters = [
            models.WaterParameter.pH,
            models.WaterParameter.turbidity,
            models.WaterParameter.DO,
            models.WaterParameter.temperature,
            models.WaterParameter.lead,
            models.WaterParameter.arsenic,
            models.WaterParameter.bacteria
        ]
        
        # Parameter ranges for realistic data
        param_ranges = {
            models.WaterParameter.pH: (6.0, 8.5),
            models.WaterParameter.turbidity: (0.1, 25.0),
            models.WaterParameter.DO: (2.0, 12.0),
            models.WaterParameter.temperature: (10.0, 30.0),
            models.WaterParameter.lead: (0.001, 0.015),
            models.WaterParameter.arsenic: (0.001, 0.010),
            models.WaterParameter.bacteria: (0, 1000)
        }
        
        readings_created = 0
        for station in created_stations:
            # Generate readings for the last 30 days
            for days_ago in range(30):
                date = datetime.now() - timedelta(days=days_ago)
                
                # Generate 2-4 readings per day for each station
                daily_readings = random.randint(2, 4)
                
                for _ in range(daily_readings):
                    # Random time within the day
                    hour_offset = random.randint(0, 23)
                    minute_offset = random.randint(0, 59)
                    reading_time = date.replace(hour=hour_offset, minute=minute_offset, second=0, microsecond=0)
                    
                    # Pick a random parameter
                    parameter = random.choice(parameters)
                    min_val, max_val = param_ranges[parameter]
                    
                    # Generate realistic value with some variation
                    if parameter == models.WaterParameter.bacteria:\n                        value = random.randint(int(min_val), int(max_val))\n                    else:\n                        value = round(random.uniform(min_val, max_val), 3)\n                    \n                    reading = models.StationReading(\n                        station_id=station.id,\n                        parameter=parameter,\n                        value=value,\n                        recorded_at=reading_time\n                    )\n                    \n                    db.add(reading)\n                    readings_created += 1\n        \n        db.commit()\n        print(f\"✅ Created {readings_created} sample readings\")\n        \n        # Create some sample alerts\n        sample_alerts = [\n            {\n                \"type\": models.AlertType.contamination,\n                \"message\": \"High bacteria levels detected - E.coli count exceeds safe limits\",\n                \"location\": \"River Delta Station Alpha\"\n            },\n            {\n                \"type\": models.AlertType.boil_notice,\n                \"message\": \"pH levels outside safe range - Boil water before consumption\",\n                \"location\": \"Lake Monitoring Station Beta\"\n            },\n            {\n                \"type\": models.AlertType.outage,\n                \"message\": \"Station connection lost - No data received for 15 minutes\",\n                \"location\": \"Coastal Water Station Gamma\"\n            }\n        ]\n        \n        alerts_created = 0\n        for alert_data in sample_alerts:\n            # Check if similar alert exists\n            existing = db.query(models.Alert).filter(\n                models.Alert.location == alert_data[\"location\"],\n                models.Alert.type == alert_data[\"type\"]\n            ).first()\n            \n            if not existing:\n                alert = models.Alert(**alert_data)\n                db.add(alert)\n                alerts_created += 1\n        \n        db.commit()\n        print(f\"✅ Created {alerts_created} sample alerts\")\n        \n        print(\"\\n🎉 Database seeding completed successfully!\")\n        print(f\"\\n📊 Summary:\")\n        print(f\"   🏭 Water Stations: {len(created_stations)}\")\n        print(f\"   📊 Station Readings: {readings_created}\")\n        print(f\"   🚨 Alerts: {alerts_created}\")\n        print(f\"\\n🚀 Database is ready for testing!\")\n        \n    except Exception as e:\n        print(f\"❌ Error seeding database: {e}\")\n        db.rollback()\n    finally:\n        db.close()\n\nif __name__ == \"__main__\":\n    seed_database()