# Backend API Complete Integration Guide

**Date:** January 17, 2026  
**Status:** Backend entities and APIs implemented and ready for integration

---

## INTEGRATION STEPS

### Step 1: Update models.py (DONE ✅)
**File:** `/backend/models.py`
- Added NGO model
- Added Project model
- Added Collaboration model
- Added Prediction model
- Added ProjectNGOAssignment (junction table)
- Added ProjectStationAssignment (junction table)
- Updated User, WaterStation with relationships

### Step 2: Add Schemas (DONE ✅)
**File:** `/backend/schemas_collaboration.py`
- NGO CRUD schemas
- Project CRUD schemas
- Collaboration CRUD schemas
- Assignment schemas
- Prediction schemas

### Step 3: Integrate Routes into main.py (REQUIRED ⏳)

Add these lines to your `main.py` file:

```python
# At the top of main.py, after other imports
from collaboration_routes import router as collab_router

# After app initialization (after CORS middleware setup)
app.include_router(collab_router)
```

### Step 4: Initialize Database with New Tables (REQUIRED ⏳)

Run this Python script to create all new tables:

```python
# Create file: /backend/init_collaboration_tables.py
from database import engine
import models

# This will create all new tables
models.Base.metadata.create_all(bind=engine)

print("✅ All collaboration tables created successfully!")
```

Then run:
```bash
cd backend
python init_collaboration_tables.py
```

### Step 5: Seed Sample Data (OPTIONAL but RECOMMENDED)

Create `/backend/seed_collaborations.py`:

```python
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal
import models

db = SessionLocal()

try:
    # Create sample NGOs
    ngo1 = models.NGO(
        name="Water for All Foundation",
        email="contact@waterforall.org",
        phone="+91-9876543210",
        location="Mumbai, India",
        established_date=datetime(2015, 1, 1),
        description="Leading water quality monitoring NGO in Western India",
        website="www.waterforall.org"
    )
    
    ngo2 = models.NGO(
        name="Clean Water Initiative",
        email="info@cleanwater.org",
        phone="+91-9876543211",
        location="Delhi, India",
        established_date=datetime(2018, 6, 15),
        description="Dedicated to ensuring clean water access",
        website="www.cleanwater.org"
    )
    
    db.add_all([ngo1, ngo2])
    db.commit()
    db.refresh(ngo1)
    db.refresh(ngo2)
    
    # Create sample project
    project = models.Project(
        name="National Water Quality Assessment 2026",
        description="Comprehensive water quality monitoring across major water bodies",
        status="active",
        start_date=datetime(2026, 1, 1),
        end_date=datetime(2026, 12, 31),
        budget=500000.00
    )
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Create collaboration
    collab = models.Collaboration(
        ngo1_id=ngo1.id,
        ngo2_id=ngo2.id,
        project_id=project.id,
        status="active",
        start_date=datetime(2026, 1, 1),
        end_date=datetime(2026, 12, 31),
        agreement_details="Partnership for comprehensive water quality monitoring"
    )
    
    db.add(collab)
    db.commit()
    
    # Assign NGOs to project
    from datetime import datetime
    assignment1 = models.ProjectNGOAssignment(
        project_id=project.id,
        ngo_id=ngo1.id,
        assigned_date=datetime.now(),
        contract_period_start=datetime(2026, 1, 1),
        contract_period_end=datetime(2026, 12, 31)
    )
    
    assignment2 = models.ProjectNGOAssignment(
        project_id=project.id,
        ngo_id=ngo2.id,
        assigned_date=datetime.now(),
        contract_period_start=datetime(2026, 1, 1),
        contract_period_end=datetime(2026, 12, 31)
    )
    
    db.add_all([assignment1, assignment2])
    db.commit()
    
    # Assign stations to project (using existing stations)
    stations = db.query(models.WaterStation).limit(4).all()
    for station in stations:
        assignment = models.ProjectStationAssignment(
            project_id=project.id,
            station_id=station.id,
            assigned_date=datetime.now(),
            assignment_period_start=datetime(2026, 1, 1),
            assignment_period_end=datetime(2026, 12, 31)
        )
        db.add(assignment)
    
    db.commit()
    
    print("✅ Sample collaboration data seeded successfully!")
    
finally:
    db.close()
```

