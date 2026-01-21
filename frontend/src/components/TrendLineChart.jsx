import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const toNum = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
};

function getStatus(metric, value) {
  const v = toNum(value);
  if (v === null) return "na";

  if (metric === "ph") {
    if (v < 6.5 || v > 8.5) return "red";
    if (v < 6.8 || v > 8.2) return "amber";
    return "green";
  }
  if (metric === "do") {
    if (v < 3) return "red";
    if (v < 5) return "amber";
    return "green";
  }
  if (metric === "turbidity" || metric === "turb") {
    if (v > 5) return "red";
    if (v > 1) return "amber";
    return "green";
  }
  return "green";
}

const statusColor = {
  green: "#16a34a",
  amber: "#f59e0b", 
  red: "#ef4444",
  na: "#94a3b8",
};

export default function TrendLineChart({ title, unit, metric, timestamps = [], values = [] }) {
  const data = useMemo(() => {
    const len = Math.min(timestamps.length, values.length);
    return Array.from({ length: len }, (_, i) => ({
      t: timestamps[i] || `T${i}`,
      value: toNum(values[i]),
      status: getStatus(metric, values[i]),
    }));
  }, [timestamps, values, metric]);

  const tickFormatter = (iso) => {
    if (!iso || typeof iso !== 'string') return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso.slice(0, 3);
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  };

  const Dot = (props) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    const c = statusColor[payload.status] || statusColor.na;
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={5} 
        fill={c} 
        stroke="#fff" 
        strokeWidth={2}
        className="drop-shadow-sm"
      />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 h-[320px] flex flex-col">
      {/* ✅ FIXED: Explicit title container */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
        <p className="text-sm font-black text-slate-900 uppercase tracking-wide">{title}</p>
        <p className="text-xs font-bold text-slate-500">{unit ? `(${unit})` : ""}</p>
      </div>
      
      {/* ✅ FIXED: Explicit height */}
      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f8fafc" />
            <XAxis 
              dataKey="t" 
              tickFormatter={tickFormatter}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
              minTickGap={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
              width={40}
            />
            <Tooltip 
              labelFormatter={tickFormatter}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                backgroundColor: 'white',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                fontWeight: 600
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1e40af"
              strokeWidth={3}
              dot={<Dot />}
              connectNulls={false}
              activeDot={{ r: 7, stroke: '#1e40af', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
