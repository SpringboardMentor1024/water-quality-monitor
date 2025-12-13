import { Menu, Bell, Droplet, User } from "lucide-react";

const Navbar = ({ setSidebarOpen }) => {
  return (
    <header className="w-full h-16 bg-[#0f172a] text-white px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-800">
      
      {/* Left: Mobile Menu Button + Logo + App Name */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-white p-2 mr-2"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
          <Droplet className="text-white" size={20} />
        </div>

        {/* App Name */}
        <span className="text-base font-semibold text-blue-400 leading-none whitespace-nowrap">
          Water Quality Monitor
        </span>
      </div>

      {/* Right: Notifications + User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          onClick={() => console.log("Notifications clicked")}
          className="relative p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* User Profile */}
        <button
          onClick={() => console.log("User profile clicked")}
          className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold hover:bg-slate-500 transition cursor-pointer"
          aria-label="User Profile"
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
