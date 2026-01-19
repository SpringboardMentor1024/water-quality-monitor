# BACKEND API ENDPOINTS - QUICK REFERENCE

**Status:** These endpoints are NOW REQUIRED by the frontend  
**Frontend Expects:** All responses as JSON arrays  
**Base URL:** `http://127.0.0.1:8000`

---

## CRITICAL ENDPOINTS (Must Implement)

### 1. GET /api/stations
**Used by:** NGODashboard, CollaborationsPage, StationsPage, MapView  
**Required:** YES - Core functionality depends on this  
**Priority:** 🔴 CRITICAL

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Riverbend Station",
    "location": "River Area",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "status": "Normal",
    "created_at": "2026-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Lakeview Point",
    "location": "Lake Shore",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "status": "Normal",
    "created_at": "2026-01-01T00:00:00Z"
  }
]
```

**Frontend Code Using This:**
```javascript
// NGODashboard.js - Line 24
const response = await fetch('http://localhost:8000/api/stations');
const data = await response.json();
setStations(data || []);
```

---

### 2. GET /api/projects
**Used by:** CollaborationsPage  
**Required:** YES - Projects tab depends on this  
**Priority:** 🔴 CRITICAL

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Community Water Quality Initiative - Riverbend",
    "description": "Monitoring water quality in the Riverbend area...",
    "status": "Active",
    "due": "2026-01-31",
    "created_at": "2026-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Groundwater Contamination Study - Northridge",
    "description": "Investigating lead and arsenic levels...",
    "status": "Pending",
    "due": "2025-11-15",
    "created_at": "2026-01-01T00:00:00Z"
  }
]
```

**Frontend Code Using This:**
```javascript
// CollaborationsPage.js - Line 31
const response = await fetch('http://127.0.0.1:8000/api/projects');
const data = await response.json();
setProjects(Array.isArray(data) ? data : []);
```

---

### 3. GET /api/activities
**Used by:** CollaborationsPage  
**Required:** YES - Activity log depends on this  
**Priority:** 🔴 CRITICAL

**Expected Response:**
```json
[
  {
    "id": 1,
    "text": "Assigned 'Water Quality Sampling' task for Riverbend project.",
    "time": "2 hours ago",
    "timestamp": "2026-01-17T10:00:00Z",
    "user": "admin",
    "action_type": "assignment"
  },
  {
    "id": 2,
    "text": "Submitted preliminary groundwater report for Northridge.",
    "time": "5 hours ago",
    "timestamp": "2026-01-17T07:00:00Z",
    "user": "operator",
    "action_type": "report"
  }
]
```

**Frontend Code Using This:**
```javascript
// CollaborationsPage.js - Line 55
const response = await fetch('http://127.0.0.1:8000/api/activities');
const data = await response.json();
setActivities(Array.isArray(data) ? data.slice(0, 6) : []);
```

---

### 4. GET /api/predictive-alerts
**Used by:** AlertsPage, PredictiveAlerts component  
**Required:** YES - Predictive Alerts module depends on this  
**Priority:** 🟡 HIGH

**Expected Response:**
```json
[
  {
    "id": 1,
    "parameter": "Turbidity",
    "probability": 75,
    "type": "turbidity",
    "station": "NGO-MH-002",
    "currentValue": 13,
    "predictedValue": 14.8,
    "expectedDate": "2026-01-16",
    "trend": "Increasing",
    "riskLevel": "High",
    "review": "Station NGO-MH-002 shows increasing turbidity trends...",
    "message": "⚠ Turbidity likely to cross safe limits (75% probability)",
    "created_at": "2026-01-17T00:00:00Z"
  },
  {
    "id": 2,
    "parameter": "Ammonia",
    "probability": 65,
    "type": "ammonia",
    "station": "NGO-DL-003",
    "currentValue": 2.6,
    "predictedValue": 2.9,
    "expectedDate": "2026-01-21",
    "trend": "Increasing",
    "riskLevel": "High",
    "review": "Ammonia levels at NGO-DL-003 are trending upward...",
    "message": "⚠ Ammonia likely to cross safe limits (65% probability)",
    "created_at": "2026-01-17T00:00:00Z"
  }
]
```

**Frontend Code Using This:**
```javascript
// PredictiveAlerts.js - Line 182
const response = await fetch('http://127.0.0.1:8000/api/predictive-alerts');
const data = await response.json();
return Array.isArray(data) ? data : [];
```

---

## SUMMARY TABLE

| Endpoint | Purpose | Priority | Required Fields | Status |
|----------|---------|----------|-----------------|--------|
| GET /api/stations | Get water stations | 🔴 CRITICAL | id, name, location, lat, lng | ❌ TODO |
| GET /api/projects | Get NGO projects | 🔴 CRITICAL | id, name, description, status, due | ❌ TODO |
| GET /api/activities | Get activity log | 🔴 CRITICAL | id, text, time | ❌ TODO |
| GET /api/predictive-alerts | Get predictions | 🟡 HIGH | id, parameter, probability, station | ❌ TODO |

---

## IMPLEMENTATION GUIDE FOR BACKEND

### Python/FastAPI Example:

```python
from fastapi import FastAPI, HTTPException
from typing import List

app = FastAPI()

# Dummy data (replace with database queries)
stations_db = [
    {"id": 1, "name": "Riverbend Station", "location": "River Area", "latitude": 28.7041, "longitude": 77.1025},
    {"id": 2, "name": "Lakeview Point", "location": "Lake Shore", "latitude": 28.6139, "longitude": 77.2090},
]

projects_db = [
    {"id": 1, "name": "Community Water Quality Initiative", "description": "...", "status": "Active", "due": "2026-01-31"},
]

activities_db = [
    {"id": 1, "text": "Assigned task", "time": "2 hours ago"},
]

predictions_db = [
    {"id": 1, "parameter": "Turbidity", "probability": 75, "station": "NGO-MH-002"},
]

@app.get("/api/stations")
async def get_stations():
    return stations_db

@app.get("/api/projects")
async def get_projects():
    return projects_db

@app.get("/api/activities")
async def get_activities():
    return activities_db

@app.get("/api/predictive-alerts")
async def get_predictive_alerts():
    return predictions_db
```

