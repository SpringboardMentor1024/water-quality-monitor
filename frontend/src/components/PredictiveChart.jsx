import React from "react";
import { Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";

const PredictiveChart = ({ title, data, dataKey, predKey, color, unit }) => (
  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 h-[400px]">
    <div className="flex justify-between items-center mb-6">
      <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">{title}</h4>
      <div className="flex gap-3">
         <span className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase">
           <div className="w-2 h-2 rounded-full" style={{backgroundColor: color}}></div> Live
         </span>
         <span className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase">
           <div className="w-2 h-0.5 border-t-2 border-dashed" style={{borderColor: color}}></div> Forecast
         </span>
      </div>
    </div>
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="time" tick={{fontSize: 9, fontWeight: 900}} axisLine={false} tickLine={false} />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip contentStyle={{borderRadius: '20px', border:'none', boxShadow:'0 10px 30px rgba(0,0,0,0.05)'}} />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.05} strokeWidth={3} dot={{r: 4, fill: color, strokeWidth: 0}} />
          <Line type="monotone" dataKey={predKey} stroke={color} strokeDasharray="6 6" strokeWidth={2} dot={false} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PredictiveChart;