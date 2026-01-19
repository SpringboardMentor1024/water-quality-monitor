# 🧪 COMPREHENSIVE TEST CASES

**Status:** Ready to Execute  
**Estimated Time:** 30 minutes  
**Prerequisites:** Backend running on port 8000, Frontend on port 3000

---

## TEST SUITE 1: MILESTONE 1 - AUTHENTICATION

### TC-1.1: User Registration ✅

**Steps:**
1. Navigate to http://localhost:3000
2. Click "Register" button
3. Fill form:
   - Email: `testuser123@example.com`
   - Username: `testuser123`
   - Password: `Password123!`
   - Confirm: `Password123!`
4. Click "Register"

**Expected Results:**
- ✅ User created in database
- ✅ Redirected to dashboard
- ✅ User logged in automatically
- ✅ Profile shows correct username

**API Calls:** `POST /api/auth/register`

---

### TC-1.2: User Login ✅

**Steps:**
1. If logged in, logout first
2. Go to Login page
3. Enter credentials:
   - Email: `testuser123@example.com`
   - Password: `Password123!`
4. Click "Login"

**Expected Results:**
- ✅ Credentials validated
- ✅ JWT token received
- ✅ Redirected to dashboard
- ✅ User menu shows correct username

**API Calls:** `POST /api/auth/login`

---

### TC-1.3: View User Profile ✅

**Steps:**
1. Click user menu (top right)
2. Click "Profile"
3. Verify information

**Expected Results:**
- ✅ Shows correct username
- ✅ Shows email address
- ✅ Shows registration date
- ✅ Profile data matches database

**API Calls:** `GET /api/auth/me`

---

## TEST SUITE 2: MILESTONE 1 - DASHBOARD

### TC-2.1: Dashboard Loads Real Data ✅

**Steps:**
1. Login successfully
2. Wait for dashboard to load
3. Observe the page

**Expected Results:**
- ✅ Map shows water stations (not empty)
- ✅ Metrics cards show real numbers
- ✅ Station list populated with real data
- ✅ Charts show real data
- ✅ No hardcoded test values

**API Calls:**
- `GET /api/stations`
- `GET /api/alerts`
- User data from `/api/auth/me`

---

### TC-2.2: Dashboard Refresh Button ✅

**Steps:**
1. On dashboard, click "Refresh Data" button
2. Wait for data to reload
3. Check if data updates

**Expected Results:**
- ✅ "Data refreshed successfully" message appears
- ✅ No errors in console
- ✅ Data updates from API

**API Calls:** `GET /api/stations`, `GET /api/alerts`

---

## TEST SUITE 3: MILESTONE 1 - STATIONS & BASEMAP

### TC-3.1: View All Stations on Map ✅

**Steps:**
1. Click "Stations" in menu
2. Observe the interactive map
3. Zoom in/out
4. Click on a station marker

**Expected Results:**
- ✅ Map displays all stations from database
- ✅ Stations show correct location
- ✅ Station details appear on click
- ✅ Shows real station names (not hardcoded)

**API Calls:** `GET /api/stations`

**Data Verification:**
- [ ] Station count matches database
- [ ] Coordinates are correct
- [ ] Status values are accurate

---

### TC-3.2: Filter Stations by Status ✅

**Steps:**
1. Go to Stations page
2. Select status filter: "Active"
3. Wait for list to update
4. Repeat with other statuses

**Expected Results:**
- ✅ List filters correctly
- ✅ Only selected status shown
- ✅ Count decreases appropriately
- ✅ Real data filtering (not mock)

**API Calls:** `GET /api/stations`

---

## TEST SUITE 4: MILESTONE 1 - SEARCH

### TC-4.1: Search Stations by Name ✅

**Steps:**
1. Go to "Search" page
2. Type station name: "Mumbai" (or actual station name)
3. Press Enter or click Search
4. Observe results

**Expected Results:**
- ✅ Real stations matching search returned
- ✅ Results include correct details
- ✅ No hardcoded mock results
- ✅ Search is case-insensitive

**API Calls:** `GET /api/stations`

**Data Verification:**
- [ ] Results match database
- [ ] Partial matches work
- [ ] Empty search shows all

---

### TC-4.2: Filter by Location ✅

**Steps:**
1. On Search page
2. Use location filter dropdown
3. Select a region
4. View results

**Expected Results:**
- ✅ Filters by actual region from database
- ✅ Shows real stations in that region
- ✅ No hardcoded location values

**API Calls:** `GET /api/stations`

---

