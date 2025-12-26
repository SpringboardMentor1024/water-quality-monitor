import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MapView from "./sections/mapview";
import Reports from "./sections/report";
import Alerts from "./sections/alerts";
import Details from "./sections/details";
import Analytics from "./sections/analytics";
import Stations from "./sections/stations";

/* =========================
   Stats Panel
========================= */
const StatsPanel = ({ stats, onFilter }) => (
  <div className="w-64 bg-gray-800 text-white p-4 rounded-lg flex flex-col gap-4">
    <div className="bg-gray-700 p-3 rounded cursor-pointer" onClick={() => onFilter("alerts")}>
      Active Alerts: {stats.activeAlerts}
    </div>
    <div className="bg-gray-700 p-3 rounded cursor-pointer" onClick={() => onFilter("reports")}>
      Open Reports: {stats.openReports}
    </div>
    <div className="bg-gray-700 p-3 rounded cursor-pointer" onClick={() => onFilter("contaminated")}>
      Contaminated Sites: {stats.contaminatedSites}
    </div>
    <div className="bg-gray-700 p-3 rounded cursor-pointer" onClick={() => onFilter("quality")}>
      Water Quality Index: {stats.waterQualityIndex.toFixed(1)}
    </div>
  </div>
);

/* =========================
   Sidebar
========================= */
const Sidebar = ({ isOpen, toggle, setActiveSection }) => (
  <div
    className={`bg-gray-900 text-white p-4 h-screen fixed md:static z-50 flex flex-col justify-between transition-all duration-300 ${
      isOpen ? "left-0" : "-left-full"
    }`}
  >
    <div>
      <h2 className="text-xl font-bold mb-6">WaterWatch</h2>
      <ul className="flex flex-col gap-4">
        {["Map", "Reports", "Alerts", "Details", "Analytics", "Stations"].map((item) => (
          <li
            key={item}
            className="hover:bg-gray-700 p-2 rounded cursor-pointer"
            onClick={() => {
              setActiveSection(item);
              toggle();
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>

    <button className="md:hidden bg-gray-700 p-2 rounded" onClick={toggle}>
      Close
    </button>
  </div>
);

/* =========================
   Dashboard
========================= */
const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Map");
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [filter, setFilter] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [hoveredStation, setHoveredStation] = useState(null);

  const [stats, setStats] = useState({
    activeAlerts: 0,
    openReports: 0,
    contaminatedSites: 0,
    waterQualityIndex: 0,
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  /* =========================
     Close profile menu
  ========================= */
  useEffect(() => {
    const handleClick = () => setProfileMenuOpen(false);
    if (profileMenuOpen) window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [profileMenuOpen]);

  /* =========================
     Fetch dashboard stats
  ========================= */
  useEffect(() => {
    axios
      .get("http://localhost:8000/water-stations")
      .then((res) => {
        const activeAlerts = res.data.filter((s) => s.active_alerts > 0).length;
        const openReports = res.data.filter((s) => s.open_reports > 0).length;
        const contaminatedSites = res.data.filter((s) => s.contaminated).length;
        const avgQuality =
          res.data.reduce((acc, s) => acc + s.water_quality_index, 0) /
            res.data.length || 0;

        setStats({
          activeAlerts,
          openReports,
          contaminatedSites,
          waterQualityIndex: avgQuality,
        });

        toast.success("Stats loaded successfully");
      })
      .catch(() => toast.error("Failed to load dashboard stats"));
  }, []);

  /* =========================
     Section Renderer
  ========================= */
  const renderSection = () => {
    switch (activeSection) {
      case "Map":
        return (
          <MapView
            filter={filter}
            onHoverStation={setHoveredStation}
            onViewDetails={(id) => {
              setSelectedStationId(id);
              setActiveSection("Details");
            }}
          />
        );

      case "Details":
        return (
          <Details
            stationId={selectedStationId}
            goToReports={() => setActiveSection("Reports")}
          />
        );

      case "Reports":
        return <Reports />;

      case "Alerts":
        return <Alerts />;

      case "Analytics":
        return <Analytics stationId={selectedStationId} />;

      case "Stations":
        return (
          <Stations
            onViewStation={(id) => {
              setSelectedStationId(id);
              setActiveSection("Analytics");
            }}
          />
        );

      default:
        return <MapView filter={filter} onHoverStation={setHoveredStation} />;
    }
  };

  const displayStats = hoveredStation
    ? {
        activeAlerts: hoveredStation.active_alerts,
        openReports: hoveredStation.open_reports,
        contaminatedSites: hoveredStation.contaminated ? 1 : 0,
        waterQualityIndex: hoveredStation.water_quality_index || 0,
      }
    : stats;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />

      <Sidebar
        isOpen={sidebarOpen}
        toggle={toggleSidebar}
        setActiveSection={setActiveSection}
      />

      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>

      <div className="flex-1 flex flex-col p-4 md:ml-64">
        {/* Profile Menu */}
        <div className="flex justify-end mb-4 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProfileMenuOpen(!profileMenuOpen);
            }}
            className="flex items-center gap-2"
          >
            <FaUserCircle size={30} />
            <span className="hidden md:block">
              {localStorage.getItem("user_name")}
            </span>
          </button>

          {profileMenuOpen && (
            <div
              className="absolute right-0 top-10 bg-gray-800 rounded-lg shadow-lg w-48 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => navigate("/profile?tab=profile")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Profile
              </button>

              <button
                onClick={() => navigate("/profile?tab=password")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Change Password
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

        <div className="flex flex-1 flex-col md:flex-row gap-4">
          <div className="flex-1 h-[70vh] md:h-auto">{renderSection()}</div>
          <div className="hidden md:flex">
            <StatsPanel stats={displayStats} onFilter={setFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
