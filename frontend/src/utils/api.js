import axios from "axios";

/**
 * Global API Configuration
 * Standardized to connect with FastAPI Backend (Milestone 3 Sync)
 */
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH TOKEN INTERCEPTOR ================= */
/**
 * Automatically attaches the JWT token from localStorage to every request.
 * Uses 'authToken' key to match Login.jsx and App.js logic.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ==========================================
   1. AUTHENTICATION (auth.py)
   ========================================== */
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

/* ==========================================
   2. USERS (users.py)
   ========================================== */
/**
 * SYNC FIX: Updated prefix from /users/users/ to /users/
 */
export const getAllUsers = async () => {
  const res = await api.get("/users/");
  return res.data;
};

export const getUserProfile = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

/* ==========================================
   3. STATIONS (stations.py)
   ========================================== */
export const getStations = async () => {
  const res = await api.get("/stations/");
  return res.data;
};

export const getStationDetails = async (id) => {
  const res = await api.get(`/stations/${id}`);
  return res.data;
};

/**
 * Fetches time-series data for Recharts
 * Backend provides 'ph', 'turbidity', and 'do' keys.
 */
export const getStationSeries = async (id, points = 30) => {
  const res = await api.get(`/stations/${id}/series?points=${points}`);
  return res.data;
};

/* ==========================================
   4. ALERTS & NOTIFICATIONS (alerts.py)
   ========================================== */
/**
 * Fetches all alerts for the dashboard.
 * Backend sorts these by 'created_at' DESC.
 */
export const getAlerts = async () => {
  const res = await api.get("/alerts/");
  return res.data;
};

/**
 * Triggers AI Analysis for a specific station.
 */
export const triggerAIAnalysis = async (stationId) => {
  const res = await api.post(`/alerts/analyze/${stationId}`);
  return res.data;
};

export const createAlert = async (alertData) => {
  const res = await api.post("/alerts/", alertData);
  return res.data;
};

export const deleteAlert = async (alertId) => {
  await api.delete(`/alerts/${alertId}`);
};

/* ==========================================
   5. USER REPORTS (reports.py)
   ========================================== */
/**
 * SYNC FIX: Updated to match simple /reports endpoint.
 */
export const getAllReports = async () => {
  const res = await api.get("/reports");
  return res.data;
};

export const createReport = async (reportData) => {
  // Uses standard JSON as per your report_schema.py
  const res = await api.post("/reports", reportData);
  return res.data;
};

/* ==========================================
   6. EXTERNAL DATA (gov.py)
   ========================================== */
export const fetchGovWaterQuality = async (location) => {
  const res = await api.get(`/external/fetch-water-quality?location_value=${location}`);
  return res.data;
};

// Milestone 4 NGO Specific Endpoints
export const getNGOStationSeries = async (id, timeframe = 'hourly') => {
  return await api.get(`/stations/${id}/series?timeframe=${timeframe}`);
};

export const updateReportStatus = async (reportId, status, notes) => {
  return await api.patch(`/reports/${reportId}`, { status, moderation_notes: notes });
};

export default api;