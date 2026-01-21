import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FINAL MENU ITEMS (NO DUPLICATES, NGO INCLUDED)
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Alerts", path: "/alerts", icon: "🔔" },
    { name: "Locations", path: "/locations", icon: "📍" },
    { name: "NGOs", path: "/ngos", icon: "🏢" },
    { name: "Analytics", path: "/analytics", icon: "📈" },
    { name: "User Reports", path: "/userreports", icon: "📋" },
    { name: "Collaborations", path: "/collaborations", icon: "🤝" },
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out of the Authority System?"
    );
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
    setShowProfileDropdown(false);
  };

  return (
    <div className="flex h-screen bg-blue-50 font-sans">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-blue-800 text-white shadow-2xl z-20">
        <div className="p-6 text-2xl font-black border-b border-blue-700 tracking-tighter italic">
          WaterWatch
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                location.pathname === item.path
                  ? "bg-blue-900 shadow-inner text-white border-l-4 border-blue-400"
                  : "hover:bg-blue-700 text-blue-200"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700 text-center">
          <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest opacity-60">
            Authority v2.0
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-blue-100 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-2xl text-blue-700"
            >
              ☰
            </button>
            <h2 className="text-xl font-black text-blue-900 tracking-tighter uppercase italic">
              Water Quality Monitor
            </h2>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-black text-white"
            >
              UP
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border py-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-6 py-3 text-xs font-black text-blue-900 uppercase hover:bg-blue-50"
                >
                  👤 View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-3 text-xs font-black text-red-500 uppercase hover:bg-red-50"
                >
                  🚪 Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* MOBILE SIDEBAR */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[9999] flex lg:hidden">
          <div
            className="fixed inset-0 bg-blue-900/60"
            onClick={() => setIsMobileOpen(false)}
          ></div>
          <div className="relative w-72 bg-blue-800 text-white p-6 h-full">
            <button
              className="self-end text-3xl mb-8"
              onClick={() => setIsMobileOpen(false)}
            >
              ✕
            </button>

            <nav className="space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center p-4 rounded-2xl font-black"
                >
                  <span className="mr-4 text-2xl">{item.icon}</span>
                  <span className="uppercase text-xs tracking-widest">
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
