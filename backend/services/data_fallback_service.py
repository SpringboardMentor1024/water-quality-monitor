import requests
from datetime import datetime
import models
from sqlalchemy.orm import Session

DATA_GOV_URL = "https://api.data.gov.in/resource/{resource_id}"

def fetch_and_store_live_data(db: Session, station_id: int):
    params = {
        "api-key": "579b464db66ec23bdd0000017cc972179aa349764bbd239567366348",
        "format": "json",
        "limit": 10
    }

    url = DATA_GOV_URL.format(
        resource_id="9f6b3c2d-8c9a-4a12-b5a6-3e6c9d1a2b45"
    )

    response = requests.get(url, params=params, timeout=10)

    if response.status_code != 200:
        return False

    records = response.json().get("records", [])
    if not records:
        return False

    for r in records:
        try:
            reading = models.StationReadings(
                station_id=station_id,
                parameter=models.ParameterEnum.pH,  # demo mapping
                value=float(r.get("ph", 7.0)),
                recorded_at=datetime.utcnow()
            )
            db.add(reading)
        except Exception:
            continue

    db.commit()
    return True
