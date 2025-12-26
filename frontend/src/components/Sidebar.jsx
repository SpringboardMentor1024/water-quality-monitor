import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdMap,
  MdAssessment,
  MdWarning,
  MdSensors,
  MdAnalytics,
  MdSearch,
  MdPerson,
  MdSettings,
  MdLogout,
} from "react-icons/md";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ LOGOUT FUNCTION (THIS IS WHERE IT GOES)
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={22} /> },
    { name: "Map", path: "/map", icon: <MdMap size={22} /> },
    { name: "Reports", path: "/reports", icon: <MdAssessment size={22} /> },
    { name: "Alerts", path: "/alerts", icon: <MdWarning size={22} /> },
    { name: "Stations", path: "/stations", icon: <MdSensors size={22} /> },
    { name: "Analytics", path: "/analytics", icon: <MdAnalytics size={22} /> },
    { name: "Search", path: "/search", icon: <MdSearch size={22} /> },
    { name: "Profile", path: "/profile", icon: <MdPerson size={22} /> },
    { name: "Settings", path: "/settings", icon: <MdSettings size={22} /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#F5FAFC] border-r border-[#C4E1E6] p-4 flex flex-col justify-between">

      {/* TOP MENU */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-6">
          Water Quality Monitor
        </h2>

        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition
              ${
                location.pathname === item.path
                  ? "bg-[#C4E1E6] text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-[#E8F5F8]"
              }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>

      {/* LOGOUT BUTTON (BOTTOM) */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-100 transition"
      >
        <MdLogout size={22} />
        Logout
      </button>

    </aside>
  );
}
