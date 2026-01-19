# 🔌 API ENDPOINTS QUICK REFERENCE

**Backend URL:** `http://localhost:8000`  
**Frontend URL:** `http://localhost:3000`  
**API Docs:** `http://localhost:8000/docs` (Swagger UI)

---

## 📍 NGO ENDPOINTS

### Create NGO
```
POST /api/ngos
Content-Type: application/json

{
  "name": "EcoWater Alliance",
  "description": "Water conservation organization",
  "location": "Mumbai, Maharashtra",
  "contact_email": "contact@ecowater.org",
  "contact_phone": "+91-22-XXXX-XXXX"
}
```

### Get All NGOs
```
GET /api/ngos
```

### Get Specific NGO
```
GET /api/ngos/{ngo_id}
```

### Update NGO
```
PUT /api/ngos/{ngo_id}
Content-Type: application/json

{
  "name": "Updated Name",
  "location": "New Location"
}
```

### Delete NGO
```
DELETE /api/ngos/{ngo_id}
```

---

## 📊 PROJECT ENDPOINTS

### Create Project
```
POST /api/projects
Content-Type: application/json

{
  "name": "Water Quality Initiative",
  "description": "Monitoring water quality in urban areas",
  "status": "Active",
  "due_date": "2026-03-31T00:00:00"
}
```

### Get All Projects
```
GET /api/projects
```

### Get Specific Project
```
GET /api/projects/{project_id}
```

### Update Project
```
PUT /api/projects/{project_id}
Content-Type: application/json

{
  "status": "Completed",
  "description": "Updated description"
}
```

### Delete Project
```
DELETE /api/projects/{project_id}
```

---

## 🤝 COLLABORATION ENDPOINTS

### Create Collaboration
```
POST /api/collaborations
Content-Type: application/json

{
  "project_id": 1,
  "ngo_id": 1,
  "start_date": "2026-01-01T00:00:00",
  "end_date": "2026-03-31T00:00:00",
  "contract_details": "6-month monitoring contract",
  "status": "Active"
}
```

### Get All Collaborations
```
GET /api/collaborations
```

### Get Collaboration by ID
```
GET /api/collaborations/{collab_id}
```

### Get Collaborations for Project
```
GET /api/collaborations/project/{project_id}
```

### Get Collaborations for NGO
```
GET /api/collaborations/ngo/{ngo_id}
```

### Update Collaboration
```
PUT /api/collaborations/{collab_id}
Content-Type: application/json

{
  "status": "Completed",
  "end_date": "2026-02-15T00:00:00"
}
```

### Delete Collaboration
```
DELETE /api/collaborations/{collab_id}
```

---

## 📌 NGO-STATION ASSIGNMENT ENDPOINTS

### Assign Station to NGO
```
POST /api/ngo-stations
Content-Type: application/json

{
  "ngo_id": 1,
  "project_id": 1,
  "station_id": 1,
  "assigned_date": "2026-01-01T00:00:00"
}
```

### Get All Assignments
```
GET /api/ngo-stations
```

### Get Stations for NGO
```
GET /api/ngo-stations/ngo/{ngo_id}
```

### Get Stations for Project
```
GET /api/ngo-stations/project/{project_id}
```

### Unassign Station
```
PUT /api/ngo-stations/{assignment_id}
Content-Type: application/json

{
  "unassigned_date": "2026-02-01T00:00:00"
}
```

### Delete Assignment
```
DELETE /api/ngo-stations/{assignment_id}
```

---

## 🔮 PREDICTION ENDPOINTS

### Create Prediction
```
POST /api/predictions
Content-Type: application/json

{
  "station_id": 1,
  "parameter": "pH",
  "current_value": 7.2,
  "predicted_value": 8.5,
  "probability": 75.0,
  "expected_alert_date": "2026-01-20T00:00:00",
  "trend": "Increasing",
  "risk_level": "High",
  "review_content": "pH levels showing concerning trend",
  "confidence_score": 85.0
}
```

### Get All Predictions
```
GET /api/predictions
```

### Get Specific Prediction
```
GET /api/predictions/{prediction_id}
```

### Get Predictions for Station
```
GET /api/predictions/station/{station_id}
```

