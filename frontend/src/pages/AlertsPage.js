import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertsAPI } from '../services/api';
import HistoricalDataGraphs from '../components/alerts/HistoricalDataGraphs';
import AlertTrigger from '../components/alerts/AlertTrigger';

const AlertsPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertsAPI.getAllAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  const mockAlerts = [
    {
      id: 1,
      type: "contamination",
      message: "High Turbidity Detected - Turbidity levels exceed 10 NTU",
      location: "Station Alpha",
      issued_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      type: "boil_notice",
      message: "Low Dissolved Oxygen - DO levels critical at 2.1 mg/L",
      location: "River Delta Station",
      issued_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      type: "contamination",
      message: "Bacteria Contamination - E. coli levels above safety limit",
      location: "Lake Reservoir",
      issued_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    }
  ];

  const getPriorityColor = (type) => {
    switch (type) {
      case 'contamination': return 'bg-red-50 border-red-600';
      case 'boil_notice': return 'bg-orange-50 border-orange-500';
      case 'outage': return 'bg-yellow-50 border-yellow-500';
      default: return 'bg-blue-50 border-blue-500';
    }
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      'boil_notice': '🔥',
      'contamination': '☣️',
      'outage': '⚠️'
    };
    return icons[type] || '📢';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - alertTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleViewDetails = (alertId) => {
    navigate(`/alerts/${alertId}`);
  };

  const handleAlertTriggered = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Water Quality Alerts</h1>
        <p className="text-gray-600 mt-2">Monitor and manage water quality alerts in real-time</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab('historical')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'historical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historical Data
            </button>
            <button
              onClick={() => setActiveTab('triggers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'triggers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Alert Configuration
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Alerts</h3>
              <p className="text-gray-600">All water quality parameters are within normal ranges.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`border-l-4 rounded-xl p-5 shadow-lg bg-white ${getPriorityColor(alert.type)}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{getAlertTypeIcon(alert.type)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {alert.type.replace('_', ' ').toUpperCase()}
                        </h3>
                        <p className="text-gray-600 font-medium">{alert.location}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      alert.type === 'contamination' ? 'text-red-700 bg-red-100' :
                      alert.type === 'boil_notice' ? 'text-orange-700 bg-orange-100' :
                      'text-yellow-700 bg-yellow-100'
                    }`}>
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{alert.message}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <span className="mr-2">🕒</span>
                    <span>{formatTimeAgo(alert.issued_at)}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleViewDetails(alert.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      alert.type === 'contamination' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      alert.type === 'boil_notice' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                      'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'historical' && (
        <HistoricalDataGraphs />
      )}

      {activeTab === 'triggers' && (
        <AlertTrigger 
          stationData={[]}
          onAlertTriggered={handleAlertTriggered}
        />
      )}
    </div>
  );
};

export default AlertsPage;