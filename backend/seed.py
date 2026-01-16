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

# ---------- GODAVARI ----------
{"name":"Godavari - Nashik","lat":19.99,"lon":73.78,"ph":7.3,"turbidity":3.2,"temp":25,"arsenic":0.02,"do":6.9,"nitrate":5,"fluoride":0.7,"status":"Safe"},
{"name":"Godavari - Nanded","lat":19.15,"lon":77.31,"ph":7.8,"turbidity":6.8,"temp":28,"arsenic":0.04,"do":5.6,"nitrate":9,"fluoride":0.9,"status":"Warning"},
{"name":"Godavari - Rajahmundry","lat":16.99,"lon":81.78,"ph":8.3,"turbidity":11.5,"temp":31,"arsenic":0.07,"do":3.4,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

# ---------- KRISHNA ----------
{"name":"Krishna - Sangli","lat":16.85,"lon":74.60,"ph":7.4,"turbidity":4.0,"temp":26,"arsenic":0.02,"do":6.7,"nitrate":6,"fluoride":0.8,"status":"Safe"},
{"name":"Krishna - Vijayawada","lat":16.52,"lon":80.62,"ph":8.1,"turbidity":9.8,"temp":30,"arsenic":0.05,"do":4.6,"nitrate":13,"fluoride":1.2,"status":"Warning"},
{"name":"Krishna - Machilipatnam","lat":16.19,"lon":81.13,"ph":8.5,"turbidity":13.5,"temp":32,"arsenic":0.08,"do":3.0,"nitrate":18,"fluoride":1.6,"status":"Unsafe"},

# ---------- NARMADA ----------
{"name":"Narmada - Amarkantak","lat":22.67,"lon":81.75,"ph":7.2,"turbidity":2.8,"temp":24,"arsenic":0.01,"do":7.3,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Narmada - Jabalpur","lat":23.18,"lon":79.95,"ph":7.7,"turbidity":6.2,"temp":27,"arsenic":0.03,"do":5.9,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Narmada - Bharuch","lat":21.70,"lon":72.97,"ph":8.2,"turbidity":10.9,"temp":30,"arsenic":0.06,"do":3.8,"nitrate":14,"fluoride":1.3,"status":"Unsafe"},

    # ---------- CAUVERY ----------
    {"name":"Cauvery - Mysuru","lat":12.30,"lon":76.64,"ph":7.4,"turbidity":4.8,"temp":25,"arsenic":0.02,"do":6.5,"nitrate":6,"fluoride":0.8,"status":"Safe"},
    {"name":"Cauvery - Mandya","lat":12.52,"lon":76.90,"ph":7.6,"turbidity":6.0,"temp":26,"arsenic":0.03,"do":5.9,"nitrate":7,"fluoride":0.9,"status":"Warning"},
    {"name":"Cauvery - Erode","lat":11.34,"lon":77.71,"ph":6.3,"turbidity":14.0,"temp":32,"arsenic":0.07,"do":3.1,"nitrate":18,"fluoride":1.9,"status":"Unsafe"},

# ---------- USA ----------
{"name":"Mississippi - Minneapolis","lat":44.97,"lon":-93.26,"ph":7.5,"turbidity":3.5,"temp":18,"arsenic":0.01,"do":7.8,"nitrate":4,"fluoride":0.7,"status":"Safe"},
{"name":"Mississippi - St. Louis","lat":38.63,"lon":-90.20,"ph":7.9,"turbidity":7.4,"temp":22,"arsenic":0.03,"do":5.5,"nitrate":9,"fluoride":1.0,"status":"Warning"},
{"name":"Mississippi - New Orleans","lat":29.95,"lon":-90.07,"ph":8.4,"turbidity":12.8,"temp":26,"arsenic":0.06,"do":3.6,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

# ---------- EUROPE ----------
{"name":"Danube - Vienna","lat":48.20,"lon":16.37,"ph":7.4,"turbidity":3.1,"temp":17,"arsenic":0.01,"do":7.6,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Danube - Budapest","lat":47.50,"lon":19.04,"ph":7.8,"turbidity":6.9,"temp":20,"arsenic":0.03,"do":5.7,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Danube - Belgrade","lat":44.81,"lon":20.46,"ph":8.2,"turbidity":11.0,"temp":23,"arsenic":0.05,"do":3.9,"nitrate":13,"fluoride":1.2,"status":"Unsafe"},

# ---------- ASIA ----------
{"name":"Yangtze - Chongqing","lat":29.56,"lon":106.55,"ph":7.6,"turbidity":5.2,"temp":24,"arsenic":0.02,"do":6.2,"nitrate":6,"fluoride":0.8,"status":"Safe"},
{"name":"Yangtze - Wuhan","lat":30.59,"lon":114.30,"ph":8.0,"turbidity":8.6,"temp":27,"arsenic":0.04,"do":4.9,"nitrate":11,"fluoride":1.1,"status":"Warning"},
{"name":"Yangtze - Shanghai","lat":31.23,"lon":121.47,"ph":8.5,"turbidity":13.9,"temp":29,"arsenic":0.07,"do":3.1,"nitrate":17,"fluoride":1.5,"status":"Unsafe"},
# ---------- GODAVARI ----------
{"name":"Godavari - Nashik","lat":19.99,"lon":73.78,"ph":7.3,"turbidity":3.2,"temp":25,"arsenic":0.02,"do":6.9,"nitrate":5,"fluoride":0.7,"status":"Safe"},
{"name":"Godavari - Nanded","lat":19.15,"lon":77.31,"ph":7.8,"turbidity":6.8,"temp":28,"arsenic":0.04,"do":5.6,"nitrate":9,"fluoride":0.9,"status":"Warning"},
{"name":"Godavari - Rajahmundry","lat":16.99,"lon":81.78,"ph":8.3,"turbidity":11.5,"temp":31,"arsenic":0.07,"do":3.4,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

# ---------- KRISHNA ----------
{"name":"Krishna - Sangli","lat":16.85,"lon":74.60,"ph":7.4,"turbidity":4.0,"temp":26,"arsenic":0.02,"do":6.7,"nitrate":6,"fluoride":0.8,"status":"Safe"},
{"name":"Krishna - Vijayawada","lat":16.52,"lon":80.62,"ph":8.1,"turbidity":9.8,"temp":30,"arsenic":0.05,"do":4.6,"nitrate":13,"fluoride":1.2,"status":"Warning"},
{"name":"Krishna - Machilipatnam","lat":16.19,"lon":81.13,"ph":8.5,"turbidity":13.5,"temp":32,"arsenic":0.08,"do":3.0,"nitrate":18,"fluoride":1.6,"status":"Unsafe"},

# ---------- NARMADA ----------
{"name":"Narmada - Amarkantak","lat":22.67,"lon":81.75,"ph":7.2,"turbidity":2.8,"temp":24,"arsenic":0.01,"do":7.3,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Narmada - Jabalpur","lat":23.18,"lon":79.95,"ph":7.7,"turbidity":6.2,"temp":27,"arsenic":0.03,"do":5.9,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Narmada - Bharuch","lat":21.70,"lon":72.97,"ph":8.2,"turbidity":10.9,"temp":30,"arsenic":0.06,"do":3.8,"nitrate":14,"fluoride":1.3,"status":"Unsafe"},

# ---------- USA ----------
{"name":"Mississippi - Minneapolis","lat":44.97,"lon":-93.26,"ph":7.5,"turbidity":3.5,"temp":18,"arsenic":0.01,"do":7.8,"nitrate":4,"fluoride":0.7,"status":"Safe"},
{"name":"Mississippi - St. Louis","lat":38.63,"lon":-90.20,"ph":7.9,"turbidity":7.4,"temp":22,"arsenic":0.03,"do":5.5,"nitrate":9,"fluoride":1.0,"status":"Warning"},
{"name":"Mississippi - New Orleans","lat":29.95,"lon":-90.07,"ph":8.4,"turbidity":12.8,"temp":26,"arsenic":0.06,"do":3.6,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

# ---------- EUROPE ----------
{"name":"Danube - Vienna","lat":48.20,"lon":16.37,"ph":7.4,"turbidity":3.1,"temp":17,"arsenic":0.01,"do":7.6,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Danube - Budapest","lat":47.50,"lon":19.04,"ph":7.8,"turbidity":6.9,"temp":20,"arsenic":0.03,"do":5.7,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Danube - Belgrade","lat":44.81,"lon":20.46,"ph":8.2,"turbidity":11.0,"temp":23,"arsenic":0.05,"do":3.9,"nitrate":13,"fluoride":1.2,"status":"Unsafe"},

# ---------- ASIA ----------
{"name":"Yangtze - Chongqing","lat":29.56,"lon":106.55,"ph":7.6,"turbidity":5.2,"temp":24,"arsenic":0.02,"do":6.2,"nitrate":6,"fluoride":0.8,"status":"Safe"},
{"name":"Yangtze - Wuhan","lat":30.59,"lon":114.30,"ph":8.0,"turbidity":8.6,"temp":27,"arsenic":0.04,"do":4.9,"nitrate":11,"fluoride":1.1,"status":"Warning"},
{"name":"Yangtze - Shanghai","lat":31.23,"lon":121.47,"ph":8.5,"turbidity":13.9,"temp":29,"arsenic":0.07,"do":3.1,"nitrate":17,"fluoride":1.5,"status":"Unsafe"},

# =======================
# EUROPE
# =======================
{"name":"Danube - Ulm","lat":48.40,"lon":9.99,"ph":7.3,"turbidity":3.2,"temp":18,"arsenic":0.01,"do":7.8,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Danube - Vienna","lat":48.21,"lon":16.37,"ph":7.8,"turbidity":6.1,"temp":20,"arsenic":0.03,"do":6.1,"nitrate":7,"fluoride":0.9,"status":"Warning"},
{"name":"Danube - Bucharest","lat":44.43,"lon":26.10,"ph":8.2,"turbidity":11.4,"temp":23,"arsenic":0.06,"do":4.1,"nitrate":14,"fluoride":1.4,"status":"Unsafe"},

{"name":"Thames - Oxford","lat":51.75,"lon":-1.26,"ph":7.4,"turbidity":3.8,"temp":17,"arsenic":0.01,"do":7.3,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Thames - London","lat":51.50,"lon":-0.12,"ph":8.0,"turbidity":7.9,"temp":20,"arsenic":0.04,"do":5.2,"nitrate":10,"fluoride":1.1,"status":"Warning"},

# =======================
# NORTH AMERICA
# =======================
{"name":"Mississippi - Minneapolis","lat":44.98,"lon":-93.26,"ph":7.2,"turbidity":3.5,"temp":16,"arsenic":0.01,"do":7.5,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Mississippi - St Louis","lat":38.63,"lon":-90.20,"ph":7.9,"turbidity":7.3,"temp":21,"arsenic":0.03,"do":5.9,"nitrate":9,"fluoride":1.0,"status":"Warning"},
{"name":"Mississippi - New Orleans","lat":29.95,"lon":-90.07,"ph":8.4,"turbidity":14.1,"temp":28,"arsenic":0.07,"do":3.4,"nitrate":17,"fluoride":1.6,"status":"Unsafe"},

{"name":"Colorado - Glenwood Springs","lat":39.55,"lon":-107.32,"ph":7.3,"turbidity":3.1,"temp":15,"arsenic":0.01,"do":7.6,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Colorado - Yuma","lat":32.69,"lon":-114.62,"ph":8.1,"turbidity":10.6,"temp":27,"arsenic":0.05,"do":4.3,"nitrate":13,"fluoride":1.3,"status":"Unsafe"},

# =======================
# ASIA (OUTSIDE INDIA)
# =======================
{"name":"Yangtze - Yibin","lat":28.75,"lon":104.64,"ph":7.3,"turbidity":3.9,"temp":22,"arsenic":0.02,"do":6.8,"nitrate":5,"fluoride":0.7,"status":"Safe"},
{"name":"Yangtze - Wuhan","lat":30.59,"lon":114.30,"ph":7.9,"turbidity":7.4,"temp":25,"arsenic":0.04,"do":5.6,"nitrate":9,"fluoride":1.0,"status":"Warning"},
{"name":"Yangtze - Shanghai","lat":31.23,"lon":121.47,"ph":8.4,"turbidity":13.8,"temp":28,"arsenic":0.07,"do":3.5,"nitrate":16,"fluoride":1.5,"status":"Unsafe"},

{"name":"Mekong - Luang Prabang","lat":19.88,"lon":102.14,"ph":7.2,"turbidity":3.4,"temp":24,"arsenic":0.01,"do":7.0,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Mekong - Phnom Penh","lat":11.56,"lon":104.93,"ph":7.8,"turbidity":6.9,"temp":27,"arsenic":0.03,"do":5.7,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Mekong - Ho Chi Minh","lat":10.82,"lon":106.63,"ph":8.3,"turbidity":12.5,"temp":30,"arsenic":0.06,"do":3.9,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

# =======================
# MIDDLE EAST
# =======================
{"name":"Tigris - Mosul","lat":36.34,"lon":43.13,"ph":7.5,"turbidity":4.6,"temp":23,"arsenic":0.02,"do":6.5,"nitrate":6,"fluoride":0.8,"status":"Safe"},
{"name":"Tigris - Baghdad","lat":33.31,"lon":44.36,"ph":8.1,"turbidity":9.2,"temp":28,"arsenic":0.05,"do":4.6,"nitrate":12,"fluoride":1.2,"status":"Warning"},
{"name":"Tigris - Basra","lat":30.51,"lon":47.81,"ph":8.5,"turbidity":15.0,"temp":32,"arsenic":0.08,"do":2.9,"nitrate":18,"fluoride":1.8,"status":"Unsafe"},

# =======================
# SOUTH AMERICA
# =======================
{"name":"Amazon - Iquitos","lat":-3.75,"lon":-73.25,"ph":6.9,"turbidity":4.2,"temp":28,"arsenic":0.01,"do":7.1,"nitrate":5,"fluoride":0.6,"status":"Safe"},
{"name":"Amazon - Manaus","lat":-3.12,"lon":-60.02,"ph":7.5,"turbidity":7.8,"temp":30,"arsenic":0.03,"do":5.9,"nitrate":9,"fluoride":0.9,"status":"Warning"},
{"name":"Amazon - Belem","lat":-1.45,"lon":-48.50,"ph":8.2,"turbidity":13.6,"temp":31,"arsenic":0.06,"do":3.8,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

{"name":"Parana - Posadas","lat":-27.37,"lon":-55.90,"ph":7.3,"turbidity":4.0,"temp":22,"arsenic":0.01,"do":7.0,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Parana - Rosario","lat":-32.95,"lon":-60.66,"ph":7.9,"turbidity":8.6,"temp":25,"arsenic":0.04,"do":5.4,"nitrate":10,"fluoride":1.0,"status":"Warning"},

# =======================
# AFRICA
# =======================
{"name":"Nile - Jinja","lat":0.44,"lon":33.20,"ph":7.2,"turbidity":3.9,"temp":26,"arsenic":0.01,"do":7.3,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Nile - Khartoum","lat":15.50,"lon":32.56,"ph":7.8,"turbidity":6.7,"temp":29,"arsenic":0.03,"do":5.9,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Nile - Cairo","lat":30.04,"lon":31.23,"ph":8.4,"turbidity":14.5,"temp":32,"arsenic":0.07,"do":3.1,"nitrate":17,"fluoride":1.6,"status":"Unsafe"},

{"name":"Zambezi - Livingstone","lat":-17.84,"lon":25.85,"ph":7.3,"turbidity":4.2,"temp":24,"arsenic":0.02,"do":6.8,"nitrate":5,"fluoride":0.7,"status":"Safe"},
{"name":"Zambezi - Tete","lat":-16.16,"lon":33.58,"ph":8.0,"turbidity":9.1,"temp":28,"arsenic":0.05,"do":4.7,"nitrate":12,"fluoride":1.2,"status":"Warning"},

# =======================
# AUSTRALIA
# =======================
{"name":"Murray - Albury","lat":-36.08,"lon":146.92,"ph":7.4,"turbidity":3.6,"temp":20,"arsenic":0.01,"do":7.2,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Murray - Mildura","lat":-34.18,"lon":142.16,"ph":7.9,"turbidity":6.8,"temp":24,"arsenic":0.03,"do":5.8,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Murray - Goolwa","lat":-35.50,"lon":138.78,"ph":8.3,"turbidity":12.4,"temp":27,"arsenic":0.06,"do":3.9,"nitrate":14,"fluoride":1.4,"status":"Unsafe"},

# =======================
# EAST ASIA
# =======================
{"name":"Han River - Chuncheon","lat":37.88,"lon":127.73,"ph":7.2,"turbidity":3.4,"temp":18,"arsenic":0.01,"do":7.6,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Han River - Seoul","lat":37.56,"lon":126.97,"ph":7.8,"turbidity":6.9,"temp":22,"arsenic":0.03,"do":5.9,"nitrate":9,"fluoride":1.0,"status":"Warning"},

{"name":"Yellow River - Lanzhou","lat":36.06,"lon":103.83,"ph":7.4,"turbidity":5.0,"temp":20,"arsenic":0.02,"do":6.7,"nitrate":6,"fluoride":0.8,"status":"Safe"},
{"name":"Yellow River - Zhengzhou","lat":34.74,"lon":113.62,"ph":8.0,"turbidity":8.9,"temp":24,"arsenic":0.04,"do":5.1,"nitrate":11,"fluoride":1.1,"status":"Warning"},
{"name":"Yellow River - Dongying","lat":37.45,"lon":118.49,"ph":8.6,"turbidity":15.2,"temp":28,"arsenic":0.08,"do":3.0,"nitrate":19,"fluoride":1.9,"status":"Unsafe"},

# =======================
# EUROPE (EXTRA)
# =======================
{"name":"Rhine - Basel","lat":47.56,"lon":7.59,"ph":7.3,"turbidity":3.5,"temp":17,"arsenic":0.01,"do":7.4,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Rhine - Cologne","lat":50.94,"lon":6.96,"ph":7.9,"turbidity":7.2,"temp":20,"arsenic":0.04,"do":5.5,"nitrate":9,"fluoride":1.0,"status":"Warning"},
{"name":"Rhine - Rotterdam","lat":51.92,"lon":4.48,"ph":8.4,"turbidity":13.9,"temp":22,"arsenic":0.07,"do":3.7,"nitrate":16,"fluoride":1.5,"status":"Unsafe"},

# =======================
# NORTH AMERICA
# =======================
{"name":"Mississippi - Minneapolis","lat":44.98,"lon":-93.26,"ph":7.3,"turbidity":3.8,"temp":16,"arsenic":0.01,"do":7.4,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Mississippi - St Louis","lat":38.63,"lon":-90.20,"ph":7.8,"turbidity":6.9,"temp":20,"arsenic":0.03,"do":5.9,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Mississippi - New Orleans","lat":29.95,"lon":-90.07,"ph":8.5,"turbidity":14.8,"temp":28,"arsenic":0.07,"do":3.4,"nitrate":17,"fluoride":1.6,"status":"Unsafe"},

{"name":"Colorado River - Glen Canyon","lat":36.94,"lon":-111.48,"ph":7.4,"turbidity":4.0,"temp":18,"arsenic":0.01,"do":7.0,"nitrate":5,"fluoride":0.6,"status":"Safe"},
{"name":"Colorado River - Yuma","lat":32.69,"lon":-114.62,"ph":8.1,"turbidity":9.6,"temp":26,"arsenic":0.05,"do":4.6,"nitrate":13,"fluoride":1.2,"status":"Warning"},

{"name":"Columbia River - Spokane","lat":47.66,"lon":-117.42,"ph":7.2,"turbidity":3.4,"temp":15,"arsenic":0.01,"do":7.5,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Columbia River - Portland","lat":45.52,"lon":-122.68,"ph":7.9,"turbidity":6.8,"temp":18,"arsenic":0.03,"do":5.7,"nitrate":8,"fluoride":0.9,"status":"Warning"},

# =======================
# CENTRAL AMERICA
# =======================
{"name":"Usumacinta - Tenosique","lat":17.48,"lon":-91.42,"ph":7.1,"turbidity":3.7,"temp":27,"arsenic":0.01,"do":7.2,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Usumacinta - Frontera","lat":18.53,"lon":-92.65,"ph":8.0,"turbidity":9.4,"temp":30,"arsenic":0.04,"do":4.9,"nitrate":11,"fluoride":1.1,"status":"Warning"},

# =======================
# MIDDLE EAST
# =======================
{"name":"Jordan River - Tiberias","lat":32.79,"lon":35.53,"ph":7.3,"turbidity":3.9,"temp":21,"arsenic":0.01,"do":7.1,"nitrate":5,"fluoride":0.7,"status":"Safe"},
{"name":"Jordan River - Jericho","lat":31.86,"lon":35.44,"ph":8.2,"turbidity":11.0,"temp":29,"arsenic":0.06,"do":3.9,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

{"name":"Tigris - Mosul","lat":36.34,"lon":43.13,"ph":7.5,"turbidity":4.8,"temp":22,"arsenic":0.02,"do":6.5,"nitrate":6,"fluoride":0.8,"status":"Safe"},
{"name":"Tigris - Baghdad","lat":33.31,"lon":44.36,"ph":8.1,"turbidity":9.2,"temp":27,"arsenic":0.05,"do":4.7,"nitrate":12,"fluoride":1.2,"status":"Warning"},

{"name":"Euphrates - Raqqa","lat":35.95,"lon":39.01,"ph":8.5,"turbidity":14.6,"temp":31,"arsenic":0.08,"do":3.2,"nitrate":18,"fluoride":1.7,"status":"Unsafe"},

# =======================
# EASTERN EUROPE
# =======================
{"name":"Danube - Vienna","lat":48.21,"lon":16.37,"ph":7.3,"turbidity":3.6,"temp":17,"arsenic":0.01,"do":7.3,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Danube - Budapest","lat":47.49,"lon":19.04,"ph":7.9,"turbidity":6.9,"temp":20,"arsenic":0.03,"do":5.8,"nitrate":8,"fluoride":0.9,"status":"Warning"},
{"name":"Danube - Belgrade","lat":44.79,"lon":20.45,"ph":8.4,"turbidity":12.8,"temp":24,"arsenic":0.06,"do":3.9,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

# =======================
# SOUTHEAST ASIA
# =======================
{"name":"Mekong - Luang Prabang","lat":19.89,"lon":102.14,"ph":7.2,"turbidity":4.1,"temp":26,"arsenic":0.01,"do":7.0,"nitrate":4,"fluoride":0.6,"status":"Safe"},
{"name":"Mekong - Phnom Penh","lat":11.56,"lon":104.92,"ph":7.9,"turbidity":7.6,"temp":29,"arsenic":0.03,"do":5.6,"nitrate":9,"fluoride":1.0,"status":"Warning"},
{"name":"Mekong - Can Tho","lat":10.05,"lon":105.77,"ph":8.5,"turbidity":14.9,"temp":31,"arsenic":0.07,"do":3.4,"nitrate":18,"fluoride":1.6,"status":"Unsafe"},

{"name":"Chao Phraya - Nakhon Sawan","lat":15.70,"lon":100.14,"ph":7.4,"turbidity":4.5,"temp":27,"arsenic":0.02,"do":6.6,"nitrate":6,"fluoride":0.8,"status":"Safe"},
{"name":"Chao Phraya - Bangkok","lat":13.75,"lon":100.50,"ph":8.3,"turbidity":12.7,"temp":31,"arsenic":0.06,"do":3.8,"nitrate":15,"fluoride":1.4,"status":"Unsafe"},

]
# =====================================================
# INSERT STATIONS
# =====================================================
station_map = {}  # keep reference if needed later

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
    station_map[s["name"]] = s  # map name → base data

db.commit()
print("✅ Stations inserted")

from datetime import datetime, timedelta

START_DATE = datetime.now() - timedelta(days=30)

def station_factor(name: str, scale: float):
    """
    Deterministic per-station factor (NO RANDOM)
    Same station → same curve every time
    """
    return (abs(hash(name)) % 9 + 1) * scale


for s in stations:
    # unique deterministic factors per station
    ph_step = station_factor(s["name"], 0.002)
    turb_step = station_factor(s["name"], 0.07)
    nitrate_step = station_factor(s["name"], 0.12)
    fluoride_step = station_factor(s["name"], 0.025)
    do_step = station_factor(s["name"], 0.03)

    for day in range(30):
        report = models.WaterReading(
            station_name=s["name"],

            # 🔹 UNIQUE CURVES PER RIVER
            ph=round(s["ph"] + day * ph_step, 2),
            turbidity=round(s["turbidity"] + day * turb_step, 2),
            temperature=round(
                s["temp"] + ((day + len(s["name"])) % 6) * 0.4, 2
            ),

            arsenic=round(s["arsenic"] + day * 0.0004, 4),
            dissolved_oxygen=round(
                max(2.0, s["do"] - day * do_step), 2
            ),

            nitrate=round(s["nitrate"] + day * nitrate_step, 2),
            fluoride=round(s["fluoride"] + day * fluoride_step, 2),

            status=s["status"],
            source="seed",
            recorded_at=START_DATE + timedelta(days=day),
        )
        db.add(report)

db.commit()
