import { useEffect, useState } from "react";
import axios from "axios";

export default function PredictiveAlerts() {
  const [alerts, setAlerts] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchPredictiveAlerts();
  }, []);

  const fetchPredictiveAlerts = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/alerts/predictive",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Predictive alerts error:", err);
    }
  };

  const riskColor = (risk) => {
    if (risk === "Critical") return "bg-red-100 text-red-700";
    if (risk === "Warning") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="p-6 bg-[#F4FBFD] min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Predictive Alerts
      </h2>

      {alerts.length === 0 ? (
        <p className="text-gray-600">No predictive alerts available.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-5 shadow"
            >
              {/* STATION NAME */}
              <h3 className="text-lg font-semibold text-[#4FA3B5]">
                {alert.station}
              </h3>

              {/* RISK LEVEL */}
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${riskColor(
                  alert.risk_level
                )}`}
              >
                {alert.risk_level}
              </span>

              {/* REASON */}
              <p className="mt-3 text-sm text-gray-700">
                <strong>Reason:</strong> {alert.reason}
              </p>

              {/* METRICS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                <p>Avg pH: <b>{alert.avg_ph}</b></p>
                <p>Avg Turbidity: <b>{alert.avg_turbidity}</b></p>
                <p>Avg DO: <b>{alert.avg_do}</b></p>
                <p>Avg Nitrate: <b>{alert.avg_nitrate}</b></p>
                <p>Avg Arsenic: <b>{alert.avg_arsenic}</b></p>
                <p>Avg Fluoride: <b>{alert.avg_fluoride}</b></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
