import { useState } from "react";

// 🇮🇳 INDIA-BASED REPORT DATA (MOCK ONLY)
const reportData = [
  {
    id: 1,
    location: "Ganga River - Varanasi",
    ph: 6.4,
    status: "Warning",
    date: "2025-01-08",
  },
  {
    id: 2,
    location: "Yamuna River - Delhi",
    ph: 5.8,
    status: "Unsafe",
    date: "2025-01-08",
  },
  {
    id: 3,
    location: "Borewell - Bengaluru (Whitefield)",
    ph: 7.1,
    status: "Safe",
    date: "2025-01-07",
  },
  {
    id: 4,
    location: "Hussain Sagar Lake - Hyderabad",
    ph: 6.0,
    status: "Warning",
    date: "2025-01-07",
  },
  {
    id: 5,
    location: "Chennai Porur Tank",
    ph: 5.9,
    status: "Unsafe",
    date: "2025-01-06",
  },
];

export default function Reports() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredReports = reportData.filter((report) => {
    const matchesSearch =
      report.location.toLowerCase().includes(search.toLowerCase()) ||
      report.status.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || report.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">Water Quality Reports</h2>

      {/* FILTER PANEL */}
      <div className="bg-white p-4 rounded-xl shadow border border-[#C4E1E6] flex flex-col md:flex-row gap-4 md:items-end justify-between">

        {/* SEARCH BAR */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600">Search</label>
          <input
            type="text"
            placeholder="Search by location or status..."
            className="p-2 border rounded-lg mt-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATUS FILTER */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium text-gray-600">Filter by Status</label>
          <select
            className="p-2 border rounded-lg mt-1"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Safe">Safe</option>
            <option value="Warning">Warning</option>
            <option value="Unsafe">Unsafe</option>
          </select>
        </div>

      </div>

      {/* REPORTS TABLE */}
      <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#C4E1E6] text-gray-700">
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">pH Level</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{report.location}</td>
                <td className="p-3">{report.ph}</td>
                <td className="p-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="p-3">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION (UI only, no backend needed) */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            Prev
          </button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>

    </div>
  );
}

/* ----------------------------------------
   STATUS BADGE COMPONENT
----------------------------------------- */

function StatusBadge({ status }) {
  const color =
    status === "Safe"
      ? "bg-green-500"
      : status === "Warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <span
      className={`flex items-center justify-center px-4 py-1 rounded-full text-white text-sm tracking-wide ${color}`}
      style={{ minWidth: "90px" }}
    >
      {status}
    </span>
  );
}
