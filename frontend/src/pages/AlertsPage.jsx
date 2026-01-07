import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirecting to trends page

const AlertsPage = () => {
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Dummy alert data
  const alerts = [
    {
      id: 1,
      title: "High Turbidity Detected",
      station: "Station Alpha",
      level: "unsafe",
      time: "5 mins ago",
      description: "Turbidity levels exceed 10 NTU.",
      image: "https://images.unsplash.com/photo-1581093588401-22d69fd4b098?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      title: "Moderate pH Change",
      station: "Station Beta",
      level: "warning",
      time: "15 mins ago",
      description: "pH dropped slightly below safe threshold.",
      image: "https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      title: "Water Quality Normal",
      station: "Station Gamma",
      level: "safe",
      time: "1 hour ago",
      description: "All parameters within safe limits.",
      image: "https://images.unsplash.com/photo-1518611012118-f0c5a3e38f9c?auto=format&fit=crop&w=800&q=60",
    },
  ];

  const getColor = (level) => {
    switch (level) {
      case "unsafe":
        return "bg-red-50 border border-red-300 text-red-700";
      case "warning":
        return "bg-yellow-50 border border-yellow-300 text-yellow-700";
      case "safe":
        return "bg-green-50 border border-green-300 text-green-700";
      default:
        return "bg-gray-50 border border-gray-200 text-gray-700";
    }
  };

  const handleAcknowledge = (alert) => {
    console.log(`Acknowledged alert: ${alert.title}`);
  };

  const handleShare = (alert) => {
    console.log(`Shared alert: ${alert.title}`);
  };

  const handleViewTrend = (alert) => {
    // Navigate to trends page and pass the station name
    navigate("/alert-trends", { state: { station: alert.station } });
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Left: Alert List */}
      <div className="w-full md:w-1/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition ${getColor(alert.level)} ${
                selectedAlert?.id === alert.id ? "ring-2 ring-offset-2 ring-blue-400" : ""
              }`}
              onClick={() => setSelectedAlert(alert)}
            >
              <h3 className="font-semibold text-base">{alert.title}</h3>
              <p className="text-sm opacity-80">{alert.station}</p>
              <div className="flex justify-between text-xs mt-2 opacity-70">
                <span className="capitalize">{alert.level}</span>
                <span>{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Alert Details */}
      <div className="flex-1 p-6">
        {selectedAlert ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{selectedAlert.title}</h2>
            <p className="text-gray-600">
              <span className="font-medium">Station:</span> {selectedAlert.station}
            </p>
            <p className="text-gray-600">{selectedAlert.description}</p>

            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img
                src={selectedAlert.image}
                alt={selectedAlert.title}
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="flex gap-3 mt-4">
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
          </div>
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
