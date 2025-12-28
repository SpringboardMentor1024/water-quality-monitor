import csv
from datetime import datetime

input_file = "data/cpcb_cleaned.csv"
output_file = "data/cpcb_local_format.csv"

with open(input_file, newline='', encoding='utf-8') as infile, open(output_file, 'w', newline='', encoding='utf-8') as outfile:
    reader = csv.DictReader(infile)
    fieldnames = ["station_id", "station_name", "parameter", "value", "recorded_at"]
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        station_id = row["STATION CODE"]
        station_name = row["LOCATIONS"]
        recorded_at = datetime.now().isoformat()  # current time
        for param in ["pH : Mean : 6.5-8.5", "D.O. (mg/l) : Mean : > 4 mg/l",
                      "FECAL COLIFORM (MPN/100ml) : Mean : < 2500 MPN/100ml",
                      "TOTAL COLIFORM (MPN/100ml) : Mean : < 5000 MPN/100ml"]:
            if param in row and row[param]:
                value = row[param]
                param_name = param.split(":")[0].strip()  # clean parameter name
                writer.writerow({
                    "station_id": station_id,
                    "station_name": station_name,
                    "parameter": param_name,
                    "value": value,
                    "recorded_at": recorded_at
                })

print(f"CPCB data converted to local format: {output_file}")
