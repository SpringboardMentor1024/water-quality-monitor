# 📸 Screenshot Guide for NGO Collaboration & Predictive Analytics Backend

## 🎯 Overview
This guide helps you capture the right screenshots to demonstrate your NGO collaboration workflows, project-based station assignments, and predictive analytics module.

## 📋 Pre-Screenshot Setup

### 1. Start Backend Server
```bash
cd backend
python run.py
```

### 2. Create Sample Data
```bash
python ../verify_database.py
python ../test_ngo_apis.py
```

### 3. Open Required Tools
- Browser: `http://localhost:8000/docs` (Swagger UI)
- Database Tool: DB Browser for SQLite or similar
- API Testing: Postman (optional)

---

## 📸 Required Screenshots

### 1. DATABASE SCHEMA SCREENSHOTS

**Location:** Database management tool (DB Browser for SQLite)

#### A. Table Structures
- [ ] **NGOs Table Schema**
  - Show columns: id, name, contact_email, contact_phone, region, created_at
  - Highlight primary key and data types

- [ ] **Projects Table Schema**
  - Show columns: id, name, description, start_date, end_date, status, created_at
  - Highlight ENUM status field (planned, active, completed)

- [ ] **Collaborations Table Schema**
  - Show columns: id, project_id, ngo_id, role, assigned_from, assigned_to
  - Highlight foreign key relationships

- [ ] **Station Assignments Schema**
  - Show mapping between NGOs, Projects, and WaterStations
  - Highlight time-bound assignments

#### B. Foreign Key Relationships
- [ ] **ER Diagram or Relationships View**
  - Show connections between tables
  - Highlight cascading rules

#### C. Sample Data
- [ ] **NGOs Table Data** (5+ sample records)
- [ ] **Projects Table Data** (5+ sample records)
- [ ] **Collaborations Table Data** (7+ sample records)
- [ ] **Indexes and Constraints** view

---

### 2. API DOCUMENTATION SCREENSHOTS

**Location:** `http://localhost:8000/docs` (Swagger UI)

#### A. NGO Management APIs
- [ ] **NGO CRUD Endpoints**
  - GET /api/ngos/ (list with pagination)
  - POST /api/ngos/ (create new NGO)
  - PUT /api/ngos/{id} (update NGO)
  - DELETE /api/ngos/{id} (deactivate NGO)

#### B. Project Management APIs
- [ ] **Project CRUD Endpoints**
  - GET /api/projects/ (list projects)
  - POST /api/projects/ (create project)
  - PUT /api/projects/{id} (update project)
  - GET /api/projects/{id}/ngos (assigned NGOs)

#### C. Collaboration APIs
- [ ] **Collaboration Management**
  - GET /api/collaborations/ (list collaborations)
  - POST /api/collaborations/ (create collaboration)
  - GET /api/collaborations/project/{id} (project collaborations)
  - GET /api/collaborations/ngo/{id} (NGO collaborations)

#### D. Predictive Analytics APIs
- [ ] **Prediction Endpoints**
  - GET /predict/station/{station_id} (station forecast)
  - GET /predict/alerts (alert predictions)
  - GET /predict/trends (trend projections)

---

### 3. API TESTING SCREENSHOTS

**Location:** Swagger UI "Try it out" or Postman

#### A. NGO Operations
- [ ] **Create NGO Request**
  ```json
  {
    "name": "Clean Water Foundation",
    "contact_email": "contact@cleanwater.org",
    "contact_phone": "+91-9876543210",
    "region": "Maharashtra"
  }
  ```
  - Show request body and 201 response

- [ ] **List NGOs Response**
  - Show paginated list with multiple NGOs
  - Highlight pagination parameters

#### B. Project Operations
- [ ] **Create Project Request**
  ```json
  {
    "name": "Mumbai Water Quality Initiative",
    "description": "Comprehensive water quality monitoring",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "status": "active"
  }
  ```

- [ ] **Assign Multiple NGOs to Project**
  - Show request assigning 2-3 NGOs to one project
  - Show successful response

#### C. Collaboration Operations
- [ ] **Create Collaboration Request**
  ```json
  {
    "project_id": 1,
    "ngo_id": 1,
    "role": "Lead Monitoring Partner",
    "assigned_from": "2024-01-01",
    "assigned_to": "2024-12-31"
  }
  ```