---

## TESTING THE ENDPOINTS

### Using cURL:
```bash
# Test stations endpoint
curl http://127.0.0.1:8000/api/stations

# Test projects endpoint
curl http://127.0.0.1:8000/api/projects

# Test activities endpoint
curl http://127.0.0.1:8000/api/activities

# Test predictive alerts endpoint
curl http://127.0.0.1:8000/api/predictive-alerts
```

### Using Postman:
1. Create new collection
2. Add 4 GET requests for each endpoint
3. Set base URL to `http://127.0.0.1:8000`
4. Test each endpoint
5. Verify JSON response format

---

## ERROR RESPONSES

Frontend expects these error conditions:

### If endpoint not found (404):
```
Frontend logs: "Error fetching stations: 404"
Frontend displays: Empty list
```

### If server error (500):
```
Frontend logs: "Error fetching stations: 500 Internal Server Error"
Frontend displays: Empty list
```

### If invalid JSON:
```
Frontend logs: "SyntaxError: Unexpected token"
Frontend displays: Empty list
```

### If connection refused:
```
Frontend logs: "Error fetching stations: Failed to fetch"
Frontend displays: Empty list + Error message
```

---

## RESPONSE REQUIREMENTS

✅ **Must return:** Valid JSON array  
✅ **Must be:** Accessible at correct URL  
✅ **Must have:** CORS enabled  
✅ **Should have:** Proper HTTP status codes (200, 404, 500)  
✅ **Should handle:** Large datasets efficiently  
✅ **Should include:** Timestamps if available  

---

## COMMON ISSUES & FIXES

### Issue: Frontend shows empty list
**Check:**
- Is backend running? `http://127.0.0.1:8000/api/stations`
- Does endpoint exist?
- Is CORS enabled?
- Is JSON valid?

### Issue: Network error in console
**Check:**
- Backend URL correct? (127.0.0.1:8000, not localhost)
- Port correct? (8000)
- CORS headers present?
- Firewall blocking?

### Issue: Wrong data format
**Check:**
- Response is valid JSON?
- Response is array `[ ]` not object `{ }`?
- Has required fields?
- Field names match exactly?

---

## DATA SAMPLE FOR SEEDING

If you need sample data to get started:

```python
# Sample Stations
stations = [
    {"id": 1, "name": "Riverbend Station", "location": "River Area", "latitude": 28.7041, "longitude": 77.1025},
    {"id": 2, "name": "Lakeview Point", "location": "Lake Shore", "latitude": 28.6139, "longitude": 77.2090},
    {"id": 3, "name": "Ganges Monitoring", "location": "Ganges Basin", "latitude": 28.6100, "longitude": 77.2300},
    {"id": 4, "name": "Coastal Watch", "location": "Coastal Area", "latitude": 28.6200, "longitude": 77.2400},
    {"id": 5, "name": "Mountain Spring", "location": "Mountain Region", "latitude": 28.6300, "longitude": 77.2500}
]

# Sample Projects
projects = [
    {"id": 1, "name": "Community Water Quality Initiative - Riverbend", "description": "Monitoring water quality...", "status": "Active", "due": "2026-01-31"},
    {"id": 2, "name": "Groundwater Contamination Study", "description": "Investigating lead and arsenic...", "status": "Pending", "due": "2025-11-15"},
    {"id": 3, "name": "Coastal Erosion Impact Assessment", "description": "Assessing coastal impact...", "status": "Active", "due": "2026-03-01"},
]

# Sample Activities
activities = [
    {"id": 1, "text": "Assigned task for Riverbend project", "time": "2 hours ago"},
    {"id": 2, "text": "Submitted groundwater report", "time": "5 hours ago"},
    {"id": 3, "text": "Updated Coastal Erosion project", "time": "1 day ago"},
]

# Sample Predictions
predictions = [
    {"id": 1, "parameter": "Turbidity", "probability": 75, "type": "turbidity", "station": "NGO-MH-002", "currentValue": 13, "predictedValue": 14.8, "expectedDate": "2026-01-16"},
    {"id": 2, "parameter": "Ammonia", "probability": 65, "type": "ammonia", "station": "NGO-DL-003", "currentValue": 2.6, "predictedValue": 2.9, "expectedDate": "2026-01-21"},
]
```

---

## NEXT STEPS

1. ✅ Implement `GET /api/stations`
2. ✅ Implement `GET /api/projects`
3. ✅ Implement `GET /api/activities`
4. ✅ Implement `GET /api/predictive-alerts`
5. ✅ Test each endpoint with cURL or Postman
6. ✅ Verify JSON format matches expectations
7. ✅ Test with frontend application
8. ✅ Verify no errors in browser console

---

## STATUS CHECKLIST

- [ ] Backend server running on http://127.0.0.1:8000
- [ ] GET /api/stations implemented
- [ ] GET /api/projects implemented
- [ ] GET /api/activities implemented
- [ ] GET /api/predictive-alerts implemented
- [ ] All endpoints return valid JSON
- [ ] CORS enabled
- [ ] Tested with cURL
- [ ] Tested with frontend
- [ ] No errors in browser console
- [ ] Data displays correctly on all pages

---

**Your frontend is ready. Implement these 4 endpoints and everything works!** 🚀
