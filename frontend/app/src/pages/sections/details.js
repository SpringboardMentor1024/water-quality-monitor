import React, { useState, useEffect } from "react";
import TrendChart from "../../components/TrendChart";
import { fetchStationReadings } from "../../services/api";
import axios from "axios";
import {
  FaFlask,
  FaChartLine,
  FaClock,
  FaMapMarkerAlt,
  FaBuilding,
  FaExclamationTriangle
} from "react-icons/fa";

/* =================================================
   TEMP MOCK STATION INFO — KEEP AS IS
================================================= */
const mockStation = {
  id: "STN-101",
  name: "Water Monitoring Station",
  location: "Unknown Location",
  managed_by: "Local Authority",
  status: "active",
  lastUpdated: "Just now"
};

// PARAMETERS TO DISPLAY (UI)
const PARAMETERS = ["pH", "turbidity", "DO", "temperature", "lead", "arsenic", "iron"];

export default function Details({ stationId, goToReports }) {
  const [showTrends, setShowTrends] = useState(false);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =================================================
     FETCH DATA (DB OR USGS)
  ================================================= */
  useEffect(() => {
    if (stationId === undefined || stationId === null) return;

    const isUSGS = String(stationId).startsWith("USGS-");

    /* ---------------- USGS STATION ---------------- */
    if (isUSGS) {
      const siteId = String(stationId).replace("USGS-", "");

      const fetchUsgsData = () => {
        setLoading(true);

        Promise.allSettled([
          axios.get(`http://127.0.0.1:8000/readings/usgs/${siteId}/ph`),
          axios.get(`http://127.0.0.1:8000/readings/usgs/${siteId}/do`),
          axios.get(`http://127.0.0.1:8000/readings/usgs/${siteId}/temperature`)
        ])
          .then((results) => {
            const collected = [];

            if (results[0].status === "fulfilled") {
              collected.push({
                parameter: "ph",
                value: results[0].value.data.value,
                recorded_at: results[0].value.data.recorded_at
              });
            }

            if (results[1].status === "fulfilled") {
              collected.push({
                parameter: "do",
                value: results[1].value.data.value,
                recorded_at: results[1].value.data.recorded_at
              });
            }

            if (results[2].status === "fulfilled") {
              collected.push({
                parameter: "temperature",
                value: results[2].value.data.value,
                recorded_at: results[2].value.data.recorded_at
              });
            }

            setReadings(collected);
          })
          .catch((err) => {
            console.error("Failed to fetch USGS live data", err);
            setReadings([]);
          })
          .finally(() => setLoading(false));
      };

      fetchUsgsData();

      // 🔁 Auto-refresh every 30 seconds
      const interval = setInterval(fetchUsgsData, 30000);
      return () => clearInterval(interval);
    }

    /* ---------------- DB STATION ---------------- */
    setLoading(true);
    fetchStationReadings(stationId)
      .then((res) => setReadings(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch DB readings", err);
        setReadings([]);
      })
      .finally(() => setLoading(false));
  }, [stationId]);

  /* =================================================
     ALERTS (USGS ONLY)
  ================================================= */
  useEffect(() => {
    if (!stationId || !String(stationId).startsWith("USGS-")) return;

    readings.forEach((r) => {
      const p = r.parameter?.toLowerCase();

      if (p === "ph" && (r.value < 6.5 || r.value > 8.5)) {
        alert("⚠️ USGS Alert: Unsafe pH level detected");
      }
      if (p === "do" && r.value < 5) {
        alert("⚠️ USGS Alert: Low Dissolved Oxygen detected");
      }
      if (p === "temperature" && r.value > 30) {
        alert("⚠️ USGS Alert: High Water Temperature detected");
      }
    });
  }, [readings, stationId]);

  /* =================================================
     BUILD LATEST READING PER PARAMETER (FIXED)
  ================================================= */
  const latestReadings = {};
  PARAMETERS.forEach((param) => {
    latestReadings[param] =
      readings.find(
        (r) => r.parameter?.toLowerCase() === param.toLowerCase()
      ) || null;
  });

  /* =================================================
     GROUP READINGS BY PARAMETER (FOR TRENDS) - FIXED
  ================================================= */
  const groupedReadings = readings.reduce((acc, r) => {
    const key = r.parameter?.toLowerCase();
    if (!key) return acc;

    if (!acc[key]) acc[key] = [];
    acc[key].push({
      time: r.recorded_at
        ? new Date(r.recorded_at).toLocaleTimeString()
        : "—",
      value: r.value
    });
    return acc;
  }, {});

  if (stationId === undefined || stationId === null) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className="text-gray-400">Select a station from the map</p>
      </div>
    );
  }

  const isUSGS = String(stationId).startsWith("USGS-");

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-4 md:p-6 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isUSGS ? "USGS Live Water Monitoring Station" : mockStation.name}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-600 mt-2">
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt /> {mockStation.location}
            </span>
            <span className="flex items-center gap-2">
              <FaBuilding /> {mockStation.managed_by}
            </span>
            <span className="flex items-center gap-2">
              <FaClock /> Updated Just now
            </span>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowTrends(!showTrends)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              <FaChartLine className="inline mr-2" />
              {showTrends ? "Hide Trends" : "View Trends"}
            </button>

            <button
              onClick={goToReports}
              className="px-4 py-2 bg-yellow-600 text-white rounded"
            >
              <FaExclamationTriangle className="inline mr-2" />
              View Reports
            </button>
          </div>
        </div>

        {/* READINGS */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Live Water Quality Readings
          </h2>

          {loading && <p className="text-gray-400">Loading...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(latestReadings).map(([param, r]) => (
              <div
                key={param}
                className="p-4 border rounded bg-white text-gray-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaFlask />
                  <h3 className="font-bold text-gray-700">{param}</h3>
                </div>

                <p className="text-3xl font-bold text-black">
                  {r ? r.value : "—"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Recorded at:{" "}
                  {r?.recorded_at
                    ? new Date(r.recorded_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            ))}
          </div>

          {showTrends && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {Object.entries(groupedReadings).map(([param, data]) => (
                <TrendChart
                  key={param}
                  title={`${param.toUpperCase()} Trend`}
                  data={data}
                  unit=""
                  color="#38bdf8"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
