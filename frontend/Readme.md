# WaterWatch: Authority Monitoring Dashboard

## 🚀 Overview

A professional React-based frontend designed for government authorities to monitor water quality telemetry in real-time. This system features geospatial mapping, analytical trend charts, and secure user management.

## 🛠 Backend Integration (Handoff Guide)

The frontend is **API-ready** and decoupled from the UI:

* **Central API Hub**: All endpoints are managed in `src/utils/api.js`. Replace mock data with real `axios` calls here.
* **Security**: A `ProtectedRoute` in `App.jsx` enforces authentication.
* **JWT Interceptor**: Axios automatically attaches the `authToken` from `localStorage` to every request header.
* **Environment Variables**: Set your API base URL in a `.env` file as `VITE_API_URL`.

## 📍 Key Features

* **Geospatial Inventory**: Interactive map of monitoring nodes with parameter popups.
* **Authority Analytics**: Deep-dive telemetry pages with trend charts for pH, DO, and Arsenic.
* **User Management**: Administrative interface to view registered monitoring agents.
* **Responsive Design**: Sidebar-driven navigation optimized for desktop and mobile field use.

## 📦 Setup

1. **Install**: `npm install`
2. **Env**: Create `.env` with `VITE_API_URL=http://your-api:8000`
3. **Run**: `npm run dev`

---