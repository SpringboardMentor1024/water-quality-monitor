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

/* ================= AUTH TOKEN ================= */

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
   USER REPORTS (NEW – SAFE ADDITION)
===================== */

export const getMyReports = async () => {
  const res = await api.get("/reports/my-reports/");
  return res.data;
};

export const createReport = async (data) => {
  const res = await api.post("/reports/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/* =====================
   DEFAULT EXPORT
===================== */

export default api;
