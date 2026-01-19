# Backend API Requirements for Water Station Details & Visualization

## Overview
This document outlines the API endpoints required by the frontend for Water Station Details Page with Report Management and Visualization Charts.

## Required Endpoints

### 1. Station Readings with Time Range
**Endpoint:** `GET /api/stations/{station_id}/readings`

**Query Parameters:**
- `range` (optional): `daily` | `weekly` | `monthly` (default: `daily`)

**Response:**
```json
[
  {
    "id": 1,
    "station_id": 1,
    "parameter": "pH" | "temperature" | "DO" | "bacteria" | "turbidity",
    "value": 7.2,
    "recorded_at": "2024-01-15T10:30:00Z"
  }
]
```

### 2. Station Reports
**Endpoint:** `GET /api/stations/{station_id}/reports`

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 5,
    "station_id": 1,
    "photo_url": "https://example.com/photo.jpg",
    "location": "Station Area",
    "description": "Water quality issue observed",
    "water_source": "Municipal Supply",
    "status": "pending" | "verified" | "rejected",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 3. Station Alerts
**Endpoint:** `GET /api/stations/{station_id}/alerts`

**Query Parameters:**
- `range` (optional): `daily` | `weekly` | `monthly`

**Response:**
```json
[
  {
    "id": 1,
    "station_id": 1,
    "type": "contamination" | "boil_notice" | "outage",
    "message": "High bacteria levels detected",
    "issued_at": "2024-01-15T10:30:00Z",
    "is_predictive": false
  }
]
```

### 4. Station Predictive Alerts
**Endpoint:** `GET /api/stations/{station_id}/predictive-alerts`

**Query Parameters:**
- `range` (optional): `daily` | `weekly` | `monthly`

**Response:**
```json
[
  {
    "id": 1,
    "station_id": 1,
    "predicted_parameter": "pH" | "temperature" | "bacteria",
    "predicted_value": 8.5,
    "confidence": 0.85,
    "alert_message": "pH levels may exceed safe limits in 24 hours",
    "predicted_at": "2024-01-16T10:30:00Z",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 5. Update Report Status
**Endpoint:** `PATCH /api/reports/{report_id}/status`

**Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "status": "pending" | "verified" | "rejected"
}
```

**Response:**
```json
{
  "id": 1,
  "status": "verified",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Database Schema Additions

### Predictive Alerts Table
```sql
CREATE TABLE predictive_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id INTEGER NOT NULL,
    predicted_parameter VARCHAR(50) NOT NULL,
    predicted_value DECIMAL(10, 4) NOT NULL,
    confidence DECIMAL(3, 2) NOT NULL,
    alert_message TEXT NOT NULL,
    predicted_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES water_stations(id)
);
```

### Update Reports Table
Add `station_id` column if not exists:
```sql
ALTER TABLE reports ADD COLUMN station_id INTEGER REFERENCES water_stations(id);
```

## Implementation Notes

1. **Time Range Filtering:**
   - `daily`: Last 7 days
   - `weekly`: Last 4 weeks
   - `monthly`: Last 12 months

2. **Predictive Alerts:**
   - Use ML model to predict parameter values
   - Generate alerts when predicted values exceed thresholds
   - Store confidence scores (0.0 to 1.0)

3. **Report Management:**
   - Only authenticated users with appropriate roles can update report status
   - Log status changes for audit trail

4. **Performance:**
   - Add indexes on `station_id`, `recorded_at`, `issued_at`
   - Consider caching for frequently accessed data

## Frontend Integration

The frontend components are ready and will automatically work once these endpoints are implemented:

- **ReportManagement.js**: Displays and manages station reports
- **VisualizationCharts.js**: Shows parameter trends, alerts, and predictive alerts
- **StationDetailsPage.js**: Main page integrating all components

## Testing Checklist

- [ ] GET readings with different time ranges
- [ ] GET station-specific reports
- [ ] GET alerts with time filtering
- [ ] GET predictive alerts
- [ ] PATCH report status (authenticated)
- [ ] Verify CORS headers
- [ ] Test with missing/invalid station_id
- [ ] Test pagination for large datasets
