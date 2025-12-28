import csv
from collections import defaultdict

# Group readings by station
stations_readings = defaultdict(list)

with open("station_readings.csv", newline="") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        stations_readings[row['station_name']].append(row)

# Print grouped readings
for station, readings in stations_readings.items():
    print(f"\nReadings for {station}:")
    for r in readings:
        print(f"  {r['parameter']}: {r['value']} at {r['recorded_at']}")
# Calculate statistics
for station, readings in stations_readings.items():
    print(f"\nStatistics for {station}:")
    param_values = defaultdict(list)
    for r in readings:
        param_values[r['parameter']].append(float(r['value']))
    
    for param, values in param_values.items():
        min_val = min(values)
        max_val = max(values)
        avg_val = sum(values) / len(values)
        print(f"  {param} -> min: {min_val}, max: {max_val}, avg: {avg_val:.2f}")
# Define safe limits
safe_limits = {
    'pH': (6.5, 8.5),
    'turbidity': (0, 5),
    'DO': (5, 14),
    'iron': (0, 0.3),
    'lead': (0, 0.01),
    'arsenic': (0, 0.01)
}

# Check readings against safe limits
for station, readings in stations_readings.items():
    print(f"\nAlerts for {station}:")
    for r in readings:
        param = r['parameter']
        value = float(r['value'])
        if param in safe_limits:
            min_limit, max_limit = safe_limits[param]
            if value < min_limit or value > max_limit:
                print(f"  {param} = {value} (outside safe range {min_limit}-{max_limit})")
