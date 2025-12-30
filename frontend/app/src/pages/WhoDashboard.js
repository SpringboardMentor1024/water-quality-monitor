// frontend/app/src/pages/WhoDashboard.js
import React, { useEffect, useState } from "react";
import { getWhoWaterData } from "../services/api";

export default function WhoDashboard() {
  const indicator = "WSH_WATER_BASIC";
  const country = "IND";

  const [limit, setLimit] = useState(10);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWhoWaterData(indicator, country, limit);
      setRecords(data.records || []);
    } catch (err) {
      console.error("WHO fetch error:", err);
      setError("Failed to fetch WHO data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-white text-2xl mb-1 text-center">
        WHO Dashboard for Indicator: {indicator}
      </h2>

      <p className="text-gray-400 text-sm text-center mb-6">
        Value represents % basic drinking water access (WHO)
      </p>

      <div className="flex items-center justify-center gap-3 mb-6">
        <label className="text-white text-sm">Limit:</label>
        <input
          type="number"
          min="1"
          max="200"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-24 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={fetchData}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
        >
          Apply
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading WHO data...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : records.length === 0 ? (
        <p className="text-gray-400 text-center">No data available</p>
      ) : (
        <div className="max-h-[600px] overflow-y-auto border border-gray-700 rounded-lg">
          <table className="w-full text-white text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-700 z-10">
              <tr>
                <th className="px-4 py-3 border border-gray-700 text-left">
                  Year
                </th>
                <th className="px-4 py-3 border border-gray-700 text-left">
                  Value (%)
                </th>
                <th className="px-4 py-3 border border-gray-700 text-left">
                  Region
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-800" : "bg-gray-900"}
                >
                  <td className="px-4 py-2 border border-gray-700">
                    {r.year}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {r.value}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {r.region}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
