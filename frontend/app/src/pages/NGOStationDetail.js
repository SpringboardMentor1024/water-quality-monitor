import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ---------------- Threshold Config ---------------- */
const THRESHOLDS = {
  ph: { min: 6.5, max: 8.5, unit: "" },
  turbidity: { max: 5, unit: "NTU" },
  tds: { max: 500, unit: "ppm" },
  do: { min: 5, unit: "mg/L" },
  temperature: { max: 35, unit: "°C" }
};

/* ---------------- Helpers ---------------- */
const getStatus = (key, value) => {
  const t = THRESHOLDS[key];
  if (t.min !== undefined && value < t.min) return "critical";
  if (t.max !== undefined && value > t.max) return "critical";
  return "safe";
};

const statusBadge = (status) =>
  status === "critical"
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";

const cardAccent = (key) => {
  switch (key) {
    case "ph":
      return "border-blue-500 bg-blue-50";
    case "turbidity":
      return "border-yellow-500 bg-yellow-50";
    case "tds":
      return "border-purple-500 bg-purple-50";
    case "do":
      return "border-green-500 bg-green-50";
    case "temperature":
      return "border-red-500 bg-red-50";
    default:
      return "border-gray-300 bg-white";
  }
};

/* ---------------- MAIN ---------------- */
const StationDetailsNGO = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState(null);
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReport, setNewReport] = useState("");

  useEffect(() => {
    /* Demo data – backend later */
    setStation({
      id: stationId,
      name: "Station D-01",
      location: "Connaught Place, Delhi",
      project: "Urban Water Quality",
      lastUpdated: "2024-07-20 11:30 AM",
      parameters: {
        ph: 7.3,
        turbidity: 4.2,
        tds: 480,
        do: 6.2,
        temperature: 27
      }
    });

    setReports([
      {
        id: 301,
        date: "15/07/2024",
        description: "High turbidity observed near inlet",
        status: "Pending"
      },
      {
        id: 302,
        date: "14/07/2024",
        description: "Routine inspection completed",
        status: "Reviewed"
      }
    ]);
  }, [stationId]);

  if (!station) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="rounded-xl p-6 mb-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{station.name}</h1>
          <p className="opacity-90">{station.location}</p>
          <p className="text-sm opacity-80 mt-1">
            Project: {station.project} • Last Updated: {station.lastUpdated}
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/ngo-dashboard")}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
        >
          ← Back to NGO Dashboard
        </button>
      </div>

      {/* ================= PARAMETER CARDS ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Water Quality Parameters
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(station.parameters).map(([key, value]) => {
            const status = getStatus(key, value);
            return (
              <div
                key={key}
                className={`border-l-4 rounded-lg p-4 text-center ${cardAccent(key)}`}
              >
                <p className="text-sm font-semibold text-gray-700 capitalize">
                  {key}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {value} {THRESHOLDS[key]?.unit}
                </p>
                <span
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-xs ${statusBadge(status)}`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= LATEST READINGS ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Latest Readings
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-800">Parameter</th>
              <th className="p-3 text-left text-gray-800">Value</th>
              <th className="p-3 text-left text-gray-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(station.parameters).map(([key, value]) => {
              const status = getStatus(key, value);
              return (
                <tr key={key} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-900 font-medium capitalize">
                    {key}
                  </td>
                  <td className="p-3 text-gray-900">
                    {value} {THRESHOLDS[key]?.unit}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${statusBadge(status)}`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= NGO REPORT MANAGEMENT ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          NGO Report Management
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Submit Report
        </button>

        {showForm && (
          <div className="mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
            <textarea
              className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded p-3 mb-3"
              placeholder="Describe the issue observed at this station..."
              value={newReport}
              onChange={(e) => setNewReport(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                onClick={() => {
                  if (!newReport.trim()) return;
                  setReports((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      date: new Date().toLocaleDateString(),
                      description: newReport,
                      status: "Pending"
                    }
                  ]);
                  setNewReport("");
                  setShowForm(false);
                }}
              >
                Submit
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-800">Report ID</th>
              <th className="p-3 text-left text-gray-800">Date</th>
              <th className="p-3 text-left text-gray-800">Description</th>
              <th className="p-3 text-left text-gray-800">Status</th>
              <th className="p-3 text-left text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-gray-900 font-medium">#{r.id}</td>
                <td className="p-3 text-gray-800">{r.date}</td>
                <td className="p-3 text-gray-800">{r.description}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      r.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3 flex gap-3">
                  {r.status === "Pending" && (
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => {
                        const updated = [...reports];
                        updated[i].status = "Reviewed";
                        setReports(updated);
                      }}
                    >
                      Mark Reviewed
                    </button>
                  )}
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() =>
                      setReports(reports.filter((rep) => rep.id !== r.id))
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StationDetailsNGO;
