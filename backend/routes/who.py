from fastapi import APIRouter, Query, HTTPException
import requests

router = APIRouter(
    prefix="/who",
    tags=["WHO"]
)

# WHO GHO Indicator API base
WHO_BASE_URL = "https://ghoapi.azureedge.net/api"

@router.get("/water")
def get_who_water_data(
    indicator: str = Query(..., description="WHO indicator code, e.g. WSH_WATER_BASIC"),
    country: str = Query("IND", description="Country code like IND, USA"),
    limit: int = Query(50, ge=1, le=200)
):
    """
    Fetch WHO water-related indicator data.
    Falls back to regional/global data if country data is unavailable.
    """

    url = f"{WHO_BASE_URL}/{indicator}"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        payload = response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"WHO request failed: {str(e)}")
    except ValueError:
        raise HTTPException(status_code=500, detail="WHO response is not valid JSON")

    records = []

    # WHO data is always inside payload["value"]
    for row in payload.get("value", []):
        spatial = row.get("SpatialDim")
        numeric_value = row.get("NumericValue")

        if numeric_value is None:
            continue

        # Accept country, regional, or global values
        if spatial in [country, "SEAR", "GLOBAL"]:
            records.append({
                "year": row.get("TimeDim"),
                "value": numeric_value,
                "region": spatial
            })

        if len(records) >= limit:
            break

    return {
        "source": "WHO",
        "indicator": indicator,
        "requested_country": country,
        "records": records
    }
