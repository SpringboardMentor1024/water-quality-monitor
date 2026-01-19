# 🔌 Backend API Integration Guide

This guide shows how to connect your integrated Station Details & Visualization Charts to the backend API.

---

## 📡 Current State

**Frontend (CollaborationsPage.js)**: ✅ Complete with mock data
**Backend API**: Ready at `http://localhost:8000`
**Next**: Replace mock data with real API calls

---

## 🔗 Required Backend Endpoints

### 1. Get All Stations
```
GET /api/stations/
```
**Used for**: Station selector dropdown, map markers, dashboard table
**Response**:
```json
[
  {
    "id": "ST001",
    "name": "Riverbend Station",
    "location": "Riverbend Area",
    "status": "Normal",
    "lat": 20.5937,
    "lng": 78.9629,
    "project_id": 1
  }
]
```

### 2. Get Station Details
```
GET /api/stations/{station_id}/
```
**Used for**: Station header, parameter cards
**Response**:
```json
{
  "id": "ST001",
  "name": "Riverbend Station",
  "location": "Riverbend Area",
  "status": "Normal",
  "last_updated": "2024-01-07 14:30:00"
}
```

### 3. Get Parameter Readings (Time Series)
```
GET /api/stations/{station_id}/parameters/?start_date=2024-01-01&end_date=2024-01-07
```
**Used for**: Line chart, parameter cards current values
**Response**:
```json
[
  {
    "date": "2024-01-01",
    "pH": 7.0,
    "temperature": 24,
    "DO": 8.0,
    "bacteria": 15,
    "turbidity": 2.0
  }
]
```

### 4. Get Alerts History
```
GET /api/stations/{station_id}/alerts/?start_date=2024-01-01&end_date=2024-01-07
```
**Used for**: Alerts bar chart
**Response**:
```json
[
  {
    "date": "2024-01-01",
    "alerts": 0,
    "critical_alerts": 0
  }
]
```

### 5. Get Predictive Alerts
```
GET /api/stations/{station_id}/predictive-alerts/
```
**Used for**: Predictive alerts cards
**Response**:
```json
[
  {
    "id": 1,
    "parameter": "pH Rising",
    "predicted_value": "7.8",
    "threshold": "7.6",
    "confidence": 0.92,
    "description": "Expected pH increase in next 24 hours"
  }
]
```

### 6. Get Reports
```
GET /api/stations/{station_id}/reports/?status=all
```
**Used for**: Reports list, report management
**Response**:
```json
[
  {
    "id": 1,
    "title": "Water Quality Test",
    "description": "Monthly water quality check",
    "station": "Riverbend Station",
    "status": "Pending",
    "created_at": "2024-01-07"
  }
]
```

### 7. Create Report
```
POST /api/stations/{station_id}/reports/
Body: {
  "title": "Monthly Test",
  "description": "...",
  "status": "Pending"
}
```

### 8. Update Report Status
```
PATCH /api/stations/{station_id}/reports/{report_id}/
Body: {
  "status": "Approved"
}
```

### 9. Delete Report
```
DELETE /api/stations/{station_id}/reports/{report_id}/
```

---

## 💻 Implementation Steps

### Step 1: Import useEffect and Axios
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios'; // npm install axios

