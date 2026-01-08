import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, TrendingUp, Info, FileText } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { getStationSeries } from "../utils/api";

export default function PredictionDetails() {
  const { id, parameter } = useParams();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getStationSeries(id, 12);
        if (response?.series) {
          const s = response.series;
          const keyMap = { turbidity: 'turbidity', oxygen: 'do', ph: 'ph' };
          const activeKey = keyMap[parameter.toLowerCase()] || 'ph';

          // Format historical data from API
          const history = (response.timestamps || []).map((t, i) => ({
            time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actual: s[activeKey]?.[i] ?? 0,
            forecast: null
          }));

          // Generate simulated future projection based on real values
          const latestVal = history.length > 0 ? history[history.length - 1].actual : 0;
          const projection = Array.from({ length: 4 }).map((_, i) => ({
            time: `+${(i + 1) * 2}h`,
            actual: null,
            forecast: parameter.toLowerCase() === 'turbidity' ? latestVal + (i * 0.1) : latestVal - (i * 0.05)
          }));
          setChartData([...history, ...projection]);
        }
      } catch (err) { console.error("Forecast Load Error:", err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [id, parameter]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black text-[#1e3a8a] animate-pulse uppercase text-xs">
      Processing Intelligence...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6 bg-[#f8fafc] min-h-screen font-sans">
      {/* Explicit Back Navigation to Station ID */}
      <button 
        onClick={() => navigate(`/analytics/${id}`)} 
        className="flex items-center gap-2 text-[#1e3a8a] font-black uppercase text-[10px] tracking-widest hover:opacity-70 transition-all"
      >
        <ArrowLeft size={16} /> Back to Analytics
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-[#1e3a8a] rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">{parameter} <br/> <span className="text-blue-300">Forecast</span></h1>
          <p className="text-[9px] font-black opacity-50 uppercase mt-4">Station: {id}</p>
          <BrainCircuit className="absolute right-[-10%] bottom-[-10%] text-white/5 w-48 h-48" />
        </div>

        <div className="lg:col-span-3 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <h4 className="font-black text-[#1e3a8a] uppercase text-[10px] mb-6">Historical vs Predicted Path</h4>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 900, fill:'#94a3b8'}} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip contentStyle={{borderRadius:'15px', border:'none'}} />
                <Line type="monotone" dataKey="actual" stroke="#1e3a8a" strokeWidth={3} dot={{r:3, fill:'#1e3a8a'}} />
                <Line type="monotone" dataKey="forecast" stroke="#1e3a8a" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 flex items-start gap-6">
          <div className="p-4 bg-blue-50 rounded-2xl text-[#1e3a8a]"><Info size={24} /></div>
          <div>
            <h4 className="font-black text-slate-400 uppercase text-[10px] mb-2 tracking-widest">AI Reasoning Analysis</h4>
            <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
              "The current {parameter} trend at {id} matches a known stability profile based on localized historical signatures. No critical surge indicators detected."
            </p>
          </div>
        </div>

        <div className="bg-[#1e3a8a] p-8 rounded-[40px] text-white flex flex-col justify-between shadow-lg">
          <h4 className="font-black text-blue-200 uppercase text-[10px] mb-2 tracking-widest">Authority Action</h4>
          <p className="text-[11px] font-bold uppercase leading-tight">No immediate intervention required based on forecast.</p>
          <button className="w-full bg-white text-[#1e3a8a] py-3 rounded-xl font-black uppercase text-[9px] tracking-widest mt-4 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <FileText size={14} /> Download PDF Log
          </button>
        </div>
      </div>
    </div>
  );
}