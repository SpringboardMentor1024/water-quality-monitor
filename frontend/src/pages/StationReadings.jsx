// frontend/src/pages/StationReadings.jsx
import React, { useState, useEffect } from "react";

const STATIONS = [
  "Ganga River Station",
  "Hussain Sagar Station",
  "Kompally Groundwater Station",
  "Musi River Station",
];

export default function StationReadings() {
  const [selectedStation, setSelectedStation] = useState(STATIONS[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStationData = async (stationName) => {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await fetch(
        `http://127.0.0.1:8000/stations/water-quality/2011/${encodeURIComponent(
          stationName
        )}`
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError("Failed to load station data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationData(selectedStation);
  }, [selectedStation]);

  const renderRow = (label, minKey, maxKey, meanKey) => {
    if (!data) return null;
    const rec = data.water_quality_2011[0];
    return (
      <tr key={label}>
        <td className="border px-2 py-1">{label}</td>
        <td className="border px-2 py-1">{rec[minKey]}</td>
        <td className="border px-2 py-1">{rec[maxKey]}</td>
        <td className="border px-2 py-1">{rec[meanKey]}</td>
      </tr>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Station 2011 Water Quality</h1>

      <div className="mb-4">
        <label className="mr-2">Select station:</label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="border px-2 py-1"
        >
          {STATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">
            {data.station.name} – 2011
          </h2>
          <p className="mb-2">
            Location: {data.station.location} | Status: {data.station.status}
          </p>

          <table className="border-collapse border text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Parameter</th>
                <th className="border px-2 py-1">Min</th>
                <th className="border px-2 py-1">Max</th>
                <th className="border px-2 py-1">Mean</th>
              </tr>
            </thead>
            <tbody>
              {renderRow("Temperature (°C)", "temp_min", "temp_max", "temp_mean")}
              {renderRow("DO (mg/L)", "do_min", "do_max", "do_mean")}
              {renderRow("pH", "ph_min", "ph_max", "ph_mean")}
              {renderRow("Conductivity", "cond_min", "cond_max", "cond_mean")}
              {renderRow("BOD", "bod_min", "bod_max", "bod_mean")}
              {renderRow("Nitrate", "nitrate_min", "nitrate_max", "nitrate_mean")}
              {renderRow(
                "Fecal coliform",
                "fecal_coliform_min",
                "fecal_coliform_max",
                "fecal_coliform_mean"
              )}
              {renderRow(
                "Total coliform",
                "total_coliform_min",
                "total_coliform_max",
                "total_coliform_mean"
              )}
              {renderRow("Fluoride", "fluoride_min", "fluoride_max", "fluoride_mean")}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
