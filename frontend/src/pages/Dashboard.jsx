import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStations, getReports, getStationReadings } from "../utils/api";
import StationCard from "../components/StationCard";
import MapComponent from "../components/MapComponent.jsx";
import { exportCsv } from "../utils/export";

console.log("Dashboard without mock data loaded");

const Dashboard = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState("Overview");
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]); // expects backend alerts later
  const [reportsLoading, setReportsLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [stationsWithReadings, setStationsWithReadings] = useState([]);

  // 1) Load stations from backend only
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

  // Export reports to CSV
  const exportReportsCsv = () => {
    const rows = reports.map((r) => ({
      Date: r.date,
      Station: r.station,
      Summary: r.summary,
    }));
    exportCsv(rows, "reports.csv");
  };

  // 2) Load reports and map readings from backend when needed
  useEffect(() => {
    const doFetch = async () => {
      if (activeSection === "Reports") {
        setReportsLoading(true);
        try {
          const data = await getReports();
          setReports(data || []);
        } catch (err) {
          console.error("Failed to fetch reports", err);
          setError("Failed to load reports from server");
        } finally {
          setReportsLoading(false);
        }
      }

      if (activeSection === "Map") {
        const source = stations || [];
        setMapLoading(true);
        try {
          const cp = await Promise.all(
            source.map(async (s) => {
              if (s.latest_reading) return s;
              try {
                const readings = await getStationReadings(s.id);
                return {
                  ...s,
                  latest_reading:
                    readings && readings.length > 0 ? readings[0] : null,
                };
              } catch {
                return { ...s, latest_reading: null };
              }
            })
          );
          setStationsWithReadings(cp);
        } catch (err) {
          console.error("Failed to fetch station readings", err);
        } finally {
          setMapLoading(false);
        }
      }
    };

    doFetch();
  }, [activeSection, stations]);

  // 3) Sections use only real data
  const Overview = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Total Stations</h3>
          <p className="text-2xl font-bold text-blue-700">{stations.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-sm text-gray-500">Active Alerts</h3>
          <p className="text-2xl font-bold text-red-500">
            {alerts.length ?? 0}
          </p>
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
      {!loading && stations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
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

  const ReportsSection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Reports</h3>
          <button
            onClick={exportReportsCsv}
            className="bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            Export CSV
          </button>
        </div>

        {reportsLoading ? (
          <p className="text-gray-600">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-gray-600">No reports available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="py-2">Date</th>
                  <th className="py-2">Station</th>
                  <th className="py-2">Summary</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.date}</td>
                    <td className="py-2">{r.station}</td>
                    <td className="py-2">{r.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const AlertsSection = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Alerts</h3>
        {alerts.length === 0 ? (
          <p className="text-gray-600">No active alerts.</p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li key={a.id} className="p-3 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{a.station}</strong>
                    <span className="ml-2 text-sm text-gray-500">
                      • {a.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{a.time}</div>
                </div>
                <p className="mt-2 text-gray-700">{a.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
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

        {/* Main tabs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {["Overview", "Map", "Stations", "Reports", "Alerts"].map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-md transition font-medium ${
                activeSection === s
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Navigation to Search & Analysis pages */}
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

      {/* Content area */}
      <div className="max-w-6xl mx-auto">
        {loading && (
          <p className="text-center text-lg text-blue-700 font-semibold animate-pulse">
            Loading stations...
          </p>
        )}

        {error && (
          <div className="text-center bg-red-100 text-red-600 p-3 rounded-lg shadow-md max-w-xl mx-auto">
            {error}
          </div>
        )}

        <div className="mt-6">
          {activeSection === "Overview" && <Overview />}
          {activeSection === "Map" && <MapSection />}
          {activeSection === "Stations" && <StationsSection />}
          {activeSection === "Reports" && <ReportsSection />}
          {activeSection === "Alerts" && <AlertsSection />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
