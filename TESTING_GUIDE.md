# Water Quality Monitor - Frontend & Backend Testing Guide

## Current Status ✅
- **Backend**: Running on http://127.0.0.1:8000
- **Database**: Seeded with sample data (3 stations, 12 readings, 3 alerts)
- **APIs**: All endpoints working correctly

## Testing Process

### 1. Backend API Testing (Already Done ✅)
```bash
# Run this to test all backend APIs
python simple_api_test.py
```
**Result**: All 5 endpoints passed ✅

### 2. Quick Browser Test
Open the HTML test file in your browser:
```
test_frontend_backend.html
```
This will test:
- Backend connection
- Water stations data
- Alerts data  
- Station readings data

### 3. Start Frontend Development Server
```bash
cd frontend
npm start
```
This will:
- Start React development server on http://localhost:3000
- Automatically proxy API calls to backend (http://localhost:8000)
- Enable hot reloading for development

### 4. Test Frontend-Backend Integration

#### Option A: Use React Frontend
1. Keep backend running: `python run.py` (in backend folder)
2. Start frontend: `npm start` (in frontend folder)
3. Open http://localhost:3000 in browser
4. Test features:
   - Dashboard with water quality data
   - Alerts panel
   - Station readings
   - Maps with station locations

#### Option B: Use HTML Test Page
1. Open `test_frontend_backend.html` in browser
2. Click each test button to verify:
   - Backend connection
   - Data loading from APIs
   - Proper error handling

## API Endpoints Available

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/api/stations` | GET | List all water stations |
| `/api/alerts` | GET | List all alerts |
| `/api/readings` | GET | List all station readings |
| `/api/reports` | GET | List all reports |

## Sample Data Available

### Water Stations (3)
- Station Alpha - Downtown Water Treatment
- River Delta Station - Industrial District  
- Lake Reservoir - Recreation Area

### Alerts (3)
- High Turbidity Detection
- Low Dissolved Oxygen Warning
- Bacteria Contamination Alert

### Station Readings (12)
- pH, Turbidity, Dissolved Oxygen, Temperature readings
- Distributed across all 3 stations
- Recent timestamps for testing

## Next Steps for Full Integration

1. **Start Frontend**: `cd frontend && npm start`
2. **Test User Registration**: Try creating a new user account
3. **Test Dashboard**: View real-time water quality data
4. **Test Alerts**: Check alert notifications
5. **Test Maps**: Verify station locations on map
6. **Test Reports**: Create and view water quality reports

## Troubleshooting

### Backend Issues
- Ensure backend is running: `python run.py`
- Check database: `water_quality.db` should exist
- Verify port 8000 is not blocked

### Frontend Issues  
- Ensure dependencies installed: `npm install`
- Check proxy configuration in package.json
- Verify port 3000 is available

### CORS Issues
- Backend already configured for CORS
- Allows localhost:3000 and 127.0.0.1:3000

## Testing Checklist

- [x] Backend APIs working
- [x] Database seeded with sample data
- [x] CORS configured properly
- [ ] Frontend starts successfully
- [ ] Frontend can fetch data from backend
- [ ] User authentication works
- [ ] Real-time features work
- [ ] Maps display correctly
- [ ] Charts render properly

Run the frontend now with: `cd frontend && npm start`