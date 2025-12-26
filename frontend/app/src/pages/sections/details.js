import React, { useState } from "react";
import TrendChart from "../../components/TrendChart";

/* =================================================
   MOCK DATA (TEMP — BACKEND WILL REPLACE LATER)
================================================= */

// Station info
const mockStation = {
  id: "STN-101",
  name: "Krishna Barrage Monitoring Station",
  location: "Prakasam Barrage, Andhra Pradesh",
  managed_by: "Irrigation Department",
};

// Latest readings
const mockReadings = [
  { parameter: "pH", value: "7.2" },
  { parameter: "Turbidity", value: "5.8 NTU" },
  { parameter: "Dissolved Oxygen", value: "8.1 mg/L" },
  { parameter: "Arsenic", value: "0.008 ppm" },
  { parameter: "Lead", value: "0.003 ppm" },
  { parameter: "Temperature", value: "22.5 °C" },
];

// Trend data with filters
const mockTrendData = {
  daily: {
    pH: [
      { time: "10 AM", value: 7.2 },
      { time: "12 PM", value: 7.3 },
      { time: "2 PM", value: 7.1 },
    ],
    Turbidity: [
      { time: "10 AM", value: 5.9 },
      { time: "12 PM", value: 5.8 },
      { time: "2 PM", value: 6.0 },
    ],
    DO: [
      { time: "10 AM", value: 8.0 },
      { time: "12 PM", value: 8.1 },
      { time: "2 PM", value: 7.9 },
    ],
  },

  weekly: {
    pH: [
      { time: "Mon", value: 7.1 },
      { time: "Tue", value: 7.3 },
      { time: "Wed", value: 7.2 },
      { time: "Thu", value: 7.4 },
    ],
    Turbidity: [
      { time: "Mon", value: 6.1 },
      { time: "Tue", value: 5.8 },
      { time: "Wed", value: 5.6 },
      { time: "Thu", value: 5.9 },
    ],
    DO: [
      { time: "Mon", value: 8.0 },
      { time: "Tue", value: 8.2 },
      { time: "Wed", value: 8.1 },
      { time: "Thu", value: 7.9 },
    ],
  },

  monthly: {
    pH: [
      { time: "Week 1", value: 7.0 },
      { time: "Week 2", value: 7.2 },
      { time: "Week 3", value: 7.3 },
    ],
    Turbidity: [
      { time: "Week 1", value: 6.2 },
      { time: "Week 2", value: 6.0 },
      { time: "Week 3", value: 5.8 },
    ],
    DO: [
      { time: "Week 1", value: 8.1 },
      { time: "Week 2", value: 8.0 },
      { time: "Week 3", value: 7.8 },
    ],
  },
};

export default function Details({ stationId, goToReports }) {
  const [showTrends, setShowTrends] = useState(false);
  const [timeFilter, setTimeFilter] = useState("daily");

  // If no station selected
  if (!stationId) {
    return (
      <div className="bg-[#222831] p-6 rounded-xl text-gray-400">
        Select a station from the map to view details.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-white space-y-6">

      {/* =============================
          STATION DETAILS
      ============================== */}
      <div className="bg-[#222831] p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-3">{mockStation.name}</h1>
        <p><strong>ID:</strong> {mockStation.id}</p>
        <p><strong>Location:</strong> {mockStation.location}</p>
        <p><strong>Managed By:</strong> {mockStation.managed_by}</p>
      </div>

      {/* =============================
          ACTION BUTTONS
      ============================== */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setShowTrends(!showTrends)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {showTrends ? "Hide Trends" : "View Water Quality Trends"}
        </button>

        <button
          onClick={goToReports}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
        >
          View / Verify Reports
        </button>
      </div>

      {/* =============================
          CURRENT READINGS
      ============================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockReadings.map((r) => (
          <div
            key={r.parameter}
            className="bg-[#222831] p-4 rounded-lg text-center"
          >
            <p className="text-gray-400">{r.parameter}</p>
            <p className="text-2xl font-bold">{r.value}</p>
          </div>
        ))}
      </div>

      {/* =============================
          TREND CHARTS
      ============================== */}
      {showTrends && (
        <div className="bg-[#222831] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">
            Water Quality Trends
          </h2>

          {/* Time Filters */}
          <div className="flex gap-3 mb-6">
            {["daily", "weekly", "monthly"].map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-4 py-2 rounded capitalize ${
                  timeFilter === f
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <TrendChart
              title="pH Level"
              data={mockTrendData[timeFilter].pH}
              unit="pH"
              color="#3b82f6"
            />

            <TrendChart
              title="Turbidity"
              data={mockTrendData[timeFilter].Turbidity}
              unit="NTU"
              color="#22c55e"
            />

            <TrendChart
              title="Dissolved Oxygen"
              data={mockTrendData[timeFilter].DO}
              unit="mg/L"
              color="#f59e0b"
            />
          </div>
        </div>
      )}
    </div>
  );
}
