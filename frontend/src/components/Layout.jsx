import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      "Are you sure you want to log out?"
    );
    if (confirmLogout) {
      // ✅ FIXED: remove authToken (not token)
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/login");
    }
    setShowProfileDropdown(false);
  };

  return (
    <div className="flex h-screen bg-blue-50 font-sans">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-blue-800 text-white shadow-2xl">
        <div className="p-6 text-2xl font-black border-b border-blue-700 italic">
          WaterWatch
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                location.pathname === item.path
                  ? "bg-blue-900 border-l-4 border-blue-400"
                  : "hover:bg-blue-700"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700 text-center text-[7px] uppercase tracking-widest opacity-60">
          Authority v2.0
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white h-16 flex items-center justify-between px-8 border-b">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden text-2xl text-blue-700"
          >
            ☰
          </button>

          <h2 className="text-xl font-black uppercase italic">
            Water Quality Monitor
          </h2>

          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-10 h-10 bg-blue-600 rounded-full text-white font-black"
            >
              UP
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-4 py-3 text-xs font-black uppercase hover:bg-blue-50"
                >
                  👤 Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-xs font-black uppercase text-red-500 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
