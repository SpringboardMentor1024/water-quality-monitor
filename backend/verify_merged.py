import csv

with open("data/merged_readings.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)
