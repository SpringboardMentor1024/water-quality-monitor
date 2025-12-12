import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import WaterQualityMap from '../components/dashboard/WaterQualityMap';
import MetricsCards from '../components/dashboard/MetricsCards';
import QualityChart from '../components/dashboard/QualityChart';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import ReportsPanel from '../components/dashboard/ReportsPanel';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const handleRefreshData = () => {
    // Simulate data refresh
    alert('Data refreshed successfully!');
    window.location.reload();
  };

  useEffect(() => {
    // Mock data - replace with actual API calls
    setWaterQualityData([
      { id: 1, lat: 40.7128, lng: -74.0060, ph: 7.2, turbidity: 1.5, dissolved_oxygen: 8.5, temperature: 22, status: 'good' },
      { id: 2, lat: 40.7589, lng: -73.9851, ph: 6.8, turbidity: 2.1, dissolved_oxygen: 7.8, temperature: 24, status: 'warning' },
      { id: 3, lat: 40.6892, lng: -74.0445, ph: 6.2, turbidity: 4.2, dissolved_oxygen: 6.1, temperature: 26, status: 'critical' },
    ]);

    setAlerts([
      { id: 1, location: 'Central Park Lake', message: 'High turbidity detected', severity: 'warning', timestamp: '2024-01-15 10:30' },
      { id: 2, location: 'Hudson River', message: 'Low dissolved oxygen levels', severity: 'critical', timestamp: '2024-01-15 09:15' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-3 sm:space-y-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Water Quality Dashboard</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
              <button 
                onClick={handleRefreshData}
                className="bg-teal-600 text-white px-3 py-2 sm:px-4 text-sm rounded-md hover:bg-teal-700"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metrics Cards */}
        <MetricsCards data={waterQualityData} />

        {/* Map and Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Monitoring Locations</h2>
            <WaterQualityMap 
              data={waterQualityData} 
              onLocationSelect={setSelectedLocation}
              selectedLocation={selectedLocation}
            />
          </div>

          {/* Quality Chart */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Water Quality Trends</h2>
            <QualityChart data={waterQualityData} selectedLocation={selectedLocation} />
          </div>
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