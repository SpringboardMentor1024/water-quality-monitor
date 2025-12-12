// src/components/Navbar.js
import React from "react";
import { FiBell, FiMenu } from "react-icons/fi";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-slate-700 bg-slate-900/80 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-full p-2 bg-slate-800/80 text-slate-100 border border-slate-600/60 shadow-sm"
          aria-label="Open sidebar"
          onClick={() => { if (typeof onMenuClick === "function") onMenuClick(); }}
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm font-semibold text-slate-100 md:text-lg">
            Water Quality Monitor Dashboard
          </h1>
          <p className="hidden text-xs text-slate-400 sm:block">
            Live overview of water quality parameters
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/70 bg-slate-800/80 text-slate-100 shadow-sm" aria-label="Notifications">
          <FiBell className="w-4 h-4" />
          <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-slate-900">
          S
        </div>
      </div>
    </header>
  );
};

export default Navbar;
