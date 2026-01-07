import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, Info, TrendingUp } from "lucide-react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Analysis() {
  const { stationId } = useParams();
  const navigate = useNavigate();

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
        setError("Failed to load station data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [stationId]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-blue-900">EXTRACTING TREND DATA...</div>;
  if (error) return <div className="p-12 text-center text-red-600 font-bold">{error}</div>;

  // Function to get the latest non-zero value
  const getLatest = (arr) => {
    if (!arr) return 0;
    return arr.slice().reverse().find(v => v !== 0) || 0;
  };

  const buildChart = (label, data, color) => ({
    labels: series.timestamps.map((t) =>
      new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ),
    datasets: [{
      label,
      data,
      backgroundColor: color,
      borderRadius: 5,
    }],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { weight: 'bold', size: 10 } }
      }
    },
    scales: {
      x: { ticks: { font: { weight: 'bold', size: 9 }, angle: -45 } },
      y: { ticks: { font: { weight: 'bold', size: 10 } } }
    }
  };

  return (
    <div className="p-6 md:p-12 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* 1. HEADER & NAVIGATION */}
      <div className="max-w-7xl mx-auto mb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-700 mb-8 tracking-[0.2em] hover:-translate-x-2 transition-transform">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h2 className="text-4xl md:text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">{station.name}</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3 flex items-center gap-2">
          <Activity className="w-3 h-3 text-blue-500" /> {station.location}
        </p>
      </div>

      {/* 2. REAL-TIME VALUE SNAPSHOTS (Showing the values you requested) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <MetricCard title="Live pH Reading" val={getLatest(series.series.ph).toFixed(2)} color="text-emerald-600" />
        <MetricCard title="Live Turbidity" val={getLatest(series.series.turbidity).toFixed(2)} unit="NTU" color="text-orange-500" />
        <MetricCard title="Oxygen Saturation" val={getLatest(series.series.do).toFixed(2)} unit="mg/L" color="text-blue-600" />
      </div>

      {/* 3. BAR CHARTS GRID (Exact design from screenshot 166) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartContainer title="pH Level" icon={<TrendingUp className="text-emerald-500 w-4 h-4" />}>
          <Bar data={buildChart("pH", series.series.ph, "rgba(34,197,94,0.7)")} options={chartOptions} />
        </ChartContainer>

        <ChartContainer title="Turbidity">
          <Bar data={buildChart("Turbidity", series.series.turbidity, "rgba(251,146,60,0.7)")} options={chartOptions} />
        </ChartContainer>

        <ChartContainer title="Dissolved Oxygen">
          <Bar data={buildChart("DO", series.series.do, "rgba(59,130,246,0.7)")} options={chartOptions} />
        </ChartContainer>
      </div>
    </div>
  );
}

// Sub-component: Clean Metric Card to show values
const MetricCard = ({ title, val, unit, color }) => (
  <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between h-48 hover:shadow-xl transition-all duration-500">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
    <div className="flex items-baseline gap-2">
      <span className={`text-6xl font-black tracking-tighter ${color}`}>{val}</span>
      {unit && <span className="text-sm font-black text-slate-200 uppercase">{unit}</span>}
    </div>
  </div>
);

// Sub-component: Chart Box
const ChartContainer = ({ title, children, icon }) => (
  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-[450px] hover:shadow-lg transition-all">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">{title}</h3>
      {icon}
    </div>
    <div className="h-[320px]">
      {children}
    </div>
  </div>
);
