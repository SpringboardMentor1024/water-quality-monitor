#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Populate sample water stations and readings for the stations page
"""
import sqlite3
from datetime import datetime, timedelta
import random

def populate_sample_stations():
    """Add sample water stations and readings to the database"""
    
    # Connect to database
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute("DELETE FROM station_readings")
    cursor.execute("DELETE FROM water_stations")
    
    # Sample stations data
    stations = [
        {
            'name': 'Riverbend Station',
            'location': 'Delhi, India',
            'latitude': 28.6139,
            'longitude': 77.2090,
            'managed_by': 'Delhi Water Board'
        },
        {
            'name': 'Lakeview Point',
            'location': 'Mumbai, India',
            'latitude': 19.0760,
            'longitude': 72.8777,
            'managed_by': 'Mumbai Municipal Corporation'
        },
        {
            'name': 'Ganges Monitoring',
            'location': 'Varanasi, India',
            'latitude': 25.3176,
            'longitude': 83.0058,
            'managed_by': 'UP Pollution Control Board'
        },
        {
            'name': 'Coastal Watch',
            'location': 'Chennai, India',
            'latitude': 13.0827,
            'longitude': 80.2707,
            'managed_by': 'Tamil Nadu Water Board'
        },
        {
            'name': 'Mountain Spring',
            'location': 'Shimla, India',
            'latitude': 31.1048,
            'longitude': 77.1734,
            'managed_by': 'Himachal Pradesh Water Authority'
        }
    ]
    
    # Insert stations
    station_ids = []
    for station in stations:
        cursor.execute("""
            INSERT INTO water_stations (name, location, latitude, longitude, managed_by)
            VALUES (?, ?, ?, ?, ?)
        """, (station['name'], station['location'], station['latitude'], 
              station['longitude'], station['managed_by']))
        
        station_ids.append(cursor.lastrowid)
    
    # Water parameters and their typical ranges
    parameters = {
        'pH': (6.0, 8.5),
        'turbidity': (0.5, 5.0),
        'DO': (5.0, 10.0),  # Dissolved Oxygen
        'temperature': (15.0, 35.0),
        'lead': (0.0001, 0.015),
        'arsenic': (0.0001, 0.010)
    }
    
    # Generate readings for each station (last 24 hours)
    base_time = datetime.now() - timedelta(hours=24)
    
    for station_id in station_ids:
        # Generate readings every 2 hours for the last 24 hours
        for hour in range(0, 24, 2):
            reading_time = base_time + timedelta(hours=hour)
            
            for param, (min_val, max_val) in parameters.items():
                # Add some variation to make data realistic
                if param in ['lead', 'arsenic']:
                    # These should be very low
                    value = random.uniform(min_val, min_val * 10)
                elif param == 'pH':
                    # pH should be close to neutral
                    value = random.uniform(6.5, 8.0)
                elif param == 'turbidity':
                    # Most readings should be low
                    value = random.uniform(min_val, max_val * 0.6)
                else:
                    value = random.uniform(min_val, max_val)
                
                cursor.execute("""
                    INSERT INTO station_readings (station_id, parameter, value, recorded_at)
                    VALUES (?, ?, ?, ?)
                """, (station_id, param, round(value, 4), reading_time.isoformat()))
    
    # Commit changes
    conn.commit()
    
    # Verify data
    cursor.execute("SELECT COUNT(*) FROM water_stations")
    total_stations = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM station_readings")
    total_readings = cursor.fetchone()[0]
    
    print(f"Successfully populated {total_stations} water stations")
    print(f"Successfully populated {total_readings} station readings")
    
    # Show station details
    cursor.execute("SELECT id, name, location FROM water_stations")
    stations_data = cursor.fetchall()
    print("\nCreated stations:")
    for station_id, name, location in stations_data:
        print(f"  - {name} ({location}) - ID: {station_id}")
    
    conn.close()

if __name__ == "__main__":
    populate_sample_stations()