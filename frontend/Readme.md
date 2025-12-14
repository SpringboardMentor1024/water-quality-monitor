
````markdown
# 💧 Water Quality Monitor Dashboard – Project Structure

This repository contains both the **frontend (React)** and **backend (Node.js/Express)** code for the Water Quality Monitoring System.

## 💻 Frontend (Complete & Ready)

The frontend is fully developed, styled with Tailwind CSS, and is 100% ready for backend API integration.

* **Technology Stack:** React, Tailwind CSS, Axios, React Icons.
* **Base URL:** All API calls are configured to hit `http://localhost:5000/api`.

### 🚀 Getting Started (Installation)

1. **Navigate to the frontend folder:** `cd frontend`
2. **Install all dependencies:** `npm install`
3. **Start the development server:** `npm start`
    * The project will open at: **http://localhost:3000**

## 🔗 Backend API Integration Requirements

Below are the **exact JSON formats** and **endpoints** required by the frontend.
The backend must return successful data matching these structures.

---

### 🔑 1. User Authentication (Crucial)

**Authentication Method:** All authenticated requests use a **JSON Web Token (JWT)** sent in the `Authorization: Bearer <token>` header.

| Endpoint | Method | Purpose | Required Backend Action |
| :--- | :--- | :--- | :--- |
| **`/api/auth/register`** | `POST` | Create new user account. | Store user (with hashed password), generate JWT, and return token. |
| **`/api/auth/login`** | `POST` | Sign in user. | Verify credentials, generate JWT, and return token. |
| **`/api/users/profile`** | `PUT` | Update user details (Name, Phone, Location). | Validate JWT, update database, and return updated user object. |

---

### 📊 2. Dashboard Data (Read-Only)

#### A. Real-Time Stats (Dashboard Overview)
**File:** `src/pages/Dashboard.js`
```json
[
  {"label": "pH", "value": "7.2", "status": "Normal"},
  {"label": "Turbidity", "value": "3 NTU", "status": "Safe"},
  {"label": "TDS", "value": "450 ppm", "status": "Normal"},
  {"label": "Temperature", "value": "24°C", "status": "Normal"}
]
````

#### B. Historical Chart Data (pH Trend)

**File:** `src/components/PhLineChart.js`

```json
[
  {"time": "00:00", "pH": 7.2},
  {"time": "04:00", "pH": 7.0}
]
```

#### C. Alerts Data (Alert Page Feed)

**File:** `src/pages/Alerts.js`

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

-----

### 📍 3. Location and Configuration

#### A. Sensor Locations (Map + Table)

**File:** `src/components/MapComponent.js`

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

#### B. Alert Threshold Configuration (Settings Page)

**Endpoint:** `/api/v1/config/thresholds`
**Method:** `POST` / `PUT`

```json
{
  "phWarning": 7.8,
  "phCritical": 6.5,
  "turbidityWarning": 5,
  "turbidityCritical": 10,
  "tempCritical": 30
}
```

-----

## ✔️ Summary

The **frontend development is complete**. The next phase is to build the backend API endpoints according to the formats above.

```
```