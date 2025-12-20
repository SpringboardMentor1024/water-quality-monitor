import React, { useState } from "react";

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      station: "STN-101",
      parameter: "pH",
      severity: "High",
      status: "Active",
      message: "pH level exceeded safe threshold",
    },
    {
      id: 2,
      station: "STN-204",
      parameter: "Arsenic",
      severity: "Critical",
      status: "Active",
      message: "Arsenic detected above permissible limit",
    },
    {
      id: 3,
      station: "STN-305",
      parameter: "Turbidity",
      severity: "Medium",
      status: "Resolved",
      message: "Turbidity levels normalized",
    },
  ]);

  // Filter logic
  const filteredAlerts = alerts.filter((alert) => {
    const severityMatch =
      severityFilter === "All" || alert.severity === severityFilter;
    const statusMatch =
      statusFilter === "All" || alert.status === statusFilter;
    return severityMatch && statusMatch;
  });

  // Resolve alert
  const resolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Resolved" }
          : alert
      )
    );
  };

  return (
    <div className="p-6 text-white space-y-8">

      {/* Page Title */}
      <h1 className="text-2xl font-bold">
        Water Quality Alerts
      </h1>

      {/* Filters */}
      <div className="bg-[#222831] p-6 rounded-xl grid grid-cols-2 gap-6">

        <div>
          <label className="text-gray-400 text-sm">
            Filter by Severity
          </label>
          <select
            className="w-full mt-1 p-2 bg-black rounded"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 text-sm">
            Filter by Status
          </label>
          <select
            className="w-full mt-1 p-2 bg-black rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Resolved</option>
          </select>
        </div>

      </div>

      {/* Alerts List */}
      <div className="bg-[#222831] p-6 rounded-xl">

        <h2 className="text-lg font-semibold mb-4">
          Alerts List
        </h2>

        {filteredAlerts.length === 0 && (
          <p className="text-gray-400">
            No alerts match the selected filters.
          </p>
        )}

        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#1b1f24] p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">
                  {alert.parameter} Alert
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Station: {alert.station}
                </p>
                <p className="text-sm mt-2">
                  {alert.message}
                </p>

                <div className="flex gap-2 mt-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      alert.severity === "Critical"
                        ? "bg-red-600"
                        : alert.severity === "High"
                        ? "bg-orange-500"
                        : alert.severity === "Medium"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-600"
                    }`}
                  >
                    {alert.severity}
                  </span>

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      alert.status === "Active"
                        ? "bg-blue-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Action */}
              {alert.status === "Active" && (
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-4 py-2 bg-green-600 rounded text-sm"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