Run it:
```bash
python seed_collaborations.py
```

---

## COMPLETE API ENDPOINT LIST

### NGO MANAGEMENT
```
POST   /api/ngos                        - Create NGO
GET    /api/ngos                        - List all NGOs
GET    /api/ngos/{ngo_id}               - Get NGO details
PUT    /api/ngos/{ngo_id}               - Update NGO
DELETE /api/ngos/{ngo_id}               - Delete NGO
GET    /api/ngos/{ngo_id}/projects      - Get NGO's projects
GET    /api/ngos/{ngo_id}/stations      - Get NGO's assigned stations
GET    /api/ngos/{ngo_id}/collaborations - Get NGO's collaborations
```

### PROJECT MANAGEMENT
```
POST   /api/projects                    - Create project
GET    /api/projects                    - List all projects (with status filter)
GET    /api/projects/{project_id}       - Get project details
PUT    /api/projects/{project_id}       - Update project
DELETE /api/projects/{project_id}       - Delete project
GET    /api/projects/{project_id}/stations - Get project's stations
```

### ASSIGNMENTS
```
POST   /api/projects/{id}/assign-ngo        - Assign NGO to project
DELETE /api/projects/{id}/ngos/{ngo_id}     - Remove NGO from project
POST   /api/projects/{id}/assign-station    - Assign station to project
DELETE /api/projects/{id}/stations/{stn_id} - Remove station from project
```

### COLLABORATIONS
```
POST   /api/collaborations              - Create collaboration
GET    /api/collaborations              - List all collaborations
GET    /api/collaborations/{id}         - Get collaboration details
PUT    /api/collaborations/{id}         - Update collaboration
DELETE /api/collaborations/{id}         - Delete collaboration
```

### PREDICTIONS
```
POST   /api/predictions                 - Create prediction
GET    /api/predictions                 - Get latest predictions
GET    /api/predictions/station/{id}    - Get station's predictions
GET    /api/predictions/parameter/{type} - Get parameter predictions
GET    /api/predictions/{id}            - Get specific prediction
DELETE /api/predictions/{id}            - Delete prediction
```

---

## EXAMPLE API CALLS

### 1. Create an NGO
```bash
curl -X POST http://localhost:8000/api/ngos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Water for All",
    "email": "contact@waterforall.org",
    "phone": "+91-9876543210",
    "location": "Mumbai, India",
    "description": "Leading water quality NGO"
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Water for All",
  "email": "contact@waterforall.org",
  "phone": "+91-9876543210",
  "location": "Mumbai, India",
  "description": "Leading water quality NGO",
  "website": null,
  "established_date": null,
  "created_at": "2026-01-17T10:30:00"
}
```

### 2. Create a Project
```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "National Water Assessment",
    "description": "Comprehensive monitoring",
    "status": "active",
    "start_date": "2026-01-01T00:00:00",
    "end_date": "2026-12-31T23:59:59",
    "budget": 500000
  }'
```

### 3. Assign NGO to Project
```bash
curl -X POST http://localhost:8000/api/projects/1/assign-ngo \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "ngo_id": 1,
    "contract_period_start": "2026-01-01T00:00:00",
    "contract_period_end": "2026-12-31T23:59:59"
  }'
```

### 4. Assign Station to Project
```bash
curl -X POST http://localhost:8000/api/projects/1/assign-station \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "station_id": 1,
    "assignment_period_start": "2026-01-01T00:00:00",
    "assignment_period_end": "2026-12-31T23:59:59"
  }'
```

### 5. Create Collaboration
```bash
curl -X POST http://localhost:8000/api/collaborations \
  -H "Content-Type: application/json" \
  -d '{
    "ngo1_id": 1,
    "ngo2_id": 2,
    "project_id": 1,
    "status": "active",
    "start_date": "2026-01-01T00:00:00",
    "agreement_details": "Partnership for water quality monitoring"
  }'
```

