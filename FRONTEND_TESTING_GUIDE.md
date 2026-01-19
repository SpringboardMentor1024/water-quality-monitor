# Frontend Component Integration Test Guide

## Quick Start Testing

### 1. **NGO Dashboard Testing**
```javascript
// URL: http://localhost:3000/ngo-dashboard

Expected Behavior:
✓ Page loads with "NGO Dashboard" title
✓ Multiple station cards displayed
✓ Can click on station card to select
✓ Two tabs visible: "Report Management" & "Visualization & Trends"
✓ No JavaScript errors in console
```

### 2. **Report Management Testing**

**Create Report:**
```javascript
Steps:
1. Click "New Report" button
2. Fill in form:
   - Location: "Test Location"
   - Water Source: Select from dropdown
   - Description: "Test water quality report"
   - Photo URL: (optional) https://example.com/photo.jpg
3. Click "Create Report"
4. Verify success message appears
5. Report appears in list below

Expected: Report created with "pending" status (yellow badge)
```

**View Report Details:**
```javascript
Steps:
1. Click eye icon on any report
2. Report expands to show full details
3. All fields visible in expandable section

Expected: Detailed information displays correctly
```

**Update Report Status:**
```javascript
Steps:
1. Click green checkmark (✓) to verify
2. Verify success notification
3. Report status changes to "verified" (green)

Or:
1. Click red X to reject
2. Report status changes to "rejected" (red)

Expected: Status updates immediately in list
```

**Edit Report:**
```javascript
Steps:
1. Click pencil icon on pending/rejected report
2. Form opens with existing data
3. Modify fields
4. Click "Update Report"
5. Verify report updated in list

Expected: Changes saved and displayed
```

**Delete Report:**
```javascript
Steps:
1. Click trash icon
2. Confirm deletion in popup
3. Report removed from list

Expected: Report deleted from list
```

---

### 3. **Visualization Charts Testing**

**Basic Chart Rendering:**
```javascript
Steps:
1. Click "Visualization & Trends" tab
2. Wait for charts to load
3. Observe line chart, area chart, bar chart

Expected:
✓ All three charts visible
✓ Charts have axes labels
✓ Charts are responsive (resize window to test)
✓ Charts have legend
```

**Metric Selection:**
```javascript
Steps:
1. Click metric buttons: "All Parameters", "pH", "Temperature", "DO", etc.
2. Observe chart updates

Expected: Only selected parameter lines show/hide appropriately
```

**Time Range Selection:**
```javascript
Steps:
1. Click "Daily", "Weekly", or "Monthly" buttons
2. Charts update with different data

Expected: X-axis labels change appropriately
```

**Predictive Alerts:**
```javascript
Steps:
1. Scroll down to "Predictive Alerts Details" section
2. View alert cards with:
   - Parameter name
   - Predicted value
   - Threshold
   - Confidence percentage
   - Description

Expected: Predictive alerts display correctly
```

---

### 4. **Water Station Details Page Testing**

**Access Station Details:**
```javascript
URL: http://localhost:3000/station/1

Expected:
✓ Station name and location in header
✓ Real-time indicator (green/gray dot)
✓ Pause/Resume button works
✓ Last updated timestamp
✓ Parameter cards (pH, Temperature, DO, Turbidity)
```

**Tab Navigation:**
```javascript
Steps:
1. Click "Overview" tab - Shows station metadata
2. Click "Reports" tab - Shows report management
3. Click "Trends" tab - Shows visualization charts

Expected: Content changes smoothly, all data loads
```

---

### 5. **Error Handling Testing**

**API Unavailable:**
```javascript
Steps:
1. Stop backend server
2. Refresh dashboard
3. Observe error message

Expected:
✓ User-friendly error displayed
✓ "Displaying sample data" message shown
✓ Mock data populated
✓ "Try again" button available
```

**Network Error:**
```javascript
Steps:
1. Open DevTools > Network tab
2. Offline mode ON
3. Navigate to NGO Dashboard

Expected:
✓ Error handling triggered
✓ Mock data loads
✓ All functionality works with mock data
```

