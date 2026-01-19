#!/usr/bin/env python3
"""
Analyze the real data vs mock data issue in the backend
"""

import sqlite3
import json
from pathlib import Path

# Connect to database
db_path = Path(__file__).parent / "backend" / "water_quality.db"
conn = sqlite3.connect(str(db_path))
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("=" * 80)
print("WATER QUALITY MONITOR - DATA ANALYSIS")
print("=" * 80)

# Check tables
print("\n1. DATABASE TABLES")
print("-" * 80)
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [row[0] for row in cursor.fetchall()]
print(f"Total Tables: {len(tables)}")
for table in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f"  ✓ {table}: {count} records")

# Check water stations
print("\n2. WATER STATIONS DATA")
print("-" * 80)
cursor.execute("SELECT id, name, location, latitude, longitude, managed_by FROM water_stations LIMIT 10")
stations = cursor.fetchall()
print(f"Total Water Stations: {len(stations)} records")
if stations:
    for station in stations:
        print(f"  • Station ID {station['id']}: {station['name']}")
        print(f"    Location: {station['location']}")
        print(f"    Coordinates: ({station['latitude']}, {station['longitude']})")
        print(f"    Managed by: {station['managed_by']}")
else:
    print("  ⚠ No water stations found!")

# Check station readings
print("\n3. STATION READINGS DATA")
print("-" * 80)
cursor.execute("""
    SELECT sr.id, sr.station_id, sr.parameter, sr.value, sr.recorded_at,
           ws.name as station_name
    FROM station_readings sr
    LEFT JOIN water_stations ws ON sr.station_id = ws.id
    ORDER BY sr.recorded_at DESC
    LIMIT 20
""")
readings = cursor.fetchall()
print(f"Total Station Readings: {cursor.execute('SELECT COUNT(*) FROM station_readings').fetchone()[0]} records")
if readings:
    for reading in readings:
        print(f"  • Station {reading['station_id']} ({reading['station_name']})")
        print(f"    Parameter: {reading['parameter']}, Value: {reading['value']}")
        print(f"    Recorded: {reading['recorded_at']}")
else:
    print("  ⚠ No station readings found!")

# Check for distinct parameters per station
print("\n4. PARAMETERS BY STATION")
print("-" * 80)
cursor.execute("""
    SELECT sr.station_id, ws.name, GROUP_CONCAT(DISTINCT sr.parameter) as parameters,
           COUNT(*) as reading_count
    FROM station_readings sr
    LEFT JOIN water_stations ws ON sr.station_id = ws.id
    GROUP BY sr.station_id
""")
param_data = cursor.fetchall()
if param_data:
    for row in param_data:
        print(f"  Station {row['station_id']} ({row['name']}):")
        print(f"    Parameters: {row['parameters']}")
        print(f"    Total readings: {row['reading_count']}")
else:
    print("  ⚠ No parameter data found!")

# Check alerts
print("\n5. ALERTS DATA")
print("-" * 80)
cursor.execute("SELECT COUNT(*) FROM alerts")
alert_count = cursor.fetchone()[0]
print(f"Total Alerts: {alert_count} records")
if alert_count > 0:
    cursor.execute("SELECT id, type, location, issued_at FROM alerts LIMIT 5")
    for alert in cursor.fetchall():
        print(f"  • Alert {alert['id']}: {alert['type']} at {alert['location']} ({alert['issued_at']})")

# Check reports
print("\n6. REPORTS DATA")
print("-" * 80)
cursor.execute("SELECT COUNT(*) FROM reports")
report_count = cursor.fetchone()[0]
print(f"Total Reports: {report_count} records")
if report_count > 0:
    cursor.execute("SELECT id, location, description, status, created_at FROM reports LIMIT 5")
    for report in cursor.fetchall():
        print(f"  • Report {report['id']}: {report['location']} - {report['status']} ({report['created_at']})")

# Issue Analysis
print("\n7. ISSUE ANALYSIS")
print("-" * 80)
print("🔍 FINDINGS:")

if len(stations) == 0:
    print("  ❌ NO WATER STATIONS IN DATABASE")
    print("     → Frontend shows no stations or hardcoded stations")
else:
    print(f"  ✓ Water stations exist: {len(stations)} stations")
    
if len(readings) == 0:
    print("  ❌ NO STATION READINGS IN DATABASE")
    print("     → Backend endpoint (main.py:253-264) returns HARDCODED values:")
    print("        - ph: 7.2")
    print("        - turbidity: 1.5")
    print("        - dissolved_oxygen: 8.0")
    print("        - temperature: 22.0")
    print("     → All stations show SAME VALUES (repeating/identical)")
else:
    print(f"  ✓ Station readings exist: {len(readings)} readings")
    
print("\n8. ROOT CAUSE")
print("-" * 80)
print("""
ISSUE IDENTIFIED:
The /api/stations endpoint in backend/main.py (lines 253-264) has hardcoded
'currentReading' values instead of fetching actual data from station_readings table.

CODE LOCATION: backend/main.py line 260-265
CURRENT CODE:
    'currentReading': {
        'ph': 7.2,              ← HARDCODED
        'turbidity': 1.5,       ← HARDCODED
        'dissolved_oxygen': 8.0, ← HARDCODED
        'temperature': 22.0     ← HARDCODED
    },

RESULT: All stations show identical readings (SAME VALUES)
""")

print("\n" + "=" * 80)
conn.close()
