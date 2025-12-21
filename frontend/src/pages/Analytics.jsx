import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// 🇮🇳 INDIA-BASED MOCK TREND DATA
const trendData = [
  { day: "Mon", ph: 6.8, temp: 24, turbidity: 30 },
  { day: "Tue", ph: 6.5, temp: 25, turbidity: 35 },
  { day: "Wed", ph: 6.2, temp: 27, turbidity: 40 },
  { day: "Thu", ph: 6.3, temp: 26, turbidity: 45 },
  { day: "Fri", ph: 6.7, temp: 25, turbidity: 28 },
  { day: "Sat", ph: 6.9, temp: 24, turbidity: 25 },
  { day: "Sun", ph: 7.0, temp: 23, turbidity: 20 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("Weekly");

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">Water Quality Analytics</h2>

      {/* TIME RANGE FILTER */}
      <div className="bg-white p-4 rounded-xl shadow border border-[#C4E1E6] flex gap-4 items-center">
        <label className="font-medium">Time Range:</label>
        <select
          className="p-2 border rounded-lg"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      {/* PH TREND */}
      <AnalyticsCard title="pH Level Trend Across India">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[5, 8]} />
            <Tooltip />
            <Line type="monotone" dataKey="ph" stroke="#8DBCC7" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      {/* TEMPERATURE TREND */}
      <AnalyticsCard title="Temperature Trend Across India">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[20, 35]} />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#A4CCD9" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsCard>

      {/* TURBIDITY TREND */}
      <AnalyticsCard title="Turbidity Trend Across India">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="turbidity" stroke="#C4E1E6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </AnalyticsCard>
    </div>
  );
}

/* ----------------------------------------
   ANALYTICS CARD COMPONENT
----------------------------------------- */
function AnalyticsCard({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
