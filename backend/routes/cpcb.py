from fastapi import APIRouter, Depends
from auth import get_current_user
import pandas as pd
from models import Users

router = APIRouter(
    prefix="/cpcb",
    tags=["CPCB"]
)

CSV_PATH = "data/merged_readings.csv"

@router.get("/readings")
def get_cpcb_readings(current_user: Users = Depends(get_current_user)):
    df = pd.read_csv(CSV_PATH)
    return df.to_dict(orient="records")

@router.get("/station/{station_id}")
def get_cpcb_station_readings(
    station_id: int,
    current_user: Users = Depends(get_current_user)
):
    df = pd.read_csv(CSV_PATH)

    if "station_id" not in df.columns:
        return []

    station_df = df[df["station_id"] == station_id]

    return station_df.to_dict(orient="records")

