import { useState } from "react";

// 🇮🇳 INDIA-BASED STATION LIST (MOCK DATA)
const stationData = [
  {
    id: 1,
    name: "Ganga River Station - Varanasi",
    status: "Online",
    lastUpdate: "2 mins ago",
    sensors: { ph: 7.2, turbidity: "Normal", temp: "24°C" }
  },
  {
    id: 2,
    name: "Yamuna Monitoring Site - Delhi",
    status: "Warning",
    lastUpdate: "5 mins ago",
    sensors: { ph: 6.1, turbidity: "High", temp: "28°C" }
  },
  {
    id: 3,
    name: "Borewell Station - Bengaluru",
    status: "Offline",
    lastUpdate: "1 hour ago",
    sensors: { ph: "-", turbidity: "-", temp: "-" }
  },
  {
    id: 4,
    name: "Hussain Sagar Lake - Hyderabad",
    status: "Online",
    lastUpdate: "12 mins ago",
    sensors: { ph: 6.8, turbidity: "Moderate", temp: "26°C" }
  },
  {
    id: 5,
    name: "Chennai Water Tank – Porur",
    status: "Warning",
    lastUpdate: "18 mins ago",
    sensors: { ph: 6.3, turbidity: "Slight", temp: "29°C" }
  }
];

export default function Stations() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredStations = stationData.filter((station) => {
    const matchesSearch = station.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || station.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h2 className="text-2xl font-bold text-gray-700">Stations</h2>

      {/* SEARCH + FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow border border-[#C4E1E6] flex flex-col md:flex-row gap-4 md:items-end justify-between">

        {/* SEARCH BAR */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600">Search Station</label>
          <input
            type="text"
            placeholder="Search by station name..."
            className="p-2 border rounded-lg mt-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATUS FILTER */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium text-gray-600">Status</label>
          <select
            className="p-2 border rounded-lg mt-1"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Online">Online</option>
            <option value="Warning">Warning</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* STATION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>

    </div>
  );
}

/* ---------------------------------
   STATION CARD COMPONENT
----------------------------------- */

function StationCard({ station }) {
  const badgeColor =
    station.status === "Online"
      ? "bg-green-500"
      : station.status === "Warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-[#A4CCD9]">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{station.name}</h3>

        {/* STATUS BADGE */}
        <span
          className={`px-4 py-1 rounded-full text-white text-sm font-medium tracking-wide ${badgeColor}`}
          style={{ minWidth: "100px", textAlign: "center" }}
        >
          {station.status}
        </span>
      </div>

      {/* LAST UPDATE */}
      <p className="text-sm text-gray-500 mt-1">
        Last updated: {station.lastUpdate}
      </p>

      {/* SENSOR INFO */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">

        <SensorBox label="pH" value={station.sensors.ph} />
        <SensorBox label="Turbidity" value={station.sensors.turbidity} />
        <SensorBox label="Temp" value={station.sensors.temp} />

      </div>
    </div>
  );
}

/* ---------------------------------
   SENSOR BOX COMPONENT
----------------------------------- */

function SensorBox({ label, value }) {
  return (
    <div className="border rounded-lg p-3 bg-[#F5FAFC]">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
