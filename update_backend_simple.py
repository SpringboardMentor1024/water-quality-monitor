import sqlite3
import os

def update_database():
    """Update database with NGO stations"""
    
    # Change to backend directory
    os.chdir('backend')
    
    # Connect to database
    conn = sqlite3.connect('water_quality.db')
    cursor = conn.cursor()
    
    print("🔄 Updating database...")
    
    # Clear existing data
    cursor.execute("DELETE FROM station_readings")
    cursor.execute("DELETE FROM water_stations")
    
    # Add custom_id column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE water_stations ADD COLUMN custom_id TEXT")
    except:
        pass  # Column already exists
    
    try:
        cursor.execute("ALTER TABLE water_stations ADD COLUMN status TEXT DEFAULT 'active'")
    except:
        pass  # Column already exists
    
    # Insert NGO stations
    stations = [
        (1, 'NGO-MH-001', 'Mumbai Coast', 'Mumbai, Maharashtra', 19.0760, 72.8777, 'Maharashtra Water Board', 'active'),
        (2, 'NGO-MH-002', 'Thane Creek', 'Thane, Maharashtra', 19.2050, 72.9736, 'Maharashtra Water Board', 'alert'),
        (3, 'NGO-DL-003', 'Yamuna River Delhi', 'Delhi', 28.6139, 77.2090, 'Delhi Water Board', 'alert'),
        (4, 'NGO-KA-004', 'Bellandur Lake Bangalore', 'Bangalore, Karnataka', 12.9716, 77.5946, 'Karnataka Water Authority', 'active'),
        (5, 'NGO-GJ-005', 'Sabarmati River', 'Ahmedabad, Gujarat', 23.0225, 72.5714, 'Gujarat Water Board', 'active')
    ]
    
    for station in stations:
        cursor.execute("""
            INSERT INTO water_stations (id, custom_id, name, location, latitude, longitude, managed_by, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, station)
    
    # Add sample readings
    readings = [
        (1, 'temperature', 32),  # Salinity as temperature for NGO-MH-001
        (2, 'turbidity', 9),     # Turbidity for NGO-MH-002
        (3, 'pH', 8.5),          # High ammonia as high pH for NGO-DL-003
        (4, 'DO', 6.7),          # DO for NGO-KA-004
        (5, 'pH', 7.2)           # pH for NGO-GJ-005
    ]
    
    for reading in readings:
        cursor.execute("""
            INSERT INTO station_readings (station_id, parameter, value)
            VALUES (?, ?, ?)
        """, reading)
    
    conn.commit()
    conn.close()
    
    print("✅ Database updated successfully!")
    print("✅ Added 5 NGO stations with readings")

if __name__ == "__main__":
    update_database()