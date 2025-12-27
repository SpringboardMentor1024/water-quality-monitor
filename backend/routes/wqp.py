from fastapi import APIRouter, Query, HTTPException
import pandas as pd

router = APIRouter(
    prefix="/wqp",
    tags=["WQP"]
)

CSV_PATH = "data/wqp_stations.csv"

STATE_CODE_MAP = {
    1: "AL", 2: "AK", 4: "AZ", 5: "AR", 6: "CA",
    8: "CO", 9: "CT", 10: "DE", 11: "DC", 12: "FL",
    13: "GA", 15: "HI", 16: "ID", 17: "IL", 18: "IN",
    19: "IA", 20: "KS", 21: "KY", 22: "LA", 23: "ME",
    24: "MD", 25: "MA", 26: "MI", 27: "MN", 28: "MS",
    29: "MO", 30: "MT", 31: "NE", 32: "NV", 33: "NH",
    34: "NJ", 35: "NM", 36: "NY", 37: "NC", 38: "ND",
    39: "OH", 40: "OK", 41: "OR", 42: "PA", 44: "RI",
    45: "SC", 46: "SD", 47: "TN", 48: "TX", 49: "UT",
    50: "VT", 51: "VA", 53: "WA", 54: "WV", 55: "WI",
    56: "WY"
}

@router.get("/results")
def get_wqp_results(
    state: str | None = Query(None, description="US state code like CA, NY"),
    limit: int = Query(10, ge=1, le=1000)
):
    try:
        df = pd.read_csv(CSV_PATH, low_memory=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV read error: {e}")

    # Clean column names
    df.columns = df.columns.str.strip()

    # Keep US records only
    df = df[df["CountryCode"] == "US"]

    # Convert numeric state codes to abbreviations
    df["StateCode"] = pd.to_numeric(df["StateCode"], errors="coerce")
    df["StateAbbr"] = df["StateCode"].map(STATE_CODE_MAP)

    # Optional state filter
    if state:
        state = state.upper()
        df = df[df["StateAbbr"] == state]

    # Replace NaN with None (JSON safe)
    df = df.where(pd.notnull(df), None)

    # Select useful columns only
    result = df[[
        "MonitoringLocationIdentifier",
        "MonitoringLocationName",
        "StateAbbr",
        "LatitudeMeasure",
        "LongitudeMeasure",
        "MonitoringLocationTypeName"
    ]].head(limit)

    return result.to_dict(orient="records")
