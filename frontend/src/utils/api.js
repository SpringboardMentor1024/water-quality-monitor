import axios from "axios";

/**
 * BASE URL CONFIGURATION
 * Uses Vite env; falls back to local FastAPI.
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
 * Automatically adds JWT token to Authorization header.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTHENTICATION MODULE ---

export const loginUser = async (email, password) => {
  // BACKEND TEAM: replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        access_token: "secure-jwt-authority-token-12345",
        user: { name: "Authority Admin", email },
      });
    }, 500);
  });
};

export const registerUser = async (userData) => {
  // BACKEND TEAM: replace with real API call
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ status: "success", message: "Account Created" }),
      500
    );
  });
};

export const getAllUsers = async () => {
  // BACKEND TEAM: replace with real API call
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            id: 1,
            name: "Admin",
            email: "admin@gov.in",
            role: "authority",
            created_at: new Date(),
          },
        ]),
      300
    );
  });
};

// --- MONITORING & TELEMETRY MODULE ---

/**
 * GET /stations
 * Retrieves all active water quality monitoring points.
 */
export const getStations = async () => {
  const res = await api.get("/stations/");
  return res.data;
};

/**
 * POST /stations
 * Add a new monitoring location.
 * (Currently mocked; backend can wire real endpoint.)
 */
export const addStation = async (stationData) => {
  // BACKEND TEAM: replace with real API call if needed
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ status: "success", data: stationData }),
      500
    );
  });
};

/**
 * GET /reports
 * Fetch dashboard reports.
 */
export const getReports = async () => {
  const res = await api.get("/reports");
  return res.data;
};

/**
 * GET /stations/:id/readings
 * Fetch readings for a station.
 */
export const getStationReadings = async (stationId) => {
  const res = await api.get(`/stations/${stationId}/readings`);
  return res.data;
};

export default api;
