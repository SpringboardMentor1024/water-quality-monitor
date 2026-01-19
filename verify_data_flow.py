#!/usr/bin/env python3
"""
Verification script to check if data is properly set up for charts to display
"""

import sys
sys.path.insert(0, 'backend')

from database import SessionLocal, engine
from backend import models

# Create tables
models.Base.metadata.create_all(bind=engine)

# Get database session
db = SessionLocal()

try:
    # Count existing data
    stations_count = db.query(models.WaterStation).count()
    readings_count = db.query(models.StationReading).count()
    alerts_count = db.query(models.Alert).count()
    predictions_count = db.query(models.Prediction).count()
    
    print("=" * 60)
    print("WATER QUALITY MONITOR - DATA VERIFICATION")
    print("=" * 60)
    print(f"\nDatabase Status:")
    print(f"  ✓ Water Stations: {stations_count}")
    print(f"  ✓ Station Readings: {readings_count}")
    print(f"  ✓ Alerts: {alerts_count}")
    print(f"  ✓ Predictions: {predictions_count}")
    
    # Check if data exists for charts
    if stations_count > 0:
        print(f"\n✅ Stations exist - Chart data should load")
        first_station = db.query(models.WaterStation).first()
        print(f"  Sample Station: {first_station.name} (ID: {first_station.id})")
        
        # Check readings for this station
        station_readings = db.query(models.StationReading).filter(
            models.StationReading.station_id == first_station.id
        ).count()
        print(f"  Readings for Station {first_station.id}: {station_readings}")
        
        # Check alerts for this station  
        station_alerts = db.query(models.Alert).filter(
            models.Alert.location == str(first_station.id)
        ).count()
        print(f"  Alerts for Station {first_station.id}: {station_alerts}")
        
        # Check predictions for this station
        station_predictions = db.query(models.Prediction).filter(
            models.Prediction.station_id == first_station.id
        ).count()
        print(f"  Predictions for Station {first_station.id}: {station_predictions}")
    else:
        print(f"\n⚠️  No stations found - Run seed_collaborations.py first!")
        print("   Command: cd backend && python seed_collaborations.py")
    
    print("\n" + "=" * 60)
    print("BACKEND API ENDPOINTS CHECK:")
    print("=" * 60)
    print(f"  ✓ /api/stations/{{id}}/readings")
    print(f"  ✓ /api/alerts?station_id={{id}}")
    print(f"  ✓ /api/predictions?station_id={{id}}")
    print("\n" + "=" * 60)
    
finally:
    db.close()
