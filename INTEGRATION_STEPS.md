# INTEGRATION STEPS - Step by Step Instructions

**Estimated Time:** 10-15 minutes to full integration

---

## STEP 1: Add Router to main.py (2 minutes)

**File:** `/backend/main.py`

**Find this section** (around line 15):
```python
import models, schemas, auth, config
```

**Add this line after it:**
```python
from collaboration_routes import router as collab_router
```

**Find the CORS middleware section** (around line 25):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Add this line right after the middleware setup:**
```python
app.include_router(collab_router)
```

**Your updated main.py should look like:**
```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
# ... other imports ...
import models, schemas, auth, config
from collaboration_routes import router as collab_router  # ← NEW LINE

load_dotenv()
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Water Quality Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(collab_router)  # ← NEW LINE

# ... rest of your main.py ...
```

---

## STEP 2: Initialize Database Tables (2 minutes)

**In your terminal:**

```bash
cd backend
python init_collaboration_tables.py
```

**Expected Output:**
```
🔄 Initializing collaboration tables...
✅ Successfully created all collaboration tables!

Tables created:
  • ngos
  • projects
  • collaborations
  • project_ngo_assignments
  • project_station_assignments
  • predictions

Next steps:
  1. Run: python seed_collaboration_data.py
  2. Restart backend: python main.py
  3. Visit: http://localhost:8000/docs for API docs
```

---

## STEP 3: Seed Sample Data (2 minutes)

**In your terminal:**

```bash
python seed_collaboration_data.py
```

**Expected Output:**
```
🌱 Seeding collaboration data...

📋 Creating NGOs...
✅ Created 3 NGOs

📋 Creating Projects...
✅ Created 2 Projects

📋 Creating Collaborations...
✅ Created 2 Collaborations

📋 Assigning NGOs to Projects...
✅ Assigned NGOs to Projects

📋 Assigning Stations to Projects...
✅ Assigned 8 Stations to Projects

📋 Creating Predictions...
✅ Created 4 Predictions

==================================================
✅ SAMPLE DATA SEEDING COMPLETE!
==================================================

Created:
  • 3 NGOs
  • 2 Projects
  • 2 Collaborations
  • 4 NGO Assignments
  • 8 Station Assignments
  • 4 Predictions

📚 Test the API:
  • Visit: http://localhost:8000/docs
  • Try: GET /api/ngos
  • Try: GET /api/projects
  • Try: GET /api/predictions
```

---

## STEP 4: Restart Backend (automatic when saved)

**Stop current backend process (Ctrl+C)**

**Start backend again:**
```bash
python main.py
```

**OR if using uvicorn:**
```bash
uvicorn main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Waiting for applications startup.
INFO:     Application startup complete.
```

---

## STEP 5: Test the APIs (5 minutes)

### Option A: Interactive API Docs (Easiest)

1. Visit: **http://localhost:8000/docs**
2. You should see Swagger UI with all endpoints
3. Try these requests:

**Test 1: Get All NGOs**
- Expand: `GET /api/ngos`
- Click "Try it out"
- Click "Execute"
- Should see 3 NGOs with details

**Test 2: Get All Projects**
- Expand: `GET /api/projects`
- Click "Try it out"
- Click "Execute"
- Should see 2 projects

**Test 3: Get Predictions**
- Expand: `GET /api/predictions`
- Click "Try it out"
- Click "Execute"
- Should see 4 predictions

### Option B: Using curl (Terminal)

```bash
# Get all NGOs
curl http://localhost:8000/api/ngos

# Get all projects
curl http://localhost:8000/api/projects

# Get predictions
curl http://localhost:8000/api/predictions

# Get specific NGO with projects
curl http://localhost:8000/api/ngos/1
```

---

## STEP 6: Verify Frontend Still Works (2 minutes)

**In another terminal:**
```bash
cd frontend
npm start
```

**Visit:** http://localhost:3000/collaborations

**Verify:**
- ✅ Dashboard loads
- ✅ Projects display
- ✅ Station selector works
- ✅ Report management buttons work
- ✅ Charts render
- ✅ No console errors

---

## STEP 7: Update Frontend to Use Real APIs (Optional - Later)

