````markdown
# 💧 Water Quality Monitor Dashboard – Frontend Structure (Complete)

This repository contains the fully responsive React frontend for the Water Quality Monitoring System, built using **React + Tailwind CSS**.  
This frontend is 100% ready for backend API integration.

---

## 💻 Getting Started (Installation)

1. **Pull the latest project code**
   ```bash
   git pull origin team-b
````

2. **Navigate to the frontend folder**

   ```bash
   cd frontend
   ```

3. **Install all dependencies**

   ```bash
   npm install
   # OR
   yarn install
   ```

4. **Start the development server**

   ```bash
   npm start
   # OR
   yarn start
   ```

   The project will open at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔗 API Integration Requirements

Below are the **exact JSON formats** required by the frontend for backend integration.
Each endpoint must return data matching these structures.

---

### ✅ 1. Real-Time Stats (Dashboard Overview)

**File:** `src/pages/Dashboard.js`
**Purpose:** Fills the 4 statistic cards (pH, Turbidity, TDS, Temperature)

```json
[
  {"label": "pH", "value": "7.2", "status": "Normal"},
  {"label": "Turbidity", "value": "3 NTU", "status": "Safe"},
  {"label": "TDS", "value": "450 ppm", "status": "Normal"},
  {"label": "Temperature", "value": "24°C", "status": "Normal"}
]
```

---

### ✅ 2. Sensor Locations (Map + Table)

**File:** `src/components/MapComponent.js`
**Purpose:** Displays markers on the map + table details.

```json
[
  {
    "id": 1,
    "name": "Intake Site A",
    "lat": 34.05,
    "lng": -118.25,
    "status": "Warning",
    "lastReading": "7.2 pH"
  }
]
```

---

### ✅ 3. Alert Threshold Configuration (Settings Page)

**Endpoint:** `/api/v1/config/thresholds`
**Method:** `POST` / `PUT`
**Used in:** `handleSave()` inside Settings Page

```json
{
  "phWarning": 7.8,
  "phCritical": 6.5,
  "turbidityWarning": 5,
  "turbidityCritical": 10,
  "tempCritical": 30
}
```

---

### ✅ 4. Historical Chart Data (pH Trend)

**File:** `src/components/PhLineChart.js`

```json
[
  {"time": "00:00", "pH": 7.2},
  {"time": "04:00", "pH": 7.0}
]
```

---

### ✅ 5. Alerts Data (Alert Page Feed)

**File:** `src/pages/Alerts.js`
**Purpose:** Populates "Active Alerts" list.

```json
[
  {
    "id": 1,
    "title": "High Turbidity Spike",
    "location": "Intake Site A",
    "time": "10:12 AM",
    "severity": "CRITICAL",
    "details": "Turbidity exceeded 15 NTU.",
    "acknowledged": false
  }
]
```

---

# ✔️ Summary

* This document includes **all REQUIRED frontend API formats**.
* Backend must return **exact JSON structures**.
* Frontend is now ready for **data binding + API integration**.
* Once APIs are connected, all components (charts, map, alerts, settings) will become fully functional.


