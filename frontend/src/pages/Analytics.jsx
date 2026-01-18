import { useEffect, useState } from "react";
import { getAnalytics, getPredictiveAlerts } from "../services/api.js";
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
  const [alerts, setAlerts] = useState([]);

  // FETCH ANALYTICS
  useEffect(() => {
    getAnalytics()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Analytics API error:", err);
      });
  }, []);

  // FETCH PREDICTIVE ALERTS
  useEffect(() => {
    getPredictiveAlerts()
      .then((data) => {
        setAlerts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Predictive Alerts API error:", err);
      });
  }, []);

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">Station Analytics & Predictive</h2>

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
          color="#22c55e"
        />
      </AnalyticsCard>

      {/* TURBIDITY CHART */}
      <AnalyticsCard title="Average Turbidity">
        <BarChartComponent
          data={data}
          dataKey="avg_turbidity"
          label="Turbidity"
          color="#facc15"
        />
      </AnalyticsCard>

      {/* TEMPERATURE CHART */}
      <AnalyticsCard title="Average Temperature (°C)">
        <BarChartComponent
          data={data}
          dataKey="avg_temperature"
          label="Temperature"
          color="#ef4444"
        />
      </AnalyticsCard>

      {/* 🔮 PREDICTIVE ALERTS SECTION */}
      <PredictiveAlertsCard alerts={alerts} />
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

/* ---------------------------------
   🔮 PREDICTIVE ALERTS CARD
----------------------------------- */

function PredictiveAlertsCard({ alerts }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">
      <h3 className="text-lg font-semibold mb-4 text-[#4FA3B5]">
        Predictive Alerts
      </h3>

      {alerts.length === 0 ? (
        <p className="text-gray-500">No predictive alerts available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-[#E6F7FA] text-gray-700">
              <tr>
                <th className="p-3 text-left">Station</th>
                <th className="p-3 text-left">Parameter</th>
                <th className="p-3 text-left">Prediction</th>
                <th className="p-3 text-left">Severity</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3">{alert.station_name}</td>
                  <td className="p-3">{alert.parameter}</td>
                  <td className="p-3">{alert.prediction}</td>
                  <td
                    className={`p-3 font-semibold ${
                      alert.severity === "High"
                        ? "text-red-600"
                        : alert.severity === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {alert.severity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
