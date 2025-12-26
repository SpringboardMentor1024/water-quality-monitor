import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jul 20", value: 7.0 },
  { name: "Jul 22", value: 7.2 },
  { name: "Jul 24", value: 7.1 },
  { name: "Jul 26", value: 7.3 },
];

export default function Stations() {
  return (
    <div className="min-h-screen bg-[#F4FBFD] text-gray-800 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-[#4FA3B5] mb-8">
        Station Details: Riverbend Monitoring Point A
      </h1>

      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Station Info */}
        <div className="md:col-span-2 bg-white border border-[#C4E1E6] rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-[#4FA3B5] mb-3">
            Riverbend Monitoring Point A
          </h2>
          <p className="text-sm text-gray-600 mb-1">ID: STN-4829</p>
          <p className="text-sm text-gray-600 mb-1">
            Location: Confluence River, near Willow Creek Bridge
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Coordinates: 34.0522, -118.2437
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Managed by: Environmental Protection Agency
          </p>
          <div className="flex gap-3">
            <button className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg hover:bg-[#3D91A3] transition">
              Trigger Alert
            </button>
            <button className="bg-[#7FC8D6] text-white px-4 py-2 rounded-lg hover:bg-[#6CBED0] transition">
              Initiate Collaboration
            </button>
          </div>
        </div>

        {/* Current Readings */}
        <div className="bg-white border border-[#C4E1E6] rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold text-[#4FA3B5] mb-4">
            Current Readings
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>pH</span>
              <span className="font-semibold">7.2</span>
            </li>
            <li className="flex justify-between">
              <span>Turbidity</span>
              <span className="font-semibold">5.8 NTU</span>
            </li>
            <li className="flex justify-between">
              <span>Dissolved Oxygen</span>
              <span className="font-semibold">8.1 mg/L</span>
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            Last updated: 2024-07-26, 10:30 AM UTC
          </p>
        </div>
      </div>

      {/* Detailed Real-time Readings */}
      <h2 className="text-2xl font-bold text-[#4FA3B5] mb-4">
        Detailed Real-time Readings
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { name: "pH", value: "7.2", unit: "", status: "Normal" },
          { name: "Turbidity", value: "5.8", unit: "NTU", status: "Warning" },
          { name: "Dissolved Oxygen", value: "8.1", unit: "mg/L", status: "Normal" },
          { name: "Lead", value: "0.003", unit: "ppm", status: "Normal" },
          { name: "Arsenic", value: "0.008", unit: "ppm", status: "Alert" },
          { name: "Temperature", value: "22.5", unit: "°C", status: "Normal" },
        ].map((reading) => (
          <div
            key={reading.name}
            className="bg-white border border-[#C4E1E6] rounded-xl p-4 shadow text-center"
          >
            <h3 className="text-gray-600 font-semibold mb-1">{reading.name}</h3>
            <p className="text-3xl font-bold">
              {reading.value}{" "}
              <span className="text-base font-normal">{reading.unit}</span>
            </p>
            <p
              className={`text-sm mt-1 ${
                reading.status === "Alert"
                  ? "text-red-500"
                  : reading.status === "Warning"
                  ? "text-yellow-500"
                  : "text-green-600"
              }`}
            >
              {reading.status}
            </p>
          </div>
        ))}
      </div>

      {/* Historical Trend Charts */}
      <h2 className="text-2xl font-bold text-[#4FA3B5] mb-4">
        Historical Trend Charts
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {["pH Trend", "Turbidity Trend", "Dissolved Oxygen Trend"].map(
          (title, index) => (
            <div
              key={index}
              className="bg-white border border-[#C4E1E6] rounded-xl p-4 shadow"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                {title}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4FA3B5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        )}
      </div>
    </div>
  );
}
