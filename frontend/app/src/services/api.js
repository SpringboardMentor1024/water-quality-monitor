// api.js
const BASE_URL = "http://127.0.0.1:8000";

export async function getStations(stateCode, page = 1, pageSize = 100) {
  const url = `${BASE_URL}/api/stations/${stateCode}?page=${page}&page_size=${pageSize}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch stations");
  return await response.json();
}

export async function getWhoWaterData(indicator, country) {
  const url = new URL(`${BASE_URL}/api/who/water`);
  url.searchParams.append("indicator", indicator);
  if (country) url.searchParams.append("country", country);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch WHO water data");
  return await response.json();
}

// Add more API calls here (login, register, users, etc.)
