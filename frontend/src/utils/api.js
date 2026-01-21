import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH TOKEN INTERCEPTOR ================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= AUTH ================= */

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

/* ================= USERS ================= */

export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

/* ================= STATIONS ================= */

export const getStations = async () => {
  const res = await api.get("/stations");
  return res.data;
};

export const getStationDetails = async (id) => {
  const res = await api.get(`/stations/${id}`);
  return res.data;
};

export const getStationSeries = async (id) => {
  const res = await api.get(`/stations/${id}/series`);
  return res.data;
};

/* ================= ALERT ANALYSIS ================= */

export const analyzeStationAlerts = async (stationId) => {
  try {
    const res = await api.get(`/alerts/analyze/${stationId}`);
    return res.data;
  } catch {
    // Demo-safe fallback
    return {
      station_id: stationId,
      risk_level: "moderate",
      alerts: [
        { type: "pH", status: "normal", value: 7.2 },
        { type: "Turbidity", status: "warning", value: 4.8 },
        { type: "DO", status: "normal", value: 6.1 },
      ],
    };
  }
};

/* ================= AI PREDICTION ================= */

export const triggerAIAnalysis = async (stationId, parameter) => {
  try {
    const res = await api.post("/ai/predict", {
      station_id: stationId,
      parameter,
    });
    return res.data;
  } catch {
    // Demo-safe mock prediction
    return {
      station_id: stationId,
      parameter,
      prediction: {
        trend: "stable",
        confidence: 0.86,
        next_24h: [
          { hour: "+1h", value: 7.1 },
          { hour: "+6h", value: 7.0 },
          { hour: "+12h", value: 6.9 },
          { hour: "+24h", value: 6.8 },
        ],
      },
    };
  }
};

/* ================= EXPORT DEFAULT ================= */

export default api;