const API_BASE = 'http://localhost:8000/api';
```

### Step 2: Replace Mock Stations with API Call
```javascript
// OLD: Hardcoded filteredStations
// NEW:
useEffect(() => {
  const fetchStations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stations/`);
      setFilteredStations(response.data);
      // Optionally filter by selectedProjectId
    } catch (error) {
      console.error('Error fetching stations:', error);
      setFilteredStations([]); // Fallback
    }
  };
  fetchStations();
}, [selectedProjectId]);
```

### Step 3: Fetch Parameter Data When Station Selected
```javascript
useEffect(() => {
  if (!selectedStationDetails) return;
  
  const fetchParameters = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const response = await axios.get(
        `${API_BASE}/stations/${selectedStationDetails.id}/parameters/`,
        {
          params: {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
          }
        }
      );
      setParameterData(response.data);
    } catch (error) {
      console.error('Error fetching parameters:', error);
    }
  };
  
  fetchParameters();
}, [selectedStationDetails]);
```

### Step 4: Fetch Alert Data
```javascript
useEffect(() => {
  if (!selectedStationDetails) return;
  
  const fetchAlerts = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const response = await axios.get(
        `${API_BASE}/stations/${selectedStationDetails.id}/alerts/`,
        {
          params: {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
          }
        }
      );
      setAlertData(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };
  
  fetchAlerts();
}, [selectedStationDetails]);
```

### Step 5: Fetch Predictive Alerts
```javascript
useEffect(() => {
  if (!selectedStationDetails) return;
  
  const fetchPredictiveAlerts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/stations/${selectedStationDetails.id}/predictive-alerts/`
      );
      setPredictiveAlerts(response.data);
    } catch (error) {
      console.error('Error fetching predictive alerts:', error);
    }
  };
  
  fetchPredictiveAlerts();
}, [selectedStationDetails]);
```

### Step 6: Fetch Reports
```javascript
useEffect(() => {
  if (!selectedStationDetails) return;
  
  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/stations/${selectedStationDetails.id}/reports/`,
        {
          params: { status: reportFilter === 'all' ? '' : reportFilter }
        }
      );
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };
  
  fetchReports();
}, [selectedStationDetails, reportFilter]);
```

### Step 7: Implement Submit Report
```javascript
const handleSubmitReport = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/stations/${selectedStationDetails.id}/reports/`,
      {
        title: formData.title,
        description: formData.description,
        status: 'Pending'
      }
    );
    
    // Add new report to list
    setReports([...reports, response.data]);
    setShowReportForm(false);
    
    // Show success message
    alert('Report submitted successfully!');
  } catch (error) {
    console.error('Error submitting report:', error);
    alert('Failed to submit report');
  }
};
```

### Step 8: Implement Update Report Status
```javascript
const handleUpdateReportStatus = async (reportId, newStatus) => {
  try {
    await axios.patch(
      `${API_BASE}/stations/${selectedStationDetails.id}/reports/${reportId}/`,
      { status: newStatus }
    );
    
    // Update reports list
    const updatedReports = reports.map(r =>
      r.id === reportId ? { ...r, status: newStatus } : r
    );
    setReports(updatedReports);
    
    alert('Report status updated!');
  } catch (error) {
    console.error('Error updating report:', error);
    alert('Failed to update report');
  }
};
```

### Step 9: Implement Delete Report
```javascript
const handleDeleteReport = async (reportId) => {
  if (!window.confirm('Are you sure?')) return;
  
  try {
    await axios.delete(
      `${API_BASE}/stations/${selectedStationDetails.id}/reports/${reportId}/`
    );
    
    // Remove from list
    setReports(reports.filter(r => r.id !== reportId));
    
    alert('Report deleted!');
  } catch (error) {
    console.error('Error deleting report:', error);
    alert('Failed to delete report');
  }
};
```

---

## ⚠️ Error Handling Template

```javascript
// Add loading and error states
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// In API call:
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/stations/`);
      setFilteredStations(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load data');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

// In JSX:
{loading && <p>Loading...</p>}
{error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
{!loading && !error && filteredStations.length > 0 && (
  // Render content
)}
```

---

## 🔄 Request/Response Flow Diagram

```
User selects station from dropdown
    ↓
[Fetch Station Details] → GET /api/stations/{id}/
    ↓
[Fetch Parameters] → GET /api/stations/{id}/parameters/
    ↓
[Fetch Alerts] → GET /api/stations/{id}/alerts/
    ↓
[Fetch Predictive Alerts] → GET /api/stations/{id}/predictive-alerts/
    ↓
[Fetch Reports] → GET /api/stations/{id}/reports/
    ↓
Display all data in charts and cards

User clicks "New Report"
    ↓
[Submit Form] → POST /api/stations/{id}/reports/
    ↓
[Refresh Reports] → GET /api/stations/{id}/reports/
    ↓
Update reports list in UI
```

---

## 📦 Installation

```bash
cd c:\Users\damma\Downloads\water-quality-monitor\frontend
npm install axios
```

---

## 🧪 Testing API Calls

Before implementing in component, test endpoints:

```bash
# Test in PowerShell or use Postman/Insomnia

# Get all stations
curl http://localhost:8000/api/stations/

# Get specific station
curl http://localhost:8000/api/stations/ST001/

# Get parameters with date range
curl "http://localhost:8000/api/stations/ST001/parameters/?start_date=2024-01-01&end_date=2024-01-07"

# Create report
curl -X POST http://localhost:8000/api/stations/ST001/reports/ `
  -H "Content-Type: application/json" `
  -d '{"title":"Test","description":"Test report"}'
```

---

## ✅ Integration Checklist

- [ ] Axios installed: `npm install axios`
- [ ] API_BASE constant added to CollaborationsPage.js
- [ ] Stations fetched from API instead of mock
- [ ] Parameter data fetched when station selected
- [ ] Alert data fetched when station selected
- [ ] Predictive alerts fetched when station selected
- [ ] Reports fetched from API
- [ ] New report submission works (creates in backend)
- [ ] Report status update works (PATCH endpoint)
- [ ] Report deletion works (DELETE endpoint)
- [ ] Error handling implemented with try-catch
- [ ] Loading states show during API calls
- [ ] All charts update with real data
- [ ] Responsive design still works with real data

---

## 📝 Notes

1. **Date Format**: Backend expects ISO format (YYYY-MM-DD)
2. **Timezone**: Consider timezone differences for date ranges
3. **Pagination**: For large datasets, add pagination to reports list
4. **Caching**: Consider React Query or SWR for better data fetching
5. **Rate Limiting**: Implement debouncing for frequent updates

**Ready to integrate?** Start with Step 1 and work through sequentially!

