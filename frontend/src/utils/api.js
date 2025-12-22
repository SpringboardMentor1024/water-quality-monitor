import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const loginUser = async (email, password) => {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await apiClient.post("/auth/register", userData);
  return res.data;
};

export const getStations = async () => {
  const res = await apiClient.get("/stations/");
  return res.data;
};

export default apiClient;
