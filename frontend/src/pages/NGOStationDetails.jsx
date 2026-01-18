import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ShieldCheck, CheckCircle, XCircle, FileText, 
  Zap, AlertTriangle, Calendar, Download, X, Activity, RefreshCw
} from "lucide-react";
import { 
  Area, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ComposedChart, ReferenceArea 
} from "recharts";
// 🟢 API IMPORT: Ensure these are exported in your utils/api.js
import { 
  getStationDetails, 
  getStationSeries, 
  getAllReports, 
  updateReportStatus 
} from "../utils/api";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [modNote, setModNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");
  const [toast, setToast] = useState(null);

  // 1. 🟢 FETCH INITIAL STATION & REPORT DATA
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [details, allReports] = await Promise.all([
          getStationDetails(id),
          getAllReports()
        ]);
        setStation(details);
        // Filter reports only for this station
        setReports(allReports.filter(r => r.station_id === parseInt(id)));
      } catch (err) {
        console.error("Failed to fetch station details:", err);
      }
    };
    fetchInitialData();
  }, [id]);

  // 2. 🟢 FETCH TIME-SERIES DATA (Refreshes on timeframe change)
  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      try {
        const response = await getStationSeries(id, timeframe === 'hourly' ? 12 : 30);
        if (response?.series) {
          const s = response.series;
          const formatted = (response.timestamps || []).map((t, i) => ({
            time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            // 🟢 KEY SYNC: Matching your scheduler.py parameter names
            ph: s.pH?.[i] ?? 0,
            turb: s.Turbidity?.[i] ?? 0,
            do: s.Oxygen?.[i] ?? 0,
            // Simple logic for forecast (backend can eventually provide this)
            pred_ph: i > response.timestamps.length - 4 ? (s.pH?.[i] || 7) + 0.1 : null,
            pred_turb: i > response.timestamps.length - 4 ? (s.Turbidity?.[i] || 2) + 0.5 : null,
            pred_do: i > response.timestamps.length - 4 ? (s.Oxygen?.[i] || 6) - 0.2 : null
          }));
          setData(formatted);
        }
      } catch (err) {
        console.error("Series Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSeries();
  }, [id, timeframe]);

  const latest = data.findLast(d => d.ph !== null) || { ph: 0, turb: 0, do: 0 };

  // 3. 🟢 MODERATION LOGIC (Synced with Backend PATCH)
  const openModeration = (report, status) => {
    setCurrentReport(report);
    setPendingStatus(status);
    setModNote(report.moderation_notes || "");
    setIsModalOpen(true);
  };

  const saveModeration = async () => {
    try {
      // 🟢 API CALL: Update status in database
      await updateReportStatus(currentReport.id, pendingStatus, modNote);
      
      // Update local state for immediate UI feedback
      setReports(prev => prev.map(r => 
        r.id === currentReport.id ? { ...r, status: pendingStatus.toLowerCase(), moderation_notes: modNote } : r
      ));
      
      setIsModalOpen(false);
      const isVerify = pendingStatus === 'verified';
      setToast({ 
        type: isVerify ? 'success' : 'error', 
        msg: isVerify ? "Verification Saved to Database" : "Report Rejected" 
      });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', msg: "Failed to update backend." });
    }
  };

  if (!station) return <div className="min-h-screen flex items-center justify-center font-black text-blue-900 animate-pulse">CONNECTING TO COMMAND...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen font-sans relative">
      
      {/* 🔔 TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-300 border ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={20}/> : <XCircle size={20}/>}
          <span className="text-sm font-black uppercase tracking-wide">{toast.msg}</span>
        </div>
      )}

      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-700 tracking-widest hover:-translate-x-1 transition-transform p-2">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar">
          {["hourly", "daily", "weekly", "monthly"].map((t) => (
            <button key={t} onClick={() => setTimeframe(t)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* 2. HERO SECTION (Real Station Data) */}
      <div className="bg-[#1e3a8a] w-full rounded-[32px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-8 group">
        <div className="space-y-4 z-10 w-full lg:w-auto">
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">STN-{id}</span>
             <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1"><ShieldCheck size={12}/> {station.managed_by || 'NGO Managed'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">{station.name}</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 lg:border-l border-white/10 lg:pl-12 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0">
           <div>
             <p className="text-blue-300 text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Assigned Project</p>
             <p className="text-lg font-bold">Ganga Restoration 2026</p>
           </div>
           <div>
             <p className="text-blue-300 text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Contract Validity</p>
             <p className="text-lg font-bold flex items-center gap-2 text-cyan-400"><Calendar size={18}/> {station.duration || '11 Months Left'}</p>
           </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SNAPSHOTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SnapshotSquare label="pH Level" val={latest.ph} color="text-emerald-500" icon={<Zap size={18}/>} />
        <SnapshotSquare label="Turbidity" val={latest.turb} unit="NTU" color="text-orange-500" icon={<Activity size={18}/>} />
        <SnapshotSquare label="Oxygen" val={latest.do} unit="mg/L" color="text-cyan-500" icon={<Zap size={18}/>} />
      </div>

      {/* 4. PREDICTIVE CHARTS (Loading States included) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full h-40 flex items-center justify-center text-slate-300 font-black uppercase text-xs tracking-widest">Generating Predictive Path...</div>
        ) : (
          <>
            <PredictiveCard title="pH Forecast" data={data} k="ph" pk="pred_ph" color="#10b981" threshold={8.5} />
            <PredictiveCard title="Turbidity Risk" data={data} k="turb" pk="pred_turb" color="#f59e0b" threshold={5.0} />
            <PredictiveCard title="Oxygen Trend" data={data} k="do" pk="pred_do" color="#0ea5e9" threshold={4.0} lowThreshold={true} />
          </>
        )}
      </div>

      {/* 5. REPORT MODERATION PORTAL */}
      <section className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 rounded-xl"><FileText className="text-blue-600" size={20}/></div>
          <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Report Moderation Portal</h3>
        </div>
        
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="p-10 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">No Active Community Reports</div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group transition-all hover:border-blue-300">
                <div className="flex items-start gap-5 mb-4 md:mb-0 w-full">
                  <div className={`p-3 rounded-xl ${r.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <ShieldCheck size={20}/>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-800 uppercase">{r.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(r.created_at || Date.now()).toLocaleDateString()} • {r.user_email}</p>
                    <div className="mt-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${r.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                    </div>
                    {r.moderation_notes && <p className="text-[10px] text-blue-600 mt-2 italic border-l-2 border-blue-200 pl-2">"{r.moderation_notes}"</p>}
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => openModeration(r, 'verified')} className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-md hover:bg-emerald-600 transition-all text-[10px] font-black uppercase">Verify</button>
                  <button onClick={() => openModeration(r, 'rejected')} className="flex-1 md:flex-none px-4 py-2 bg-rose-500 text-white rounded-xl shadow-md hover:bg-rose-600 transition-all text-[10px] font-black uppercase">Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
             <h3 className="text-xl font-black text-slate-900 uppercase italic mb-6">Moderation Action</h3>
             <textarea value={modNote} onChange={(e) => setModNote(e.target.value)} className="w-full h-32 bg-slate-50 rounded-2xl border-none p-5 text-xs font-medium focus:ring-4 focus:ring-blue-100 mb-6" placeholder="Enter technical reasoning..."/>
             <div className="flex gap-3">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[10px] font-black uppercase text-slate-500">Cancel</button>
               <button onClick={saveModeration} className="flex-1 py-3 bg-[#1e3a8a] text-white rounded-xl text-[10px] font-black uppercase shadow-xl">Confirm {pendingStatus}</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components (SnapshotSquare, PredictiveCard) stay the same as previous design
const SnapshotSquare = ({ label, val, unit, color, icon }) => (
  <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center h-[160px] group hover:border-blue-200 transition-all duration-300">
    <div className="mb-3 p-3 bg-slate-50 rounded-full group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-4xl font-black tracking-tighter ${color}`}>{Number(val || 0).toFixed(2)}<span className="text-[10px] ml-1 text-slate-300">{unit}</span></p>
  </div>
);

const PredictiveCard = ({ title, data, k, pk, color, threshold, lowThreshold }) => (
  <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-100 h-[320px] flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
    <div className="flex-1 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="time" hide /> <YAxis hide domain={['auto', 'auto']} />
          <Tooltip contentStyle={{borderRadius: '12px', border: 'none', fontSize:'10px'}} />
          <ReferenceArea y1={lowThreshold ? 0 : threshold} y2={lowThreshold ? threshold : 100} fill="#fee2e2" fillOpacity={0.5} />
          <Area type="monotone" dataKey={k} stroke={color} fill={color} fillOpacity={0.05} strokeWidth={3} />
          <Line type="monotone" dataKey={pk} stroke={color} strokeDasharray="5 5" strokeWidth={2} dot={false} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);