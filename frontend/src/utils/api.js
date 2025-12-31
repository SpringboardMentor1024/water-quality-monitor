import axios from "axios";

/* =========================================================
   BASE CONFIG
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================================
   JWT INTERCEPTOR
========================================================= */

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

/* =========================================================
   AUTH APIs
========================================================= */

// REGISTER
export const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

// LOGIN  ✅ JSON based (NOT form-data)
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  // Store token
  localStorage.setItem("authToken", res.data.access_token);

  return res.data;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("authToken");
};

// GET ALL USERS (Admin panel)
export const getAllUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};

/* =========================================================
   STATIONS & MAP APIs
========================================================= */

// GET ALL STATIONS
export const getStations = async (params = {}) => {
  const res = await api.get("/stations/", { params });
  return res.data;
};

// GET STATION READINGS (if exists)
export const getStationReadings = async (stationId) => {
  const res = await api.get(`/stations/${stationId}/readings`);
  return res.data;
};

// GET 2011 WATER QUALITY SUMMARY (Analysis page)
export const getStation2011 = async (stationName) => {
  const res = await api.get(
    `/stations/water-quality/2011/${encodeURIComponent(stationName)}`
  );
  return res.data;
};

/* =========================================================
   EXPORT DEFAULT AXIOS INSTANCE
========================================================= */

export default api;
