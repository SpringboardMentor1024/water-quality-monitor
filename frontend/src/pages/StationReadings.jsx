import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStationReadings } from "../utils/api";
import ReadingCard from "../components/ReadingCard";
import PhLineChart from "../components/PhLineChart";

const StationReadings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("HOURLY");
  const [data, setData] = useState(null);

  useEffect(() => {
    getStationReadings(id, timeframe).then(setData);
  }, [id, timeframe]);

  if (!data) return <div className="p-20 text-center font-black text-blue-800">SYNCING LIVE DATA...</div>;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* 1. Station Overview Header */}
      <div className="bg-blue-900 text-white p-8 rounded-[32px] shadow-2xl flex flex-col md:flex-row justify-between gap-8 border-4 border-white">
        <div className="space-y-4">
          <button onClick={() => navigate("/dashboard")} className="text-blue-300 text-[10px] font-black uppercase tracking-widest hover:underline">← Back to Overview</button>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">{data.name}</h1>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[10px] uppercase font-bold text-blue-300">
            <p>Station ID: <span className="text-white">{data.id}</span></p>
            <p>Last Updated: <span className="text-white">Just Now</span></p>
            <p>Managed By: <span className="text-white">{data.managed_by}</span></p>
            <p>Status: <span className="text-green-400 font-black italic">● ACTIVE</span></p>
          </div>
          <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg active:scale-95 transition-transform">Initiate Collaboration</button>
        </div>

        {/* Quick Current Readings */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 min-w-[280px]">
          <h3 className="text-xs font-black uppercase mb-4 border-b border-white/10 pb-2">Latest Readings</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span>pH Level</span> <span className="font-black text-blue-300">{data.ph}</span></div>
            <div className="flex justify-between text-sm"><span>Temperature</span> <span className="font-black text-blue-300">{data.temp}°C</span></div>
            <div className="flex justify-between text-sm"><span>Dissolved Oxygen</span> <span className="font-black text-blue-300">{data.do} mg/L</span></div>
          </div>
        </div>
      </div>

      {/* 2. Time Filter Selection */}
      <div className="flex justify-end bg-white/50 p-1 rounded-2xl w-fit ml-auto border border-blue-50">
        {["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"].map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all ${
              timeframe === t ? "bg-blue-900 text-white shadow-xl" : "text-gray-400 hover:text-blue-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 3. Detailed Real-time Readings Grid */}
      <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight italic border-l-4 border-blue-600 pl-4">Detailed Real-time Readings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReadingCard label="pH Level" value={data.ph} unit="pH" status="Normal" />
        <ReadingCard label="Dissolved Oxygen" value={data.do} unit="mg/L" status="Normal" />
        <ReadingCard label="Temperature" value={data.temp} unit="°C" status="Normal" />
        <ReadingCard label="Lead (Pb)" value="0.003" unit="ppm" status="Normal" />
        <ReadingCard label="Arsenic (As)" value={data.arsenic} unit="ppm" status={data.status === "WARNING" ? "Alert" : "Normal"} />
        <ReadingCard label="E-Coli" value={data.ecoil} unit="cfu" status={data.status === "WARNING" ? "Warning" : "Normal"} />
      </div>

      {/* 4. Historical Trend Charts */}
      <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight italic border-l-4 border-blue-600 pl-4">Historical Trend Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
          <h4 className="text-[10px] font-black text-blue-900 uppercase mb-4">pH Level Trend</h4>
          <div className="h-32"><PhLineChart barHeights={data.charts.ph} isWarning={false} /></div>
          <p className="text-[8px] text-center text-gray-400 font-bold uppercase mt-4">Value in pH units</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
          <h4 className="text-[10px] font-black text-blue-900 uppercase mb-4">Dissolved Oxygen Trend</h4>
          <div className="h-32"><PhLineChart barHeights={data.charts.do} isWarning={false} /></div>
          <p className="text-[8px] text-center text-gray-400 font-bold uppercase mt-4">Value in mg/L</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
          <h4 className="text-[10px] font-black text-blue-900 uppercase mb-4">Arsenic Level Trend</h4>
          <div className="h-32"><PhLineChart barHeights={data.charts.arsenic} isWarning={data.status === "WARNING"} /></div>
          <p className="text-[8px] text-center text-gray-400 font-bold uppercase mt-4">Value in ppm</p>
        </div>
      </div>
    </div>
  );
};

export default StationReadings;