import React, { useState } from "react";

export default function Analytics() {
  const [activeParam, setActiveParam] = useState("pH");
  const [timeRange, setTimeRange] = useState("Daily");

  // Dummy analytics data (station-level simulation)
  const analyticsData = {
    pH: {
      Daily: { wqi: 72, status: "Good" },
      Weekly: { wqi: 70, status: "Good" },
      Monthly: { wqi: 65, status: "Moderate" },
      Yearly: { wqi: 60, status: "Moderate" },
    },
    "Dissolved Oxygen": {
      Daily: { wqi: 75, status: "Good" },
      Weekly: { wqi: 72, status: "Good" },
      Monthly: { wqi: 68, status: "Moderate" },
      Yearly: { wqi: 62, status: "Moderate" },
    },
    Turbidity: {
      Daily: { wqi: 60, status: "Moderate" },
      Weekly: { wqi: 55, status: "Moderate" },
      Monthly: { wqi: 48, status: "Poor" },
      Yearly: { wqi: 42, status: "Poor" },
    },
    Arsenic: {
      Daily: { wqi: 50, status: "Poor" },
      Weekly: { wqi: 48, status: "Poor" },
      Monthly: { wqi: 45, status: "Poor" },
      Yearly: { wqi: 40, status: "Critical" },
    },
    "E. Coli": {
      Daily: { wqi: 58, status: "Poor" },
      Weekly: { wqi: 55, status: "Poor" },
      Monthly: { wqi: 50, status: "Poor" },
      Yearly: { wqi: 45, status: "Critical" },
    },
    Iron: {
      Daily: { wqi: 68, status: "Moderate" },
      Weekly: { wqi: 65, status: "Moderate" },
      Monthly: { wqi: 60, status: "Moderate" },
      Yearly: { wqi: 55, status: "Poor" },
    },
  };

  const current = analyticsData[activeParam][timeRange];

  const statusColor =
    current.status === "Good"
      ? "bg-green-600"
      : current.status === "Moderate"
      ? "bg-yellow-500 text-black"
      : current.status === "Poor"
      ? "bg-orange-500"
      : "bg-red-600";

  const parameters = [
    "pH",
    "Dissolved Oxygen",
    "Turbidity",
    "Arsenic",
    "E. Coli",
    "Iron",
  ];

  return (
    <div className="p-6 text-white space-y-8">

      {/* Title */}
      <h1 className="text-2xl font-bold">Water Quality Analytics</h1>

      {/* Time Range Selector */}
      <div className="flex gap-4">
        {["Daily", "Weekly", "Monthly", "Yearly"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded ${
              timeRange === range
                ? "bg-yellow-400 text-black"
                : "bg-[#222831]"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#222831] p-6 rounded-xl">
          <p className="text-gray-400">Water Quality Index</p>
          <p className="text-3xl font-bold mt-2">{current.wqi}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${statusColor}`}>
            {current.status}
          </span>
        </div>

        <div className="bg-[#222831] p-6 rounded-xl">
          <p className="text-gray-400">Total Stations</p>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-[#222831] p-6 rounded-xl">
          <p className="text-gray-400">Contaminated Sites</p>
          <p className="text-3xl font-bold mt-2">
            {current.status === "Good" ? 5 : 18}
          </p>
        </div>

        <div className="bg-[#222831] p-6 rounded-xl">
          <p className="text-gray-400">Active Alerts</p>
          <p className="text-3xl font-bold mt-2">
            {current.status === "Good" ? 2 : 6}
          </p>
        </div>
      </div>

      {/* Parameter Trends */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Water Quality Parameter Trends
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {parameters.map((param) => (
            <div
              key={param}
              onClick={() => setActiveParam(param)}
              className={`bg-[#222831] p-6 rounded-xl cursor-pointer ${
                activeParam === param ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <p className="mb-3 font-semibold">{param}</p>
              <div className="h-32 border border-dashed border-gray-600 rounded flex items-center justify-center text-gray-400 text-sm">
                {param} Trend ({timeRange})
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
