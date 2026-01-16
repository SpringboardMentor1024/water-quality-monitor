from sqlalchemy.orm import Session
from database import SessionLocal
import models

db: Session = SessionLocal()

# =====================================================
# CLEAR OLD DATA
# =====================================================
db.query(models.Alert).delete()
db.query(models.WaterReading).delete()
db.query(models.Station).delete()
db.commit()

print("🧹 Old data cleared")

# =====================================================
# STATIONS (EXPLICIT, FIXED VALUES)
# =====================================================
stations = [
    # ---------- GANGA ----------
    {"name":"Ganga - Haridwar","lat":29.94,"lon":78.16,"ph":7.4,"turbidity":2.1,"temp":24,"arsenic":0.01,"do":7.2,"nitrate":4,"fluoride":0.6,"status":"Safe"},
    {"name":"Ganga - Kanpur","lat":26.44,"lon":80.33,"ph":7.8,"turbidity":6.2,"temp":26,"arsenic":0.03,"do":5.8,"nitrate":7,"fluoride":0.8,"status":"Warning"},
    {"name":"Ganga - Varanasi","lat":25.32,"lon":82.97,"ph":8.3,"turbidity":10.5,"temp":28,"arsenic":0.06,"do":3.9,"nitrate":14,"fluoride":1.3,"status":"Unsafe"},

    # ---------- YAMUNA ----------
    {"name":"Yamuna - Delhi","lat":28.61,"lon":77.20,"ph":8.2,"turbidity":9.5,"temp":30,"arsenic":0.04,"do":4.8,"nitrate":12,"fluoride":1.2,"status":"Warning"},
    {"name":"Yamuna - Mathura","lat":27.49,"lon":77.67,"ph":7.6,"turbidity":6.4,"temp":29,"arsenic":0.02,"do":6.0,"nitrate":8,"fluoride":0.9,"status":"Safe"},
    {"name":"Yamuna - Agra","lat":27.17,"lon":78.04,"ph":8.4,"turbidity":11.2,"temp":31,"arsenic":0.07,"do":3.6,"nitrate":16,"fluoride":1.5,"status":"Unsafe"},

    # ---------- CAUVERY ----------
    {"name":"Cauvery - Mysuru","lat":12.30,"lon":76.64,"ph":7.4,"turbidity":4.8,"temp":25,"arsenic":0.02,"do":6.5,"nitrate":6,"fluoride":0.8,"status":"Safe"},
    {"name":"Cauvery - Mandya","lat":12.52,"lon":76.90,"ph":7.6,"turbidity":6.0,"temp":26,"arsenic":0.03,"do":5.9,"nitrate":7,"fluoride":0.9,"status":"Warning"},
    {"name":"Cauvery - Erode","lat":11.34,"lon":77.71,"ph":6.3,"turbidity":14.0,"temp":32,"arsenic":0.07,"do":3.1,"nitrate":18,"fluoride":1.9,"status":"Unsafe"},
]

# =====================================================
# INSERT STATIONS
# =====================================================
for s in stations:
    station = models.Station(
        name=s["name"],
        latitude=s["lat"],
        longitude=s["lon"],
        ph=s["ph"],
        turbidity=s["turbidity"],
        temperature=s["temp"],
        arsenic=s["arsenic"],
        dissolved_oxygen=s["do"],
        nitrate=s["nitrate"],
        fluoride=s["fluoride"],
        status=s["status"],
        source="seed"
    )
    db.add(station)

db.commit()
print("✅ Stations inserted")

# =====================================================
# HISTORY TEMPLATES (FIXED, NO RANDOM)
# =====================================================
SAFE_HISTORY = [
    {"ph":7.0,"turb":2.5,"temp":24,"ars":0.01,"do":7.2,"status":"Safe"},
    {"ph":7.1,"turb":3.0,"temp":24,"ars":0.01,"do":7.0,"status":"Safe"},
    {"ph":7.2,"turb":3.5,"temp":25,"ars":0.02,"do":6.8,"status":"Safe"},
    {"ph":7.3,"turb":4.0,"temp":25,"ars":0.02,"do":6.6,"status":"Safe"},
]

WARNING_HISTORY = [
    {"ph":7.6,"turb":5.5,"temp":26,"ars":0.03,"do":5.8,"status":"Warning"},
    {"ph":7.8,"turb":6.5,"temp":27,"ars":0.04,"do":5.2,"status":"Warning"},
    {"ph":8.0,"turb":7.5,"temp":28,"ars":0.04,"do":4.8,"status":"Warning"},
    {"ph":8.1,"turb":8.5,"temp":29,"ars":0.05,"do":4.5,"status":"Warning"},
]

UNSAFE_HISTORY = [
    {"ph":8.2,"turb":9.5,"temp":30,"ars":0.06,"do":4.0,"status":"Unsafe"},
    {"ph":8.4,"turb":11.0,"temp":31,"ars":0.07,"do":3.6,"status":"Unsafe"},
    {"ph":8.6,"turb":13.0,"temp":32,"ars":0.08,"do":3.2,"status":"Unsafe"},
    {"ph":8.8,"turb":15.0,"temp":33,"ars":0.09,"do":2.8,"status":"Unsafe"},
]

# =====================================================
# INSERT HISTORY BASED ON STATION STATUS
# =====================================================
for s in stations:
    history = (
        SAFE_HISTORY if s["status"] == "Safe"
        else WARNING_HISTORY if s["status"] == "Warning"
        else UNSAFE_HISTORY
    )

    for r in history:
        report = models.WaterReading(
            station_name=s["name"],
            ph=r["ph"],
            turbidity=r["turb"],
            temperature=r["temp"],
            arsenic=r["ars"],
            dissolved_oxygen=r["do"],
            nitrate=10.0,
            fluoride=1.0,
            status=r["status"],
            source="seed"
        )
        db.add(report)

db.commit()
count = db.query(models.Station).count()
print("TOTAL STATIONS IN DB =", count)

db.close()

