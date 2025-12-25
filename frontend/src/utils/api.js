import axios from "axios";

/** * BASE URL CONFIGURATION
 * This uses a Vite environment variable. The backend team will set this in a .env file.
 * If no .env is found, it defaults to the local development server.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * SECURITY GATEKEEPER (INTERCEPTOR)
 * This logic automatically grabs the JWT token from localStorage and adds it to 
 * the 'Authorization' header of every outgoing request.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTHENTICATION MODULE ---

/**
 * POST /auth/login
 * Standard login request that returns a JWT token and user details.
 */
export const loginUser = async (email, password) => {
  // BACKEND TEAM: Replace the mock promise with: return api.post("/auth/login", { email, password });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        access_token: "secure-jwt-authority-token-12345", 
        user: { name: "Authority Admin", email: email } 
      });
    }, 500);
  });
};

/**
 * POST /auth/register
 * Sends new user details to the server for account creation.
 */
export const registerUser = async (userData) => {
  // BACKEND TEAM: Replace with: return api.post("/auth/register", userData);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: "success", message: "Account Created" }), 500);
  });
};

/**
 * GET /auth/users
 * Fetches a list of all monitoring agents (Authority Access only).
 */
export const getAllUsers = async () => {
  // BACKEND TEAM: Replace with: return api.get("/auth/users");
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { id: 1, name: "Admin", email: "admin@gov.in", role: "authority", created_at: new Date() }
    ]), 300);
  });
};

// --- MONITORING & TELEMETRY MODULE ---

/**
 * GET /api/stations
 * Retrieves all active water quality monitoring points for the map and dashboard.
 */
export const getStations = async () => {
  // BACKEND TEAM: Replace with: return api.get("/api/stations");
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { id: "STN-4829", name: "Riverbend Point A", location: "Sanath Nagar", latitude: 17.4523, longitude: 78.4412, managed_by: "TSPCB" },
      { id: "STN-4830", name: "Riverbend Point B", location: "Errum Manzil", latitude: 17.4200, longitude: 78.4500, managed_by: "KRMB" }
    ]), 300);
  });
};

/**
 * POST /api/stations
 * Allows an authorized user to add a new monitoring location to the geospatial inventory.
 */
export const addStation = async (stationData) => {
  // BACKEND TEAM: Replace with: return api.post("/api/stations", stationData);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: "success", data: stationData }), 500);
  });
};

/**
 * GET /api/stations/:id/readings
 * Fetches real-time sensor data (pH, DO, Temp) and historical trends for a specific node.
 */
export const getStationReadings = async (id, timeframe) => {
  // BACKEND TEAM: Replace with: return api.get(`/api/stations/${id}/readings?period=${timeframe}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      id, 
      name: "River Station Alpha", 
      ph: "7.2", 
      do: "8.1", 
      temp: "22.5", 
      status: "NORMAL",
      charts: { 
        ph: [40, 55, 90, 65, 80, 45], 
        do: [70, 80, 75, 85, 90, 80], 
        arsenic: [10, 15, 12, 18, 14, 16] 
      }
    }), 300);
  });
};

export default api;