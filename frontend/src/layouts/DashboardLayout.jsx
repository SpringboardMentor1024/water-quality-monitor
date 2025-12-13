import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex">
      {/* Sidebar (desktop + mobile overlay handled inside Sidebar) */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col bg-[#0b1220]">
        {/* Top Navbar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 bg-[#0b1220] px-4 py-6 sm:px-6 lg:px-8 overflow-hidden">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 py-4 border-t border-slate-800">
          © 2025 Water Quality Monitor. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
