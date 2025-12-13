import React, { useState } from 'react';
import Navigation from '../components/layout/Navigation';

const AlertsPage = () => {
  const [allAlerts, setAllAlerts] = useState([
    { id: 1, location: 'Central Park Lake', message: 'High turbidity detected', severity: 'warning', timestamp: '2024-01-15 10:30', status: 'active' },
    { id: 2, location: 'Hudson River', message: 'Low dissolved oxygen levels', severity: 'critical', timestamp: '2024-01-15 09:15', status: 'active' },
    { id: 3, location: 'East River', message: 'pH levels slightly elevated', severity: 'warning', timestamp: '2024-01-14 15:20', status: 'resolved' },
    { id: 4, location: 'Bronx River', message: 'Temperature anomaly detected', severity: 'info', timestamp: '2024-01-14 12:45', status: 'investigating' },
  ]);

  const handleViewDetails = (alertId) => {
    alert(`Viewing details for alert ${alertId}`);
  };

  const handleMarkResolved = (alertId) => {
    setAllAlerts(allAlerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const getSeverityColor = (severity) => {
    const colors = {
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[severity] || colors.info;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-800',
      resolved: 'bg-green-100 text-green-800',
      investigating: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Alerts</h1>
          <p className="text-gray-600">Monitor and manage water quality alerts</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="space-y-4">
              {allAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{alert.location}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <p className="text-xs opacity-75">{alert.timestamp}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(alert.id)}
                        className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700"
                      >
                        View Details
                      </button>
                      {alert.status === 'active' && (
                        <button 
                          onClick={() => handleMarkResolved(alert.id)}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;