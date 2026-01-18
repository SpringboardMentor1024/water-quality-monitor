// src/pages/services/api.js
// frontend/app/src/services/api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized — not redirecting during development");
      // ❌ DO NOT redirect automatically during dev
    }
    return Promise.reject(error);
  }
);


// -----------------------------
// Water Stations
// -----------------------------
export const fetchStations = async () => {
  return api.get("/stations");
};

// -----------------------------
// WHO Water API
// -----------------------------
export async function getWhoWaterData(indicator, country, limit) {
  const url = new URL(`${BASE_URL}/who/water`);

  url.searchParams.append("indicator", indicator);
  if (country) url.searchParams.append("country", country);
  if (limit) url.searchParams.append("limit", limit);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch WHO water data");
  return await response.json();
}

// -----------------------------
// Station Readings (single)
// -----------------------------
export const fetchStationReadings = async (stationId) => {
  return api.get(`/readings/${stationId}`);
};

// -----------------------------
// Station Readings (BATCH) ✅ NEW
// -----------------------------
export const fetchBatchReadings = async (stationIds) => {
  return api.post("/readings/batch", stationIds);
};

// -----------------------------
// CPCB API
// -----------------------------
export const fetchCpcbReadings = async () => {
  try {
    const res = await api.get("/cpcb/readings");
    return res.data;
  } catch (error) {
    console.error("CPCB fetch error:", error);
    return [];
  }
};

// -----------------------------
// WQP API
// -----------------------------
export const fetchWqpResults = async (state, page = 1, page_size = 20) => {
  try {
    const res = await api.get("/wqp/results", {
      params: { state, page, page_size },
    });
    return res.data;
  } catch (error) {
    console.error("WQP results fetch error:", error);
    return { records: [] };
  }
};

export const fetchNearbyStations = async (lat, lon, radius = 10, limit = 20) => {
  try {
    const res = await api.get("/wqp/nearby", {
      params: { lat, lon, radius, limit },
    });
    return res.data;
  } catch (error) {
    console.error("Nearby stations fetch error:", error);
    return [];
  }
};

// -----------------------------
// Auth Helper
// -----------------------------
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Export the axios instance
export default api;