## TEST SUITE 5: MILESTONE 1 - STATION READINGS

### TC-5.1: View Station Readings Chart ✅

**Steps:**
1. Go to any station page
2. Click "View Readings" or similar
3. Wait for chart to load
4. Observe data

**Expected Results:**
- ✅ Chart displays real readings from database
- ✅ X-axis shows dates
- ✅ Y-axis shows values
- ✅ Multiple parameters visible (pH, Temperature, etc.)
- ✅ Data matches database records

**API Calls:** `GET /api/stations/{id}/readings`

**Sample Data:**
```json
{
  "id": 1,
  "parameter": "pH",
  "value": 7.2,
  "recorded_at": "2026-01-17T10:30:00Z"
}
```

---

### TC-5.2: Filter by Parameter ✅

**Steps:**
1. On Station Readings page
2. Select parameter filter: "pH"
3. Chart updates
4. Repeat with other parameters

**Expected Results:**
- ✅ Chart shows only selected parameter
- ✅ Data from API, not hardcoded
- ✅ All parameters available

**Parameters to test:**
- [ ] pH
- [ ] Temperature
- [ ] Dissolved Oxygen
- [ ] Turbidity
- [ ] Bacteria Count

---

### TC-5.3: Filter by Date Range ✅

**Steps:**
1. Use date range selector
2. Choose date range (last 7 days)
3. Chart updates
4. Try different ranges

**Expected Results:**
- ✅ Chart shows only readings in date range
- ✅ Dates are accurate
- ✅ Data from API

---

## TEST SUITE 6: MILESTONE 1 - ALERTS

### TC-6.1: View All Alerts ✅

**Steps:**
1. Go to "Alerts" page
2. Wait for list to load
3. Observe data

**Expected Results:**
- ✅ List shows all alerts from database
- ✅ Includes alert details:
  - Alert type
  - Station
  - Severity level
  - Timestamp
- ✅ Real data, not hardcoded

**API Calls:** `GET /api/alerts`

**Data Verification:**
- [ ] Alert count matches database
- [ ] All fields populated correctly
- [ ] Timestamps are accurate

---

### TC-6.2: Filter Alerts by Severity ✅

**Steps:**
1. On Alerts page
2. Use severity filter
3. Select "Critical"
4. List updates

**Expected Results:**
- ✅ Shows only critical alerts
- ✅ Real filtering from database
- ✅ Severity colors correct

**Severity Levels:**
- [ ] Low
- [ ] Medium
- [ ] High
- [ ] Critical

---

### TC-6.3: View Alert Details ✅

**Steps:**
1. Click on an alert
2. View details page
3. Check all information

**Expected Results:**
- ✅ Shows full alert details
- ✅ Location on map
- ✅ Historical data
- ✅ Related readings

**API Calls:** `GET /api/alerts/{id}`

---

### TC-6.4: View Alert History ✅

**Steps:**
1. Go to "Alert History" page
2. Select time period
3. View historical data

**Expected Results:**
- ✅ Shows past alerts
- ✅ Real historical data from database
- ✅ Timeline visualization correct

**API Calls:** `GET /api/alerts/historical`

---

## TEST SUITE 7: MILESTONE 1 - REPORTS

### TC-7.1: Create New Report ✅

**Steps:**
1. Go to "Reports" → "New Report"
2. Fill form:
   - Title: "Water Quality Check"
   - Description: "Monthly assessment"
   - Station: Select from dropdown
   - Status: "Submitted"
3. Click "Create"

**Expected Results:**
- ✅ Report created in database
- ✅ Confirmation message shown
- ✅ Added to report list
- ✅ Timestamp recorded

**API Calls:** `POST /api/reports`

**Database Verification:**
- [ ] Report exists in reports table
- [ ] User ID correctly recorded
- [ ] Station ID correctly linked
- [ ] Timestamp accurate

---

### TC-7.2: View All Reports ✅

**Steps:**
1. Go to "Reports" page
2. Wait for list to load
3. View all reports

**Expected Results:**
- ✅ List shows all reports from database
- ✅ Shows user's own reports
- ✅ Real data, not mock

**API Calls:** `GET /api/reports`

---

### TC-7.3: View Report Details ✅

**Steps:**
1. Click on a report
2. View full details

**Expected Results:**
- ✅ Shows complete report data
- ✅ Includes station info
- ✅ Shows submission date
- ✅ Real data from database

**API Calls:** `GET /api/reports/{id}`

---

### TC-7.4: Update Report ✅

**Steps:**
1. Open a report
2. Click "Edit"
3. Change description
4. Save changes

