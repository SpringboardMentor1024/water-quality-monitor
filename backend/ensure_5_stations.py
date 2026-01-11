#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ensure we have exactly 5 stations with minimal readings
"""
import sqlite3
from datetime import datetime, timedelta
import random

def ensure_5_stations():
    """Ensure we have exactly 5 stations with current readings"""
    
    # Connect to database
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    # Check current stations count
    cursor.execute("SELECT COUNT(*) FROM water_stations")
    current_count = cursor.fetchone()[0]
    
    print(f"Current stations count: {current_count}")
    
    if current_count == 0:
        print("No stations found. Creating 5 stations...")
        
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
        
        # Add minimal current readings (just latest reading for each parameter)
        parameters = {
            'pH': (6.5, 8.0),
            'turbidity': (0.5, 3.0),
            'DO': (6.0, 9.0),
            'temperature': (18.0, 30.0),
            'lead': (0.0001, 0.005),
            'arsenic': (0.0001, 0.003)
        }
        
        current_time = datetime.now()
        
        for station_id in station_ids:
            for param, (min_val, max_val) in parameters.items():
                # Generate realistic values
                if param in ['lead', 'arsenic']:
                    value = random.uniform(min_val, min_val * 5)
                elif param == 'pH':
                    value = random.uniform(6.8, 7.8)
                elif param == 'turbidity':
                    value = random.uniform(min_val, max_val * 0.7)
                else:
                    value = random.uniform(min_val, max_val)
                
                cursor.execute("""
                    INSERT INTO station_readings (station_id, parameter, value, recorded_at)
                    VALUES (?, ?, ?, ?)
                """, (station_id, param, round(value, 4), current_time.isoformat()))
        
        conn.commit()
        
        # Verify final counts
        cursor.execute("SELECT COUNT(*) FROM water_stations")
        stations_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM station_readings")
        readings_count = cursor.fetchone()[0]
        
        print(f"Successfully created {stations_count} stations")
        print(f"Successfully created {readings_count} readings")
        
    else:
        print(f"Already have {current_count} stations - no changes needed")
    
    # Show station details
    cursor.execute("SELECT id, name, location FROM water_stations")
    stations_data = cursor.fetchall()
    print(f"\nCurrent stations ({len(stations_data)}):")
    for station_id, name, location in stations_data:
        print(f"  - {name} ({location}) - ID: {station_id}")
    
    conn.close()

if __name__ == "__main__":
    ensure_5_stations()