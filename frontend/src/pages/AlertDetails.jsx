import React, { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Share2,
} from "lucide-react";

import BaseMap from "./BaseMap";

const API_BASE = "http://localhost:8000"; // adjust if needed

// ---------------- ALERT LIST ----------------
function AlertList({ alerts, selectedAlert, onSelect }) {
  return (
    <div className="w-full md:w-96 bg-white border-r border-slate-200">
      <div className="p-4 border-b">
        <h2 className="text-lg">Active Alerts</h2>
        <p className="text-sm text-slate-500">{alerts.length} total alerts</p>
      </div>

      <div className="p-3 space-y-2">
        {alerts.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a)}
            className={`w-full text-left p-4 rounded-lg border ${
              selectedAlert?.id === a.id
                ? "bg-blue-50 border-blue-200"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm capitalize">{a.type.replace("_", " ")}</h3>
                <p className="text-xs text-slate-600 line-clamp-1">{a.message}</p>
                <p className="text-xs text-slate-500 mt-1">{a.location}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------- DETAILS PANEL ----------------
function AlertDetailsPanel({ alertData, onBack, acknowledgedState, setAcknowledgedState }) {
  if (!alertData) return null;

  const acknowledged = acknowledgedState[alertData.id] || false;

  const handleAcknowledge = () => {
    setAcknowledgedState((prev) => ({ ...prev, [alertData.id]: true }));
  };

  const handleShare = () => {
    const url = `${window.location.origin}?alert_id=${alertData.id}`;
    navigator.clipboard.writeText(url);
    window.alert(`Link copied: ${url}`);
  };

  // Extract coordinates for BaseMap marker
  const markerPosition = alertData.coordinates || null;

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <div className="md:hidden p-4 border-b bg-white">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h1 className="text-2xl capitalize mb-2">{alertData.type.replace("_", " ")} Alert</h1>
          <p className="text-slate-600">{alertData.message}</p>
        </div>

        <div className="bg-white border rounded-xl p-6 grid sm:grid-cols-2 gap-4 mb-6">
          <Info icon={<MapPin />} label="Location" value={alertData.location} />
          <Info
            icon={<Calendar />}
            label="Issued On"
            value={new Date(alertData.issued_at).toLocaleString()}
          />
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleAcknowledge}
            disabled={acknowledged}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              acknowledged ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            {acknowledged ? "Acknowledged" : "Acknowledge"}
          </button>

          <button
            onClick={handleShare}
            className="px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg mb-4">Alert Location</h2>
          <div className="h-72 rounded-lg overflow-hidden">
            {/* Pass coordinates to BaseMap */}
            <BaseMap markerPosition={markerPosition} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- INFO ----------------
function Info({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="text-blue-600 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

// ---------------- MAIN PAGE ----------------
export default function AlertDetails() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [acknowledgedState, setAcknowledgedState] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/alerts`)
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data);

        // Check if URL has alert_id for sharing
        const params = new URLSearchParams(window.location.search);
        const alertId = params.get("alert_id");
        if (alertId) {
          const alert = data.find((a) => String(a.id) === alertId);
          setSelectedAlert(alert || data[0] || null);
        } else {
          setSelectedAlert(data[0] || null);
        }
      })
      .catch((err) => console.error("Failed to fetch alerts", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b p-4">
        <h1 className="text-2xl">Alert Details</h1>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          Dashboard <ChevronRight size={14} /> Alerts <ChevronRight size={14} /> Details
        </div>
      </header>

      <div className="flex h-[calc(100vh-96px)]">
        <AlertList
          alerts={alerts}
          selectedAlert={selectedAlert}
          onSelect={setSelectedAlert}
        />
        <AlertDetailsPanel
          alertData={selectedAlert}
          onBack={() => setSelectedAlert(null)}
          acknowledgedState={acknowledgedState}
          setAcknowledgedState={setAcknowledgedState}
        />
      </div>
    </div>
  );
}
