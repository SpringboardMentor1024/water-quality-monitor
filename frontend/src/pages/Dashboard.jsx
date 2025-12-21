// ✅ IMPORTS
import { Link } from "react-router-dom";
import GoogleMapReact from "google-map-react";

// ✅ MINI MAP COMPONENT — MUST BE ABOVE Dashboard()
function MiniMap() {
  const defaultProps = {
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 11,
  };

  return (
    <div className="h-52 rounded-lg overflow-hidden border border-[#A4CCD9]">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAeMYcURw7ex-KyeHJ5_3ZJwF9ebKKio54" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      />
    </div>
  );
}

// ✅ MAIN DASHBOARD COMPONENT
export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">Dashboard Overview</h2>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Alerts" value="12" color="#8DBCC7" />
        <StatCard title="Recent Reports" value="56" color="#A4CCD9" />
        <StatCard title="Stations Online" value="18" color="#C4E1E6" />
        <StatCard title="Water Quality Index" value="Good" color="#8DBCC7" />
      </div>

      {/* MAP PREVIEW */}
      <div className="bg-white p-5 rounded-xl shadow border border-[#C4E1E6]">
        <h2 className="text-xl font-semibold mb-3">Map Overview</h2>
        <MiniMap />
        <Link
          to="/map"
          className="mt-3 inline-block text-blue-600 font-semibold hover:underline"
        >
          View Full Map →
        </Link>
      </div>

      {/* GRID: ALERTS + REPORTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* RECENT ALERTS */}
        <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          <AlertItem location="Riverbank Station" status="Unsafe" color="red" />
          <AlertItem location="City Tank" status="Warning" color="yellow" />
          <AlertItem location="Borewell Area" status="Unsafe" color="red" />
          <Link to="/alerts" className="text-blue-600 font-semibold mt-3 inline-block">
            View All Alerts →
          </Link>
        </div>

        {/* RECENT REPORTS */}
        <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          <ReportItem location="Lake View" ph="6.1" status="Warning" />
          <ReportItem location="City Tank" ph="7.0" status="Safe" />
          <ReportItem location="River Bank" ph="5.8" status="Unsafe" />
          <Link to="/reports" className="text-blue-600 font-semibold mt-3 inline-block">
            View All Reports →
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ---- SUB COMPONENTS ---- */

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

function AlertItem({ location, status, color }) {
  return (
    <div className="p-3 rounded-lg mb-3 border border-gray-200 flex justify-between items-center">
      <div>
        <p className="font-semibold">{location}</p>
        <p className="text-sm text-gray-500">Status: {status}</p>
      </div>

      <span
        className={`flex items-center justify-center px-4 py-1 rounded-full font-medium text-white text-sm tracking-wide ${
          color === "red" ? "bg-red-500" : "bg-yellow-500"
        }`}
        style={{ minWidth: "100px" }}
      >
        {status}
      </span>
    </div>
  );
}

function ReportItem({ location, ph, status }) {
  return (
    <div className="p-3 rounded-lg mb-3 border border-gray-200 flex justify-between items-center">
      <div>
        <p className="font-semibold">{location}</p>
        <p className="text-sm text-gray-500">pH: {ph}</p>
      </div>

      <span
        className={`flex items-center justify-center px-4 py-1 rounded-full font-medium text-white text-sm tracking-wide ${
          status === "Safe"
            ? "bg-green-500"
            : status === "Warning"
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
        style={{ minWidth: "100px" }}
      >
        {status}
      </span>
    </div>
  );
}
