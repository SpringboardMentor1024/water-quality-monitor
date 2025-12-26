import { useEffect, useState } from "react";
import { getAlerts } from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  // FETCH ALERTS FROM BACKEND
  useEffect(() => {
    getAlerts()
      .then((res) => {
        const formattedAlerts = res.data.map((a) => ({
          id: a.id,
          station: a.station_name,
          status: a.status,
          message: a.message,
          time: new Date(a.created_at).toLocaleString(),
        }));
        setAlerts(formattedAlerts);
      })
      .catch((err) => {
        console.error("Alerts API error:", err);
      });
  }, []);

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">
        Alerts & Warnings
      </h2>

      {/* EMPTY STATE */}
      {alerts.length === 0 && (
        <p className="text-gray-500">No alerts available</p>
      )}

      {/* ALERT LIST */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>

    </div>
  );
}

/* ---------------------------------
   ALERT CARD COMPONENT
----------------------------------- */

function AlertCard({ alert }) {
  const badgeColor =
    alert.status === "Safe"
      ? "bg-green-500"
      : alert.status === "Warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {alert.station}
        </h3>

        {/* STATUS BADGE */}
        <span
          className={`px-4 py-1 rounded-full text-white text-sm font-medium ${badgeColor}`}
        >
          {alert.status}
        </span>
      </div>

      {/* MESSAGE */}
      <p className="text-gray-700 mt-3">
        {alert.message}
      </p>

      {/* TIME */}
      <p className="text-xs text-gray-500 mt-2">
        {alert.time}
      </p>

    </div>
  );
}
