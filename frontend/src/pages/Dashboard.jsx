import React, { useEffect, useState } from "react";
import { getStations } from "../utils/api";
import StationCard from "../components/StationCard";

const Dashboard = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data);
      } catch (err) {
        setError("Failed to load water stations");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-blue-800 drop-shadow-sm">
          Water Quality Monitoring Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Live monitoring of all water stations
        </p>

        {/* View Base Map Button */}
        <div className="mt-4">
          <a
            href="/map"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            View Base Map
          </a>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-lg text-blue-700 font-semibold animate-pulse">
          Loading stations...
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="text-center bg-red-100 text-red-600 p-3 rounded-lg shadow-md max-w-xl mx-auto">
          {error}
        </div>
      )}

      {/* Stations Grid */}
      {!loading && stations.length > 0 && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      )}

      {/* No Stations */}
      {!loading && stations.length === 0 && (
        <p className="text-center text-gray-600 text-lg mt-6">
          No water stations found.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
