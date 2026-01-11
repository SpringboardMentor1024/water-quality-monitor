import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import WaterQualityMap from '../components/dashboard/WaterQualityMap';
import MetricsCards from '../components/dashboard/MetricsCards';
import QualityChart from '../components/dashboard/QualityChart';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import ReportsPanel from '../components/dashboard/ReportsPanel';
import TestAuth from '../components/TestAuth';
import { authAPI, alertsAPI, stationsAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRefreshData = async () => {
    try {
      await fetchWaterQualityData();
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
      toast.textContent = 'Data refreshed successfully!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error('Refresh failed:', error);
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
      toast.textContent = 'Failed to refresh data';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  const fetchWaterQualityData = async () => {
    try {
      // Fetch real data from backend
      const stations = await stationsAPI.getAllStations();
      const processedData = stations.map((station) => {
        let status = station.status || 'active';
        if (status === 'active') status = 'good';
        
        return {
          id: station.id,
          location: station.name,
          lat: parseFloat(station.latitude),
          lng: parseFloat(station.longitude),
          ph: station.currentReading?.ph || 7.0,
          turbidity: station.currentReading?.turbidity || 1.0,
          dissolved_oxygen: station.currentReading?.dissolved_oxygen || 8.0,
          temperature: station.currentReading?.temperature || 20.0,
          status: status
        };
      });
      setWaterQualityData(processedData);
      
      const realAlerts = await alertsAPI.getAllAlerts();
      const formattedAlerts = realAlerts.slice(0, 5).map(alert => ({
        id: alert.id,
        location: alert.location,
        message: alert.message,
        severity: alert.type === 'critical' ? 'critical' : alert.type === 'contamination' ? 'warning' : 'info',
        timestamp: new Date(alert.issued_at).toLocaleString()
      }));
      setAlerts(formattedAlerts);
      
    } catch (error) {
      console.error('Backend API error:', error);
      setWaterQualityData([]);
      setAlerts([]);
    }
  };

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
    
    // Fetch real data from backend
    fetchWaterQualityData();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/login';
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Water Quality Dashboard</h1>
              {user && (
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, <span className="font-medium">{user.full_name}</span>!
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center">
                    {user ? user.full_name?.charAt(0).toUpperCase() || 'S' : 'S'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {user ? user.full_name?.split(' ')[0] || 'Sandhya' : 'Sandhya'}
                  </span>
                  <svg className={`w-4 h-4 text-gray-500 transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      👤 My Profile
                    </Link>
                    <Link 
                      to="/password-recovery" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      🔒 Change Password
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
              
              <span className="text-xs sm:text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
              <button 
                onClick={handleRefreshData}
                className="bg-teal-600 text-white px-3 py-2 sm:px-4 text-sm rounded-md hover:bg-teal-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Test Auth Component */}
        <TestAuth />
        
        {/* Metrics Cards */}
        <MetricsCards data={waterQualityData} />
        
        {/* Map and Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Monitoring Locations</h2>
            <WaterQualityMap 
              data={waterQualityData} 
              onLocationSelect={setSelectedLocation}
              selectedLocation={selectedLocation}
              showRealTimeData={true}
            />
          </div>
          <QualityChart data={waterQualityData} />
        </div>
        
        {/* Alerts and Reports */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <AlertsPanel alerts={alerts} onViewAll={() => navigate('/alerts')} />
          <ReportsPanel onViewAll={() => navigate('/reports')} onNewReport={() => navigate('/new-report')} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;