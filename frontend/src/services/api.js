import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const BACKEND_URL = "http://127.0.0.1:8000";

// -------- STATIONS --------
export const getStations = () => API.get("/api/stations");
export const createStation = (data) => API.post("/api/stations", data);

// -------- REPORTS --------
export const getReports = () => API.get("/api/reports");
export const createReport = (data) => API.post("/api/reports", data);

// -------- ANALYTICS --------
export const getAnalytics = () => API.get("/api/analytics/stations");

// -------- ALERTS --------
export const getAlerts = () => API.get("/api/alerts");

export async function getPredictiveAlerts() {
  const res = await fetch("http://127.0.0.1:8000/alerts/predictive");
  if (!res.ok) throw new Error("Failed to fetch predictive alerts");
  return await res.json();
}


export default API;
