import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/alerts', icon: '⚠️', label: 'Alerts' },
    { path: '/user-reports', icon: '📄', label: 'Reports' },
    { path: '/map', icon: '🗺️', label: 'Map' },
    { path: '/stations', icon: '📍', label: 'Stations' },
    { path: '/analytics', icon: '📊', label: 'Analytics' },
    { path: '/collaborations', icon: '👥', label: 'Collaborations' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
    // Removed support option
  ];

  return (
    <nav className="w-64 bg-white h-screen shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-teal-600">Water Quality Monitor</h1>
        <p className="text-sm text-gray-500">Real-time monitoring system</p>
      </div>
      
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <div className="text-center text-sm text-gray-500">
          <p>Water Quality Monitor v1.0</p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
