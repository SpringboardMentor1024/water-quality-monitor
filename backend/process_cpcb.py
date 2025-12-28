import csv

input_file = "data/cpcb_water_quality.csv"
output_file = "data/cpcb_cleaned.csv"

relevant_columns = [
    "STATION CODE", "LOCATIONS", "D.O. (mg/l) : Mean : > 4 mg/l",
    "pH : Mean : 6.5-8.5", "FECAL COLIFORM (MPN/100ml) : Mean : < 2500 MPN/100ml",
    "TOTAL COLIFORM (MPN/100ml) : Mean : < 5000 MPN/100ml", "lead", "arsenic", "iron"
]

with open(input_file, newline='', encoding='utf-8') as infile, open(output_file, 'w', newline='', encoding='utf-8') as outfile:
    reader = csv.DictReader(infile)
    # write only relevant columns that exist
    existing_columns = [col for col in relevant_columns if col in reader.fieldnames]
    writer = csv.DictWriter(outfile, fieldnames=existing_columns)
    writer.writeheader()
    for row in reader:
        writer.writerow({col: row[col] for col in existing_columns})

print(f"Cleaned CPCB data saved to {output_file}")
