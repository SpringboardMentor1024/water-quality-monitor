import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, Info, Zap, MapPin, Droplets } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getStationDetails, getStationSeries } from "../utils/api";

export default function StationReadings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stationData = await getStationDetails(id);
        const seriesData = await getStationSeries(id);
        setDetails(stationData);

        if (seriesData?.series) {
          const s = seriesData.series;
          // 🔴 SYNC FIX: Map backend keys to history state
          // Backend uses 'do' for Oxygen and 'turbidity' for Turbidity
          const formatted = (seriesData.timestamps || []).map((t, idx) => ({
            time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ph: s.ph?.[idx] ?? 0,
            do: s.do?.[idx] ?? 0, 
            turb: s.turbidity?.[idx] ?? 0
          }));
          setHistory(formatted);
        }
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  /**
   * Helper to get the latest value for snapshots
   * Maps short frontend keys to full backend schema keys
   */
  const getVal = (k) => {
    const keyMap = { 
        do: 'dissolved_oxygen', 
        turb: 'turbidity', 
        ph: 'ph' 
    };
    const backendKey = keyMap[k] || k;

    // Check real-time snapshot first
    const realTime = details?.latest_readings?.[backendKey];
    if (realTime && realTime !== 0) return realTime;

    // Fallback to the last point in history if real-time is null
    if (history.length > 0) {
      const histKey = k; // matches formatted array keys: ph, do, turb
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i][histKey] && history[i][histKey] !== 0) return history[i][histKey];
      }
    }
    return 0.0;
  };

  if (loading || !details) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="p-12 text-center animate-pulse font-black text-blue-900 tracking-widest text-xs uppercase">
        Establishing Secure Link...
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 md:space-y-12 bg-[#f8fafc] min-h-screen font-sans">
      
      <button 
        onClick={() => navigate(-1)} 
        className="text-blue-700 font-black flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] hover:-translate-x-1 transition-transform group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:scale-125 transition-transform" /> Back to Overview
      </button>

      {/* HERO CARD */}
      <div className="bg-[#1e3a8a] rounded-[30px] md:rounded-[50px] p-8 md:p-12 text-white shadow-2xl flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-8 md:gap-12 relative overflow-hidden">
        <div className="z-10 flex-1">
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-none break-words">
            {details.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-4">
              <MapPin className="text-blue-400 w-5 h-5" />
              <div>
                <p className="text-[9px] font-black uppercase opacity-40">Location</p>
                <p className="text-sm font-bold">{details.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Zap className="text-yellow-400 w-5 h-5" />
              <div>
                <p className="text-[9px] font-black uppercase opacity-40">Station ID</p>
                <p className="text-sm font-bold">STN-{details.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LIVE SNAPSHOT MINI-CARD */}
        <div className="bg-white/10 backdrop-blur-3xl rounded-[35px] p-8 border border-white/20 z-10 shadow-2xl w-full lg:w-[400px] flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase mb-8 tracking-[0.3em] opacity-40">Live Snapshot</p>
          <div className="space-y-6">
            <SnapshotRow label="pH Level" val={getVal('ph').toFixed(2)} />
            <SnapshotRow label="Turbidity" val={getVal('turb').toFixed(2)} unit="NTU" />
            <SnapshotRow label="Oxygen" val={getVal('do').toFixed(2)} unit="mg/L" isLast />
          </div>
        </div>
      </div>

      {/* SENSOR ANALYTICS BOXES */}
      <section>
        <h3 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-8 tracking-[0.4em] flex items-center gap-3">
          <span className="h-px w-10 bg-slate-200"></span> Sensor Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricBox title="PH LEVEL" val={getVal('ph')} unit="pH" color="green" />
          {/* 🔴 SYNC FIX: Ensure Oxygen saturation uses 'do' key */}
          <MetricBox title="DISSOLVED OXYGEN" val={getVal('do')} unit="mg/L" color="blue" />
          <MetricBox title="TURBIDITY" val={getVal('turb')} unit="NTU" color="orange" />
        </div>
      </section>

      {/* 24H TELEMETRY CHARTS */}
      <section className="pb-10">
        <h3 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-8 tracking-[0.4em] flex items-center gap-3">
          <span className="h-px w-10 bg-slate-200"></span> 24H Telemetry
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AdvancedChart title="pH Dynamics" data={history} k="ph" color="#22c55e" unit="pH units" />
          <AdvancedChart title="Turbidity Levels" data={history} k="turb" color="#f97316" unit="NTU" />
          {/* 🔴 SYNC FIX: Chart data key set to 'do' to match history array mapping */}
          <AdvancedChart title="Oxygen Saturation" data={history} k="do" color="#3b82f6" unit="mg/L" />
        </div>
      </section>
    </div>
  );
}

const SnapshotRow = ({ label, val, unit, isLast }) => (
  <div className={`flex justify-between items-center ${!isLast ? 'border-b border-white/10 pb-4' : ''}`}>
    <span className="text-xs font-bold opacity-60">{label}</span>
    <span className="text-xl font-black">{val} {unit && <span className="text-[9px] opacity-30 ml-1">{unit}</span>}</span>
  </div>
);

const MetricBox = ({ title, val, unit, color }) => (
  <div className="bg-white p-12 rounded-[45px] shadow-sm border border-slate-100 flex flex-col justify-between h-64 hover:shadow-xl transition-all duration-500 group">
    <div className="flex justify-between items-start">
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{title}</span>
      <div className={`p-1.5 rounded-full ${color === 'green' ? 'bg-green-50 text-emerald-600' : color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
        <Activity className="w-3 h-3" />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-7xl font-black text-slate-900 tracking-tighter group-hover:text-blue-800 transition-colors duration-500">{val.toFixed(2)}</span>
      <span className="text-sm font-black text-slate-200 uppercase">{unit}</span>
    </div>
  </div>
);

const AdvancedChart = ({ title, data, k, color, unit }) => (
  <div className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100 h-[500px] hover:shadow-xl transition-all duration-500">
    <div className="flex justify-between items-start mb-10">
      <div>
        <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest mb-1">{title}</h4>
        <p className="text-[9px] text-slate-400 font-black uppercase">{unit}</p>
      </div>
      <Zap className="w-4 h-4 text-yellow-400" />
    </div>
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 40 }}>
          <defs>
            <linearGradient id={`gradient${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" angle={-45} textAnchor="end" interval="preserveStartEnd" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} axisLine={false} tickLine={false} dy={10} />
          <YAxis fontSize={9} fontWeight="black" stroke="#cbd5e1" axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '12px' }} />
          <Area type="monotone" dataKey={k} stroke={color} strokeWidth={4} fillOpacity={1} fill={`url(#gradient${k})`} dot={{ r: 3, fill: color, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);