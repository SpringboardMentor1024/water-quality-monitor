import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { getStation2011 } from "../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analysis() {
  const location = useLocation();
  const { stationName, stationLocation } = location.state || {};

  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stationName) {
      setError("Station not selected");
      setLoading(false);
      return;
    }

    const loadReading = async () => {
      try {
        const data = await getStation2011(stationName);
        const rec = Array.isArray(data.water_quality_2011)
          ? data.water_quality_2011[0]
          : null;

        setReading(rec);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load station data");
      } finally {
        setLoading(false);
      }
    };

    loadReading();
  }, [stationName]);

  const buildTripleBar = (label, minKey, maxKey, meanKey, color) => ({
    labels: ["Min", "Max", "Mean"],
    datasets: [
      {
        label,
        data: reading
          ? [
              reading[minKey] ?? 0,
              reading[maxKey] ?? 0,
              reading[meanKey] ?? 0,
            ]
          : [0, 0, 0],
        backgroundColor: color,
      },
    ],
  });

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (loading) return <p className="p-6">Loading analysis…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-1">
        Water Quality Analysis (2011)
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {stationName} — {stationLocation}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4 h-80">
          <h3 className="font-semibold mb-2">pH</h3>
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

        <div className="bg-white rounded shadow p-4 h-80 flex items-center justify-center text-gray-400">
          Turbidity data not available (2011)
        </div>

        <div className="bg-white rounded shadow p-4 h-80">
          <h3 className="font-semibold mb-2">Dissolved Oxygen</h3>
          <Bar
            data={buildTripleBar(
              "DO",
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
  );
}
