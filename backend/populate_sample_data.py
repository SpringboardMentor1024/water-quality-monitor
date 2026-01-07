#!/usr/bin/env python3
"""
Sample data population script for Water Quality Monitor
Adds sample alerts, stations, and readings to the database
"""

import sys
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import engine, get_db
import models

def create_sample_data():
    """Create sample data for testing"""
    db = next(get_db())
    
    try:
        print("Creating sample water stations...")
        
        # Create sample water stations
        stations = [
            models.WaterStation(
                name="Downtown Treatment Plant",
                location="Downtown District",
                latitude=40.7128,
                longitude=-74.0060,
                managed_by="City Water Department"
            ),
            models.WaterStation(
                name="Riverside Monitoring Station",
                location="Riverside Area",
                latitude=40.7589,
                longitude=-73.9851,
                managed_by="Environmental Agency"
            ),
            models.WaterStation(
                name="Industrial Zone Monitor",
                location="Industrial District",
                latitude=40.6892,
                longitude=-74.0445,
                managed_by="Industrial Water Board"
            )
        ]
        
        for station in stations:
            existing = db.query(models.WaterStation).filter(models.WaterStation.name == station.name).first()
            if not existing:
                db.add(station)
        
        db.commit()
        print("Sample stations created")
        
        print("Creating sample alerts...")
        
        # Create sample alerts for the last 30 days
        alert_types = ["boil_notice", "contamination", "outage"]
        severities = ["low", "medium", "high", "critical"]
        
        sample_alerts = []
        base_date = datetime.utcnow() - timedelta(days=30)
        
        for i in range(30):
            current_date = base_date + timedelta(days=i)
            
            # Add 0-3 random alerts per day
            import random
            num_alerts = random.randint(0, 3)
            
            for j in range(num_alerts):
                alert_type = random.choice(alert_types)
                severity = random.choice(severities)
                
                # Create more realistic alert messages
                messages = {
                    "boil_notice": f"Boil water advisory issued for {random.choice(['Downtown', 'Riverside', 'Industrial'])} area due to potential bacterial contamination.",
                    "contamination": f"Chemical contamination detected in water supply. Levels: {random.randint(10, 50)}ppm. Immediate action required.",
                    "outage": f"Water service disruption in {random.choice(['North', 'South', 'East', 'West'])} sector. Estimated repair time: {random.randint(2, 8)} hours."
                }
                
                alert = models.Alert(
                    type=alert_type,
                    message=messages[alert_type],
                    location=f"{random.choice(['Downtown', 'Riverside', 'Industrial', 'Suburban'])} District",
                    issued_at=current_date + timedelta(hours=random.randint(0, 23), minutes=random.randint(0, 59))
                )
                sample_alerts.append(alert)
        
        # Add alerts to database
        for alert in sample_alerts:
            db.add(alert)
        
        db.commit()
        print(f"Created {len(sample_alerts)} sample alerts")
        
        print("Creating sample station readings...")
        
        # Get created stations
        stations = db.query(models.WaterStation).all()
        
        # Create sample readings for each station
        parameters = ["pH", "turbidity", "temperature", "DO"]
        
        for station in stations:
            for i in range(30):  # 30 days of readings
                reading_date = base_date + timedelta(days=i)
                
                # Create readings for each parameter
                for param in parameters:
                    reading_time = reading_date + timedelta(hours=random.randint(0, 23))
                    
                    # Generate realistic values for each parameter
                    if param == "pH":
                        value = round(random.uniform(6.5, 8.5), 2)
                    elif param == "temperature":
                        value = round(random.uniform(15.0, 25.0), 1)
                    elif param == "DO":
                        value = round(random.uniform(7.0, 12.0), 2)
                    elif param == "turbidity":
                        value = round(random.uniform(0.1, 2.0), 2)
                    else:
                        value = round(random.uniform(1.0, 10.0), 2)
                    
                    reading = models.StationReading(
                        station_id=station.id,
                        parameter=param,
                        value=value,
                        recorded_at=reading_time
                    )
                    db.add(reading)
        
        db.commit()
        print("Sample station readings created")
        
        # Print summary
        alert_count = db.query(models.Alert).count()
        station_count = db.query(models.WaterStation).count()
        reading_count = db.query(models.StationReading).count()
        
        print("\nDatabase Summary:")
        print(f"   • Alerts: {alert_count}")
        print(f"   • Stations: {station_count}")
        print(f"   • Readings: {reading_count}")
        print("\nSample data population completed successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting sample data population...")
    create_sample_data()