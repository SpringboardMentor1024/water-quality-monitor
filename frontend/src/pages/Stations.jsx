import { useEffect, useState } from "react";
import { getStations, getReports } from "../services/api";

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    Promise.all([getStations(), getReports()])
      .then(([stationsRes, reportsRes]) => {
        setStations(stationsRes.data);
        setReports(reportsRes.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔥 attach latest report to each station
  const stationsWithReadings = stations.map((station) => {
    const stationReports = reports
      .filter((r) => r.station_name === station.name)
      .sort(
        (a, b) => new Date(b.recorded_at) - new Date(a.recorded_at)
      );

    const latest = stationReports[0];

    return {
      ...station,
      sensors: latest
        ? {
            ph: latest.ph,
            turbidity: latest.turbidity,
            temp: `${latest.temperature}°C`,
            status: latest.status,
          }
        : {
            ph: "-",
            turbidity: "-",
            temp: "-",
            status: "Online",
          },
    };
  });

  const filteredStations = stationsWithReadings.filter((station) => {
    const matchesSearch = station.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      station.sensors.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold text-gray-700">
        Stations
      </h2>

      {/* SEARCH + FILTER */}
      <div className="bg-white p-4 rounded-xl shadow border flex flex-col md:flex-row gap-4">

        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600">
            Search Station
          </label>
          <input
            type="text"
            placeholder="Search by station name..."
            className="p-2 border rounded-lg mt-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium text-gray-600">
            Status
          </label>
          <select
            className="p-2 border rounded-lg mt-1"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Safe">Safe</option>
            <option value="Warning">Warning</option>
            <option value="Unsafe">Unsafe</option>
          </select>
        </div>

      </div>

      {/* STATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>

    </div>
  );
}

/* --------------------------------- */

function StationCard({ station }) {
  const badgeColor =
    station.sensors.status === "Safe"
      ? "bg-green-500"
      : station.sensors.status === "Warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-white p-5 rounded-xl shadow border">

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {station.name}
        </h3>

        <span
          className={`px-4 py-1 rounded-full text-white text-sm ${badgeColor}`}
        >
          {station.sensors.status}
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Last updated: Just now
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <SensorBox label="pH" value={station.sensors.ph} />
        <SensorBox label="Turbidity" value={station.sensors.turbidity} />
        <SensorBox label="Temp" value={station.sensors.temp} />
      </div>

    </div>
  );
}

function SensorBox({ label, value }) {
  return (
    <div className="border rounded-lg p-3 bg-[#F5FAFC]">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
