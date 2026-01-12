import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";
import api from "../utils/api";

export default function Alerts() {
  // ... (keep all existing state and functions exactly the same)
  const [allAlerts, setAllAlerts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [stats, setStats] = useState({ active: 0, acknowledged: 0, total: 0 });
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    try {
      const cacheBuster = new Date().getTime();
      const res = await api.get(`/alerts/?_t=${cacheBuster}`);
      const alerts = res.data || [];
      const active = alerts.filter(alert => !alert.acknowledged);
      const acknowledged = alerts.filter(alert => alert.acknowledged);
      
      console.log(`📊 TOTAL ALERTS: ${alerts.length}, ACTIVE: ${active.length}, ACK: ${acknowledged.length}`);
      
      setAllAlerts(alerts);
      setActiveAlerts(active);
      setAcknowledgedAlerts(acknowledged);
      setStats({
        active: active.length,
        acknowledged: acknowledged.length,
        total: alerts.length
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAlerts = async () => {
    try {
      setGenerating(true);
      const res = await api.get("/alerts/generate-real-alerts");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchAlerts();
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("Failed to generate alerts:", err);
      alert("❌ Failed to generate alerts. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const acknowledgeAlert = async (id) => {
    try {
      await api.post(`/alerts/${id}/acknowledge`);
      fetchAlerts();
    } catch (err) {
      console.error(err);
      alert("Failed to acknowledge alert");
    }
  };

  // Loading & Error states (unchanged)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <div className="text-center font-black text-blue-800 animate-pulse uppercase tracking-[0.2em] text-base sm:text-lg px-4 sm:px-6">
          Loading Alert Network...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <div className="text-center max-w-md p-8 sm:p-12 w-full mx-4">
          <AlertCircle className="w-20 h-20 sm:w-24 sm:h-24 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Network Error</h2>
          <p className="text-slate-500 mb-8 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchAlerts}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black uppercase tracking-wide hover:bg-blue-700 transition-all w-full sm:w-auto"
          >
            🔄 Refresh Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-2 sm:p-4 md:p-8 font-sans">
      {/* 1. RESPONSIVE HEADER */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#1e3a8a] tracking-tighter leading-tight">
          🚨 Alerts
        </h1>
      </div>

      {/* 2. RESPONSIVE TABS */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12 w-full">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row p-1.5 md:p-2 overflow-hidden">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-4 sm:py-3 md:py-5 px-4 font-black text-sm sm:text-[10px] md:text-[11px] uppercase tracking-widest transition-all duration-500 w-full sm:w-auto ${
              activeTab === "active" 
                ? "bg-[#1e3a8a] text-white shadow-lg rounded-xl md:rounded-[20px]" 
                : "text-slate-400 hover:bg-slate-50 hover:text-[#1e3a8a]"
            }`}
          >
            Active Alerts ({stats.active})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-4 sm:py-3 md:py-5 px-4 font-black text-sm sm:text-[10px] md:text-[11px] uppercase tracking-widest transition-all duration-500 w-full sm:w-auto ${
              activeTab === "history" 
                ? "bg-emerald-600 text-white shadow-lg rounded-xl md:rounded-[20px]" 
                : "text-slate-400 hover:bg-slate-50 hover:text-emerald-600"
            }`}
          >
            History log ({stats.acknowledged})
          </button>
        </div>
      </div>

      {/* 3. RESPONSIVE STATS + GENERATE */}
      <div className="max-w-7xl mx-auto mb-12 w-full">
        <div className="bg-white rounded-[30px] p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center justify-between w-full">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="flex items-center gap-3 text-sm sm:text-base font-black text-slate-600 min-w-0 flex-1">
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Total:</span>
                <span className="text-2xl md:text-3xl text-[#1e3a8a] font-black">{stats.total}</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base font-black text-[#1e3a8a] min-w-0 flex-1">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{stats.active} Active</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base font-black text-emerald-600 min-w-0 flex-1">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{stats.acknowledged} Acknowledged</span>
              </div>
            </div>
            
            <button
              onClick={handleGenerateAlerts}
              disabled={generating}
              className={`group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-2xl md:rounded-[25px] font-black text-sm sm:text-base uppercase tracking-[0.1em] shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-3 w-full lg:w-auto ${
                generating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  🎲 Generate Real Alerts
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-xl group-hover:bg-white/30 hidden sm:inline">
                    289 Stations
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. WIDER FULL WIDTH ALERTS */}
      <div className="w-full max-w-6xl mx-auto space-y-0 px-2 sm:px-4">
        {activeTab === "active" && activeAlerts.length === 0 ? (
          <div className="text-center py-20 sm:py-24 bg-white/70 backdrop-blur-xl rounded-[45px] border-2 border-dashed border-blue-200 shadow-xl mx-4 sm:mx-auto max-w-4xl">
            <CheckCircle2 className="w-24 h-24 sm:w-32 sm:h-32 text-emerald-400 mx-auto mb-6 sm:mb-8 opacity-75" />
            <h3 className="text-3xl sm:text-5xl font-black text-slate-700 mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              🎉 All Clear
            </h3>
            <p className="text-lg sm:text-2xl text-slate-500 mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed">
              No active water quality alerts detected.
            </p>
          </div>
        ) : activeTab === "history" && acknowledgedAlerts.length === 0 ? (
          <div className="text-center py-20 sm:py-24 bg-white/70 backdrop-blur-xl rounded-[45px] border-2 border-dashed border-emerald-200 shadow-xl mx-4 sm:mx-auto max-w-4xl">
            <CheckCircle2 className="w-24 h-24 sm:w-32 sm:h-32 text-emerald-400 mx-auto mb-6 sm:mb-8" />
            <h3 className="text-3xl sm:text-5xl font-black text-slate-700 mb-4 sm:mb-6">No History</h3>
            <p className="text-lg sm:text-xl text-slate-500 mb-8 max-w-xl mx-auto">
              Acknowledge alerts to see response history here.
            </p>
          </div>
        ) : (
          (activeTab === "active" ? activeAlerts : acknowledgedAlerts).map((alert, index) => (
            <AlertRow 
              key={alert.id} 
              alert={alert} 
              index={index}
              onAcknowledge={acknowledgeAlert} 
              navigate={navigate} 
              mode={activeTab}
              isHistory={activeTab === "history"}
            />
          ))
        )}
      </div>
    </div>
  );
}

// UPDATED ALERT ROW - UNIFORM BUTTONS + NO ICONS
function AlertRow({ alert, index, onAcknowledge, navigate, mode, isHistory }) {
  return (
    <div className={`w-full transition-all duration-300 hover:bg-slate-50/80 border-b border-slate-100 py-5 sm:py-6 md:py-8 px-3 sm:px-6 md:px-10 last:border-b-0 group hover:border-blue-200/70 ${index % 2 === 0 ? 'bg-gradient-to-r from-blue-50/20 to-transparent' : 'bg-white/90'}`}>
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Row - MOBILE STACKED */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4 md:gap-6">
          {/* RED SEVERITY BADGE */}
          <div className={`px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl text-sm sm:text-base font-black shadow-lg flex-shrink-0 w-fit ${
            (alert.severity === 'CRITICAL' || alert.severity === 'WARNING') 
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
              : "bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white"
          }`}>
            {alert.severity}
          </div>
          
          {/* UNIFORM BUTTONS - SAME SIZE, NO ICONS, ACKNOWLEDGE ORANGE */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto sm:flex-shrink-0">
            {!isHistory && onAcknowledge && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAcknowledge(alert.id);
                }}
                className="h-12 flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-0 px-6 rounded-lg font-bold text-sm shadow-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
              >
                Acknowledge
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/alerts/${alert.id}`);
              }}
              className="h-12 flex-1 bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white py-0 px-6 rounded-lg font-bold text-sm shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
            >
              Details
            </button>
          </div>
        </div>

        {/* Station Info */}
        {(alert.station_name || alert.location) && (
          <div className="mb-4 sm:mb-6 pl-0 sm:pl-4 md:pl-6 border-l-0 sm:border-l-4 border-blue-200 bg-blue-50/40 py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-xl w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-bold text-[#1e3a8a]">
              <span className="text-xl sm:text-2xl">📍</span>
              <span className="truncate">{alert.station_name || 'Unknown Station'}</span>
              {alert.location && (
                <span className="text-sm sm:text-base md:text-lg text-slate-600 font-normal">• {alert.location}</span>
              )}
            </div>
          </div>
        )}

        {/* Alert Message */}
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight group-hover:text-[#1e3a8a] transition-all duration-300 w-full pr-2 sm:pr-0">
          {alert.message}
        </h3>

        {/* Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm sm:text-base bg-slate-50/70 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-slate-200/50 backdrop-blur-sm shadow-sm w-full">
          <span className="flex items-center gap-2 sm:gap-3 text-slate-700 font-semibold text-sm sm:text-base">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">{new Date(alert.created_at).toLocaleDateString('en-IN', { 
              year: 'numeric', month: 'short', day: 'numeric' 
            })} {new Date(alert.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </span>
          <span className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md ${
            mode === "active" || !isHistory 
              ? "bg-blue-100 text-[#1e3a8a] border border-blue-200" 
              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}>
            {mode === "active" || !isHistory ? "⏳ ACTIVE" : "✅ ACKNOWLEDGED"}
          </span>
        </div>
      </div>
    </div>
  );
}
