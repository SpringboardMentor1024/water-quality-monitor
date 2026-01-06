// frontend/app/src/services/api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// -----------------------------
// Water Stations
// -----------------------------
export const fetchStations = async () => {
  return axios.get(`${BASE_URL}/stations`);
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
  return axios.get(`${BASE_URL}/readings/${stationId}`);
};

// -----------------------------
// Station Readings (BATCH) ✅ NEW
// -----------------------------
export const fetchBatchReadings = async (stationIds) => {
  return axios.post(`${BASE_URL}/readings/batch`, stationIds);
};

// -----------------------------
// CPCB API
// -----------------------------
export const fetchCpcbReadings = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/cpcb/readings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
    const res = await axios.get(`${BASE_URL}/wqp/results`, {
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
    const res = await axios.get(`${BASE_URL}/wqp/nearby`, {
      params: { lat, lon, radius, limit },
    });
    return res.data;
  } catch (error) {
    console.error("Nearby stations fetch error:", error);
    return [];
  }
};
