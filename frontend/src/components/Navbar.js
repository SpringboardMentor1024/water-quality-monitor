import React, { useState } from "react";
// Import FiUser for the avatar, and FiLogOut for the menu item
import { FiBell, FiMenu, FiLogOut, FiUser } from "react-icons/fi"; 

// Accept the onLogout prop from Dashboard.js
const Navbar = ({ onMenuClick, onLogout, onNavigateToProfile, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Helper function to toggle the dropdown
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // NEW HANDLER: Toggles the notification view/modal
  const toggleNotifications = () => setIsNotificationOpen(prev => !prev);

  // Handler: Navigates to a page AND closes the notification dropdown
  const handleAlertsClick = () => {
      setIsNotificationOpen(false); // Close notifications dropdown
      if (typeof onNavigate === "function") {
          onNavigate("alerts"); // Navigate to the Alerts page
      }
  };

  // Helper function to handle logout and close the menu
  const handleLogoutClick = () => {
    setIsMenuOpen(false); // Close menu
    if (typeof onLogout === "function") {
        onLogout(); // Execute logout logic (set view to MonitorProfile/Login in App.js)
    }
  };
  
  // Helper function to navigate to Profile and close the menu
  const handleProfileClick = () => {
    setIsMenuOpen(false); // Close menu
    if (typeof onNavigateToProfile === "function") {
        onNavigateToProfile("profile"); 
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-slate-700 bg-slate-900/80 backdrop-blur z-30 relative">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-full p-2 bg-slate-800/80 text-slate-100 border border-slate-600/60 shadow-sm"
          aria-label="Open sidebar"
          onClick={onMenuClick}
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

      <div className="flex items-center gap-3 relative">
        {/* Notifications Button (Now Clickable) */}
        <button 
          type="button" 
          onClick={toggleNotifications} // ADDED HANDLER
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/70 bg-slate-800/80 text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors" 
          aria-label="Notifications"
          // Optional: Add a class for active state if needed (e.g., active:bg-slate-700)
        >
          <FiBell className="w-4 h-4" />
          {/* Mock unread notification indicator */}
          <span className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* --- Notification Dropdown Placeholder --- */}
        {isNotificationOpen && (
          <div className="absolute right-0 top-12 mt-2 w-72 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-40">
            <div className="py-2 px-4 text-sm font-semibold border-b border-slate-700 text-slate-50">
              Recent Alerts (Mock)
            </div>
            <div className="p-3 text-sm text-slate-400">
              <p className="mb-1 border-b border-slate-700/50 pb-1">pH Critical at Site A (2 min ago)</p>
              <p className="mb-1 border-b border-slate-700/50 pb-1">Turbidity Warning (15 min ago)</p>
              {/* ADDED onClick HANDLER HERE */}
              <button onClick={handleAlertsClick} className="w-full text-center pt-2 text-cyan-400 hover:text-cyan-300 transition-colors block text-xs">
                View All Alerts
              </button>
            </div>
          </div>
        )}

        {/* User Profile Dropdown Toggle */}
        <button 
          type="button"
          onClick={toggleMenu}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-shadow"
          aria-label="User menu"
        >
          S
        </button>
        
        {/* --- Dropdown Menu --- */}
        {isMenuOpen && (
          <div className="absolute right-0 top-12 mt-2 w-48 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-40">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
              
              {/* Option 1: View Profile */}
              <button
                onClick={handleProfileClick}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/80 transition-colors"
                role="menuitem"
              >
                <FiUser className="w-4 h-4 mr-2" /> View Profile
              </button>
              
              {/* Option 2: Logout */}
              <button
                onClick={handleLogoutClick}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700/80 transition-colors border-t border-slate-700 mt-1 pt-2"
                role="menuitem"
              >
                <FiLogOut className="w-4 h-4 mr-2" /> Sign Out
              </button>
              
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;