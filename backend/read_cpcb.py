import csv

file_path = "data/cpcb_water_quality.csv"

with open(file_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    headers = next(reader)  # read the header row
    print("Headers:", headers)
    for i, row in enumerate(reader):
        print(row)
        if i == 4:  # print first 5 rows only
            break