#### D. Predictive Analytics
- [ ] **Station Prediction Response**
  ```json
  {
    "station_id": 1,
    "risk_level": "medium",
    "contamination_probability": 0.35,
    "predicted_parameters": {
      "ph": 6.8,
      "turbidity": 4.2
    },
    "forecast_date": "2024-02-01"
  }
  ```

- [ ] **Alert Predictions Response**
  - Show array of predicted alerts by region
  - Highlight probability scores

- [ ] **Trend Predictions Response**
  - Show time-series forecast data
  - Highlight parameter trends

---

### 4. SECURITY & AUTHENTICATION SCREENSHOTS

#### A. JWT Authentication
- [ ] **Login Request**
  ```json
  {
    "username": "ngo_admin",
    "password": "secure_password"
  }
  ```
  - Show successful token response

- [ ] **Protected Endpoint Access**
  - Show 401 Unauthorized without token
  - Show 200 OK with valid token

#### B. Role-Based Access Control
- [ ] **NGO Admin Access**
  - Show NGO admin accessing their assigned projects
  - Show restricted access to other NGO data

- [ ] **System Admin Access**
  - Show full access to all NGOs and projects

---

### 5. INTEGRATION SCREENSHOTS

#### A. Dashboard Integration
- [ ] **NGO Dashboard API Response**
  - Show API returning NGO-specific data
  - Highlight assigned stations and projects

#### B. Station Assignment Mapping
- [ ] **Station-NGO Mapping**
  - Show which NGOs are assigned to which stations
  - Show time-bound assignments

---

## 🚀 Quick Screenshot Workflow

### Step 1: Database Screenshots (5 minutes)
1. Open DB Browser for SQLite
2. Load `backend/water_quality.db`
3. Capture table structures for NGOs, Projects, Collaborations
4. Show sample data in each table

### Step 2: API Documentation (10 minutes)
1. Open `http://localhost:8000/docs`
2. Scroll through and capture all NGO/Project/Collaboration endpoints
3. Capture predictive analytics endpoints
4. Show request/response schemas

### Step 3: API Testing (15 minutes)
1. Use Swagger UI "Try it out" feature
2. Test creating NGO, Project, Collaboration
3. Test predictive endpoints
4. Capture request/response examples

### Step 4: Security Testing (5 minutes)
1. Test authentication endpoints
2. Show protected endpoint behavior
3. Demonstrate role-based access

---

## ✅ Screenshot Checklist

### Database (4 screenshots)
- [ ] NGOs table structure and data
- [ ] Projects table structure and data  
- [ ] Collaborations table structure and data
- [ ] Foreign key relationships diagram

### API Documentation (6 screenshots)
- [ ] NGO CRUD endpoints
- [ ] Project management endpoints
- [ ] Collaboration endpoints
- [ ] Predictive analytics endpoints
- [ ] Authentication endpoints
- [ ] Request/response schemas

### API Testing (8 screenshots)
- [ ] Create NGO request/response
- [ ] List NGOs with pagination
- [ ] Create project with multiple NGOs
- [ ] Station prediction response
- [ ] Alert predictions response
- [ ] Trend predictions response
- [ ] JWT authentication
- [ ] Protected endpoint access

### Integration (2 screenshots)
- [ ] Station assignment mapping
- [ ] Dashboard API integration

**Total: 20 key screenshots**

---

## 📝 Screenshot Naming Convention

Use this naming pattern for easy organization:

```
01_database_ngos_table.png
02_database_projects_table.png
03_database_collaborations_table.png
04_database_relationships.png
05_api_docs_ngo_endpoints.png
06_api_docs_project_endpoints.png
07_api_docs_collaboration_endpoints.png
08_api_docs_predictive_endpoints.png
09_api_test_create_ngo.png
10_api_test_list_ngos.png
11_api_test_create_project.png
12_api_test_station_prediction.png
13_api_test_alert_predictions.png
14_api_test_trend_predictions.png
15_security_jwt_auth.png
16_security_protected_access.png
17_integration_station_mapping.png
18_integration_dashboard_api.png
19_sample_data_overview.png
20_complete_system_overview.png
```

This systematic approach will provide comprehensive documentation of your NGO collaboration and predictive analytics backend implementation!