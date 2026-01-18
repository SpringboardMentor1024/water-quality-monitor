import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart3, Zap, Search, CheckCircle2, AlertTriangle, ArrowLeft, Activity } from "lucide-react";
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, YAxis, CartesianGrid 
} from "recharts";
import { getStations, getStationSeries } from "../utils/api";
import PredictiveAlertsMock from "../components/PredictiveAlertsMock";

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
        
        const finalId = urlId || (safeList.length > 0 ? safeList[0].id : "");
        
        if (finalId) {
          setSelectedStationId(finalId);
          await loadSeries(finalId);
        }
      } catch (err) { 
        console.error("Initialization Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    init();
  }, [urlId]);

  const loadSeries = async (sid) => {
    try {
      const data = await getStationSeries(sid, 30);
      if (data?.series) {
        const s = data.series;
        
        // 🟢 SYNCED MAPPING: Using your working key logic
        const formatted = (data.timestamps || []).map((t, idx) => ({
          name: new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          ph: s.ph?.[idx] ?? 0,
          do: s.do?.[idx] ?? 0, 
          turb: s.turbidity?.[idx] ?? 0
        }));

        setHistory(formatted);
        processIntelligence(formatted, sid);
      }
    } catch (err) { 
      console.error("Series Load Error:", err); 
    }
  };

  /**
   * 🟢 SYNC FIX: Logic to extract the latest non-zero value
   */
  const getLatestVal = (dataArray, key) => {
    if (!dataArray || dataArray.length === 0) return 0.0;
    for (let i = dataArray.length - 1; i >= 0; i--) {
      if (dataArray[i][key] && dataArray[i][key] !== 0) {
        return dataArray[i][key];
      }
    }
    return 0.0;
  };

  const processIntelligence = (freshData, sid) => {
    if (!freshData || freshData.length === 0) return;

    // 1. pH DISTRIBUTION
    const distMap = { "Acidic (<6.5)": 0, "Neutral (6.5-7.5)": 0, "Alkaline (>7.5)": 0 };
    freshData.forEach(d => {
      if (d.ph < 6.5 && d.ph > 0) distMap["Acidic (<6.5)"]++;
      else if (d.ph > 7.5) distMap["Alkaline (>7.5)"]++;
      else if (d.ph >= 6.5) distMap["Neutral (6.5-7.5)"]++;
    });
    setDistribution(Object.keys(distMap).map(k => ({ range: k, count: distMap[k] })));

    // 🟢 SYNC FIX: Use the fallback helper for Health Logs
    const latestTurb = getLatestVal(freshData, 'turb');
    const latestDo = getLatestVal(freshData, 'do');
    const latestPh = getLatestVal(freshData, 'ph');

    const avgTurb = freshData.reduce((a, b) => a + (b.turb || 0), 0) / freshData.length;

    // 2. HEALTH LOGS
    setLogs([
      { type: "Turbidity", val: `${latestTurb.toFixed(1)} NTU`, color: latestTurb > 5.0 ? "orange" : "green" },
      { type: "Oxygen", val: `${latestDo.toFixed(1)} mg/L`, color: latestDo < 5.0 ? "orange" : "green" },
      { type: "pH Level", val: latestPh.toFixed(2), color: (latestPh < 6.5 || latestPh > 8.5) ? "orange" : "green" }
    ]);

    // 3. PREDICTIONS
    setPredictions([
      { title: latestTurb > avgTurb * 1.15 ? "Turbidity Surge Risk" : "Turbidity Stability", param: "Turbidity", prob: "75%", color: latestTurb > avgTurb * 1.15 ? "orange" : "green" },
      { title: latestDo < 5.0 ? "Oxygen Depletion Risk" : "Optimal Oxygen Levels", param: "Oxygen", prob: "80%", color: latestDo < 5.0 ? "orange" : "green" }
    ]);
  };

  const handleStationChange = (e) => {
    const newId = e.target.value;
    if (newId) navigate(`/analytics/${newId}`); 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-black text-[#1e3a8a] animate-pulse uppercase tracking-widest text-xs">
      Syncing Intelligence...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER SECTION (Merged Design) */}
      <div className="bg-[#1e3a8a] rounded-[50px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase mb-4 opacity-60 hover:opacity-100 transition-all">
              <ArrowLeft size={14}/> Dashboard
            </button>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">Analytics Engine</h1>
          </div>
          <div className="w-full md:w-72">
            <select 
              value={selectedStationId} 
              onChange={handleStationChange}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 font-black text-xs uppercase outline-none text-white cursor-pointer"
            >
              {stations.map(s => <option key={s.id} value={s.id} className="text-[#1e3a8a] bg-white">{s.name || s.id}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* TREND CHARTS row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrendCard title="pH Level Trend" data={history} k="ph" color="#10b981" />
        <TrendCard title="Turbidity Trend" data={history} k="turb" color="#f59e0b" />
        <TrendCard title="Oxygen Trend" data={history} k="do" color="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
          <h4 className="font-black text-[#1e3a8a] uppercase text-[10px] mb-10 tracking-widest">pH Distribution Analysis</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distribution} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="range" type="category" tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} axisLine={false} width={110} />
              <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={20}>
                {distribution.map((e, i) => <Cell key={i} fill={i === 1 ? '#1e3a8a' : '#bfdbfe'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SYSTEM HEALTH LOGS */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">System Health Logs</h3>
          {logs.map((log, i) => <LogRow key={i} {...log} date={history[history.length-1]?.name} />)}
        </div>
      </div>

      {/* PREDICTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        {predictions.map((p, i) => (
          <PredictionCard key={i} {...p} sid={selectedStationId} navigate={navigate} />
        ))}
      </div>

      {/* ✅ PREDICTIVE ALERTS MOCK */}
      <PredictiveAlertsMock stationId={selectedStationId} />
    </div>
  );
}

// STYLING COMPONENTS
const TrendCard = ({ title, data, k, color }) => (
  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-[300px] flex flex-col justify-between hover:border-blue-200 transition-all">
    <h4 className="font-black text-slate-400 uppercase text-[9px] tracking-widest">{title}</h4>
    <div className="h-[180px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <Tooltip contentStyle={{borderRadius:'20px', border:'none', boxShadow:'0 10px 15px rgba(0,0,0,0.05)'}} />
          <Area type="monotone" dataKey={k} stroke={color} fill={color} fillOpacity={0.05} strokeWidth={3} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const LogRow = ({ type, val, date, color }) => (
  <div className="bg-white p-6 rounded-[35px] border border-slate-100 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${color === 'green' ? 'bg-emerald-500' : 'bg-orange-500'} shadow-lg`}>
        {color === 'green' ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
      </div>
      <div>
        <p className={`text-[9px] font-black uppercase tracking-widest ${color === 'green' ? 'text-emerald-600' : 'text-orange-600'}`}>{type}</p>
        <p className="text-xl font-black text-slate-800 italic leading-none mt-1">Reading: {val}</p>
      </div>
    </div>
    <p className="text-[9px] font-black text-slate-300 uppercase">{date}</p>
  </div>
);

const PredictionCard = ({ title, param, prob, color, sid, navigate }) => (
  <div className={`bg-white p-10 rounded-[50px] shadow-sm border-t-[12px] h-64 flex flex-col justify-between ${color === 'green' ? 'border-emerald-500' : 'border-orange-500'} transition-all hover:shadow-xl`}>
    <div className="flex justify-between items-start">
      <h4 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tighter w-2/3">{title}</h4>
      <Zap className={color === 'green' ? 'text-emerald-500' : 'text-orange-500'} size={24} fill="currentColor" />
    </div>
    <div className="flex gap-10">
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parameter</p><p className="text-sm font-bold">{param}</p></div>
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</p><p className="text-sm font-black">{prob}</p></div>
    </div>
    <button 
      onClick={() => navigate(`/prediction-details/${sid}/${param.toLowerCase()}`)}
      className="bg-[#1e3a8a] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-blue-900 self-end"
    >
      Analysis
    </button>
  </div>
);