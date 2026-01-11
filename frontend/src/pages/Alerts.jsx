import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts/");
      setAlerts(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const acknowledgeAlert = async (id) => {
    try {
      await api.post(`/alerts/${id}/acknowledge`);
      fetchAlerts(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to acknowledge alert");
    }
  };

  const severityStyles = {
    BOIL_NOTICE: "border-orange-500 text-orange-600",
    CONTAMINATION: "border-red-600 text-red-700",
    OUTAGE: "border-yellow-500 text-yellow-600",
  };

  if (loading) return <p className="p-6">Loading alerts…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Alerts</h2>

      {alerts.length === 0 && (
        <p className="text-gray-500">No active alerts</p>
      )}

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white p-4 rounded shadow border-l-4 
              ${severityStyles[alert.severity] || "border-gray-300"}`}
          >
            <h3 className="font-semibold text-gray-900">
              {alert.message}
            </h3>

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-bold uppercase">
                {alert.severity.replace("_", " ")}
              </span>

              <span className="text-xs text-gray-400">
                {new Date(alert.created_at).toLocaleString()}
              </span>
            </div>

            {!alert.acknowledged && (
              <button
                onClick={() => acknowledgeAlert(alert.id)}
                className="mt-3 text-xs bg-blue-600 text-white px-3 py-1 rounded"
              >
                Acknowledge Alert
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
