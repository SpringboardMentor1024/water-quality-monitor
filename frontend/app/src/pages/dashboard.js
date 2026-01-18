// pages/dashboard.js
// frontend/app/src/pages/dashboard.js
import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaUserCircle,
  FaTimes,
  FaWater,
  FaExclamationTriangle,
  FaClipboardList,
  FaFlask,
  FaChartLine,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaUser,
  FaKey,
  FaGlobe,
  FaHandsHelping
} from "react-icons/fa";
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

import CpcbDashboard from "./CpcbDashboard";
import WqpDashboard from "./WqpDashboard";
import WhoDashboard from "./WhoDashboard";

/* =========================
   Sidebar
========================= */
const Sidebar = ({ isOpen, toggle, setActiveSection, activeSection }) => {
  const menuItems = [
    { name: "Map", icon: <FaMapMarkerAlt /> },
    { name: "Reports", icon: <FaClipboardList /> },
    { name: "Alerts", icon: <FaExclamationTriangle /> },
    { name: "Details", icon: <FaWater /> },
    { name: "Analytics", icon: <FaChartLine /> },
    { name: "Stations", icon: <FaFlask /> },
    { name: "CPCB", icon: <FaClipboardList /> },
    { name: "WQP", icon: <FaFlask /> },
    { name: "WHO", icon: <FaGlobe /> },
    { name: "NGO Dashboard", icon: <FaHandsHelping /> },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
        />
      )}

      <div
        className={`bg-gradient-to-b from-gray-900 to-gray-950 text-white p-6 h-screen fixed md:static z-50 flex flex-col w-64 ${
          isOpen ? "left-0" : "-left-full"
        }`}
      >
        <div>
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
                  if (item.name === "NGO Dashboard") {
                    window.location.href = "/ngo-dashboard";
                  } else {
                    setActiveSection(item.name);
                    toggle();
                  }
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>
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
    /* 🔒 PAGE SCROLL LOCKED */
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

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden p-3">

        {/* HEADER (FIXED) */}
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

        {/* 🔽 ONLY THIS SCROLLS */}
        <div className="flex-1 overflow-y-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