---

### 6. **Responsive Design Testing**

**Mobile View (375px):**
```javascript
Steps:
1. Open DevTools
2. Select iPhone SE preset
3. Navigate through all pages

Expected:
✓ Text readable without horizontal scroll
✓ Buttons clickable (touch targets 48px+)
✓ Charts stack vertically
✓ Forms single column
```

**Tablet View (768px):**
```javascript
Steps:
1. Resize to 768px width
2. Check layout

Expected:
✓ 2-column layout for cards
✓ Charts side-by-side where possible
✓ All content accessible
```

**Desktop View (1200px+):**
```javascript
Steps:
1. Resize to 1200px+ width

Expected:
✓ Multi-column layouts
✓ Full-width charts
✓ All features visible
```

---

### 7. **Browser Compatibility Testing**

Test on:
- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Edge 90+

Expected: No console errors, all features work

---

## Mock Data Available

When backend is unavailable, the app generates:

**Stations:**
```javascript
[
  { id: 1, name: 'Riverbend Station', location: 'River Area' },
  { id: 2, name: 'Lakeview Point', location: 'Lake Shore' },
  { id: 3, name: 'Ganges Monitoring', location: 'Ganges Basin' },
  { id: 4, name: 'Coastal Watch', location: 'Coastal Area' },
  { id: 5, name: 'Mountain Spring', location: 'Mountain Region' }
]
```

**Parameters (7-day history):**
```javascript
pH: 6.5 - 8.0
Temperature: 22 - 27°C
DO: 7 - 9 mg/L
Bacteria: 50 - 250 CFU/100ml
Turbidity: 2 - 5 NTU
```

**Predictive Alerts (Sample):**
```javascript
[
  {
    parameter: 'pH',
    predicted_value: 5.8,
    threshold: 6.0,
    confidence: 0.85
  },
  {
    parameter: 'Bacteria',
    predicted_value: 450,
    threshold: 300,
    confidence: 0.72
  }
]
```

---

## Component File Structure

```
frontend/src/
├── pages/
│   ├── NGODashboard.js ........................ Main NGO Dashboard
│   ├── StationDetailsPage.js .................. Station Details View
│   └── ...
├── components/
│   └── station/
│       ├── ReportManagement.js ............... Report CRUD Component
│       └── VisualizationCharts.js ............ Charts & Trends Component
└── ...
```

---

## Key Files Modified/Created

1. ✅ `NGODashboard.js` - Enhanced with station fetching and better UX
2. ✅ `StationDetailsPage.js` - Already well-structured
3. ✅ `ReportManagement.js` - Full CRUD operations implemented
4. ✅ `VisualizationCharts.js` - Enhanced with predictive alerts
5. ✅ `FRONTEND_DELIVERY_GUIDE.md` - Complete documentation

---

## Success Criteria

All of the following should be true:

- [ ] NGO Dashboard loads and displays stations
- [ ] Report creation form works end-to-end
- [ ] Reports can be verified/rejected
- [ ] Charts render correctly
- [ ] Predictive alerts display
- [ ] All pages responsive on mobile
- [ ] Error states handled gracefully
- [ ] No console errors when using mock data
- [ ] Navigation between components smooth
- [ ] Data persists after refresh (API data only)

---

## Common Issues & Solutions

### Issue: Charts not rendering
**Solution**: Check browser console for errors, verify Recharts library is installed

### Issue: Reports not loading
**Solution**: Verify backend API is running on http://localhost:8000, check CORS settings

### Issue: Styles look wrong
**Solution**: Verify Tailwind CSS is properly configured, check for CSS conflicts

### Issue: Mobile layout broken
**Solution**: Test with `npm run build`, not development mode. Check viewport meta tag

---

## Next Steps

1. Integrate with backend APIs (implement if not done)
2. Set up authentication properly
3. Add user profile/NGO assignment logic
4. Implement advanced map visualization
5. Set up predictive model training
6. Configure automated alert notifications

---

**Test Date**: January 17, 2026  
**Status**: Ready for Testing