**When ready, update frontend API calls:**

**File:** `/frontend/src/pages/CollaborationsPage.js`

**Example: Replace mock projects with real API**

**Current (Mock):**
```javascript
useEffect(() => {
  setLoadingProjects(true);
  setTimeout(() => {
    setProjects(mockProjects);
    setLoadingProjects(false);
  }, 300);
}, []);
```

**New (Real API):**
```javascript
useEffect(() => {
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch('http://localhost:8000/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setProjects(mockProjects); // Fallback to mock
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(mockProjects); // Fallback to mock
    } finally {
      setLoadingProjects(false);
    }
  };
  
  fetchProjects();
}, []);
```

**Similar pattern for:**
- `GET /api/stations` for water stations
- `GET /api/stations/{id}/readings` for readings
- `GET /api/predictions` for predictions
- etc.

---

## TROUBLESHOOTING

### Error: "Module not found: collaboration_routes"
**Solution:** Make sure `collaboration_routes.py` is in the `/backend/` directory

### Error: "Table already exists"
**Solution:** Delete `water_quality.db` and run `init_collaboration_tables.py` again

### Error: "Foreign key constraint failed"
**Solution:** Make sure NGOs exist before creating assignments
- Run `seed_collaboration_data.py` to create sample data

### Error: "No stations found"
**Solution:** Run `populate_sample_stations.py` first to create stations

### Frontend shows "Cannot GET /api/..."
**Solution:** Make sure backend is running on port 8000
```bash
# Check if running
lsof -i :8000

# If not, start it:
cd backend && python main.py
```

### Backend shows "CORS error"
**Solution:** Already configured in main.py, but if issues persist:
```python
# Make sure this is in your main.py:
allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"]
```

---

## VERIFICATION CHECKLIST

### Backend
- [ ] `init_collaboration_tables.py` runs without errors
- [ ] `seed_collaboration_data.py` creates 3 NGOs, 2 projects, etc.
- [ ] Backend starts: `python main.py`
- [ ] Visit http://localhost:8000/docs - see all endpoints
- [ ] GET /api/ngos returns 3 NGOs
- [ ] GET /api/projects returns 2 projects
- [ ] GET /api/predictions returns 4 predictions

### Frontend
- [ ] Frontend starts: `npm start`
- [ ] Visit http://localhost:3000/collaborations
- [ ] Dashboard loads
- [ ] Projects display
- [ ] Station selector works
- [ ] Reports list shows
- [ ] Report buttons work
- [ ] Charts render
- [ ] No console errors

---

## SAMPLE API RESPONSES

### GET /api/ngos
```json
[
  {
    "id": 1,
    "name": "Water for All Foundation",
    "email": "contact@waterforall.org",
    "phone": "+91-9876543210",
    "location": "Mumbai, Maharashtra",
    "established_date": "2015-01-15T00:00:00",
    "description": "Leading water quality monitoring NGO in Western India",
    "website": "https://www.waterforall.org",
    "created_at": "2026-01-17T10:30:00"
  }
]
```

### GET /api/projects
```json
[
  {
    "id": 1,
    "name": "National Water Quality Assessment 2026",
    "description": "Comprehensive water quality monitoring across major water bodies in India",
    "status": "active",
    "start_date": "2026-01-01T00:00:00",
    "end_date": "2026-12-31T00:00:00",
    "budget": 5000000.0,
    "manager_id": null,
    "created_at": "2026-01-17T10:31:00"
  }
]
```

### GET /api/predictions
```json
[
  {
    "id": 1,
    "station_id": 1,
    "parameter": "turbidity",
    "current_value": 13.0,
    "predicted_value": 14.8,
    "probability": 75.0,
    "expected_alert_date": "2026-01-19T10:00:00",
    "trend": "Increasing",
    "risk_level": "High",
    "review_content": "Turbidity levels showing increasing trend...",
    "created_at": "2026-01-17T10:32:00"
  }
]
```

---

## SUCCESS!

If you reach this point with all checks passing:

✅ Backend fully integrated  
✅ Database initialized  
✅ Sample data seeded  
✅ All APIs working  
✅ Frontend connected  
✅ Ready for testing  

**You're ready to deploy!** 🚀

