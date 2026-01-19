"""
Updated API endpoints for NGO Dashboard compatibility
Add these endpoints to your main.py file
"""

from fastapi import HTTPException
import sqlite3

# Database connection (adjust path as needed)
def get_db_connection():
    return sqlite3.connect('water_quality.db')

@app.get("/api/stations")
async def get_stations():
    """Get all water stations with NGO-compatible format"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
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
                elif param == 'bacteria':
                    current_reading['bacteria_concentration'] = float(value)
                elif param == 'lead':
                    current_reading['lead'] = float(value)
                elif param == 'arsenic':
                    current_reading['arsenic'] = float(value)
            
            # Determine status based on readings and stored status
            status = "active"
            if station[7] == "alert":
                status = "warning"
            elif station[7] == "critical":
                status = "critical"
            
            station_data = {
                "id": station[1] or f"STN-{station[0]:03d}",  # Use custom_id (NGO-ID) or fallback
                "name": station[2],
                "location": station[3],
                "latitude": float(station[4]),
                "longitude": float(station[5]),
                "managed_by": station[6],
                "status": status,
                "created_at": station[8],
                "currentReading": current_reading
            }
            result.append(station_data)
        
        conn.close()
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/stations/{station_id}")
async def get_station_by_id(station_id: str):
    """Get specific station by NGO ID or numeric ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
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
            elif param == 'bacteria':
                current_reading['bacteria_concentration'] = float(value)
            elif param == 'lead':
                current_reading['lead'] = float(value)
            elif param == 'arsenic':
                current_reading['arsenic'] = float(value)
        
        # Determine status
        status = "active"
        if station[7] == "alert":
            status = "warning"
        elif station[7] == "critical":
            status = "critical"
        
        result = {
            "id": station[1] or f"STN-{station[0]:03d}",
            "name": station[2],
            "location": station[3],
            "latitude": float(station[4]),
            "longitude": float(station[5]),
            "managed_by": station[6],
            "status": status,
            "created_at": station[8],
            "currentReading": current_reading
        }
        
        conn.close()
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/stations/{station_id}/readings")
async def get_station_readings(station_id: str):
    """Get historical readings for a station"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Find station by custom_id or numeric id
        cursor.execute("""
            SELECT id FROM water_stations 
            WHERE custom_id = ? OR id = ?
        """, (station_id, station_id))
        
        station = cursor.fetchone()
        if not station:
            raise HTTPException(status_code=404, detail="Station not found")
        
        # Get readings for the last 30 days
        cursor.execute("""
            SELECT parameter, value, recorded_at 
            FROM station_readings 
            WHERE station_id = ? 
            ORDER BY recorded_at DESC 
            LIMIT 100
        """, (station[0],))
        
        readings = cursor.fetchall()
        
        result = []
        for reading in readings:
            result.append({
                "parameter": reading[0],
                "value": float(reading[1]),
                "recorded_at": reading[2]
            })
        
        conn.close()
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")