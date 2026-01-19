import sqlite3
import os
from datetime import datetime, timedelta
import random

def add_historical_data():
    """Add historical readings for charts"""
    
    os.chdir('backend')
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    print("Adding historical data for charts...")
    
    # Clear existing readings
    cursor.execute("DELETE FROM station_readings")
    
    # Add historical readings for the last 7 days
    base_date = datetime.now() - timedelta(days=7)
    
    stations = [
        (1, 'NGO-MH-001'),
        (2, 'NGO-MH-002'), 
        (3, 'NGO-DL-003'),
        (4, 'NGO-KA-004'),
        (5, 'NGO-GJ-005')
    ]
    
    parameters = ['pH', 'temperature', 'turbidity', 'DO']
    
    for station_id, station_name in stations:
        print(f"Adding data for {station_name}...")
        
        for day in range(7):
            date = base_date + timedelta(days=day)
            
            # Add readings for each parameter
            for param in parameters:
                if param == 'pH':
                    value = round(random.uniform(6.5, 8.5), 2)
                elif param == 'temperature':
                    if station_id == 1:  # NGO-MH-001 - use as salinity
                        value = round(random.uniform(30, 35), 1)
                    else:
                        value = round(random.uniform(20, 30), 1)
                elif param == 'turbidity':
                    if station_id == 2:  # NGO-MH-002 - higher turbidity
                        value = round(random.uniform(8, 12), 1)
                    else:
                        value = round(random.uniform(2, 6), 1)
                elif param == 'DO':
                    value = round(random.uniform(4, 8), 1)
                
                cursor.execute("""
                    INSERT INTO station_readings (station_id, parameter, value, recorded_at)
                    VALUES (?, ?, ?, ?)
                """, (station_id, param, value, date.isoformat()))
    
    conn.commit()
    
    # Verify data
    cursor.execute("SELECT COUNT(*) FROM station_readings")
    count = cursor.fetchone()[0]
    print(f"Added {count} historical readings")
    
    # Show sample data
    cursor.execute("""
        SELECT sr.station_id, ws.custom_id, sr.parameter, sr.value, sr.recorded_at 
        FROM station_readings sr 
        JOIN water_stations ws ON sr.station_id = ws.id 
        LIMIT 10
    """)
    
    print("\nSample readings:")
    for row in cursor.fetchall():
        print(f"  {row[1]} - {row[2]}: {row[3]} ({row[4][:10]})")
    
    conn.close()
    print("Historical data added successfully!")

if __name__ == "__main__":
    add_historical_data()