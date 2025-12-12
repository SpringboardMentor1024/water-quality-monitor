// src/components/MobileSidebar.js
import React from "react";
import { FiDroplet, FiMapPin, FiActivity, FiSettings, FiX } from "react-icons/fi";

const MobileSidebar = ({ isOpen, onClose, onNavigate }) => {
  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        className={`absolute left-0 top-0 bottom-0 z-50 w-64 max-w-[80%] bg-slate-950/95 border-r border-slate-800 p-4 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-50">
            <FiDroplet className="text-cyan-400" />
            <span>Water Monitor</span>
          </div>
          <button aria-label="Close menu" className="p-2 rounded-md bg-slate-800/60" onClick={onClose}>
            <FiX className="w-5 h-5 text-slate-100" />
          </button>
        </div>

        <nav className="space-y-3 text-sm">
          <p className="uppercase text-slate-400 text-xs mb-2">Main</p>

          <button onClick={() => onNavigate && onNavigate("home")} className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 text-slate-50">
            Dashboard
          </button>

          <button onClick={() => onNavigate && onNavigate("locations")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/70 flex items-center gap-2">
            <FiMapPin /> Locations
          </button>

          <button onClick={() => onNavigate && onNavigate("alerts")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/70 flex items-center gap-2">
            <FiActivity /> Alerts
          </button>

          <button onClick={() => onNavigate && onNavigate("settings")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/70 flex items-center gap-2">
            <FiSettings /> Settings
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default MobileSidebar;
