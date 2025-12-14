// src/components/Sidebar.js
import React from "react";
import { FiDroplet, FiMapPin, FiActivity, FiSettings, FiLayout, FiUser } from "react-icons/fi";
import { getButtonClass } from "./ButtonHelper";

const Sidebar = ({ onNavigate, currentPage }) => {
  return (
    <aside className="hidden md:flex md:flex-col w-60 bg-slate-950/70 border-r border-slate-800 p-4 space-y-8">
      <div className="flex items-center gap-2 text-xl font-semibold">
        <FiDroplet className="text-cyan-400" />
        <span>Water Monitor</span>
      </div>

      <nav className="space-y-2 text-sm">
        <p className="uppercase text-slate-400 text-xs mb-2">Main</p>

        <button onClick={() => onNavigate("home")} className={getButtonClass("home", currentPage)}>
          <FiLayout /> Dashboard
        </button>

        <button onClick={() => onNavigate("locations")} className={getButtonClass("locations", currentPage)}>
          <FiMapPin /> Locations
        </button>

        <button onClick={() => onNavigate("alerts")} className={getButtonClass("alerts", currentPage)}>
          <FiActivity /> Alerts
        </button>

        <button onClick={() => onNavigate("profile")} className={getButtonClass("profile", currentPage)}>
          <FiUser /> Profile
        </button>

        <button onClick={() => onNavigate("settings")} className={getButtonClass("settings", currentPage)}>
          <FiSettings /> Settings
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
