from fastapi import APIRouter, Query, HTTPException
import pandas as pd
from math import radians, cos, sin, asin, sqrt

router = APIRouter(prefix="/wqp", tags=["WQP"])
CSV_PATH = "data/wqp_stations.csv"
STATE_CODE_MAP = {1: "AL", 2: "AK", 4: "AZ", 5: "AR", 6: "CA", 8: "CO", 9: "CT",
                  10: "DE", 11: "DC", 12: "FL", 13: "GA", 15: "HI", 16: "ID", 17: "IL",
                  18: "IN", 19: "IA", 20: "KS", 21: "KY", 22: "LA", 23: "ME", 24: "MD",
                  25: "MA", 26: "MI", 27: "MN", 28: "MS", 29: "MO", 30: "MT", 31: "NE",
                  32: "NV", 33: "NH", 34: "NJ", 35: "NM", 36: "NY", 37: "NC", 38: "ND",
                  39: "OH", 40: "OK", 41: "OR", 42: "PA", 44: "RI", 45: "SC", 46: "SD",
                  47: "TN", 48: "TX", 49: "UT", 50: "VT", 51: "VA", 53: "WA", 54: "WV",
                  55: "WI", 56: "WY"}

@router.get("/results")
def get_wqp_results(
    state: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    results = []

    try:
        for chunk in pd.read_csv(CSV_PATH, chunksize=100000):
            chunk.columns = chunk.columns.str.strip()
            chunk = chunk[chunk["CountryCode"] == "US"]
            chunk["StateCode"] = pd.to_numeric(chunk["StateCode"], errors="coerce")
            chunk["StateAbbr"] = chunk["StateCode"].map(STATE_CODE_MAP)
            chunk = chunk.where(pd.notnull(chunk), None)

            if state:
                chunk = chunk[chunk["StateAbbr"] == state.upper()]

            for _, row in chunk.iterrows():
                if len(results) >= end_idx:
                    break
                results.append({
                    "MonitoringLocationIdentifier": row["MonitoringLocationIdentifier"],
                    "MonitoringLocationName": row["MonitoringLocationName"],
                    "StateAbbr": row["StateAbbr"],
                    "LatitudeMeasure": row["LatitudeMeasure"],
                    "LongitudeMeasure": row["LongitudeMeasure"],
                    "MonitoringLocationTypeName": row["MonitoringLocationTypeName"]
                })
            if len(results) >= end_idx:
                break

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV read error: {e}")

    paginated = results[start_idx:end_idx]
    return {
        "page": page,
        "page_size": page_size,
        "total_records": len(results),
        "records": paginated
    }

def haversine(lat1, lon1, lat2, lon2):
    # distance between two points in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return 6371 * c  # Earth radius in km


# @router.get("/nearby")
# def get_nearby_stations(
#     lat: float = Query(...),
#     lon: float = Query(...),
#     radius: float = Query(10, description="Radius in km"),
#     limit: int = Query(20, ge=1, le=100)
# ):
#     if df.empty:
#         raise HTTPException(status_code=500, detail="CSV not loaded")

#     nearby = []

#     for _, row in df.iterrows():
#         if row["LatitudeMeasure"] is None or row["LongitudeMeasure"] is None:
#             continue

#         distance = haversine(
#             lat, lon,
#             row["LatitudeMeasure"],
#             row["LongitudeMeasure"]
#         )

#         if distance <= radius:
#             nearby.append({
#                 "id": row["MonitoringLocationIdentifier"],
#                 "name": row["MonitoringLocationName"],
#                 "lat": row["LatitudeMeasure"],
#                 "lon": row["LongitudeMeasure"],
#                 "type": row["MonitoringLocationTypeName"],
#                 "distance_km": round(distance, 2)
#             })

#         if len(nearby) >= limit:
#             break

#     return nearby
@router.get("/nearby")
def get_nearby_stations(
    lat: float = Query(...),
    lon: float = Query(...),
    radius: float = Query(10, description="Radius in km"),
    limit: int = Query(20, ge=1, le=100)
):
    nearby = []

    try:
        for chunk in pd.read_csv(CSV_PATH, chunksize=100000):
            chunk.columns = chunk.columns.str.strip()
            chunk = chunk[chunk["CountryCode"] == "US"]
            chunk = chunk.dropna(subset=["LatitudeMeasure", "LongitudeMeasure"])

            for _, row in chunk.iterrows():
                distance = haversine(
                    lat, lon,
                    row["LatitudeMeasure"],
                    row["LongitudeMeasure"]
                )

                if distance <= radius:
                    nearby.append({
                        "id": row["MonitoringLocationIdentifier"],
                        "name": row["MonitoringLocationName"],
                        "lat": row["LatitudeMeasure"],
                        "lon": row["LongitudeMeasure"],
                        "type": row["MonitoringLocationTypeName"],
                        "distance_km": round(distance, 2)
                    })

                if len(nearby) >= limit:
                    return nearby

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Nearby search failed: {e}")

    return nearby
