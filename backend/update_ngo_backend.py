#!/usr/bin/env python3
"""
Update Backend Database to Match Frontend NGO Dashboard
This script updates the water_stations table to have the exact stations
that your frontend NGO dashboard expects.
"""

import sqlite3
import sys
import os

def update_backend_for_ngo_dashboard():
    """Update backend database to match frontend NGO dashboard requirements"""
    
    # Database path
    db_path = 'water_quality.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Database not found: {db_path}")
        print("Please run this script from the backend directory")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔄 Updating backend database to match NGO dashboard...")
        
        # First, clear existing stations
        cursor.execute("DELETE FROM station_readings")
        cursor.execute("DELETE FROM water_stations")
        print("✅ Cleared existing stations")
        
        # Insert the exact 5 stations that match your frontend
        stations_data = [
            {
                'id': 'NGO-MH-001',
                'name': 'Mumbai Coast',
                'location': 'Mumbai, Maharashtra',
                'latitude': 19.0760,
                'longitude': 72.8777,
                'managed_by': 'Maharashtra Water Board',
                'status': 'active',
                'reading_type': 'salinity',
                'reading_value': 32,
                'reading_unit': 'PSU'
            },
            {
                'id': 'NGO-MH-002',
                'name': 'Thane Creek',
                'location': 'Thane, Maharashtra',
                'latitude': 19.2050,
                'longitude': 72.9736,
                'managed_by': 'Maharashtra Water Board',
                'status': 'alert',
                'reading_type': 'turbidity',
                'reading_value': 9,
                'reading_unit': 'NTU'
            },
            {
                'id': 'NGO-DL-003',
                'name': 'Yamuna River Delhi',
                'location': 'Delhi',
                'latitude': 28.6139,
                'longitude': 77.2090,
                'managed_by': 'Delhi Water Board',
                'status': 'alert',
                'reading_type': 'ammonia',
                'reading_value': 'High',
                'reading_unit': ''
            },
            {
                'id': 'NGO-KA-004',
                'name': 'Bellandur Lake Bangalore',
                'location': 'Bangalore, Karnataka',
                'latitude': 12.9716,
                'longitude': 77.5946,
                'managed_by': 'Karnataka Water Authority',
                'status': 'active',
                'reading_type': 'dissolved_oxygen',
                'reading_value': 6.7,
                'reading_unit': 'mg/L'
            },
            {
                'id': 'NGO-GJ-005',
                'name': 'Sabarmati River',
                'location': 'Ahmedabad, Gujarat',
                'latitude': 23.0225,
                'longitude': 72.5714,
                'managed_by': 'Gujarat Water Board',
                'status': 'active',
                'reading_type': 'ph',
                'reading_value': 7.2,
                'reading_unit': ''
            }
        ]
        
        # Since the current schema uses integer IDs, we need to modify the approach
        # We'll use the station name to match and store the NGO ID in a custom field
        
        # First, let's check if we need to add a custom_id column
        cursor.execute("PRAGMA table_info(water_stations)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'custom_id' not in columns:
            cursor.execute("ALTER TABLE water_stations ADD COLUMN custom_id TEXT")
            print("✅ Added custom_id column for NGO station IDs")
        
        if 'status' not in columns:
            cursor.execute("ALTER TABLE water_stations ADD COLUMN status TEXT DEFAULT 'active'")
            print("✅ Added status column")
        
        # Insert stations with auto-increment IDs but custom NGO IDs
        for i, station in enumerate(stations_data, 1):
            cursor.execute("""
                INSERT INTO water_stations 
                (id, custom_id, name, location, latitude, longitude, managed_by, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                i,  # Use sequential integer ID
                station['id'],  # Store NGO ID in custom_id
                station['name'],
                station['location'],
                station['latitude'],
                station['longitude'],
                station['managed_by'],
                station['status']
            ))
            
            # Add current readings for each station
            if station['reading_type'] == 'ph':
                cursor.execute("""
                    INSERT INTO station_readings (station_id, parameter, value)
                    VALUES (?, 'pH', ?)
                """, (i, station['reading_value']))
            elif station['reading_type'] == 'turbidity':
                cursor.execute("""
                    INSERT INTO station_readings (station_id, parameter, value)
                    VALUES (?, 'turbidity', ?)
                """, (i, station['reading_value']))
            elif station['reading_type'] == 'dissolved_oxygen':
                cursor.execute("""
                    INSERT INTO station_readings (station_id, parameter, value)
                    VALUES (?, 'DO', ?)
                """, (i, station['reading_value']))
            elif station['reading_type'] == 'salinity':
                # For salinity, we'll store it as a temperature reading for now
                cursor.execute("""
                    INSERT INTO station_readings (station_id, parameter, value)
                    VALUES (?, 'temperature', ?)
                """, (i, station['reading_value']))
            
            print(f"✅ Added station: {station['id']} - {station['name']}")
        
        conn.commit()
        
        # Verify the data
        cursor.execute("SELECT id, custom_id, name, status FROM water_stations")
        stations = cursor.fetchall()
        
        print("\n🎯 Updated Stations:")
        for station in stations:
            print(f"  ID: {station[0]} | NGO-ID: {station[1]} | Name: {station[2]} | Status: {station[3]}")
        
        print(f"\n✅ Successfully updated {len(stations)} stations!")
        print("🎉 Backend now matches your NGO dashboard frontend!")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error updating database: {e}")
        return False

def update_api_endpoints():
    """Update the main.py API endpoints to handle NGO station IDs"""
    
    api_update_code = '''
# Add this to your main.py to handle NGO station IDs

@app.get("/api/stations")
async def get_stations():
    """Get all water stations with NGO-compatible format"""
    try:
        cursor.execute("""
            SELECT ws.id, ws.custom_id, ws.name, ws.location, ws.latitude, ws.longitude, 
                   ws.managed_by, ws.status, ws.created_at
            FROM water_stations ws
        """)
        stations = cursor.fetchall()
        
        result = []
        for station in stations:
            # Get latest readings for this station
            cursor.execute("""
                SELECT parameter, value FROM station_readings 
                WHERE station_id = ? 
                ORDER BY recorded_at DESC LIMIT 10
            """, (station[0],))
            readings = cursor.fetchall()
            
            # Build current reading object
            current_reading = {}
            for param, value in readings:
                if param == 'pH':
                    current_reading['ph'] = float(value)
                elif param == 'turbidity':
                    current_reading['turbidity'] = float(value)
                elif param == 'DO':
                    current_reading['dissolved_oxygen'] = float(value)
                elif param == 'temperature':
                    current_reading['temperature'] = float(value)
            
            station_data = {
                "id": station[1] or f"STN-{station[0]:03d}",  # Use custom_id (NGO-ID) or fallback
                "name": station[2],
                "location": station[3],
                "latitude": float(station[4]),
                "longitude": float(station[5]),
                "managed_by": station[6],
                "status": station[7] or "active",
                "created_at": station[8],
                "currentReading": current_reading
            }
            result.append(station_data)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/stations/{station_id}")
async def get_station_by_id(station_id: str):
    """Get specific station by NGO ID or numeric ID"""
    try:
        # Try to find by custom_id first (NGO-ID), then by numeric id
        cursor.execute("""
            SELECT ws.id, ws.custom_id, ws.name, ws.location, ws.latitude, ws.longitude, 
                   ws.managed_by, ws.status, ws.created_at
            FROM water_stations ws
            WHERE ws.custom_id = ? OR ws.id = ?
        """, (station_id, station_id))
        
        station = cursor.fetchone()
        if not station:
            raise HTTPException(status_code=404, detail="Station not found")
        
        # Get latest readings
        cursor.execute("""
            SELECT parameter, value FROM station_readings 
            WHERE station_id = ? 
            ORDER BY recorded_at DESC LIMIT 10
        """, (station[0],))
        readings = cursor.fetchall()
        
        current_reading = {}
        for param, value in readings:
            if param == 'pH':
                current_reading['ph'] = float(value)
            elif param == 'turbidity':
                current_reading['turbidity'] = float(value)
            elif param == 'DO':
                current_reading['dissolved_oxygen'] = float(value)
            elif param == 'temperature':
                current_reading['temperature'] = float(value)
        
        return {
            "id": station[1] or f"STN-{station[0]:03d}",
            "name": station[2],
            "location": station[3],
            "latitude": float(station[4]),
            "longitude": float(station[5]),
            "managed_by": station[6],
            "status": station[7] or "active",
            "created_at": station[8],
            "currentReading": current_reading
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
'''
    
    print("\n📝 API Update Code:")
    print("="*50)
    print("Copy this code to your main.py to update the API endpoints:")
    print(api_update_code)
    print("="*50)

if __name__ == "__main__":
    print("🚀 Backend Database Update for NGO Dashboard")
    print("=" * 50)
    
    success = update_backend_for_ngo_dashboard()
    
    if success:
        print("\n🎯 Next Steps:")
        print("1. ✅ Database updated successfully")
        print("2. 📝 Update your API endpoints (see code below)")
        print("3. 🔄 Restart your backend server")
        print("4. 🧪 Test the NGO dashboard with real data")
        
        update_api_endpoints()
    else:
        print("\n❌ Database update failed. Please check the errors above.")
        sys.exit(1)