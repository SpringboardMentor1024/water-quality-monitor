# import_water_quality_2011.py

import os
import csv
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

CSV_PATH = "status_water_quality_2011.csv"  # change if needed


def main():
    with engine.begin() as conn, open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            station_code = row["Station Code"].strip()
            location = row["Locations"].strip()
            state_name = row["State Name"].strip()

            # 1) Upsert station (if not exists)
            station_id = conn.execute(
                text(
                    """
                    INSERT INTO stations (station_code, name, state, location)
                    VALUES (:code, :name, :state, :location)
                    ON CONFLICT (station_code) DO UPDATE SET
                      name = EXCLUDED.name,
                      state = EXCLUDED.state,
                      location = EXCLUDED.location
                    RETURNING id;
                    """
                ),
                {
                    "code": station_code,
                    "name": location,
                    "state": state_name,
                    "location": location,
                },
            ).scalar_one()

            # Helper to convert numbers / handle NA
            def num(col):
                v = row.get(col, "").strip()
                if not v or v.upper() == "NA":
                    return None
                try:
                    return float(v)
                except ValueError:
                    return None

            # 2) Insert water-quality row
            conn.execute(
                text(
                    """
                    INSERT INTO water_quality_2011 (
                        station_id,
                        temp_min, temp_max, temp_mean,
                        do_min, do_max, do_mean,
                        ph_min, ph_max, ph_mean,
                        cond_min, cond_max, cond_mean,
                        bod_min, bod_max, bod_mean,
                        nitrate_min, nitrate_max, nitrate_mean,
                        fecal_coliform_min, fecal_coliform_max, fecal_coliform_mean,
                        total_coliform_min, total_coliform_max, total_coliform_mean,
                        fluoride_min, fluoride_max, fluoride_mean
                    ) VALUES (
                        :station_id,
                        :temp_min, :temp_max, :temp_mean,
                        :do_min, :do_max, :do_mean,
                        :ph_min, :ph_max, :ph_mean,
                        :cond_min, :cond_max, :cond_mean,
                        :bod_min, :bod_max, :bod_mean,
                        :nitrate_min, :nitrate_max, :nitrate_mean,
                        :fecal_min, :fecal_max, :fecal_mean,
                        :total_min, :total_max, :total_mean,
                        :fluoride_min, :fluoride_max, :fluoride_mean
                    );
                    """
                ),
                {
                    "station_id": station_id,
                    "temp_min": num("TEMPERATURE (degree Centigrade)-Minimum"),
                    "temp_max": num("TEMPERATURE (degree Centigrade)-Maximum"),
                    "temp_mean": num("TEMPERATURE (degree Centigrade)-Mean"),
                    "do_min": num("Dissolved Oxygen(D.O.) (mg/l)-Minimum"),
                    "do_max": num("Dissolved Oxygen(D.O.) (mg/l)-Maximum"),
                    "do_mean": num("Dissolved Oxygen(D.O.) (mg/l)-Mean"),
                    "ph_min": num("pH-Minimum"),
                    "ph_max": num("pH-Maximum"),
                    "ph_mean": num("pH-Mean"),
                    "cond_min": num("CONDUCTIVITY (µmhos/cm)-Minimum"),
                    "cond_max": num("CONDUCTIVITY (µmhos/cm)-Maximum"),
                    "cond_mean": num("CONDUCTIVITY (µmhos/cm)-Mean"),
                    "bod_min": num("Biochemical oxygen demand (B.O.D.) (mg/l)-Minimum"),
                    "bod_max": num("Biochemical oxygen demand (B.O.D.) (mg/l)-Maximum"),
                    "bod_mean": num("Biochemical oxygen demand (B.O.D.) (mg/l)-Mean"),
                    "nitrate_min": num("NITRATE- N+ NITRITE-N (mg/l)-Minimum"),
                    "nitrate_max": num("NITRATE- N+ NITRITE-N (mg/l)-Maximum"),
                    "nitrate_mean": num("NITRATE- N+ NITRITE-N (mg/l)-Mean"),
                    "fecal_min": num("FECAL COLIFORM (MPN/100ml)-Minimum"),
                    "fecal_max": num("FECAL COLIFORM (MPN/100ml)-Maximum"),
                    "fecal_mean": num("FECAL COLIFORM (MPN/100ml)-Mean"),
                    "total_min": num("TOTAL COLIFORM (MPN/100ml)-Minimum"),
                    "total_max": num("TOTAL COLIFORM (MPN/100ml)-Maximum"),
                    "total_mean": num("TOTAL COLIFORM (MPN/100ml)-Mean"),
                    "fluoride_min": num("FLUORIDE(mg/l)-Minimum"),
                    "fluoride_max": num("FLUORIDE(mg/l)-Maximum"),
                    "fluoride_mean": num("FLUORIDE(mg/l)-Mean"),
                },
            )

    print("Import finished.")


if __name__ == "__main__":
    main()
