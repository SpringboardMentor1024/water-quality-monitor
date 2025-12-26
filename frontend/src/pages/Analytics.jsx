import { useEffect, useState } from "react";
import { getAnalytics } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState([]);

  // FETCH ANALYTICS FROM BACKEND
  useEffect(() => {
    getAnalytics()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Analytics API error:", err);
      });
  }, []);

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">
        Station Analytics
      </h2>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <p className="text-gray-500">No analytics data available</p>
      )}

      {/* PH CHART */}
      <AnalyticsCard title="Average pH Level">
        <BarChartComponent
          data={data}
          dataKey="avg_ph"
          label="pH"
          color="#22c55e"   // green
        />
      </AnalyticsCard>

      {/* TURBIDITY CHART */}
      <AnalyticsCard title="Average Turbidity">
        <BarChartComponent
          data={data}
          dataKey="avg_turbidity"
          label="Turbidity"
          color="#facc15"   // yellow
        />
      </AnalyticsCard>

      {/* TEMPERATURE CHART */}
      <AnalyticsCard title="Average Temperature (°C)">
        <BarChartComponent
          data={data}
          dataKey="avg_temperature"
          label="Temperature"
          color="#ef4444"   // red
        />
      </AnalyticsCard>

    </div>
  );
}

/* ---------------------------------
   REUSABLE CARD
----------------------------------- */

function AnalyticsCard({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

/* ---------------------------------
   BAR CHART COMPONENT
----------------------------------- */

function BarChartComponent({ data, dataKey, label, color }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="station_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} name={label} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
