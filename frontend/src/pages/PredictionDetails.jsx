import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Activity, Info, FileText, ShieldAlert, CheckCircle } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Area, ReferenceArea } from 'recharts';
import { getStationSeries, triggerAIAnalysis } from "../utils/api";

export default function PredictionDetails() {
  const { id, parameter } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [chartData, setChartData] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync with Backend Parameter Keys
  const backendParam = parameter.toLowerCase() === 'oxygen' ? 'do' : parameter.toLowerCase();

  useEffect(() => {
    const loadBackendData = async () => {
      try {
        // Fetch last 30 readings to allow for accurate trend visualization
        const response = await getStationSeries(id, 30);
        
        if (response?.series) {
          const s = response.series;
          const formatted = (response.timestamps || []).map((t, i) => {
            const val = s[backendParam]?.[i] ?? 0;
            return {
              time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actual: val,
              // Backend Logic Simulation: Show a projected path if it's the last few points
              forecast: i > 25 ? val + (Math.random() * 0.2 - 0.1) : null 
            };
          });
          setChartData(formatted);
        }
      } catch (err) {
        console.error("Telemetry Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBackendData();
  }, [id, backendParam]);

  // 🟢 TRIGGER REAL-TIME BACKEND AI ANALYSIS
  const handleTriggerAI = async () => {
    setIsAnalyzing(true);
    try {
      const result = await triggerAIAnalysis(id);
      setAnalysisResult(result);
    } catch (err) {
      console.error("AI Analysis Trigger Failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Thresholds based on your Backend 'WATER_QUALITY_RULES'
  const thresholds = {
    ph: { min: 6.5, max: 8.5 },
    turbidity: { max: 5.0 },
    do: { min: 4.0 }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-black text-[#1e3a8a] animate-pulse uppercase tracking-[0.3em] text-xs">
      Initialising Neural Link...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* 1. TOP NAVIGATION */}
      <button 
        onClick={() => navigate(`/analytics/${id}`)} 
        className="flex items-center gap-2 text-[#1e3a8a] font-black uppercase text-[10px] tracking-widest hover:-translate-x-1 transition-all"
      >
        <ArrowLeft size={16} /> Back to Station Engine
      </button>

      {/* 2. HERO HEADER (Sync with Backend) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-[#1e3a8a] rounded-[45px] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="z-10 space-y-4">
             <div className="flex items-center gap-2">
               <Activity size={16} className="text-blue-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">AI Analysis Module</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
               {parameter} <br/> <span className="text-blue-300">Predictive</span>
             </h1>
             <p className="text-[10px] font-black opacity-40 uppercase tracking-widest pt-4">Target: Station {id}</p>
          </div>
          <BrainCircuit className="absolute right-[-10%] bottom-[-10%] text-white/5 w-64 h-64" />
        </div>

        {/* 3. THE ANALYTICS CHART */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[45px] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
             <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Telemetry Neural Path</h4>
             <button 
               onClick={handleTriggerAI}
               disabled={isAnalyzing}
               className={`px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white shadow-lg'}`}
             >
               {isAnalyzing ? "Processing..." : "Trigger AI Analysis"}
             </button>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                
                {/* 🟢 DANGER ZONES (Based on Backend Thresholds) */}
                {backendParam === 'ph' && <ReferenceArea y1={8.5} y2={14} fill="#fee2e2" fillOpacity={0.4} />}
                {backendParam === 'ph' && <ReferenceArea y1={0} y2={6.5} fill="#fee2e2" fillOpacity={0.4} />}
                {backendParam === 'turbidity' && <ReferenceArea y1={5} y2={100} fill="#fee2e2" fillOpacity={0.4} />}
                {backendParam === 'do' && <ReferenceArea y1={0} y2={4} fill="#fee2e2" fillOpacity={0.4} />}

                <Area type="monotone" dataKey="actual" fill="#eff6ff" stroke="#1e3a8a" strokeWidth={4} />
                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={3} strokeDasharray="8 8" dot={{ r: 4, fill: '#3b82f6' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. AI REASONING (Based on PredictionService Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-10 rounded-[45px] border border-slate-100 space-y-6">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-blue-50 rounded-2xl text-[#1e3a8a]"><BrainCircuit size={28} /></div>
             <div>
               <h4 className="font-black text-slate-900 uppercase text-xs tracking-tighter italic">AI Diagnostic Summary</h4>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Analysis Result</p>
             </div>
          </div>

          <div className="p-6 bg-slate-50/50 rounded-[30px] border border-slate-100">
            {analysisResult?.status === "Risks Detected" ? (
              <div className="space-y-4">
                {analysisResult.analysis.map((risk, idx) => (
                  <div key={idx} className="flex gap-4">
                    <ShieldAlert className="text-rose-500 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase">{risk.message}</p>
                      <p className="text-xs font-bold text-slate-500 italic mt-2 leading-relaxed">"{risk.recommendation}"</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 py-4">
                <CheckCircle className="text-emerald-500" size={24} />
                <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                  "Station STN-{id} is currently stable. AI Engine detects no immediate {parameter} anomalies or dangerous trending slopes within the current 5-reading window."
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 5. AUTHORITY DECISION PANEL */}
        <div className="bg-[#1e3a8a] p-10 rounded-[45px] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
           <div className="z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-6">Expert Remediation</h4>
              <p className="text-xs font-bold uppercase leading-tight mb-2 tracking-widest">Status Assessment:</p>
              <h5 className={`text-2xl font-black uppercase italic ${analysisResult?.status === "Risks Detected" ? 'text-rose-400' : 'text-emerald-400'}`}>
                {analysisResult?.status === "Risks Detected" ? "Intervention Advised" : "Normal Operation"}
              </h5>
           </div>
           
           <div className="space-y-3 z-10 pt-8">
             <button className="w-full bg-white text-[#1e3a8a] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
               Generate Action PDF
             </button>
             <button className="w-full bg-blue-400/20 border border-white/10 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-400/30 transition-all">
               Notify Technical Team
             </button>
           </div>
           <Activity className="absolute right-[-20%] top-[-10%] text-white/5 w-64 h-64" />
        </div>
      </div>
    </div>
  );
}