### Get Latest Predictions for Station
```
GET /api/predictions/station/{station_id}/latest
```

### Update Prediction
```
PUT /api/predictions/{prediction_id}
Content-Type: application/json

{
  "review_content": "Updated analysis",
  "probability": 80.0
}
```

### Delete Prediction
```
DELETE /api/predictions/{prediction_id}
```

---

## 💧 EXISTING ENDPOINTS (Already in Backend)

### Water Stations

**Create Station**
```
POST /api/stations
```

**Get All Stations**
```
GET /api/stations
```

**Get Station Details**
```
GET /api/stations/{station_id}
```

**Get Station Readings**
```
GET /api/stations/{station_id}/readings
```

### Reports

**Create Report**
```
POST /api/reports
```

**Get All Reports**
```
GET /api/reports
```

**Get Report Details**
```
GET /api/reports/{report_id}
```

### Alerts

**Get All Alerts**
```
GET /api/alerts
```

**Get Historical Alerts**
```
GET /api/alerts/historical
```

---

## 🧪 TESTING EXAMPLES

### Using curl to Get All NGOs
```bash
curl http://localhost:8000/api/ngos
```

### Using curl to Create NGO
```bash
curl -X POST http://localhost:8000/api/ngos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test NGO",
    "location": "Test City",
    "contact_email": "test@ngo.org"
  }'
```

### Using curl to Get Predictions for Station
```bash
curl http://localhost:8000/api/predictions/station/1/latest
```

### Using curl to Create Collaboration
```bash
curl -X POST http://localhost:8000/api/collaborations \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "ngo_id": 1,
    "start_date": "2026-01-01T00:00:00",
    "status": "Active"
  }'
```

---

## 📊 RESPONSE FORMATS

### Success Response (200, 201)
```json
{
  "id": 1,
  "name": "EcoWater Alliance",
  "description": "...",
  "location": "Mumbai",
  "contact_email": "contact@ecowater.org",
  "contact_phone": "+91-22-XXXX-XXXX",
  "created_at": "2026-01-18T10:30:00"
}
```

### List Response
```json
[
  { "id": 1, "name": "NGO 1", ... },
  { "id": 2, "name": "NGO 2", ... }
]
```

### Error Response (400, 404, 500)
```json
{
  "detail": "NGO not found"
}
```

---

## 🔄 COMMON WORKFLOWS

### Create NGO and Project with Collaboration

```bash
# 1. Create NGO
NGO_ID=$(curl -s -X POST http://localhost:8000/api/ngos \
  -H "Content-Type: application/json" \
  -d '{"name":"My NGO","location":"City","contact_email":"ngo@test.org"}' | jq -r '.id')

# 2. Create Project
PROJECT_ID=$(curl -s -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","status":"Active"}' | jq -r '.id')

# 3. Create Collaboration
curl -X POST http://localhost:8000/api/collaborations \
  -H "Content-Type: application/json" \
  -d "{\"project_id\":$PROJECT_ID,\"ngo_id\":$NGO_ID,\"start_date\":\"2026-01-01T00:00:00\",\"status\":\"Active\"}"
```

### Assign Station to NGO for Project

```bash
curl -X POST http://localhost:8000/api/ngo-stations \
  -H "Content-Type: application/json" \
  -d '{
    "ngo_id": 1,
    "project_id": 1,
    "station_id": 1,
    "assigned_date": "2026-01-01T00:00:00"
  }'
```

### Create Predictive Alert

```bash
curl -X POST http://localhost:8000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "station_id": 1,
    "parameter": "pH",
    "current_value": 7.2,
    "predicted_value": 8.5,
    "probability": 75.0,
    "trend": "Increasing",
    "risk_level": "High",
    "confidence_score": 85.0
  }'
```

---

## 📝 NOTES

- All timestamps are in UTC timezone
- All IDs are integers
- Probability and confidence_score are 0-100
- Status values: Active, Completed, Paused, Terminated
- Risk levels: Low, Medium, High
- Trends: Increasing, Decreasing, Stable
- Parameters: pH, turbidity, DO, lead, arsenic, temperature, bacteria
- Empty POST/PUT bodies return 422 Unprocessable Entity
- Missing resources return 404 Not Found
- Server errors return 500 Internal Server Error
