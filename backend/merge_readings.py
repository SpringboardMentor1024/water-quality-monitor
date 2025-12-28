import csv

local_file = "station_readings.csv"
cpcb_file = "data/cpcb_local_format.csv"
merged_file = "data/merged_readings.csv"

with open(local_file, newline='', encoding='utf-8') as f1, \
     open(cpcb_file, newline='', encoding='utf-8') as f2, \
     open(merged_file, 'w', newline='', encoding='utf-8') as fout:

    reader1 = csv.DictReader(f1)
    reader2 = csv.DictReader(f2)
    fieldnames = reader1.fieldnames
    writer = csv.DictWriter(fout, fieldnames=fieldnames)
    writer.writeheader()

    # Write local readings
    for row in reader1:
        writer.writerow(row)

    # Write CPCB readings
    for row in reader2:
        writer.writerow(row)

print(f"All readings merged into {merged_file}")

