import axios from "axios";

/**
 * Global API Configuration
 */
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH TOKEN INTERCEPTOR ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ==========================================
   1. AUTHENTICATION
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
   2. USERS
   ========================================== */
export const getAllUsers = async () => {
  const res = await api.get("/users/");
  return res.data;
};

export const getUserProfile = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

/* ==========================================
   3. STATIONS & TELEMETRY
   ========================================== */
export const getStations = async () => {
  const res = await api.get("/stations/");
  return res.data;
};

export const getStationDetails = async (id) => {
  const res = await api.get(`/stations/${id}`);
  return res.data;
};

// Standard Telemetry (Last 30 points)
export const getStationSeries = async (id, points = 30) => {
  const res = await api.get(`/stations/${id}/series?points=${points}`);
  return res.data;
};

// NGO Specific Telemetry (Timeframe based)
export const getNGOStationSeries = async (id, timeframe = 'hourly') => {
  const res = await api.get(`/stations/${id}/series?timeframe=${timeframe}`);
  return res.data;
};

/* ==========================================
   4. ALERTS & AI ANALYSIS
   ========================================== */
// Get all alerts with optional filtering (Merged team version)
export const getAlerts = async (limit = 50, location = null) => {
  let url = `/alerts/?limit=${limit}`;
  if (location) url += `&location=${location}`;
  const res = await api.get(url);
  return res.data;
};

// Trigger AI Analysis (Used by Analytics and Prediction Details)
export const triggerAIAnalysis = async (stationId) => {
  const res = await api.post(`/alerts/analyze/${stationId}`);
  return res.data;
};

// Alias for triggerAIAnalysis (to support team's alternate naming)
export const analyzeStationAlerts = triggerAIAnalysis;

export const createAlert = async (alertData) => {
  const res = await api.post("/alerts/", alertData);
  return res.data;
};

export const deleteAlert = async (alertId) => {
  await api.delete(`/alerts/${alertId}`);
};

/* ==========================================
   5. USER REPORTS & MODERATION
   ========================================== */
export const getAllReports = async () => {
  const res = await api.get("/reports");
  return res.data;
};

export const getMyReports = async () => {
  const res = await api.get("/reports/my-reports/");
  return res.data;
};

export const createReport = async (reportData) => {
  const res = await api.post("/reports", reportData);
  return res.data;
};

// Milestone 4: NGO Status Moderation
export const updateReportStatus = async (reportId, status, notes) => {
  return await api.patch(`/reports/${reportId}`, { 
    status, 
    moderation_notes: notes 
  });
};

/* ==========================================
   6. EXTERNAL DATA
   ========================================== */
export const fetchGovWaterQuality = async (location) => {
  const res = await api.get(`/external/fetch-water-quality?location_value=${location}`);
  return res.data;
};

export default api;