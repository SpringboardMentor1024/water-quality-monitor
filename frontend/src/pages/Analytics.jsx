import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart3, Zap, Search, CheckCircle2, AlertTriangle } from "lucide-react";
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, YAxis 
} from "recharts";
import { getStations, getStationSeries } from "../utils/api";

export default function Analytics() {
  const { id: urlId } = useParams(); 
  const navigate = useNavigate();
  
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(urlId || ""); 
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]); 
  const [predictions, setPredictions] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const stationList = await getStations();
        const safeList = Array.isArray(stationList) ? stationList : [];
        setStations(safeList);
        
        // Priority: Use ID from URL, if none, use the first available station
        const finalId = urlId || (safeList.length > 0 ? safeList[0].id : "");
        
        if (finalId) {
          setSelectedStationId(finalId);
          loadSeries(finalId);
        }
      } catch (err) { console.error("Initialization Error:", err); }
      finally { setLoading(false); }
    };
    init();
  }, [urlId]);

  const loadSeries = async (sid) => {
    try {
      const data = await getStationSeries(sid, 30);
      if (data?.series) {
        const s = data.series;
        const formatted = (data.timestamps || []).map((t, i) => ({
          name: new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          ph: s.ph?.[i] ?? 0,
          turb: s.turbidity?.[i] ?? 0,
          do: s.do?.[i] ?? 0,
        }));
        setHistory(formatted);
        processIntelligence(formatted, sid);
      }
    } catch (err) { console.error("Series Load Error:", err); }
  };

  const processIntelligence = (data, sid) => {
    if (!data.length) return;

    // 1. pH DISTRIBUTION CALCULATION
    const distMap = { "Acidic (<6.5)": 0, "Neutral (6.5-7.5)": 0, "Alkaline (>7.5)": 0 };
    data.forEach(d => {
      if (d.ph < 6.5 && d.ph > 0) distMap["Acidic (<6.5)"]++;
      else if (d.ph > 7.5) distMap["Alkaline (>7.5)"]++;
      else if (d.ph >= 6.5) distMap["Neutral (6.5-7.5)"]++;
    });
    setDistribution(Object.keys(distMap).map(k => ({ range: k, count: distMap[k] })));

    const latest = data[data.length - 1];
    const avgTurb = data.reduce((a, b) => a + b.turb, 0) / data.length;

    // 2. HEALTH LOGS (Green = Safe, Orange = Threshold Warning)
    setLogs([
      { type: "Turbidity", val: `${latest.turb.toFixed(1)} NTU`, color: latest.turb > 5.0 ? "orange" : "green" },
      { type: "Oxygen", val: `${latest.do.toFixed(1)} mg/L`, color: latest.do < 5.0 ? "orange" : "green" },
      { type: "pH Level", val: latest.ph.toFixed(2), color: (latest.ph < 6.5 || latest.ph > 8.5) ? "orange" : "green" }
    ]);

    // 3. PREDICTIONS (Comparing Latest to 30-day Average)
    setPredictions([
      { title: latest.turb > avgTurb * 1.15 ? "Turbidity Surge Risk" : "Turbidity Stability", param: "Turbidity", prob: "75%", color: latest.turb > avgTurb * 1.15 ? "orange" : "green" },
      { title: latest.do < 5.0 ? "Oxygen Depletion Risk" : "Optimal Oxygen Levels", param: "Oxygen", prob: "80%", color: latest.do < 5.0 ? "orange" : "green" }
    ]);
  };

  const handleStationChange = (e) => {
    const newId = e.target.value;
    if (newId) navigate(`/analytics/${newId}`); 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-black text-[#1e3a8a] animate-pulse uppercase tracking-widest text-xs">
      Syncing Engine...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="bg-[#1e3a8a] rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden">
        <h1 className="text-6xl font-black tracking-tighter uppercase mb-2 italic">Analytics Engine</h1>
        <div className="relative max-w-xl mt-8">
          <select 
            value={selectedStationId} 
            onChange={handleStationChange}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 font-black text-sm uppercase outline-none text-white cursor-pointer"
          >
            {stations.map(s => <option key={s.id} value={s.id} className="text-[#1e3a8a] bg-white">{s.name || s.id}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TrendCard title="pH Trend" data={history} k="ph" color="#22c55e" />
        <TrendCard title="Turbidity Trend" data={history} k="turb" color="#f97316" />
        <TrendCard title="Oxygen Trend" data={history} k="do" color="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
          <h4 className="font-black text-[#1e3a8a] uppercase text-[11px] mb-10">pH Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distribution} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="range" type="category" tick={{fontSize: 9, fontWeight: 900}} axisLine={false} width={100} />
              <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={25}>
                {distribution.map((e, i) => <Cell key={i} fill={i === 1 ? '#1e3a8a' : '#eff6ff'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">System Health Logs</h3>
          {logs.map((log, i) => <LogRow key={i} {...log} date={history[history.length-1]?.name} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        {predictions.map((p, i) => (
          <PredictionCard key={i} {...p} sid={selectedStationId} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

const TrendCard = ({ title, data, k, color }) => (
  <div className="bg-white p-8 rounded-[45px] shadow-sm border border-slate-100 h-[320px]">
    <h4 className="font-black text-[#1e3a8a] uppercase text-[10px] mb-8">{title}</h4>
    <ResponsiveContainer width="100%" height="70%">
      <AreaChart data={data}>
        <Tooltip contentStyle={{borderRadius:'20px', border:'none'}} />
        <Area type="monotone" dataKey={k} stroke={color} fill={color} fillOpacity={0.1} strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const LogRow = ({ type, val, date, color }) => (
  <div className="bg-white p-6 rounded-[30px] border border-slate-100 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${color === 'green' ? 'bg-emerald-500' : 'bg-orange-500'}`}>
        {color === 'green' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest ${color === 'green' ? 'text-emerald-600' : 'text-orange-600'}`}>{type}</p>
        <p className="text-lg font-black text-slate-800 italic">Reading: {val}</p>
      </div>
    </div>
    <p className="text-[8px] font-black text-slate-300 uppercase">{date}</p>
  </div>
);

const PredictionCard = ({ title, param, prob, color, sid, navigate }) => (
  <div className={`bg-white p-10 rounded-[50px] shadow-sm border-t-8 h-64 flex flex-col justify-between ${color === 'green' ? 'border-emerald-500' : 'border-orange-500'} relative z-10`}>
    <div className="flex justify-between items-start">
      <h4 className="text-xl font-black text-slate-900 uppercase leading-none">{title}</h4>
      <Zap className={color === 'green' ? 'text-emerald-500' : 'text-orange-500'} />
    </div>
    <div className="flex gap-12">
      <div><p className="text-[9px] font-black text-slate-400 uppercase">Parameter</p><p className="text-sm font-bold">{param}</p></div>
      <div><p className="text-[9px] font-black text-slate-400 uppercase">Confidence</p><p className="text-sm font-black">{prob}</p></div>
    </div>
    <button 
      onClick={() => navigate(`/prediction-details/${sid}/${param.toLowerCase()}`)}
      className="bg-[#1e3a8a] text-white px-8 py-3 rounded-2xl font-black text-[9px] uppercase shadow-xl hover:bg-blue-900 self-end z-20 pointer-events-auto"
    >
      Details
    </button>
  </div>
);