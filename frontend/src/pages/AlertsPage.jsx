import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const AlertsPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error("Error fetching alerts:", err));
  }, []);

  const getColor = (level) => {
    switch (level) {
      case "Unsafe":
        return "bg-red-50 border border-red-300 text-red-700";
      case "Warning":
        return "bg-yellow-50 border border-yellow-300 text-yellow-700";
      case "Safe":
        return "bg-green-50 border border-green-300 text-green-700";
      default:
        return "bg-gray-50 border border-gray-200 text-gray-700";
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Unsafe")
      return (
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
          🔴 Unsafe
        </span>
      );
    if (status === "Warning")
      return (
        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
          🟡 Warning
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
        🟢 Safe
      </span>
    );
  };

  const handleAcknowledge = (alert) => {
    alert && console.log(`Acknowledged alert: ${alert.title}`);
  };

  const handleShare = (alert) => {
    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: alert.description,
      });
    } else {
      console.log(`Shared alert: ${alert.title}`);
    }
  };

  const handleViewTrend = (alert) => {
    navigate("/alert-trends", { state: { station: alert.station } });
  };

  const alertIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* LEFT: Alert List */}
      <div className="w-full md:w-1/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-gray-500">No active alerts 🎉</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition ${getColor(
                  alert.priority === "high"
                    ? "Unsafe"
                    : alert.priority === "medium"
                    ? "Warning"
                    : "Safe"
                )} ${
                  selectedAlert?.id === alert.id
                    ? "ring-2 ring-offset-2 ring-blue-400"
                    : ""
                }`}
                onClick={() => setSelectedAlert(alert)}
              >
                <h3 className="font-semibold text-base flex items-center justify-between">
                  {alert.title}
                  {getStatusBadge(alert.details?.Status)}
                </h3>
                <p className="text-sm opacity-80">{alert.station}</p>
                <div className="flex justify-between text-xs mt-2 opacity-70">
                  <span className="capitalize">
                    {alert.priority === "high"
                      ? "Unsafe"
                      : alert.priority === "medium"
                      ? "Warning"
                      : "Safe"}
                  </span>
                  <span>{alert.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Alert Details */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {selectedAlert ? (
          <>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {selectedAlert.title}
                </h2>
                {getStatusBadge(selectedAlert.details?.Status)}
              </div>
              <p className="text-gray-600">
                <span className="font-medium">Station:</span>{" "}
                {selectedAlert.station}
              </p>
              <p className="text-gray-700 mt-3">{selectedAlert.description}</p>
            </div>

            {/* 👇 Readings Grid with icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 border rounded-xl p-4">
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs uppercase text-gray-500">pH</p>
                <p className="text-lg font-semibold text-blue-700">
                  {selectedAlert.details?.pH || "--"}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs uppercase text-gray-500">Turbidity</p>
                <p className="text-lg font-semibold text-orange-700">
                  {selectedAlert.details?.Turbidity} NTU
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs uppercase text-gray-500">Temperature</p>
                <p className="text-lg font-semibold text-purple-700">
                  {selectedAlert.details?.Temperature}°C
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-xs uppercase text-gray-500">Status</p>
                <p className="text-lg font-semibold">
                  {getStatusBadge(selectedAlert.details?.Status)}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-gray-200 h-64">
              <MapContainer
                center={
                  selectedAlert.latitude && selectedAlert.longitude
                    ? [selectedAlert.latitude, selectedAlert.longitude]
                    : [20.5937, 78.9629]
                }
                zoom={6}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {selectedAlert.latitude && selectedAlert.longitude && (
                  <Marker
                    position={[
                      selectedAlert.latitude,
                      selectedAlert.longitude,
                    ]}
                    icon={alertIcon}
                  >
                    <Popup>{selectedAlert.station}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => handleAcknowledge(selectedAlert)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Acknowledge
              </button>
              <button
                onClick={() => handleShare(selectedAlert)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
              >
                Share
              </button>
              <button
                onClick={() => handleViewTrend(selectedAlert)}
                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
              >
                View Trend
              </button>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select an alert to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
