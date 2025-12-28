import requests
BASE_URL = "http://127.0.0.1:8000"

import csv
from datetime import datetime

# URL to get all stations
STATIONS_URL = "http://127.0.0.1:8000/stations/"

# URL template to get readings for a station (we'll format with station_id)
READINGS_URL_TEMPLATE = "http://127.0.0.1:8000/readings/{}"
# Fetch all stations
response = requests.get(STATIONS_URL)
stations = response.json()

print("Stations fetched:")
for station in stations:
    print(f"{station['id']} - {station['name']} ({station['location']})")
for station in stations:
    station_id = station["id"]
    response = requests.get(f"{BASE_URL}/readings/{station_id}")
    readings = response.json()
    print(f"\nReadings for {station['name']} (ID: {station_id}):")
    for r in readings:
        print(f"  {r['parameter']}: {r['value']}")
with open("station_readings.csv", mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["station_id", "station_name", "parameter", "value", "recorded_at"])
    
    for station in stations:
        station_id = station["id"]
        station_name = station["name"]
        response = requests.get(f"{BASE_URL}/readings/{station_id}")
        readings = response.json()
        for reading in readings:
            writer.writerow([
                station_id,
                station_name,
                reading["parameter"],
                reading["value"],
                reading["recorded_at"]
            ])
print("\nAll readings exported successfully to station_readings.csv!")
