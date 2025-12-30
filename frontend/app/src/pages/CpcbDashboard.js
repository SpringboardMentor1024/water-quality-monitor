// frontend/app/src/pages/CpcbDashboard.js
import React, { useEffect, useState } from "react";
import { fetchCpcbReadings } from "../services/api";

export default function CpcbDashboard() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search states
  const [stationSearch, setStationSearch] = useState("");
  const [selectedParam, setSelectedParam] = useState("");

  // List of unique parameters for dropdown
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    const loadReadings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCpcbReadings();
        setReadings(data);

        // Extract unique parameters
        const uniqueParams = [...new Set(data.map((r) => r.parameter))];
        setParameters(uniqueParams);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch CPCB readings.");
      } finally {
        setLoading(false);
      }
    };

    loadReadings();
  }, []);

  if (loading) return <p>Loading CPCB readings...</p>;
  if (error) return <p>{error}</p>;

  // Filter readings based on search inputs
  const filteredReadings = readings.filter((r) => {
    const matchesStation = r.station_name
      .toLowerCase()
      .includes(stationSearch.toLowerCase());
    const matchesParam = selectedParam
      ? r.parameter === selectedParam
      : true;
    return matchesStation && matchesParam;
  });

  return (
    <div className="p-4 bg-[#1e242d] rounded-lg text-white">
      <h2 className="text-xl font-semibold mb-4 text-center">CPCB Readings</h2>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by Station Name"
          value={stationSearch}
          onChange={(e) => setStationSearch(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-700 text-white flex-1"
        />
        <select
          value={selectedParam}
          onChange={(e) => setSelectedParam(e.target.value)}
          className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
        >
          <option value="">All Parameters</option>
          {parameters.map((param) => (
            <option key={param} value={param}>
              {param}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-600">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 border-b">Station</th>
              <th className="px-4 py-2 border-b">Parameter</th>
              <th className="px-4 py-2 border-b">Value</th>
              <th className="px-4 py-2 border-b">Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {filteredReadings.map((r, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
              >
                <td className="px-4 py-2 border-b">{r.station_name}</td>
                <td className="px-4 py-2 border-b">{r.parameter}</td>
                <td className="px-4 py-2 border-b">{r.value}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(r.recorded_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {filteredReadings.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-2 text-center border-b text-gray-400"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
