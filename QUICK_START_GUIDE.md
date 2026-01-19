# ⚡ QUICK START GUIDE

**Time to get running**: 5 minutes

---

## 1️⃣ Start the Frontend

```bash
cd c:\Users\damma\Downloads\water-quality-monitor\frontend
npm start
```

You should see:
```
Compiled successfully!
Local: http://localhost:3000
```

---

## 2️⃣ Open Your Browser

Navigate to: `http://localhost:3000`

---

## 3️⃣ Find CollaborationsPage

Look for "NGO Collaborations" or similar link in your app sidebar.

---

## 4️⃣ Test the 4 Tabs

### Tab 1: Dashboard
- ✅ See projects list
- ✅ See activity log
- ✅ See station table

### Tab 2: Stations
- ✅ See interactive Leaflet map
- ✅ Click stations on map
- ✅ See marker popups

### Tab 3: Station Details ⭐ (YOUR WORK)
- ✅ Select a station from dropdown
- ✅ See 4 parameter cards
- ✅ Click "Report Management" sub-tab
  - See reports list
  - Click filter buttons
  - Click "New Report" to see form
- ✅ Click "Visualization & Trends" sub-tab
  - See 4 different charts
  - See predictive alerts cards
  - See summary statistics

### Tab 4: Reports
- ✅ See original reports tab (still works)

---

## 🧪 Quick Visual Checklist

- [ ] Page loads without errors
- [ ] 4 tabs visible at top
- [ ] Station Details tab has blue icon
- [ ] Can select station from dropdown
- [ ] 4 parameter cards display (pH, Temp, DO, Turbidity)
- [ ] Report filter buttons visible (All, Pending, Approved, Rejected)
- [ ] New Report button works (form appears/disappears)
- [ ] 4 charts display in Visualization tab
- [ ] Predictive Alerts cards show data
- [ ] Summary statistics show numbers

---

## 🔌 Next: Connect to Backend (Optional)

When ready to connect to real data:

1. Start backend:
```bash
cd c:\Users\damma\Downloads\water-quality-monitor\backend
python manage.py runserver
```

2. Follow: [BACKEND_API_INTEGRATION.md](BACKEND_API_INTEGRATION.md)

3. Replace mock data with API calls

---

## 📚 Documentation Files

- **INTEGRATION_SUMMARY.md** - Complete overview
- **VISUAL_STRUCTURE.md** - Visual layout guide
- **BACKEND_API_INTEGRATION.md** - API integration steps
- **TEST_INTEGRATION.md** - Detailed testing guide
- **FINAL_INTEGRATION_VERIFICATION.md** - Verification checklist

---

## ❓ Troubleshooting

### Port 3000 already in use?
```bash
# Windows PowerShell
lsof -i :3000  # Find process
kill -9 <PID>  # Kill process
# Or just use another port
npm start -- --port 3001
```

### Module not found errors?
```bash
cd frontend
npm install
npm start
```

### Blank page?
- Check browser console (F12)
- Look for error messages
- Ensure you're on correct URL (localhost:3000)
- Try hard refresh (Ctrl+Shift+R)

---

## 🎯 Key Features to Verify

| Feature | How to Test | Status |
|---------|-----------|--------|
| Station selector | Pick from dropdown | ✅ Works |
| Parameter cards | Select station, view cards | ✅ Works |
| Report filters | Click filter buttons | ✅ Works |
| New Report form | Click "New Report" button | ✅ Works |
| Charts | Switch to Viz & Trends tab | ✅ Works |
| Predictive alerts | Scroll down in Viz tab | ✅ Works |

---

## 📊 Expected Data

When you navigate to Station Details tab, you should see:

**Parameter Cards:**
- pH: 7.2 (Normal)
- Temperature: 24°C (Normal)
- Dissolved Oxygen: 7.7 mg/L (Normal)
- Turbidity: 2.0 NTU (Normal)

**Reports:**
- 10 sample reports with different statuses
- Can filter by: All, Pending, Approved, Rejected

**Charts:**
- 4 different chart types
- 7 days of sample data
- Multiple parameters displayed

**Predictive Alerts:**
- pH Rising (92% confidence)
- Bacteria Contamination (85% confidence)
- Temperature Increase (78% confidence)
- Turbidity Alert (71% confidence)

---

## 🚀 Success Criteria

✅ You're done when:
- [ ] Page loads without errors
- [ ] Can navigate all 4 tabs
- [ ] Station Details tab renders
- [ ] All 4 charts display
- [ ] Can filter reports
- [ ] Can create report form (shows/hides)
- [ ] Responsive on mobile (resize window)

---

## 📞 File Locations

```
Main Work:
c:\Users\damma\Downloads\water-quality-monitor\frontend\src\pages\CollaborationsPage.js

Documentation:
c:\Users\damma\Downloads\water-quality-monitor\
├─ INTEGRATION_SUMMARY.md
├─ VISUAL_STRUCTURE.md
├─ BACKEND_API_INTEGRATION.md
├─ TEST_INTEGRATION.md
├─ FINAL_INTEGRATION_VERIFICATION.md
└─ QUICK_START_GUIDE.md (this file)
```

---

## ⏱️ Timeline

| Activity | Time |
|----------|------|
| Start frontend | 1 min |
| Navigate to page | 1 min |
| Test all tabs | 2 min |
| Total | **5 minutes** |

---

## 🎉 You're Ready!

Your integrated Station Details & Visualization Charts are **live and functional**.

Next step: [Connect to Backend](BACKEND_API_INTEGRATION.md) (when ready)

**Enjoy!** 🚀

