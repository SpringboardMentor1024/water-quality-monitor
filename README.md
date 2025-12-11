# 💧 Water Quality Monitor Dashboard - Frontend Structure

This repository contains the complete, responsive React frontend structure for the Water Quality Monitoring Dashboard, styled using Tailwind CSS. This work is 100% complete and ready for API integration by the backend team.

---

## 💻 Getting Started (Installation)

1.  **Pull the Latest Changes:**
    *(Before starting development, ensure you have your teammate's latest code.)*
    ```bash
    git pull origin team-b
    ```

2.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend
    ```

3.  **Install dependencies:**
    This command installs all necessary packages (React Icons, Recharts, etc.).
    ```bash
    npm install 
    # OR
    yarn install
    ```

4.  **Start the application:**
    ```bash
    npm start
    # OR
    yarn start
    ```
    The application will open in your browser, usually at `http://localhost:3000`.

---

## 🔗 API Integration Endpoints (Required Data Structure)

The backend team must ensure their API endpoints return data in these precise JSON formats to integrate with the existing frontend components.

### 1. Real-Time Stats (Home Overview)

| Component      | Integration Point        | Payload Format (Example) |
| :--- | :--- | :--- | :--- |
| **Stat Cards** | `src/pages/Dashboard.js` | *The frontend expects a list of objects for the Stat Cards.* |

```json
[
  {"label": "pH", "value": "7.2", "status": "Normal"},
  {"label": "Turbidity", "value": "3 NTU", "status": "Safe"},
  {"label": "TDS", "value": "450 ppm", "status": "Normal"},
  {"label": "Temperature", "value": "24°C", "status": "Normal"}
]

### 2.Sensor location(basemap)

Component,Integration Point,Payload Format (Example)
MapComponent,src/components/MapComponent.js,Location data for map markers and site table rows.

```json
[
  {
    "id": 1,
    "name": "Intake Site A",
    "lat": 34.05,
    "lng": -118.25,
    "status": "Warning", 
    "lastReading": "7.2 pH" 
  },
  // ... more sensor objects
]

### 3. Alert Thresholds(Settings Page)

Component,Required Endpoint,Method,Payload Format (Example)
Settings Save,/api/v1/config/thresholds,POST / PUT,"Keys are camelCase, matching state variables in Settings.js."

```json
{
  "phWarning": 7.8,
  "phCritical": 6.5,
  "turbidityWarning": 5,
  "turbidityCritical": 10,
  "tempCritical": 30
}

### 4. Historical Chart Data (pH Trend)

Component,Integration Point,Payload Format (Example)
PH Chart,src/components/PhLineChart.js,```json

[
{""time"": ""00:00"", ""pH"": 7.2},
{""time"": ""04:00"", ""pH"": 7.0},
// ... more hourly data points,,
]

### 5. Alerts Data

| Component       | Integration Point     |   Payload Format (Example)    |
| :--- | :--- | :--- | :--- |
| **Alerts Grid** | `src/pages/Alerts.js` | *Data for active and historical alerts.* |

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
  },
  // ... more alert objects
]
