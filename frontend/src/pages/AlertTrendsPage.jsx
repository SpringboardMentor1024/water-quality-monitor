import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const AlertTrendsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const station = location.state?.station;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!station) return;

    fetch(`http://127.0.0.1:8000/api/history/${station}`)
      .then((res) => res.json())
      .then((resData) =>
  setData(
    resData.map(item => ({
      ...item,
      time: new Date(item.time).getTime() // 🔑 KEY FIX
    }))
  )
)

      .catch((err) => console.error(err));
  }, [station]);

  return (
    <div className="p-6 w-full">
      <button
        onClick={() => navigate("/alerts")}
        className="mb-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
      >
        ← Back to Alerts
      </button>

      <h1 className="text-2xl font-semibold mb-6">
        Historical Trends for {station}
      </h1>

      {data.length === 0 ? (
        <p className="text-gray-500">No historical data available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* pH */}
          <ChartCard title="pH Levels" dataKey="ph" color="#4ade80" data={data} />

          {/* Turbidity */}
          <ChartCard
            title="Turbidity (NTU)"
            dataKey="turbidity"
            color="#facc15"
            data={data}
          />

          {/* Temperature */}
          <ChartCard
            title="Temperature (°C)"
            dataKey="temperature"
            color="#fb7185"
            data={data}
          />
        </div>
      )}
    </div>
  );
};

function ChartCard({ title, dataKey, color, data }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-white font-semibold mb-2">{title}</h2>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
         <XAxis
  dataKey="time"
  type="number"
  scale="time"
  domain={["auto", "auto"]}
  tickFormatter={(time) =>
    new Date(time).toLocaleDateString()
  }
  stroke="#ccc"
/>

          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AlertTrendsPage;
