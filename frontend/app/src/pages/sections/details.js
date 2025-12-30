import React, { useState, useEffect } from "react";
import TrendChart from "../../components/TrendChart";
import { fetchStationReadings } from "../../services/api";
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

export default function Details({ stationId, goToReports }) {
  const [showTrends, setShowTrends] = useState(false);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stationId) return;

    setLoading(true);
    fetchStationReadings(stationId)
      .then((res) => setReadings(res.data || []))
      .catch((err) => console.error("Failed to fetch readings", err))
      .finally(() => setLoading(false));
  }, [stationId]);

  /* =================================================
     GROUP READINGS BY PARAMETER (FOR TRENDS)
  ================================================= */
  const groupedReadings = readings.reduce((acc, r) => {
    if (!acc[r.parameter]) acc[r.parameter] = [];
    acc[r.parameter].push({
      time: new Date(r.recorded_at).toLocaleTimeString(),
      value: r.value
    });
    return acc;
  }, {});

  if (!stationId) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className="text-gray-400">Select a station from the map</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-4 md:p-6 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {mockStation.name}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-600 mt-2">
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt /> {mockStation.location}
            </span>
            <span className="flex items-center gap-2">
              <FaBuilding /> {mockStation.managed_by}
            </span>
            <span className="flex items-center gap-2">
              <FaClock /> Updated {mockStation.lastUpdated}
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
          {!loading && readings.length === 0 && (
            <p className="text-gray-400">No readings found.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {readings.map((r) => (
              <div
                key={r.id}
                className="p-4 border rounded bg-white text-gray-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaFlask />
                  <h3 className="font-bold text-gray-700">
                    {r.parameter}
                  </h3>
                </div>

                <p className="text-3xl font-bold text-black">
                  {r.value}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Recorded at:{" "}
                  {new Date(r.recorded_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* TREND CHARTS */}
          {showTrends && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {Object.entries(groupedReadings).map(
                ([param, data]) => (
                  <TrendChart
                    key={param}
                    title={`${param} Trend`}
                    data={data}
                    unit=""
                    color="#38bdf8"
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
