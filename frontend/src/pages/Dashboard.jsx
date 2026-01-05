import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardMap from "../components/DashboardMap";
import { getAlerts, getReports, getStations } from "../services/api";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DASHBOARD DATA
  useEffect(() => {
    Promise.all([
      getAlerts(),
      getReports(),
      getStations(),
    ])
      .then(([alertsRes, reportsRes, stationsRes]) => {
        setAlerts(alertsRes.data || []);
        setReports(reportsRes.data || []);
        setStations(stationsRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">
        Dashboard Overview
      </h2>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Alerts" value={alerts.length} color="#8DBCC7" />
        <StatCard title="Recent Reports" value={reports.length} color="#A4CCD9" />
        <StatCard title="Stations Online" value={stations.length} color="#C4E1E6" />
        <StatCard title="Water Quality Index" value="Moderate" color="#8DBCC7" />
      </div>

      {/* MAP OVERVIEW */}
      <div className="bg-white p-5 rounded-xl shadow border border-[#C4E1E6]">
        <h2 className="text-xl font-semibold mb-3">Map Overview</h2>

        <div className="rounded-lg overflow-hidden border border-[#A4CCD9] h-[350px]">
          <DashboardMap stations={stations} />
        </div>

        <Link
          to="/map"
          className="mt-3 inline-block text-blue-600 font-semibold hover:underline"
        >
          View Full Map →
        </Link>
      </div>

      {/* ALERTS + REPORTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RECENT ALERTS */}
        <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>

          {alerts.slice(0, 3).map((alert) => (
            <AlertItem
              key={alert.id}
              location={alert.station_name}
              status={alert.status}
            />
          ))}

          {alerts.length === 0 && (
            <p className="text-gray-500">No alerts available</p>
          )}

          <Link
            to="/alerts"
            className="text-blue-600 font-semibold mt-3 inline-block"
          >
            View All Alerts →
          </Link>
        </div>

        {/* RECENT REPORTS */}
        <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>

          {reports.slice(0, 3).map((report) => (
            <ReportItem
              key={report.id}
              location={report.station_name}
              ph={report.ph}
              status={report.status}
            />
          ))}

          {reports.length === 0 && (
            <p className="text-gray-500">No reports available</p>
          )}

          <Link
            to="/reports"
            className="text-blue-600 font-semibold mt-3 inline-block"
          >
            View All Reports →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------
   SUB COMPONENTS
----------------------------------- */

function StatCard({ title, value, color }) {
  return (
    <div
      className="p-5 rounded-xl shadow text-white text-center"
      style={{ backgroundColor: color }}
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function AlertItem({ location, status }) {
  const color =
    status === "Warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="p-3 rounded-lg mb-3 border border-gray-200 flex justify-between items-center">
      <div>
        <p className="font-semibold">{location}</p>
        <p className="text-sm text-gray-500">Status: {status}</p>
      </div>

      <span
        className={`px-4 py-1 rounded-full text-white text-sm font-medium ${color}`}
      >
        {status}
      </span>
    </div>
  );
}

function ReportItem({ location, ph, status }) {
  const color =
    status === "Safe"
      ? "bg-green-500"
      : status === "Warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="p-3 rounded-lg mb-3 border border-gray-200 flex justify-between items-center">
      <div>
        <p className="font-semibold">{location}</p>
        <p className="text-sm text-gray-500">pH: {ph}</p>
      </div>

      <span
        className={`px-4 py-1 rounded-full text-white text-sm font-medium ${color}`}
      >
        {status}
      </span>
    </div>
  );
}
