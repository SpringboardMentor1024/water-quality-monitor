import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StatCard from "../../components/StatCard";

export default function Details() {
  const { stationId } = useParams();

  const [station, setStation] = useState(null);
  const [readings, setReadings] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     Fetch Station + Readings
  ========================= */
  useEffect(() => {
    Promise.all([
      axios.get(`http://127.0.0.1:8000/water-stations/${stationId}`),
      axios.get(`http://127.0.0.1:8000/water-stations/${stationId}/readings`)
    ])
      .then(([stationRes, readingsRes]) => {
        setStation(stationRes.data);
        setReadings(readingsRes.data);
      })
      .catch(() => {
        setStation(null);
        setReadings(null);
      })
      .finally(() => setLoading(false));
  }, [stationId]);

  if (loading) {
    return <p className="p-6 text-white">Loading station details…</p>;
  }

  if (!station) {
    return <p className="p-6 text-red-400">Station not found</p>;
  }

  return (
    <div className="p-4 md:p-6 space-y-8 text-white">

      {/* =========================
          TITLE
      ========================= */}
      <h1 className="text-xl md:text-2xl font-bold">
        Station Details: {station.name}
      </h1>

      {/* =========================
          TOP SECTION
      ========================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Station Info */}
        <div className="lg:col-span-2 bg-[#222831] p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{station.name}</h2>
            <span className="text-green-400 text-sm">
              {station.status || "Active"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <p><strong>Location:</strong> {station.location}</p>
            <p><strong>Managed By:</strong> {station.managed_by || "—"}</p>
            <p>
              <strong>Coordinates:</strong>{" "}
              {station.latitude}, {station.longitude}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {station.last_updated
                ? new Date(station.last_updated).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>

        {/* Current Readings (Summary) */}
        <div className="bg-[#222831] p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Current Readings</h3>

          {readings?.current ? (
            <div className="space-y-3 text-sm">
              {Object.entries(readings.current).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">
                    {key.replace("_", " ")}
                  </span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              No real-time readings available
            </p>
          )}
        </div>
      </div>

      {/* =========================
          DETAILED READINGS
      ========================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Detailed Real-time Readings
        </h2>

        {readings?.current ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(readings.current).map(([key, value]) => (
              <StatCard
                key={key}
                title={key.replace("_", " ")}
                value={value}
                unit={
                  key === "ph" ? "" :
                  key === "turbidity" ? "NTU" :
                  key === "temperature" ? "°C" :
                  key === "dissolved_oxygen" ? "mg/L" :
                  ""
                }
                status="Normal"
                updatedAt="Just now"
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#222831] p-6 rounded-xl text-gray-400 text-sm">
            Detailed readings will appear once data is available from monitoring sources.
          </div>
        )}
      </div>

      {/* =========================
          TREND CHARTS
      ========================= */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Historical Trend Charts
        </h2>

        {readings?.history ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(readings.history).map((metric) => (
              <div
                key={metric}
                className="bg-[#222831] p-6 rounded-xl"
              >
                <h3 className="text-sm font-semibold mb-2 capitalize">
                  {metric} Trend
                </h3>
                <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
                  Chart will be rendered here
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#222831] p-6 rounded-xl text-gray-400 text-sm">
            Historical data not available
          </div>
        )}
      </div>
    </div>
  );
}
