import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getStations, getStationReadings } from "../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Analysis() {
  const [stations, setStations] = useState([]);
  const [stationId, setStationId] = useState(null);
  const [hours, setHours] = useState(48);
  const [readings, setReadings] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingReadings, setLoadingReadings] = useState(false);
  const [error, setError] = useState("");

  // Load stations list
  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await getStations();
        const list = Array.isArray(data) ? data : [];
        setStations(list);
        if (list.length > 0) setStationId(list[0].id);
      } catch (err) {
        console.error("Failed to load stations", err);
        setError("Failed to load stations for analysis");
      } finally {
        setLoadingStations(false);
      }
    };
    loadStations();
  }, []);

  // Load readings for selected station
  useEffect(() => {
    const loadReadings = async () => {
      if (!stationId) return;
      setLoadingReadings(true);
      try {
        const data = await getStationReadings(stationId, { hours });
        // if your backend ignores {hours}, just call getStationReadings(stationId)
        setReadings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load readings", err);
        setError("Failed to load readings for charts");
      } finally {
        setLoadingReadings(false);
      }
    };
    loadReadings();
  }, [stationId, hours]);

  const buildData = (field, label, borderColor) => ({
    labels: readings.map((r) =>
      new Date(r.recorded_at).toLocaleString()
    ),
    datasets: [
      {
        label,
        data: readings.map((r) => r[field]),
        borderColor,
        backgroundColor: borderColor,
        tension: 0.25,
        pointRadius: 1,
      },
    ],
  });

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analysis & Charts</h2>

      {error && (
        <div className="mb-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Station + range controls */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Station:</label>
          <select
            value={stationId || ""}
            onChange={(e) => setStationId(Number(e.target.value))}
            className="border rounded px-3 py-1"
            disabled={loadingStations || stations.length === 0}
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Range:</span>
          {[24, 48, 168].map((h) => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`px-3 py-1 rounded ${
                hours === h
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {h === 24 ? "24h" : h === 48 ? "48h" : "7d"}
            </button>
          ))}
        </div>
      </div>

      {loadingReadings && (
        <div className="mb-3 text-sm text-gray-600">
          Loading readings...
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4 h-80">
          <h3 className="text-lg font-semibold mb-2">pH</h3>
          <div className="h-full">
            <Line
              data={buildData("ph", "pH", "rgba(34,197,94,0.8)")}
              options={commonOptions}
            />
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 h-80">
          <h3 className="text-lg font-semibold mb-2">
            Turbidity (NTU)
          </h3>
          <div className="h-full">
            <Line
              data={buildData(
                "turbidity",
                "Turbidity (NTU)",
                "rgba(249,115,22,0.8)"
              )}
              options={commonOptions}
            />
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 h-80">
          <h3 className="text-lg font-semibold mb-2">
            Dissolved Oxygen (mg/L)
          </h3>
          <div className="h-full">
            <Line
              data={buildData(
                "dissolved_oxygen",
                "Dissolved Oxygen (mg/L)",
                "rgba(59,130,246,0.8)"
              )}
              options={commonOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
