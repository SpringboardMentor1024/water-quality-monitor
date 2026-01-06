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
  if (metric === "turbidity") {
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
      t: timestamps[i],
      value: toNum(values[i]),
      status: getStatus(metric, values[i]),
    }));
  }, [timestamps, values, metric]);

  const tickFormatter = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
  };

  const Dot = (props) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    const c = statusColor[payload.status] || statusColor.na;
    return <circle cx={cx} cy={cy} r={4} fill={c} stroke={c} />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black text-slate-900 uppercase tracking-wide">{title}</p>
        <p className="text-xs font-bold text-slate-500">{unit ? `Value in ${unit}` : ""}</p>
      </div>

      <div className="mt-4" style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" tickFormatter={tickFormatter} />
            <YAxis />
            <Tooltip labelFormatter={(iso) => new Date(iso).toLocaleString()} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={<Dot />}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
