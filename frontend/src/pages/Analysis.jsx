import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { getStationDetails, getStationSeries } from "../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Analysis() {
  const { stationId } = useParams();

  const [station, setStation] = useState(null);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const stationData = await getStationDetails(stationId);
        const seriesData = await getStationSeries(stationId);

        setStation(stationData);
        setSeries(seriesData);
      } catch (err) {
        console.error(err);
        setError("Failed to load station data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [stationId]);

  if (loading) return <p className="p-6">Loading analysis…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const buildChart = (label, data, color) => ({
    labels: series.timestamps.map((t) =>
      new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ),
    datasets: [
      {
        label,
        data,
        backgroundColor: color,
      },
    ],
  });

  return (
    <div className="p-6">
      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-1">{station.name}</h2>
      <p className="text-sm text-gray-500 mb-6">{station.location}</p>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow h-80">
          <h3 className="font-semibold mb-2">pH Level</h3>
          <Bar
            data={buildChart(
              "pH",
              series.series.ph,
              "rgba(34,197,94,0.7)"
            )}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        <div className="bg-white p-4 rounded shadow h-80">
          <h3 className="font-semibold mb-2">Turbidity</h3>
          <Bar
            data={buildChart(
              "Turbidity",
              series.series.turbidity,
              "rgba(251,146,60,0.7)"
            )}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        <div className="bg-white p-4 rounded shadow h-80">
          <h3 className="font-semibold mb-2">Dissolved Oxygen</h3>
          <Bar
            data={buildChart(
              "DO",
              series.series.do,
              "rgba(59,130,246,0.7)"
            )}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}