**Expected Results:**
- ✅ Report updated in database
- ✅ Changes saved
- ✅ Confirmation shown

**API Calls:** `PUT /api/reports/{id}`

---

### TC-7.5: Delete Report ✅

**Steps:**
1. Go to Reports list
2. Click delete on a report
3. Confirm deletion

**Expected Results:**
- ✅ Report removed from database
- ✅ No longer in list
- ✅ Confirmation shown

**API Calls:** `DELETE /api/reports/{id}`

---

## TEST SUITE 8: MILESTONE 2 - NGO DASHBOARD

### TC-8.1: View NGO Dashboard ✅

**Steps:**
1. Go to "NGO Dashboard"
2. Wait for page to load
3. Observe data

**Expected Results:**
- ✅ Station list shows real stations
- ✅ All data from API
- ✅ Real metrics displayed
- ✅ No hardcoded values

**API Calls:** `GET /api/stations`

---

### TC-8.2: Select Station and View Data ✅

**Steps:**
1. On NGO Dashboard
2. Select a station from dropdown
3. View tabs: Reports, Trends, Metrics

**Expected Results:**
- ✅ Correct station data loads
- ✅ Reports list shows real data
- ✅ Charts update
- ✅ All data from API

**API Calls:**
- `GET /api/stations`
- `GET /api/reports?station_id={id}`

---

## TEST SUITE 9: MILESTONE 2 - COLLABORATIONS (THE BIG TEST!)

### TC-9.1: CollaborationsPage Loads Real Data ✅

**Steps:**
1. Go to "Collaborations" page
2. Wait for page to load
3. **LOOK AT PARAMETER CARDS**

**Expected Results:**
- ✅ Parameter cards visible
- ✅ Shows: pH, Temperature, DO, Turbidity
- ✅ **VALUES ARE NOT HARDCODED:**
  - Not always 7.2 for pH
  - Not always 24°C for temperature
  - Not always 7.7 for DO
  - Not always 2.0 for turbidity
- ✅ Values change based on selected station

**API Calls:** Page loads

---

### TC-9.2: Change Selected Station - Parameters Update ✅

**Steps:**
1. On Collaborations page
2. Use "Select a Station" dropdown
3. Select different station
4. **WATCH PARAMETER CARDS**

**Expected Results:**
- ✅ Parameter cards update instantly
- ✅ Shows values for NEW station
- ✅ Not hardcoded (changes with selection)
- ✅ Shows real latest readings

**Example:**
- Station A: pH=7.2, Temp=24°C
- Station B: pH=7.5, Temp=26°C
- Cards update correctly when switching

**API Calls:** `GET /api/stations/{id}/readings`

---

### TC-9.3: Projects List Shows Real Data ✅

**Steps:**
1. On Collaborations page
2. Look at Projects section
3. See project list

**Expected Results:**
- ✅ Shows real projects from database
- ✅ Not hardcoded mock projects
- ✅ Correct project details
- ✅ Project count accurate

**API Calls:** `GET /api/projects`

---

### TC-9.4: View Project Reports ✅

**Steps:**
1. On Collaborations page
2. Click on a project
3. View reports for that project

**Expected Results:**
- ✅ Shows real reports from API
- ✅ Filtered by project
- ✅ Full report details
- ✅ CRUD operations work

**API Calls:** `GET /api/reports?project_id={id}`

---

## TEST SUITE 10: MILESTONE 2 - PREDICTIONS

### TC-10.1: View Predictive Alerts ✅

**Steps:**
1. Go to "Alerts" page
2. Look for predictive alerts section
3. View predictions

**Expected Results:**
- ✅ Shows predictions from API
- ✅ Includes forecast data
- ✅ Severity indicators
- ✅ Real predictions, not mock

**API Calls:** `GET /api/predictions`

---

### TC-10.2: Filter Predictions by Station ✅

**Steps:**
1. Select a station
2. View predictions for that station
3. Try different stations

**Expected Results:**
- ✅ Shows correct predictions
- ✅ Filtered by station
- ✅ Real data from API

**API Calls:** `GET /api/predictions?station_id={id}`

---

## TEST SUITE 11: DATA INTEGRITY VERIFICATION

### TC-11.1: Verify No Hardcoded Values ✅

**Steps:**
1. Open browser DevTools (F12)
2. Go to each page
3. Search for hardcoded values:
   - "7.2", "24", "7.7", "2.0"
   - "Mock", "Hardcoded"
   - "Test Data"
