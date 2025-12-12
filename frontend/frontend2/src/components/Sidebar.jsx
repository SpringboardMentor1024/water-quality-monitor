import { Link, useLocation } from "react-router-dom";
import { 
  MdDashboard, MdMap, MdAssessment, MdWarning, MdSensors, MdAnalytics
} from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: <MdDashboard size={22} /> },
    { name: "Map", path: "/map", icon: <MdMap size={22} /> },
    { name: "Reports", path: "/reports", icon: <MdAssessment size={22} /> },
    { name: "Alerts", path: "/alerts", icon: <MdWarning size={22} /> },
    { name: "Stations", path: "/stations", icon: <MdSensors size={22} /> },
    { name: "Analytics", path: "/analytics", icon: <MdAnalytics size={22} /> }
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#A4CCD9] shadow-md p-6">
      {/* PROJECT TITLE */}
      <h1 className="text-2xl font-bold mb-10 text-gray-800">
        Water Quality Monitor
      </h1>

      {/* MENU */}
      <nav className="flex flex-col gap-3">
        {menu.map((m) => (
          <Link
            key={m.path}
            to={m.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium
              ${
                location.pathname === m.path
                  ? "bg-[#8DBCC7] text-white shadow"
                  : "text-gray-800 hover:bg-[#C4E1E6]"
              }
            `}
          >
            {m.icon}
            {m.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
