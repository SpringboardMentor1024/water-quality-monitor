import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle, FaTimes, FaWater, FaExclamationTriangle, FaClipboardList, FaFlask, FaChartLine, FaMapMarkerAlt, FaSignOutAlt, FaUser, FaKey, FaFilter } from "react-icons/fa";
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
   Stats Panel - Ultra Compact White Theme
========================= */
const StatsPanel = ({ stats, onFilter, hoveredStation }) => (
  <div className="w-full bg-white text-gray-800 p-2 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-xs font-bold text-gray-700">Water Stats</h3>
      {hoveredStation && (
        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
          Station View
        </span>
      )}
    </div>
    
    <div className="grid grid-cols-4 gap-1.5">
      <div 
        className="bg-gradient-to-r from-red-50 to-red-50 p-1.5 rounded-md border border-red-100 cursor-pointer hover:border-red-200 transition-colors duration-150"
        onClick={() => onFilter("alerts")}
        title="Filter by Alerts"
      >
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-red-100 rounded">
            <FaExclamationTriangle className="text-red-600 text-xs" />
          </div>
          <div>
            <p className="text-[10px] text-gray-600">Alerts</p>
            <p className="text-sm font-bold text-gray-800">{stats.activeAlerts}</p>
          </div>
        </div>
      </div>

      <div 
        className="bg-gradient-to-r from-yellow-50 to-yellow-50 p-1.5 rounded-md border border-yellow-100 cursor-pointer hover:border-yellow-200 transition-colors duration-150"
        onClick={() => onFilter("reports")}
        title="Filter by Reports"
      >
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-yellow-100 rounded">
            <FaClipboardList className="text-yellow-600 text-xs" />
          </div>
          <div>
            <p className="text-[10px] text-gray-600">Reports</p>
            <p className="text-sm font-bold text-gray-800">{stats.openReports}</p>
          </div>
        </div>
      </div>

      <div 
        className="bg-gradient-to-r from-purple-50 to-purple-50 p-1.5 rounded-md border border-purple-100 cursor-pointer hover:border-purple-200 transition-colors duration-150"
        onClick={() => onFilter("contaminated")}
        title="Filter by Contaminated Sites"
      >
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-purple-100 rounded">
            <FaFlask className="text-purple-600 text-xs" />
          </div>
          <div>
            <p className="text-[10px] text-gray-600">Contaminated</p>
            <p className="text-sm font-bold text-gray-800">{stats.contaminatedSites}</p>
          </div>
        </div>
      </div>

      <div 
        className="bg-gradient-to-r from-blue-50 to-blue-50 p-1.5 rounded-md border border-blue-100 cursor-pointer hover:border-blue-200 transition-colors duration-150"
        onClick={() => onFilter("quality")}
        title="Filter by Water Quality"
      >
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-blue-100 rounded">
            <FaWater className="text-blue-600 text-xs" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-600">WQI</p>
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold text-gray-800">{stats.waterQualityIndex.toFixed(1)}</p>
              <div className="flex-1 bg-gray-100 h-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${stats.waterQualityIndex > 70 ? 'bg-green-500' : stats.waterQualityIndex > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(stats.waterQualityIndex, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-1 pt-1 border-t border-gray-100">
      <p className="text-[10px] text-gray-500 text-center">
        Click stats to filter
      </p>
    </div>
  </div>
);