4. Check HTML/JSON responses

**Expected Results:**
- ✅ No hardcoded parameter values
- ✅ No mock data labels
- ✅ No test data visible
- ✅ All values from API

---

### TC-11.2: Verify API Responses ✅

**Steps:**
1. Open DevTools → Network tab
2. Refresh page
3. Watch API calls
4. Click on each request
5. View Response tab

**Expected Results:**
- ✅ All responses have real data
- ✅ No empty arrays (unless intended)
- ✅ Correct JSON structure
- ✅ Valid timestamps

---

### TC-11.3: Verify Database Persistence ✅

**Steps:**
1. Create new report (or other entity)
2. Restart backend
3. Refresh frontend
4. Check if data still exists

**Expected Results:**
- ✅ Data persists in database
- ✅ Survives restart
- ✅ No loss of data
- ✅ Timestamps accurate

---

## TEST SUITE 12: ERROR HANDLING

### TC-12.1: Backend Offline ✅

**Steps:**
1. Stop backend (Ctrl+C)
2. Try to load a page
3. Observe error handling

**Expected Results:**
- ✅ Graceful error message
- ✅ May fall back to mock data
- ✅ No crash
- ✅ User can still navigate

---

### TC-12.2: Invalid Credentials ✅

**Steps:**
1. Try to login with wrong password
2. Observe result

**Expected Results:**
- ✅ Clear error message
- ✅ Stays on login page
- ✅ Can try again
- ✅ No partial login

---

### TC-12.3: Missing Required Fields ✅

**Steps:**
1. Try to create report without title
2. Try to create without station
3. Submit form

**Expected Results:**
- ✅ Validation error shown
- ✅ Specific field highlighted
- ✅ Form not submitted
- ✅ Data not sent to API

---

## 📊 TEST RESULT SUMMARY TEMPLATE

```
TEST SUITE RESULTS
==================

Date: [DATE]
Tester: [NAME]
Environment: Backend: http://localhost:8000, Frontend: http://localhost:3000

MILESTONE 1 TESTS:
- TC-1.1 (Registration): [ ] PASS [ ] FAIL [ ] SKIP
- TC-1.2 (Login): [ ] PASS [ ] FAIL [ ] SKIP
- TC-2.1 (Dashboard): [ ] PASS [ ] FAIL [ ] SKIP
- TC-3.1 (Stations Map): [ ] PASS [ ] FAIL [ ] SKIP
- TC-4.1 (Search): [ ] PASS [ ] FAIL [ ] SKIP
- TC-5.1 (Readings): [ ] PASS [ ] FAIL [ ] SKIP
- TC-6.1 (Alerts): [ ] PASS [ ] FAIL [ ] SKIP
- TC-7.1 (Reports): [ ] PASS [ ] FAIL [ ] SKIP

MILESTONE 2 TESTS:
- TC-8.1 (NGO Dashboard): [ ] PASS [ ] FAIL [ ] SKIP
- TC-9.2 (Collaborations - CRITICAL!): [ ] PASS [ ] FAIL [ ] SKIP
- TC-10.1 (Predictions): [ ] PASS [ ] FAIL [ ] SKIP

DATA INTEGRITY:
- TC-11.1 (No Hardcoded): [ ] PASS [ ] FAIL [ ] SKIP
- TC-11.2 (API Responses): [ ] PASS [ ] FAIL [ ] SKIP
- TC-11.3 (Database Persistence): [ ] PASS [ ] FAIL [ ] SKIP

ERROR HANDLING:
- TC-12.1 (Backend Offline): [ ] PASS [ ] FAIL [ ] SKIP
- TC-12.2 (Invalid Login): [ ] PASS [ ] FAIL [ ] SKIP

TOTAL PASS: ___/30
TOTAL FAIL: ___/30
TOTAL SKIP: ___/30

CRITICAL ISSUES FOUND:
[List any issues]

NOTES:
[Additional observations]

STATUS: [ ] READY FOR PROD [ ] NEEDS FIXES [ ] MORE TESTING
```

---

## ✅ SUCCESS CRITERIA

**All tests pass if:**
1. ✅ No hardcoded values visible
2. ✅ All data from API
3. ✅ CRUD operations work
4. ✅ Database persistence verified
5. ✅ Error handling works
6. ✅ Parameter cards show real readings
7. ✅ No mock data labels

**Ready for deployment if:** ALL criteria met

---

**Test Suite Complete!**

Expected execution time: 30-45 minutes for full suite  
Estimated defect rate: 0-5% (minor issues only)

