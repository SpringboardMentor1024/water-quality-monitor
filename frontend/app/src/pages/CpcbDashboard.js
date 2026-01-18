// frontend/app/src/pages/CpcbDashboard.js
import React, { useEffect, useState } from "react";
import { fetchCpcbReadings } from "../services/api";

export default function CpcbDashboard() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stationSearch, setStationSearch] = useState("");
  const [selectedParam, setSelectedParam] = useState("");
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    const loadReadings = async () => {
      try {
        const data = await fetchCpcbReadings();
        setReadings(data);

        const uniqueParams = [...new Set(data.map((r) => r.parameter))];
        setParameters(uniqueParams);
      } catch (err) {
        setError("Failed to fetch CPCB readings.");
      } finally {
        setLoading(false);
      }
    };

    loadReadings();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-300">
        Loading CPCB readings...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-400">
        {error}
      </div>
    );

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
    <div className="p-6 bg-[#1e242d] rounded-xl shadow-lg text-white h-full flex flex-col">
      
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-400">
        CPCB Water Quality Readings
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Station Name"
          value={stationSearch}
          onChange={(e) => setStationSearch(e.target.value)}
          className="p-2 rounded-lg border border-gray-600 bg-gray-700 text-white flex-1
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedParam}
          onChange={(e) => setSelectedParam(e.target.value)}
          className="p-2 rounded-lg border border-gray-600 bg-gray-700 text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Parameters</option>
          {parameters.map((param) => (
            <option key={param} value={param}>
              {param}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto rounded-lg border border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-800 z-10">
            <tr>
              <th className="px-4 py-3 text-left border-b border-gray-700">
                Station
              </th>
              <th className="px-4 py-3 text-left border-b border-gray-700">
                Parameter
              </th>
              <th className="px-4 py-3 text-left border-b border-gray-700">
                Value
              </th>
              <th className="px-4 py-3 text-left border-b border-gray-700">
                Recorded At
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredReadings.map((r, idx) => (
              <tr
                key={idx}
                className="odd:bg-gray-800 even:bg-gray-900
                           hover:bg-blue-900/30 transition-colors"
              >
                <td className="px-4 py-2 border-b border-gray-700">
                  {r.station_name}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {r.parameter}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {r.value}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {new Date(r.recorded_at).toLocaleString()}
                </td>
              </tr>
            ))}

            {filteredReadings.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-gray-400"
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
