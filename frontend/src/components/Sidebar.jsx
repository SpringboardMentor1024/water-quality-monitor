import { NavLink } from "react-router-dom";
import { Map, FileText, Bell, Droplet, BarChart2, Users } from "lucide-react";

const menuItems = [
  { name: "Map", path: "/dashboard", icon: Map },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "Stations", path: "/stations", icon: Droplet },
  { name: "Analytics", path: "/analytics", icon: BarChart2 },
  { name: "Collaborations", path: "/collaborations", icon: Users },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
            <Droplet className="text-white" size={20} />
          </div>
          <span className="text-sm font-semibold text-blue-400">
            Water Quality Monitor
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-slate-800 text-blue-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
