import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= USERS ================= */

export const getAllUsers = async () => {
  const res = await api.get("/users/users/");
  return res.data;
};


// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =====================
   AUTH
===================== */
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

/* =====================
   STATIONS
===================== */
export const getStations = async () => {
  const res = await api.get("/stations/");
  return res.data;
};

export const getStationDetails = async (stationId) => {
  const res = await api.get(`/stations/${stationId}`);
  return res.data;
};

export const getStationSeries = async (stationId, points = 12) => {
  const res = await api.get(`/stations/${stationId}/series?points=${points}`);
  return res.data;
};


/* =====================
   ALERTS
===================== */

// Get all alerts
export const getAlerts = async (limit = 50, location = null) => {
  let url = `/alerts/?limit=${limit}`;
  if (location) url += `&location=${location}`;

  const res = await api.get(url);
  return res.data;
};

// Create new alert
export const createAlert = async (data) => {
  const res = await api.post("/alerts/", data);
  return res.data;
};

// Acknowledge alert
export const acknowledgeAlert = async (alertId) => {
  const res = await api.post(`/alerts/${alertId}/acknowledge`);
  return res.data;
};

// Delete alert
export const deleteAlert = async (alertId) => {
  await api.delete(`/alerts/${alertId}`);
};


export default api;