/* =========================
   Sidebar - Enhanced
========================= */
const Sidebar = ({ isOpen, toggle, setActiveSection, activeSection }) => {
  const menuItems = [
    { name: "Map", icon: <FaMapMarkerAlt /> },
    { name: "Reports", icon: <FaClipboardList /> },
    { name: "Alerts", icon: <FaExclamationTriangle /> },
    { name: "Details", icon: <FaWater /> },
    { name: "Analytics", icon: <FaChartLine /> },
    { name: "Stations", icon: <FaFlask /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
        />
      )}
      
      <div
        className={`bg-gradient-to-b from-gray-900 to-gray-950 text-white p-6 h-screen fixed md:static z-50 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-2xl md:shadow-xl w-64 ${
          isOpen ? "left-0" : "-left-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <FaWater className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                WaterWatch
              </h2>
            </div>
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={toggle}
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.name 
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30" 
                    : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
                }`}
                onClick={() => {
                  setActiveSection(item.name);
                  toggle();
                }}
              >
                <div className={`p-2 rounded-lg ${activeSection === item.name ? 'bg-blue-500/30' : 'bg-gray-800'}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <p className="text-xs text-gray-400">Last Updated</p>
            <p className="text-sm">Just now</p>
          </div>
        </div>
      </div>
    </>
  );
};

/* =========================
   Dashboard - Enhanced
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

        toast.success("Dashboard updated successfully!");
      })
      .catch(() => toast.error("Failed to load dashboard stats"));
  }, []);

  /* =========================
     Section Renderer
  ========================= */
  const renderSection = () => {
    const sectionTitles = {
      "Map": "Water Quality Map",
      "Reports": "Incident Reports",
      "Alerts": "Alert System",
      "Details": "Station Details",
      "Analytics": "Analytics Dashboard",
      "Stations": "Monitoring Stations"
    };

    const sectionIcons = {
      "Map": <FaMapMarkerAlt />,
      "Reports": <FaClipboardList />,
      "Alerts": <FaExclamationTriangle />,
      "Details": <FaWater />,
      "Analytics": <FaChartLine />,
      "Stations": <FaFlask />
    };

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
              {sectionIcons[activeSection]}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{sectionTitles[activeSection]}</h2>
              <p className="text-gray-400 text-xs">Real-time monitoring</p>
            </div>
          </div>
          
          {filter && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-full">
              <FaFilter className="text-blue-400 text-xs" />
              <span className="text-xs text-blue-300">{filter}</span>
              <button 
                onClick={() => setFilter(null)}
                className="ml-0.5 text-gray-400 hover:text-white"
              >
                <FaTimes size={8} />
              </button>
            </div>
          )}
        </div>

        {/* Ultra Compact Stats Panel - REMOVED on Stations AND Analytics pages */}
        {activeSection !== "Stations" && activeSection !== "Analytics" && (
          <div className="mb-2">
            <StatsPanel 
              stats={hoveredStation
                ? {
                    activeAlerts: hoveredStation.active_alerts,
                    openReports: hoveredStation.open_reports,
                    contaminatedSites: hoveredStation.contaminated ? 1 : 0,
                    waterQualityIndex: hoveredStation.water_quality_index || 0,
                  }
                : stats}
              onFilter={setFilter}
              hoveredStation={hoveredStation}
            />
          </div>
        )}

        {/* Map/Content Area - MAXIMUM SPACE (no minimum height constraint) */}
        <div className="flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          {(() => {
            switch (activeSection) {
              case "Map":
                return (
                  <div className="h-full w-full">
                    <MapView
                      filter={filter}
                      onHoverStation={setHoveredStation}
                      onViewDetails={(id) => {
                        setSelectedStationId(id);
                        setActiveSection("Details");
                      }}
                    />
                  </div>
                );

              case "Details":
                return (
                  <div className="h-full">
                    <Details
                      stationId={selectedStationId}
                      goToReports={() => setActiveSection("Reports")}
                    />
                  </div>
                );

              case "Reports":
                return <div className="h-full"><Reports /></div>;

              case "Alerts":
                return <div className="h-full"><Alerts /></div>;

              case "Analytics":
                return <div className="h-full"><Analytics stationId={selectedStationId} /></div>;

              case "Stations":
                return (
                  <div className="h-full">
                    <Stations
                      onViewStation={(id) => {
                        setSelectedStationId(id);
                        setActiveSection("Analytics");
                      }}
                    />
                  </div>
                );

              default:
                return (
                  <div className="h-full w-full">
                    <MapView filter={filter} onHoverStation={setHoveredStation} />
                  </div>
                );
            }
          })()}
        </div>
      </div>
    );
  };

  const userName = localStorage.getItem("user_name") || "User";

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        toastClassName="bg-gray-800 text-white"
      />

      <Sidebar
        isOpen={sidebarOpen}
        toggle={toggleSidebar}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg"
        onClick={toggleSidebar}
      >
        <FaBars size={16} />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-2 md:p-3 md:ml-0 overflow-hidden">
        {/* Header - Very Compact */}
        <div className="flex justify-between items-center mb-1">
          <div className="hidden md:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Water Quality Dashboard
            </h1>
            <p className="text-gray-400 text-xs">Monitor water stations</p>
          </div>
          
          {/* Profile Menu - Ultra Compact */}
          <div className="relative ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileMenuOpen(!profileMenuOpen);
              }}
              className="flex items-center gap-1.5 px-2 py-1 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200"
            >
              <div className="p-1 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-md">
                <FaUserCircle size={14} className="text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-xs">{userName}</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            </button>

            {profileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div
                  className="absolute right-0 top-10 bg-gray-800/95 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-700 w-44 z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2 border-b border-gray-700">
                    <p className="font-medium text-xs">{userName}</p>
                    <p className="text-xs text-gray-400">waterwatch@admin.com</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/profile?tab=profile");
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-700/50 transition-colors text-xs"
                    >
                      <FaUser className="text-gray-400 text-xs" />
                      <span>Profile Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/profile?tab=password");
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-700/50 transition-colors text-xs"
                    >
                      <FaKey className="text-gray-400 text-xs" />
                      <span>Change Password</span>
                    </button>

                    <div className="my-1 border-t border-gray-700" />

                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 text-red-400 hover:bg-red-500/10 transition-colors text-xs"
                    >
                      <FaSignOutAlt className="text-xs" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Title - Very Compact */}
        <div className="md:hidden mb-1">
          <h1 className="text-sm font-bold">WaterWatch</h1>
          <p className="text-gray-400 text-xs">Monitoring system</p>
        </div>

        {/* Main Content Area - MAXIMUM SPACE (reduced margins for more space) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderSection()}
        </div>

        {/* Footer - Minimal */}
        <div className="mt-1 pt-1 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500">
            <p>WaterWatch v2.0</p>
            <p className="flex items-center gap-0.5">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 ml-0.5">Operational</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
