import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ShieldCheck, CheckCircle, XCircle, FileText, 
  Zap, AlertTriangle, Calendar, Activity, RefreshCw
} from "lucide-react";
import { 
  Area, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ComposedChart, ReferenceArea 
} from "recharts";
import api from "../utils/api";

export default function NGOStationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- REAL DATA STATE ---
  const [station, setStation] = useState(null);
  const [timeframe, setTimeframe] = useState("hourly");
  const [data, setData] = useState([]);
  const [reports, setReports] = useState([]);

  // --- UI STATE ---
  const [loading, setLoading] = useState(true);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [modNote, setModNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  // 1. 🟢 FETCH STATION DETAILS & REPORTS
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch station details
        const detailsRes = await api.get(`/stations/${id}`);
        setStation(detailsRes.data);
        
        // Fetch all reports & filter for this station
        const reportsRes = await api.get("/reports/"); // Adjust endpoint as needed
        setReports(reportsRes.data.filter(r => r.station_id === parseInt(id)));
        
      } catch (err) {
        console.error("Failed to fetch station details:", err);
        setError("Failed to load station data");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  // 2. 🟢 FETCH TIME-SERIES DATA - PERFECT BACKEND SYNC
  useEffect(() => {
    const loadSeries = async () => {
      if (!station) return;
      setSeriesLoading(true);
      
      try {
        const response = await api.get(`/stations/${id}/series`, {
          params: { points: timeframe === 'hourly' ? 12 : 30 }
        });
        
        console.log("🟢 SERIES RESPONSE:", response.data);
        
        // ✅ YOUR EXACT BACKEND STRUCTURE: {timestamps: [], series: {ph:[], turbidity:[], do:[]}}
        if (response.data?.timestamps && response.data?.series) {
          const timestamps = response.data.timestamps;
          const series = response.data.series;
          
          const formatted = timestamps.map((timestamp, i) => ({
            time: new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            ph: series.ph?.[i] ?? series.pH?.[i] ?? 0,
            turb: series.turbidity?.[i] ?? series.Turbidity?.[i] ?? 0,
            do: series.do?.[i] ?? series.DO?.[i] ?? series.Oxygen?.[i] ?? 0,
            // Prediction lines
            pred_ph: i >= timestamps.length - 3 ? (series.ph?.[i] || 7) + 0.2 : null,
            pred_turb: i >= timestamps.length - 3 ? (series.turbidity?.[i] || 2) + 0.8 : null,
            pred_do: i >= timestamps.length - 3 ? (series.do?.[i] || 6) - 0.3 : null
          }));
          
          setData(formatted);
          console.log("✅ Charts loaded:", formatted.length, "data points");
        } else {
          console.warn("⚠️ No series data:", response.data);
          setData([]);
        }
      } catch (err) {
        console.error("❌ Series fetch failed:", err);
        setData([]);
      } finally {
        setSeriesLoading(false);
      }
    };
    
    loadSeries();
  }, [id, timeframe, station]);

  // Latest values for snapshot cards
  const latest = data.length > 0 ? data[data.length - 1] : { ph: 0, turb: 0, do: 0 };

  // 3. 🟢 REPORT MODERATION
  const openModeration = (report, status) => {
    setCurrentReport(report);
    setPendingStatus(status);
    setModNote(report.moderation_notes || "");
    setIsModalOpen(true);
  };

  const saveModeration = async () => {
    try {
      await api.patch(`/reports/${currentReport.id}`, {
        status: pendingStatus.toLowerCase(),
        moderation_notes: modNote
      });
      
      setReports(prev => prev.map(r => 
        r.id === currentReport.id 
          ? { ...r, status: pendingStatus.toLowerCase(), moderation_notes: modNote } 
          : r
      ));
      
      setIsModalOpen(false);
      setToast({ 
        type: pendingStatus === 'verified' ? 'success' : 'error', 
        msg: pendingStatus === 'verified' ? "✅ Verified" : "❌ Rejected" 
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', msg: "Failed to update report" });
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8">
          <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6 shadow-xl"></div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Loading Station STN-{id}</h2>
          <p className="text-lg text-slate-600">Fetching charts & reports...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error || !station) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 max-w-md">
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-4">Station Not Found</h2>
          <p className="text-lg text-slate-600 mb-8">{error || "Station unavailable"}</p>
          <button 
            onClick={() => navigate('/ngo')} 
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            ← Back to NGO Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen font-sans relative">
      {/* 🔔 TOAST */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-300 border ${
          toast.type === 'success' 
            ? 'bg-emerald-600 border-emerald-500 text-white' 
            : 'bg-rose-600 border-rose-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20}/> : <XCircle size={20}/>}
          <span className="text-sm font-black uppercase tracking-wide">{toast.msg}</span>
        </div>
      )}

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button 
          onClick={() => navigate('/ngo')} 
          className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-700 tracking-widest hover:-translate-x-1 transition-transform p-2"
        >
          <ArrowLeft size={14} /> NGO Dashboard
        </button>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar">
          {["hourly", "daily", "weekly", "monthly"].map((t) => (
            <button 
              key={t} 
              onClick={() => setTimeframe(t)} 
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                timeframe === t 
                  ? 'bg-[#1e3a8a] text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <div className="bg-[#1e3a8a] w-full rounded-[32px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-8 group">
        <div className="space-y-4 z-10 w-full lg:w-auto">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
              STN-{id}
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck size={12}/> {station.managed_by || 'NGO Managed'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            {station.name}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 lg:border-l border-white/10 lg:pl-12 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0">
          <div>
            <p className="text-blue-300 text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Assigned Project</p>
            <p className="text-lg font-bold">Ganga Restoration 2026</p>
          </div>
          <div>
            <p className="text-blue-300 text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Status</p>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              station.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
              station.status === 'warning' ? 'bg-orange-500/20 text-orange-300' :
              'bg-red-500/20 text-red-300'
            }`}>
              {station.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. SNAPSHOT CARDS - REAL DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SnapshotSquare 
          label="pH Level" 
          val={latest.ph} 
          color="text-emerald-500" 
          icon={<Zap size={18}/>}
          unit=""
        />
        <SnapshotSquare 
          label="Turbidity" 
          val={latest.turb} 
          unit="NTU" 
          color="text-orange-500" 
          icon={<Activity size={18}/>}
        />
        <SnapshotSquare 
          label="Dissolved Oxygen" 
          val={latest.do} 
          unit="mg/L" 
          color="text-cyan-500" 
          icon={<Zap size={18}/>}
        />
      </div>

      {/* 4. PREDICTIVE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {seriesLoading ? (
          <div className="col-span-full h-40 flex items-center justify-center text-slate-300 font-black uppercase text-xs tracking-widest">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading Trends...
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full h-40 flex items-center justify-center text-slate-400 font-semibold">
            No data available for selected timeframe
          </div>
        ) : (
          <>
            <PredictiveCard 
              title="pH Forecast" 
              data={data} 
              k="ph" 
              pk="pred_ph" 
              color="#10b981" 
              threshold={8.5} 
            />
            <PredictiveCard 
              title="Turbidity Risk" 
              data={data} 
              k="turb" 
              pk="pred_turb" 
              color="#f59e0b" 
              threshold={5.0} 
            />
            <PredictiveCard 
              title="Oxygen Trend" 
              data={data} 
              k="do" 
              pk="pred_do" 
              color="#0ea5e9" 
              threshold={4.0} 
              lowThreshold={true}
            />
          </>
        )}
      </div>

      {/* 5. REPORT MODERATION */}
      <section className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 rounded-xl">
            <FileText className="text-blue-600" size={20}/>
          </div>
          <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">
            Report Moderation ({reports.length})
          </h3>
        </div>
        
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="p-10 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">
              No Active Community Reports
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-blue-300 transition-all">
                <div className="flex items-start gap-5 mb-4 md:mb-0 w-full">
                  <div className={`p-3 rounded-xl ${
                    r.status === 'pending' 
                      ? 'bg-amber-100 text-amber-600' 
                      : r.status === 'verified' 
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <ShieldCheck size={20}/>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-800 uppercase">{r.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                      {new Date(r.created_at).toLocaleDateString()} • {r.user_email}
                    </p>
                    <div className="mt-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        r.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 
                        r.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    {r.moderation_notes && (
                      <p className="text-[10px] text-blue-600 mt-2 italic border-l-2 border-blue-200 pl-2">
                        "{r.moderation_notes}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  {r.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => openModeration(r, 'verified')} 
                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-md hover:bg-emerald-600 transition-all text-[10px] font-black uppercase"
                      >
                        Verify
                      </button>
                      <button 
                        onClick={() => openModeration(r, 'rejected')} 
                        className="flex-1 md:flex-none px-4 py-2 bg-rose-500 text-white rounded-xl shadow-md hover:bg-rose-600 transition-all text-[10px] font-black uppercase"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODERATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-900 uppercase italic mb-6">
              {pendingStatus} Report
            </h3>
            <textarea 
              value={modNote} 
              onChange={(e) => setModNote(e.target.value)} 
              className="w-full h-32 bg-slate-50 rounded-2xl border-none p-5 text-xs font-medium focus:ring-4 focus:ring-blue-100 mb-6"
              placeholder="Enter technical reasoning for moderation decision..."
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-3 text-[10px] font-black uppercase text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={saveModeration} 
                className="flex-1 py-3 bg-[#1e3a8a] text-white rounded-xl text-[10px] font-black uppercase shadow-xl hover:shadow-2xl transition-all"
              >
                Confirm {pendingStatus}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SNAPSHOT SQUARE COMPONENT
const SnapshotSquare = ({ label, val, unit = "", color, icon }) => (
  <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center h-[160px] group hover:border-blue-200 transition-all duration-300">
    <div className="mb-3 p-3 bg-slate-50 rounded-full group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className={`text-4xl font-black tracking-tighter ${color}`}>
      {Number(val || 0).toFixed(2)}
      {unit && <span className="text-[10px] ml-1 text-slate-300">{unit}</span>}
    </p>
  </div>
);

// PREDICTIVE CHART COMPONENT
const PredictiveCard = ({ title, data, k, pk, color, threshold, lowThreshold = false }) => (
  <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-100 h-[320px] flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
      {title}
    </h4>
    <div className="flex-1 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              fontSize: '10px',
              backgroundColor: 'white',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }} 
          />
          <ReferenceArea 
            y1={lowThreshold ? 0 : threshold} 
            y2={lowThreshold ? threshold : 100} 
            fill="#fee2e2" 
            fillOpacity={0.5} 
            label="Risk Zone"
          />
          <Area 
            type="monotone" 
            dataKey={k} 
            stroke={color} 
            fill={color} 
            fillOpacity={0.05} 
            strokeWidth={3} 
          />
          <Line 
            type="monotone" 
            dataKey={pk} 
            stroke={color} 
            strokeDasharray="5 5" 
            strokeWidth={2} 
            dot={false} 
            connectNulls 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);
