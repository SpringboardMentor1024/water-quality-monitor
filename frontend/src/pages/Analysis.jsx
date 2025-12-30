import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getStations, getStation2011 } from "../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analysis() {
  const [stations, setStations] = useState([]);
  const [stationName, setStationName] = useState("");
  const [reading, setReading] = useState(null);
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
        if (list.length > 0) setStationName(list[0].name);
      } catch (err) {
        console.error("Failed to load stations", err);
        setError("Failed to load stations for analysis");
      } finally {
        setLoadingStations(false);
      }
    };
    loadStations();
  }, []);

  // Load 2011 summary for selected station
  useEffect(() => {
    const loadReading = async () => {
      if (!stationName) return;
      setLoadingReadings(true);
      try {
        const data = await getStation2011(stationName);
        const rec = Array.isArray(data.water_quality_2011)
          ? data.water_quality_2011[0]
          : null;
        setReading(rec);
        setError("");
      } catch (err) {
        console.error("Failed to load 2011 data", err);
        setError("Failed to load readings for charts");
        setReading(null);
      } finally {
        setLoadingReadings(false);
      }
    };
    loadReading();
  }, [stationName]);

  const buildTripleBar = (label, minKey, maxKey, meanKey, color) => {
    if (!reading) {
      return {
        labels: ["Min", "Max", "Mean"],
        datasets: [
          {
            label,
            data: [0, 0, 0],
            backgroundColor: color,
          },
        ],
      };
    }
    return {
      labels: ["Min", "Max", "Mean"],
      datasets: [
        {
          label,
          data: [
            reading[minKey] ?? 0,
            reading[maxKey] ?? 0,
            reading[meanKey] ?? 0,
          ],
          backgroundColor: color,
        },
      ],
    };
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analysis & Charts (2011)</h2>

      {error && (
        <div className="mb-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Station control */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Station:</label>
          <select
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="border rounded px-3 py-1"
            disabled={loadingStations || stations.length === 0}
          >
            {stations.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing annual summary for 2011 (min / max / mean)
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
            <Bar
              data={buildTripleBar(
                "pH",
                "ph_min",
                "ph_max",
                "ph_mean",
                "rgba(34,197,94,0.8)"
              )}
              options={commonOptions}
            />
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 h-80">
          <h3 className="text-lg font-semibold mb-2">Turbidity (NTU)</h3>
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Not available in 2011 dataset
          </div>
        </div>

        <div className="bg-white rounded shadow p-4 h-80">
          <h3 className="text-lg font-semibold mb-2">
            Dissolved Oxygen (mg/L)
          </h3>
          <div className="h-full">
            <Bar
              data={buildTripleBar(
                "Dissolved Oxygen",
                "do_min",
                "do_max",
                "do_mean",
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
