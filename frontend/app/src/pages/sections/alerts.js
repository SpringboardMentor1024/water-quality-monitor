import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  LineChart, Line,
  PieChart, Pie,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

import {
  FaBell, FaExclamationTriangle,
  FaSearch, FaClock,
  FaEye, FaCheckCircle, FaTimes
} from "react-icons/fa";

const ALERT_API = "http://127.0.0.1:8000/alerts";
/* 🔮 DUMMY PREDICTIVE ALERTS (FRONTEND ONLY) */
const DUMMY_PREDICTIVE_ALERTS = [
  {
    id: "PA-1",
    parameter: "pH",
    message: "pH levels predicted to exceed safe threshold",
    severity: "High",
    window: "Next 24 hrs"
  },
  {
    id: "PA-2",
    parameter: "Turbidity",
    message: "Upward turbidity trend indicates contamination risk",
    severity: "Critical",
    window: "Next 12 hrs"
  },
  {
    id: "PA-3",
    parameter: "Dissolved Oxygen",
    message: "DO levels declining – possible hypoxic conditions",
    severity: "High",
    window: "Next 48 hrs"
  }
];


/* ==============================
   MAIN PAGE
================================ */
export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showTrigger, setShowTrigger] = useState(false);
  const [predictiveAlerts, setPredictiveAlerts] = useState([]);
  const prevCount = useRef(0);

  /* 🔮 FETCH PREDICTIVE ALERTS FROM MODEL (BACKEND) 
  const loadPredictiveAlerts = async () => {
    try {
      const res = await axios.get(`${ALERT_API}/predictive`);
      setPredictiveAlerts(res.data || []);
    } catch (err) {
      console.error("Predictive alerts not available");
    }
  };*/
  const loadPredictiveAlerts = () => {
  // Frontend demo data only (backend-independent)
  setPredictiveAlerts(DUMMY_PREDICTIVE_ALERTS);
};


  /* FETCH ACTIVE + HISTORY ALERTS */
  const loadAlerts = async () => {
    const [activeRes, historyRes] = await Promise.all([
      axios.get(ALERT_API),
      axios.get(`${ALERT_API}/history`)
    ]);

    if (prevCount.current > 0 && activeRes.data.length > prevCount.current) {
      setShowTrigger(true);
      setTimeout(() => setShowTrigger(false), 4000);
    }

    prevCount.current = activeRes.data.length;
    setAlerts(activeRes.data.map(mapAlert));
    setHistory(historyRes.data.map(mapAlert));
  };

  useEffect(() => {
    loadAlerts();
    loadPredictiveAlerts();

    const interval = setInterval(() => {
      loadAlerts();
      loadPredictiveAlerts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (alert) => {
    await axios.put(`${ALERT_API}/${alert.id}/resolve`);
    await loadAlerts();
    setActiveTab("history");
  };

  const handleView = async (id) => {
    const res = await axios.get(`${ALERT_API}/${id}`);
    setSelectedAlert({
      title: res.data.message,
      location: res.data.location,
      severity: res.data.type === "boil_notice" ? "Critical" : "High",
      status: res.data.status,
      time: new Date(res.data.issued_at).toLocaleString()
    });
  };

  return (
    <div className="w-full px-6 py-6 bg-slate-100 min-h-screen text-slate-900">

      <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-3 mb-6">
        <FaBell className="text-red-700" />
        Alerts & Triggered Events Dashboard
      </h1>

      {showTrigger && (
        <div className="mb-4 p-3 rounded bg-orange-100 border border-orange-400 text-orange-900 font-semibold flex items-center gap-2">
          <FaExclamationTriangle />
          New alert triggered due to threshold breach
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat title="Active Triggered Alerts" value={alerts.length} color="text-red-700" />
        <Stat title="Critical Alerts" value={alerts.filter(a => a.severity === "Critical").length} color="text-red-900" />
        <Stat title="Average Response Time" value="2.4 hrs" color="text-blue-800" />
        <Stat title="Resolved Alerts" value={history.length} color="text-green-800" />
      </div>

      <div className="flex gap-8 border-b border-slate-400 mb-6">
        <Tab label="Triggered Alerts (Active)" active={activeTab === "active"} onClick={() => setActiveTab("active")} />
        <Tab label="Resolved Alerts (History)" active={activeTab === "history"} onClick={() => setActiveTab("history")} />
        <Tab label="Alert Trends & Historical Analysis" active={activeTab === "trends"} onClick={() => setActiveTab("trends")} />
        <Tab label="Alert Trigger Conditions" active={activeTab === "triggers"} onClick={() => setActiveTab("triggers")} />
        <Tab label="Predictive Alerts" active={activeTab === "predictive"} onClick={() => setActiveTab("predictive")} />
      </div>

      {activeTab === "active" && (
        <AlertsTable data={alerts} onResolve={handleResolve} onView={handleView} active />
      )}

      {activeTab === "history" && (
        <AlertsTable data={history} history />
      )}

      {activeTab === "trends" && <AlertTrends />}

      {activeTab === "triggers" && <TriggersInfo />}

      {activeTab === "predictive" && (
        <div className="bg-white p-6 rounded border border-slate-300">
          <h2 className="text-xl font-extrabold text-blue-900 mb-4">
            Predictive Alerts (Model Forecast)
          </h2>

          <table className="w-full">
            <thead className="bg-blue-100 text-blue-900 font-bold">
              <tr>
                <th className="p-4 text-left">Parameter</th>
                <th className="p-4 text-left">Prediction</th>
                <th className="p-4 text-center">Severity</th>
                <th className="p-4 text-center">Expected Window</th>
              </tr>
            </thead>
            <tbody>
              {predictiveAlerts.map(p => (
                <tr key={p.id} className="border-t border-slate-300">
                  <td className="p-4 font-bold">{p.parameter}</td>
                  <td className="p-4">{p.message}</td>
                  <td className="p-4 text-center font-bold">{p.severity}</td>
                  <td className="p-4 text-center">{p.window}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAlert && (
        <AlertModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
}
/* ==============================
   ALERT MODAL  ✅ FIXED
================================ */
function AlertModal({ alert, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg relative text-slate-900">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-800">
          <FaTimes />
        </button>
        <h2 className="text-xl font-extrabold mb-4 text-blue-900">
          Alert Details
        </h2>
        <p><b>Message:</b> {alert.title}</p>
        <p><b>Location:</b> {alert.location}</p>
        <p><b>Severity:</b> {alert.severity}</p>
        <p><b>Status:</b> {alert.status}</p>
        <p><b>Time:</b> {alert.time}</p>
      </div>
    </div>
  );
}

/* ==============================
   ALERT TABLE
================================ */
function AlertsTable({ data, history = false, active = false, onResolve, onView }) {
  const [search, setSearch] = useState("");

  const filtered = data.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded border border-slate-300 shadow">
      <div className="p-4 flex items-center gap-3 border-b border-slate-300">
        <FaSearch className="text-slate-800" />
        <input
          className="flex-1 border border-slate-400 px-3 py-2 rounded text-slate-900 placeholder-slate-500"
          placeholder="Search alerts by station, parameter, or location"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-blue-100 text-blue-900 font-bold">
            <tr>
              <th className="p-4 text-left">Alert Description</th>
              <th className="p-4">Parameter</th>
              <th className="p-4">Severity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Time</th>
              {active && <th className="p-4">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-t border-slate-300 hover:bg-slate-100">
                <td className="p-4">
                  <p className="font-bold text-slate-900">{a.title}</p>
                  <p className="text-sm italic font-semibold text-orange-800">
                    ⚠ Trigger: {a.triggerMessage}
                  </p>
                  <p className="text-sm font-medium text-slate-800">{a.location}</p>
                </td>

                <td className="p-4 text-center">
                  <p className="font-bold">{a.parameter}</p>
                  <p className="text-sm">{a.value}</p>
                </td>

                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded font-bold ${
                    a.severity === "Critical"
                      ? "bg-red-300 text-red-900"
                      : "bg-orange-300 text-orange-900"
                  }`}>
                    {a.severity}
                  </span>
                </td>

                <td className="p-4 text-center font-extrabold">
                  {history
                    ? <span className="text-green-800">RESOLVED</span>
                    : <span className="text-red-800">ACTIVE</span>}
                </td>

                <td className="p-4 whitespace-nowrap font-medium">
                  <FaClock className="inline mr-2" />
                  {a.time}
                </td>

                {active && (
                  <td className="p-4 flex gap-4 font-semibold">
                    <button onClick={() => onView(a.id)} className="text-blue-800 hover:underline">
                      <FaEye /> View
                    </button>
                    <button onClick={() => onResolve(a)} className="text-green-800 hover:underline">
                      <FaCheckCircle /> Resolve
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==============================
   TRIGGERS + TRENDS + HELPERS
   (UNCHANGED LOGIC)
================================ */

function TriggersInfo() {
  return (
    <div className="bg-white p-6 rounded border border-slate-300">
      <h2 className="text-xl font-extrabold text-blue-900 mb-4">
        Alert Trigger Conditions
      </h2>
      <ul className="list-disc ml-6 space-y-2 font-medium text-slate-900">
        <li>pH &lt; 6.5 or &gt; 8.5 → Contamination Alert</li>
        <li>Turbidity &gt; 5 NTU → Contamination Alert</li>
        <li>Dissolved Oxygen &lt; 5 mg/L → Contamination Alert</li>
        <li>Arsenic &gt; 0.01 mg/L → Contamination Alert</li>
        <li>Iron &gt; 0.3 mg/L → Contamination Alert</li>
        <li>E. coli detected → Boil Water Notice</li>
      </ul>
    </div>
  );
}

/* ==============================
   ALERT TRENDS (LINE + PIE)
================================ */
function AlertTrends() {
  const [trendData, setTrendData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    axios.get(`${ALERT_API}/analytics/trends`).then(res => {
      setTrendData(res.data);

      const total = res.data.reduce((sum, d) => sum + d.count, 0);
      setPieData([{ name: "Alert Occurrences", value: total }]);
    });

    axios.get(`${ALERT_API}/analytics/radar`)
      .then(res => setRadarData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LINE CHART */}
        <div className="bg-white p-6 rounded border border-slate-300">
          <h2 className="text-lg font-extrabold text-blue-900 mb-4">
            Alert Trend Over Time
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1d4ed8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded border border-slate-300">
          <h2 className="text-lg font-extrabold text-blue-900 mb-4">
            Alert Distribution Summary
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#2563eb"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔴 RADAR CHART (NEW) */}
      <div className="bg-white p-6 mt-6 rounded border border-slate-300">
        <h2 className="text-lg font-extrabold text-blue-900 mb-4">
          Parameter-wise Alert Analysis (Radar)
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="parameter" />
            <PolarRadiusAxis allowDecimals={false} />
            <Radar
              name="Alert Count"
              dataKey="alerts"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 font-bold ${
        active ? "border-b-4 border-blue-800 text-blue-900" : "text-slate-700 hover:text-blue-800"
      }`}
    >
      {label}
    </button>
  );
}

function Stat({ title, value, color }) {
  return (
    <div className="bg-white p-4 rounded border border-slate-300">
      <p className="font-semibold text-slate-700">{title}</p>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

/* ==============================
   ALERT PARSING
================================ */
function mapAlert(a) {
  return {
    id: a.id,
    title: a.message,
    triggerMessage: a.message,
    parameter: extractParameter(a.message),
    value: extractValue(a.message),
    severity: a.type === "boil_notice" ? "Critical" : "High",
    location: a.location,
    time: new Date(a.issued_at).toLocaleString()
  };
}

function extractParameter(msg) {
  const m = msg.toLowerCase();
  if (m.includes("ph")) return "pH";
  if (m.includes("turbidity")) return "Turbidity";
  if (m.includes("oxygen")) return "Dissolved Oxygen";
  if (m.includes("arsenic")) return "Arsenic";
  if (m.includes("iron")) return "Iron";
  if (m.includes("e. coli")) return "E. coli";
  return "Water Quality";
}

function extractValue(msg) {
  const match = msg.match(/\(([^)]+)\)/);
  return match ? match[1] : "—";
}
