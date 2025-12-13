import React, { useState, useEffect } from 'react';
import WaterQualityMap from '../components/dashboard/WaterQualityMap';

const Dashboard = () => {
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

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
        setLastUpdate(new Date());
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
    fetchWaterQualityData();
    const interval = setInterval(fetchWaterQualityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      good: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.good;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || colors.warning;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">💧 Water Quality Monitor</h1>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        
        {/* Map View */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monitoring Locations</h2>
          <WaterQualityMap 
            data={waterQualityData} 
            onLocationSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
        </div>

        {/* Water Quality Data */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Water Quality</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {waterQualityData.map((data) => (
              <div key={data.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{data.location}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
                    {data.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>pH: {data.ph}</div>
                  <div>Turbidity: {data.turbidity} NTU</div>
                  <div>Dissolved O₂: {data.dissolved_oxygen} mg/L</div>
                  <div>Temperature: {data.temperature}°C</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{alert.location}</h3>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
                  </div>
                  <span className="text-lg">{alert.severity === 'critical' ? '🚨' : '⚠️'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;