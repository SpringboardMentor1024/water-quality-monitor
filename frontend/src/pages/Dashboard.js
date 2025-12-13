import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import WaterQualityMap from '../components/dashboard/WaterQualityMap';
import MetricsCards from '../components/dashboard/MetricsCards';
import QualityChart from '../components/dashboard/QualityChart';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import ReportsPanel from '../components/dashboard/ReportsPanel';
import TestAuth from '../components/TestAuth';
import { authAPI } from '../services/api';

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

  const handleRefreshData = () => {
    // Simulate data refresh
    alert('Data refreshed successfully!');
    window.location.reload();
  };

  const fetchWaterQualityData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/readings');
      if (response.ok) {
        const readings = await response.json();
        const processedData = readings.slice(0, 3).map((reading, index) => {
          const locations = [
            { name: 'Central Park Lake', lat: 40.7829, lng: -73.9654 },
            { name: 'Hudson River', lat: 40.7589, lng: -73.9851 },
            { name: 'East River', lat: 40.6892, lng: -73.9442 }
          ];
          const location = locations[index] || locations[0];
          const status = reading.ph < 6.5 || reading.turbidity > 3 ? 'critical' : 
                        reading.ph < 7 || reading.turbidity > 2 ? 'warning' : 'good';
          
          return {
            id: reading.id,
            location: location.name,
            lat: location.lat,
            lng: location.lng,
            ph: parseFloat(reading.ph),
            turbidity: parseFloat(reading.turbidity),
            dissolved_oxygen: 8.0,
            temperature: parseFloat(reading.temperature),
            status: status
          };
        });
        setWaterQualityData(processedData);
        
        const newAlerts = processedData
          .filter(data => data.status !== 'good')
          .map(data => ({
            id: data.id,
            location: data.location,
            message: data.status === 'critical' ? 'Critical water quality issue detected' : 'Water quality warning',
            severity: data.status,
            timestamp: new Date().toLocaleString()
          }));
        setAlerts(newAlerts);
      }
    } catch (error) {
      console.log('Using fallback data - backend not available');
      setWaterQualityData([
        { id: 1, location: 'Central Park Lake', lat: 40.7829, lng: -73.9654, ph: 7.2, turbidity: 1.5, dissolved_oxygen: 8.5, temperature: 22, status: 'good' },
        { id: 2, location: 'Hudson River', lat: 40.7589, lng: -73.9851, ph: 6.8, turbidity: 2.1, dissolved_oxygen: 7.8, temperature: 24, status: 'warning' },
        { id: 3, location: 'East River', lat: 40.6892, lng: -73.9442, ph: 6.2, turbidity: 4.2, dissolved_oxygen: 6.1, temperature: 26, status: 'critical' },
      ]);
      setAlerts([
        { id: 1, location: 'Central Park Lake', message: 'High turbidity detected', severity: 'warning', timestamp: '2024-01-15 10:30' },
        { id: 2, location: 'Hudson River', message: 'Low dissolved oxygen levels', severity: 'critical', timestamp: '2024-01-15 09:15' },
      ]);
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

    // Mock data - replace with actual API calls
    setWaterQualityData([
      { id: 1, lat: 40.7128, lng: -74.0060, ph: 7.2, turbidity: 1.5, dissolved_oxygen: 8.5, temperature: 22, status: 'good' },
      { id: 2, lat: 40.7589, lng: -73.9851, ph: 6.8, turbidity: 2.1, dissolved_oxygen: 7.8, temperature: 24, status: 'warning' },
      { id: 3, lat: 40.6892, lng: -73.9442, ph: 6.2, turbidity: 4.2, dissolved_oxygen: 6.1, temperature: 26, status: 'critical' },
    ]);
    setAlerts([
      { id: 1, location: 'Central Park Lake', message: 'High turbidity detected', severity: 'warning', timestamp: '2024-01-15 10:30' },
      { id: 2, location: 'Hudson River', message: 'Low dissolved oxygen levels', severity: 'critical', timestamp: '2024-01-15 09:15' },
    ]);
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