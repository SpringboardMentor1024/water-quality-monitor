// src/pages/Dashboard.js
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";
import Alerts from "./Alerts";
import Settings from "./Settings";
import HomeOverview from "./HomeOverview";
import Locations from "./Locations";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const stats = [
    { label: "pH", value: "7.2", status: "Normal" },
    { label: "Turbidity", value: "3 NTU", status: "Safe" },
    { label: "TDS", value: "450 ppm", status: "Normal" },
    { label: "Temperature", value: "24°C", status: "Normal" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex">
      <Sidebar onNavigate={(p) => setCurrentPage(p)} currentPage={currentPage} />

      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <MobileSidebar
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onNavigate={(p) => { setCurrentPage(p); setMobileOpen(false); }}
        />

        <main className="flex-1 p-4 md:p-6 space-y-6">
          {currentPage === "home" && <HomeOverview stats={stats} />}
          {currentPage === "locations" && <Locations />}
          {currentPage === "alerts" && <Alerts />}
          {currentPage === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
