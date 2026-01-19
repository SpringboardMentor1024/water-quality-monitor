// frontend/app/src/pages/dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaWater,
  FaExclamationTriangle,
  FaClipboardList,
  FaFlask,
  FaChartLine,
  FaMapMarkerAlt,
  FaGlobe,
  FaHandsHelping
} from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MapView from "./sections/mapview";
import Reports from "./sections/report";
import Alerts from "./sections/alerts";
import Details from "./sections/details";
import Analytics from "./sections/analytics";
import Stations from "./sections/stations";

import CpcbDashboard from "./CpcbDashboard";
import WqpDashboard from "./WqpDashboard";
import WhoDashboard from "./WhoDashboard";

/* =========================
   Sidebar
========================= */
const Sidebar = ({ isOpen, toggle, setActiveSection, activeSection }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Map", icon: <FaMapMarkerAlt />, action: () => setActiveSection("Map") },
    { name: "Reports", icon: <FaClipboardList />, action: () => setActiveSection("Reports") },
    { name: "Alerts", icon: <FaExclamationTriangle />, action: () => setActiveSection("Alerts") },
    { name: "Details", icon: <FaWater />, action: () => setActiveSection("Details") },
    { name: "Analytics", icon: <FaChartLine />, action: () => setActiveSection("Analytics") },
    { name: "Stations", icon: <FaFlask />, action: () => setActiveSection("Stations") },
    { name: "CPCB", icon: <FaClipboardList />, action: () => setActiveSection("CPCB") },
    { name: "WQP", icon: <FaFlask />, action: () => setActiveSection("WQP") },
    { name: "WHO", icon: <FaGlobe />, action: () => setActiveSection("WHO") },

    // ✅ NGO DASHBOARD (ROUTE)
    {
      name: "NGO Dashboard",
      icon: <FaHandsHelping />,
      action: () => navigate("/ngo/dashboard")
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
        />
      )}

      {/* ✅ FIX: overflow-y-auto ADDED */}
      <div
        className={`bg-gradient-to-b from-gray-900 to-gray-950 text-white
        p-6 h-screen fixed md:static z-50 flex flex-col w-64 overflow-y-auto ${
          isOpen ? "left-0" : "-left-full"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">WaterWatch</h2>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                activeSection === item.name
                  ? "bg-gray-800"
                  : "hover:bg-gray-800/50"
              }`}
              onClick={() => {
                item.action();
                toggle();
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

/* =========================
   Dashboard
========================= */
const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Map");
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    axios
      .get("http://localhost:8000/stations")
      .then(() => toast.success("Dashboard loaded"))
      .catch(() => toast.error("Failed to load dashboard"));
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "Map":
        return (
          <MapView
            onViewDetails={(id) => {
              setSelectedStationId(id);
              setActiveSection("Details");
            }}
          />
        );
      case "Details":
        return <Details stationId={selectedStationId} />;
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
      case "CPCB":
        return <CpcbDashboard />;
      case "WQP":
        return <WqpDashboard />;
      case "WHO":
        return <WhoDashboard />;
      default:
        return <MapView />;
    }
  };

  const userName = localStorage.getItem("user_name") || "User";

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white">

      <ToastContainer theme="dark" />

      <Sidebar
        isOpen={sidebarOpen}
        toggle={toggleSidebar}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      {/* Mobile Menu */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-blue-500 rounded"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden p-3">

        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-bold">Water Quality Dashboard</h1>

          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2"
            >
              <FaUserCircle />
              <span>{userName}</span>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded w-40">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="block w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