### 6. Create Prediction
```bash
curl -X POST http://localhost:8000/api/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "station_id": 1,
    "parameter": "turbidity",
    "current_value": 13,
    "predicted_value": 14.8,
    "probability": 75,
    "expected_alert_date": "2026-01-19T10:00:00",
    "trend": "Increasing",
    "risk_level": "High",
    "review_content": "Turbidity levels showing concerning trend"
  }'
```

---

## FRONTEND INTEGRATION

Update frontend API calls to use real endpoints instead of mock data:

### Example: Update CollaborationsPage to use real API

```javascript
// Replace mock projects with API call
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ngos/1/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Fallback to mock data
      setProjects(mockProjects);
    }
  };
  
  fetchProjects();
}, []);

// Similar pattern for stations, reports, predictions, etc.
```

---

## DATABASE SCHEMA VISUALIZATION

```
users (existing)
├── id (PK)
├── email
├── full_name
├── hashed_password
├── role
└── ngo_id (FK) → ngos.id

ngos (NEW)
├── id (PK)
├── name (UNIQUE)
├── email (UNIQUE)
├── phone
├── location
├── established_date
├── description
├── website
└── created_at

projects (NEW)
├── id (PK)
├── name
├── description
├── status
├── start_date
├── end_date
├── budget
├── manager_id (FK) → users.id
└── created_at

collaborations (NEW)
├── id (PK)
├── ngo1_id (FK) → ngos.id
├── ngo2_id (FK) → ngos.id
├── project_id (FK) → projects.id
├── status
├── start_date
├── end_date
├── agreement_details
└── created_at

project_ngo_assignments (NEW - Junction Table)
├── project_id (FK, PK)
├── ngo_id (FK, PK)
├── assigned_date
├── contract_period_start
└── contract_period_end

project_station_assignments (NEW - Junction Table)
├── project_id (FK, PK)
├── station_id (FK, PK)
├── assigned_date
├── assignment_period_start
└── assignment_period_end

water_stations (existing)
├── id (PK)
├── name
├── location
├── latitude
├── longitude
├── managed_by
└── created_at

predictions (NEW)
├── id (PK)
├── station_id (FK) → water_stations.id
├── parameter (ENUM)
├── current_value
├── predicted_value
├── probability
├── expected_alert_date
├── trend
├── risk_level
├── review_content
└── created_at

station_readings (existing)
├── id (PK)
├── station_id (FK) → water_stations.id
├── parameter (ENUM)
├── value
└── recorded_at
```

---

## TESTING THE BACKEND

### 1. Initialize Tables
```bash
cd backend
python init_collaboration_tables.py
```

### 2. Seed Sample Data
```bash
python seed_collaborations.py
```

### 3. Test All Endpoints
Use Postman or create a test script. FastAPI provides automatic docs:
```
Visit: http://localhost:8000/docs
```

This gives you interactive API documentation!

### 4. Run Backend
```bash
cd backend
python main.py
# OR
uvicorn main:app --reload
```

---

## NEXT STEPS

1. ✅ **Backend Models & Schemas Created**
2. ⏳ **Integrate routes into main.py**
3. ⏳ **Initialize database**
4. ⏳ **Seed sample data**
5. ⏳ **Test all endpoints**
6. ⏳ **Update frontend to use real APIs**
7. ⏳ **Create predictive model scheduler**
8. ⏳ **Full integration testing**
9. ⏳ **Deployment**

---

## TROUBLESHOOTING

**Error: ForeignKey constraint error**
- Ensure all referenced records exist before creating related records
- Example: Create NGO before assigning to Project

**Error: Table already exists**
- Delete `water_quality.db` and reinitialize: `python init_collaboration_tables.py`

**Error: Import error in main.py**
- Ensure `collaboration_routes.py` is in the same directory as `main.py`
- Check Python path and imports

**Missing data in relationships**
- Use `.options(joinedload(...))` in queries for eager loading
- Example: `db.query(models.Project).options(joinedload(models.Project.ngos)).all()`

