import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EnhancedBaseMap from '../components/maps/EnhancedBaseMap';
import { authAPI } from '../services/api';
import stationService from '../services/stationService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState(null);
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stations, setStations] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    fetchUserData();
    fetchStations();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        return;
      }

      const userData = await authAPI.getCurrentUser();
      setUser(userData);

    } catch (error) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (parseError) {
          setUser({
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'Water Quality Analyst'
          });
        }
      } else {
        setUser({
          name: 'Guest User',
          email: 'guest@example.com',
          role: 'Water Quality Analyst'
        });
      }
    }
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    navigate('/station/' + station.id);
  };

  const handleRefreshData = async () => {
    try {
      setMapLoading(true);
      await fetchStations();
      alert('Data refreshed successfully!');
    } catch (error) {
      console.error('Failed to refresh stations:', error);
      alert('Failed to refresh data.');
    } finally {
      setMapLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const stationsData = await stationService.getStations();
      setStations(stationsData);

      const transformedData = stationsData.map(station => ({
        id: station.id,
        location: station.name,
        lat: station.latitude,
        lng: station.longitude,
        ph: station.currentReading?.ph || 7.0,
        turbidity: station.currentReading?.turbidity || 2.0,
        dissolved_oxygen: station.currentReading?.dissolved_oxygen || 7.5,
        temperature: station.currentReading?.temperature || 25,
        status: station.status === 'active' ? 'good' :
                station.status === 'warning' ? 'warning' : 'critical'
      }));
      setWaterQualityData(transformedData);

      const stationAlerts = stationsData
        .filter(station => station.status !== 'active')
        .map(station => ({
          id: station.id,
          location: station.name,
          message: station.status === 'critical' 
                   ? 'Critical readings at ' + station.name
                   : 'Warning at ' + station.name,
          severity: station.status === 'critical' ? 'critical' : 'warning',
          timestamp: new Date().toLocaleString(),
          stationId: station.id
        }));
      setAlerts(stationAlerts);

    } catch (error) {
      console.error('Failed to fetch stations:', error);
      setWaterQualityData([
        { id: 'STN-001', location: 'Riverbend Station', ph: 7.2, turbidity: 1.5, dissolved_oxygen: 8.5, temperature: 22, status: 'good' },
        { id: 'STN-002', location: 'Lakeview Point', ph: 6.8, turbidity: 2.1, dissolved_oxygen: 7.8, temperature: 24, status: 'warning' },
        { id: 'STN-003', location: 'Ganges Monitoring', ph: 6.2, turbidity: 4.2, dissolved_oxygen: 6.1, temperature: 26, status: 'critical' },
      ]);
      setAlerts([
        { id: 1, location: 'Ganges Monitoring', message: 'Critical water quality', severity: 'critical', timestamp: 'Today' },
      ]);
    } finally {
      setMapLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Water Quality Dashboard</h1>
              <p className="text-gray-600">Real-time monitoring and analysis</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefreshData}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                disabled={mapLoading}
              >
                <span className="mr-2">⟳</span>
                {mapLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>

              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <span>🔔</span>
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600">👤</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{user?.name || 'User'}</div>
                    <div className="text-sm text-gray-500">{user?.role || 'Analyst'}</div>
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="mr-3">👤</span>
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="mr-3">⚙️</span>
                      Settings
                    </Link>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <span className="mr-3">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Analyst'}!</h2>
            <p className="opacity-90">Monitor real-time water quality data across all stations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-blue-600">💧</span>
              </div>
              <div>
                <div className="text-2xl font-bold">{stations.length}</div>
                <div className="text-gray-600">Active Stations</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="text-green-600">⚡</span>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stations.filter(s => s.status === 'active').length}
                </div>
                <div className="text-gray-600">Normal Status</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <span className="text-yellow-600">⚠️</span>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stations.filter(s => s.status === 'warning').length}
                </div>
                <div className="text-gray-600">Warnings</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <span className="text-red-600">⚠️</span>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stations.filter(s => s.status === 'critical').length}
                </div>
                <div className="text-gray-600">Critical Alerts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Water Station Map</h2>
            <p className="text-gray-600">Click on any station marker to view details</p>
          </div>
          <EnhancedBaseMap onStationSelect={handleStationSelect} />
        </div>

        {alerts.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2 text-red-600">⚠️</span>
                Active Alerts ({alerts.length})
              </h2>
              <Link
                to="/alerts"
                className="flex items-center text-teal-600 hover:text-teal-800"
              >
                View All Alerts
                <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="space-y-4">
              {alerts.slice(0, 3).map((alert) => {
                const alertClass = alert.severity === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50';
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${alertClass}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.location}</h3>
                        <p className="text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-sm text-gray-500 mt-2">{alert.timestamp}</p>
                      </div>
                      <Link
                        to={'/station/' + alert.stationId}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Investigate
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2 text-teal-600">📄</span>
              Recent Reports
            </h3>
            <p className="text-gray-600 mb-4">Check the latest user-submitted reports</p>
            <Link
              to="/user-reports"
              className="inline-flex items-center text-teal-600 hover:text-teal-800"
            >
              View Reports
              <span className="ml-1">→</span>
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2 text-teal-600">➕</span>
              Submit Report
            </h3>
            <p className="text-gray-600 mb-4">Report water quality issues in your area</p>
            <Link
              to="/new-report"
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <span className="mr-2">➕</span>
              New Report
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2 text-teal-600">📅</span>
              Schedule
            </h3>
            <p className="text-gray-600 mb-4">Upcoming maintenance and inspections</p>
            <div className="text-sm text-gray-500">
              <div className="flex justify-between py-2 border-b">
                <span>Station STN-001</span>
                <span>Tomorrow, 10 AM</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Monthly Report</span>
                <span>Dec 25</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

