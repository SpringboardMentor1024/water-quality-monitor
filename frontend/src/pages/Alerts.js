// src/pages/Alerts.js
import React, { useState, useMemo } from "react";
import { FiActivity, FiCheckCircle } from "react-icons/fi";

const mockHistoricalAlerts = [
  { id: 1, title: "High Turbidity Spike", location: "Intake Site A", time: "10:12 AM", severity: "CRITICAL", details: "Turbidity exceeded 15 NTU for 5 minutes. Suggested action: Check intake filter.", acknowledged: false },
  { id: 2, title: "pH Level Low", location: "Storage Tank B", time: "09:50 AM", severity: "WARNING", details: "pH dropped to 6.2, approaching critical level 5.5. Suggested action: Check chemical dosing system.", acknowledged: false },
  { id: 3, title: "Temperature Exceeded Limit", location: "Filter Output C", time: "08:30 AM", severity: "INFO", details: "Water temperature reached 30°C. Affects DO levels. Suggested action: Monitor cooling system.", acknowledged: true },
  { id: 4, title: "Dissolved Oxygen Crash", location: "Aeration Pond D", time: "07:15 AM", severity: "CRITICAL", details: "DO fell below 4 mg/L. Immediate threat to aquatic life/process efficiency. Suggested action: Increase aeration.", acknowledged: false },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockHistoricalAlerts);
  const [filter, setFilter] = useState("active"); // 'active' | 'historical'

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-600 text-white";
      case "WARNING": return "bg-yellow-500 text-slate-900";
      case "INFO": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const filteredAlerts = useMemo(() => {
    if (filter === 'active') return alerts.filter(a => !a.acknowledged);
    return alerts;
  }, [alerts, filter]);

  const handleAcknowledgeAll = () => {
    const updatedAlerts = alerts.map(a => a.acknowledged ? a : { ...a, acknowledged: true });
    setAlerts(updatedAlerts);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-50">
        <FiActivity className="text-red-400" /> System Alerts & Event Log
      </h2>

      <div className="flex items-center gap-4 border-b border-slate-700 pb-2 text-sm">
        <button onClick={() => setFilter("active")} className={`px-4 py-2 rounded-full transition duration-150 font-medium ${filter === 'active' ? 'bg-red-700 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
          Active Alerts ({alerts.filter(a => !a.acknowledged).length})
        </button>
        <button onClick={() => setFilter("historical")} className={`px-4 py-2 rounded-full transition duration-150 font-medium ${filter === 'historical' ? 'bg-cyan-600 text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
          Historical Log
        </button>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 && filter === 'active' && (
          <div className="p-6 bg-emerald-800/60 rounded-xl border border-emerald-700 flex items-center gap-3">
            <FiCheckCircle className="w-6 h-6 text-emerald-300" />
            <p className="text-slate-100 font-medium">All systems normal. No active alerts.</p>
          </div>
        )}

        {filteredAlerts.map(a => (
          <div key={a.id} className={`p-4 rounded-xl border transition duration-150 ${a.acknowledged ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-800/70 border-red-700'}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`font-semibold text-base ${a.acknowledged ? 'text-slate-500' : 'text-slate-50'}`}>{a.title}</div>
                <div className="text-sm text-slate-400">{a.location} • {a.time}</div>
              </div>

              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityClass(a.severity)}`}>{a.severity}</div>
            </div>

            <p className={`text-sm mt-3 ${a.acknowledged ? 'text-slate-500' : 'text-slate-300'}`}>{a.details}</p>

            {a.acknowledged && (
              <p className="text-xs mt-2 text-emerald-400 flex items-center gap-1"><FiCheckCircle /> Acknowledged by System</p>
            )}
          </div>
        ))}
      </div>

      {filter === 'active' && filteredAlerts.length > 0 && (
        <button onClick={handleAcknowledgeAll} className="mt-4 px-6 py-2 rounded-full bg-red-700 text-white text-sm font-bold hover:bg-red-600 transition duration-150 shadow-lg">
          Acknowledge All Active Alerts
        </button>
      )}
    </div>
  );
};

export default Alerts;
