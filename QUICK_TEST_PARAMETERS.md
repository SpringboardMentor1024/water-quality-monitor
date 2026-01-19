# QUICK TEST - STATION-SPECIFIC PARAMETERS

## ✅ FIXED: All Stations Now Show DIFFERENT Water Quality Values

---

## Run This Now

```bash
# Terminal 1: Backend
cd backend
python seed_collaborations.py    # Creates unique readings per station
python main.py                   # Start API server

# Terminal 2: Frontend
cd frontend
npm start                        # Start web app

# Browser
http://localhost:3000           # Should auto-open
```

---

## Test in Browser

Click **"STATION DETAILS"** tab and try each station:

| Station | Expected pH | Expected Temp | Expected DO | What to see |
|---------|------------|---|---|---|
| **Select Station 1** | 7.0-7.2 | 23-25°C | 6.4-6.6 | Standard values |
| **Select Station 2** | 6.8-7.0 | 22-24°C | 6.7-6.9 | **Lower pH, Lower Temp** |
| **Select Station 3** | 7.2-7.4 | 24-26°C | 6.0-6.4 | **Higher pH, Higher Temp** |
| **Select Station 4** | 6.9-7.1 | 21-23°C | 6.9-7.1 | **Lowest Temp, Best DO** |
| **Select Station 5** | 7.3-7.5 | 25-27°C | 5.7-5.9 | **Highest Temp & pH** |

Each station should show **DIFFERENT** parameter ranges in charts! ✅

---

## What Changed

### Frontend (Mock Data)
- Station 1 → pH base 7.1, generates values like: 7.05, 7.15, 7.10...
- Station 2 → pH base 6.9, generates values like: 6.85, 6.95, 6.90...
- Station 3 → pH base 7.3, generates values like: 7.25, 7.35, 7.30...

### Backend (Real Data)
- **140 readings created** (28 per station × 5 stations)
- Each station has unique base pH, Temperature, DO, Turbidity
- 7 days of realistic daily variations

---

## Expected Output After Seed

```
✨ Demo data seeding complete!
  📍 4 NGOs created
  📊 4 Projects created
  🤝 4 Collaborations created
  📌 5 Station assignments created
  📈 140 Station readings created  ← NEW! 140 unique readings
  🔮 5 Predictions created
```

---

## Verify In DevTools

1. Press **F12** in browser
2. Go to **Network** tab
3. Select a station
4. Look for `/api/stations/1/readings` request
5. Click it → Preview tab
6. You'll see 28 readings with **station-specific values**

Example response:
```json
[
  {
    "id": 1,
    "station_id": 1,
    "parameter_name": "pH",
    "value": 7.08,
    "recorded_at": "2026-01-12"
  },
  {
    "id": 2,
    "station_id": 1,
    "parameter_name": "Temperature",
    "value": 24.1,
    "recorded_at": "2026-01-12"
  },
  ...
]
```

---

## Troubleshooting

**Issue**: All stations still showing same values
- Run: `python seed_collaborations.py` in backend folder
- Verify output shows: `📈 140 Station readings created`

**Issue**: Charts showing no data
- Check DevTools Network tab for `/api/stations/*/readings` request
- Should return 200 OK with 28 readings

**Issue**: Want to reset and test again
```bash
cd backend
rm water_quality_monitor.db       # Delete old database
python seed_collaborations.py     # Create fresh data
```

---

## Success Criteria

✅ Station 1 and Station 2 show DIFFERENT pH values
✅ Station 3 shows HIGHER temperature than Station 2
✅ Station 4 shows DIFFERENT DO values than Station 5
✅ All 4 parameters differ between stations
✅ Charts display smooth 7-day trends

All checkboxes ✅ = **System working perfectly!**
