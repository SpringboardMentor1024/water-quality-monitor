// src/components/PhLineChart.js
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { FiClock } from 'react-icons/fi';

// Mock Data structure for backend integration
const phData = [
  { time: '00:00', pH: 7.2 }, { time: '04:00', pH: 7.0 },
  { time: '08:00', pH: 6.8 }, { time: '12:00', pH: 6.5 },
  { time: '16:00', pH: 7.3 }, { time: '20:00', pH: 8.0 },
  { time: '24:00', pH: 8.1 },
];

const PhLineChart = () => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 h-80 flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-semibold flex items-center gap-1">
        <FiClock className="text-cyan-400" /> pH Levels - Last 24 Hours
      </h2>
      <span className="text-xs text-slate-400">Recharts Integrated</span>
    </div>

    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={phData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#94a3b8" tickLine={false} />
          <YAxis domain={[6.0, 9.0]} stroke="#94a3b8" tickLine={false} tickFormatter={(v)=>`${v} pH`} />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
          <ReferenceLine y={6.5} stroke="#dc2626" strokeDasharray="5 5" label={{ value: 'Critical', position: 'right', fill: '#dc2626', fontSize: 10 }} />
          <Line type="monotone" dataKey="pH" stroke="#06b6d4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PhLineChart;
