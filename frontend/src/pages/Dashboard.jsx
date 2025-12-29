import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStations } from "../utils/api";
import StationCard from "../components/StationCard";
import MapComponent from "../components/MapComponent.jsx";

const Dashboard = () => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("Overview");
  const [error, setError] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [stationsWithReadings, setStationsWithReadings] = useState([]);

  // Load stations from backend
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data || []);
      } catch (err) {
        console.error("Failed to load stations", err);
        setError("Failed to load water stations from server");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // If in Map tab, just mirror stations to stationsWithReadings (no extra API for now)
  useEffect(() => {
    if (activeSection === "Map") {
      setMapLoading(true);
      setStationsWithReadings(stations || []);
      setMapLoading(false);
    }
  }, [activeSection, stations]);

  const filteredStations = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Overview = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Total Stations</h3>
          <p className="text-2xl font-bold text-blue-700">{stations.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Active Alerts</h3>
          <p className="text-2xl font-bold text-red-500">0</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Recent Update</h3>
          <p className="text-2xl font-bold text-gray-700">–</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Overview</h3>
        <p className="text-gray-600">
          Quick summary and charts will appear here once data is available.
        </p>
      </div>
    </div>
  );

  const StationsSection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
        <div className="flex-1 relative group w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all opacity-50">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search stations by name or ID..."
            className="w-full bg-white border-2 border-blue-50 rounded-2xl py-3 px-6 pl-12 text-sm font-medium shadow-sm focus:border-blue-400 focus:ring-0 outline-none transition-all placeholder:text-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-full lg:w-auto bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold text-xs uppercase tracking-widest shadow hover:bg-blue-800 transition-all">
          ＋ Add Monitoring Point
        </button>
      </div>

      {!loading && filteredStations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-600 text-lg mt-6">
            No water stations found.
          </p>
        )
      )}
    </div>
  );

  const MapSection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Map</h3>
          {mapLoading && (
            <span className="text-sm text-gray-500">Loading map data...</span>
          )}
        </div>
        <MapComponent
          stations={
            stationsWithReadings.length ? stationsWithReadings : stations
          }
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-20 text-center font-black text-blue-800 animate-pulse">
        SYNCING NETWORK...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 drop-shadow-sm">
              Water Quality Monitoring Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Live monitoring of all water stations
            </p>
          </div>
        </div>

        {/* Links to Search & Analysis */}
        <div className="mt-4 flex gap-3">
          <Link to="/search">
            <button className="bg-white text-blue-700 border border-blue-600 px-4 py-2 rounded-md">
              Go to Search
            </button>
          </Link>
          <Link to="/analysis">
            <button className="bg-white text-blue-700 border border-blue-600 px-4 py-2 rounded-md">
              Go to Analysis
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="text-center bg-red-100 text-red-600 p-3 rounded-lg shadow-md max-w-xl mx-auto">
            {error}
          </div>
        )}

        <div className="mt-6">
          {activeSection === "Overview" && <Overview />}
          {activeSection === "Stations" && <StationsSection />}
          {activeSection === "search" && <Dashboard />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
