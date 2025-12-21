import { useState } from "react";
import { MdWarning, MdError } from "react-icons/md";

// 🇮🇳 INDIA-BASED ALERT LIST (MOCK DATA)
const alertData = [
  {
    id: 1,
    location: "Ganga River - Kanpur",
    status: "Unsafe",
    details: "High industrial chemical contamination detected",
  },
  {
    id: 2,
    location: "Yamuna River - Delhi",
    status: "Warning",
    details: "Excess foaming and high phosphate levels observed",
  },
  {
    id: 3,
    location: "Borewell - Bengaluru (Whitefield)",
    status: "Unsafe",
    details: "High nitrate levels due to sewage infiltration",
  },
  {
    id: 4,
    location: "Chennai Porur Water Tank",
    status: "Warning",
    details: "Possible bacterial contamination detected",
  },
  {
    id: 5,
    location: "Hussain Sagar Lake - Hyderabad",
    status: "Warning",
    details: "Increased turbidity due to urban runoff",
  },
];

export default function Alerts() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredAlerts = alertData.filter((alert) => {
    const matchesSearch =
      alert.location.toLowerCase().includes(search.toLowerCase()) ||
      alert.details.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || alert.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">Active Alerts</h2>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow border border-[#C4E1E6] flex flex-col md:flex-row gap-4 md:items-end justify-between">

        {/* SEARCH BAR */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600">Search Alerts</label>
          <input
            type="text"
            placeholder="Search by location or description..."
            className="p-2 border rounded-lg mt-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATUS FILTER */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium text-gray-600">Alert Type</label>
          <select
            className="p-2 border rounded-lg mt-1"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Unsafe">Unsafe</option>
            <option value="Warning">Warning</option>
          </select>
        </div>
      </div>

      {/* ALERT CARDS LIST */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   ALERT CARD COMPONENT
----------------------------------------- */

function AlertCard({ alert }) {
  const statusColor =
    alert.status === "Unsafe"
      ? "bg-red-500"
      : "bg-yellow-500"; // Warning

  const Icon = alert.status === "Unsafe" ? MdError : MdWarning;

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9] flex items-start gap-4">

      {/* ALERT ICON */}
      <div className={`p-3 rounded-full ${statusColor} text-white`}>
        <Icon size={22} />
      </div>

      {/* ALERT DETAILS */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{alert.location}</h3>
        <p className="text-sm text-gray-600">{alert.details}</p>

        {/* STATUS BADGE */}
        <div className="flex items-center gap-3 mt-2">
          <span
            className={`px-4 py-1 rounded-full text-white text-sm tracking-wide ${statusColor}`}
            style={{ minWidth: "100px", textAlign: "center" }}
          >
            {alert.status}
          </span>
        </div>
      </div>
    </div>
  );
}
