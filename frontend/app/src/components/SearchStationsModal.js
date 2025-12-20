import React, { useState } from "react";

export default function SearchStationsModal({ isOpen, onClose }) {
  // ✅ Hooks ALWAYS at top level
  const [region, setRegion] = useState("");
  const [area, setArea] = useState("");
  const [stationQuery, setStationQuery] = useState("");
  const [status, setStatus] = useState("");

  // Dummy station data
  const stations = [
    {
      id: "STN-001",
      name: "Sample Station 001",
      region: "Sample Region",
      area: "Sample Area",
      status: "Safe",
    },
    {
      id: "STN-002",
      name: "Sample Station 002",
      region: "Sample Region",
      area: "Sample Area",
      status: "Safe",
    },
    {
      id: "STN-003",
      name: "Sample Station 003",
      region: "Another Region",
      area: "Urban Area",
      status: "Contaminated",
    },
  ];

  // Filter logic
  const filteredStations = stations.filter((s) => {
    return (
      (!region || s.region.toLowerCase().includes(region.toLowerCase())) &&
      (!area || s.area.toLowerCase().includes(area.toLowerCase())) &&
      (!stationQuery ||
        s.name.toLowerCase().includes(stationQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(stationQuery.toLowerCase())) &&
      (!status || s.status === status)
    );
  });

  // ✅ Conditional rendering AFTER hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#222831] w-3/4 max-w-5xl rounded-xl p-6 text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Search Water Stations</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <input
            className="p-2 bg-black rounded"
            placeholder="Region (State)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />

          <input
            className="p-2 bg-black rounded"
            placeholder="Area (City / District)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <input
            className="p-2 bg-black rounded"
            placeholder="Station Name / ID"
            value={stationQuery}
            onChange={(e) => setStationQuery(e.target.value)}
          />

          <select
            className="p-2 bg-black rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Safe">Safe</option>
            <option value="Warning">Warning</option>
            <option value="Contaminated">Contaminated</option>
          </select>
        </div>

        {/* Results */}
        <div>
          <h3 className="font-semibold mb-3">Results</h3>

          <div className="grid grid-cols-5 text-sm text-gray-400 border-b border-gray-600 pb-2">
            <span>ID</span>
            <span>Name</span>
            <span>Region</span>
            <span>Area</span>
            <span>Status</span>
          </div>

          {filteredStations.length === 0 && (
            <p className="text-gray-400 mt-4">
              No stations found matching your criteria.
            </p>
          )}

          {filteredStations.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-5 py-3 border-b border-gray-700 text-sm"
            >
              <span>{s.id}</span>
              <span>{s.name}</span>
              <span>{s.region}</span>
              <span>{s.area}</span>
              <span
                className={
                  s.status === "Safe"
                    ? "text-green-400"
                    : s.status === "Contaminated"
                    ? "text-red-400"
                    : "text-yellow-400"
                }
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
