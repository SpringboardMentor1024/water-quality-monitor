import React, { useState, useEffect } from 'react';
import HistoricalDataGraphs from '../components/alerts/HistoricalDataGraphs';
import { alertsAPI } from '../services/api';

const AlertsPage = () => {
  const [expandedAlerts, setExpandedAlerts] = useState(new Set());
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const realAlerts = await alertsAPI.getAllAlerts();
      if (realAlerts && Array.isArray(realAlerts)) {
        const formattedAlerts = realAlerts.map(alert => ({
          id: alert.id,
          title: alert.message || 'No message',
          station: alert.location || 'Unknown location',
          priority: alert.type === 'contamination' ? 'critical' : 
                   alert.type === 'boil_notice' ? 'high' : 'medium',
          time: alert.issued_at ? new Date(alert.issued_at).toLocaleString() : 'Unknown time',
          description: alert.message || 'No description',
          details: `Alert issued for ${alert.location || 'unknown location'}. Type: ${alert.type || 'unknown'}. Please take appropriate action.`,
          parameters: [
            `Type: ${alert.type || 'unknown'}`, 
            `Location: ${alert.location || 'unknown'}`, 
            `Time: ${alert.issued_at ? new Date(alert.issued_at).toLocaleString() : 'unknown'}`
          ]
        }));
        setAlerts(formattedAlerts);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-600';
      case 'high': return 'bg-orange-50 border-orange-500';
      case 'medium': return 'bg-yellow-50 border-yellow-500';
      case 'low': return 'bg-blue-50 border-blue-500';
      default: return 'bg-gray-50 border-gray-500';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return 'INFO';
    }
  };

  const handleViewDetails = (alertId) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const exportToJSON = () => {
    if (!alerts || alerts.length === 0) {
      alert('No alerts to export');
      return;
    }
    
    try {
      const dataStr = JSON.stringify(alerts, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `water-quality-alerts-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Function to export as CSV
  const exportToCSV = () => {
    if (!alerts || alerts.length === 0) {
      alert('No alerts to export');
      return;
    }
    
    try {
      const headers = ['ID', 'Title', 'Station', 'Priority', 'Time', 'Description', 'Details', 'Parameters'];
      const csvRows = [];
      
      csvRows.push(headers.join(','));
      
      alerts.forEach(alert => {
        const row = [
          alert.id || '',
          `"${(alert.title || '').replace(/"/g, '""')}"`,
          `"${(alert.station || '').replace(/"/g, '""')}"`,
          alert.priority || '',
          `"${alert.time || ''}"`,
          `"${(alert.description || '').replace(/"/g, '""')}"`,
          `"${(alert.details || '').replace(/"/g, '""')}"`,
          `"${(alert.parameters || []).join('; ').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `water-quality-alerts-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleExportAll = () => {
    if (!alerts || alerts.length === 0) {
      alert('No alerts to export');
      return;
    }
    
    try {
      const format = prompt('Choose export format:\n1. JSON\n2. CSV\n\nEnter 1 or 2:', '1');
      
      if (format === null) return; // User cancelled
      
      switch(format) {
        case '1':
          exportToJSON();
          break;
        case '2':
          exportToCSV();
          break;
        default:
          alert('Please select a valid format (1 or 2)');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleAcknowledgeAll = () => {
    if (!alerts || alerts.length === 0) {
      alert('No alerts to acknowledge');
      return;
    }
    
    try {
      if (window.confirm(`Are you sure you want to acknowledge all ${alerts.length} alerts?`)) {
        alert(`All ${alerts.length} alerts have been acknowledged.`);
        console.log('All alerts acknowledged');
      }
    } catch (error) {
      console.error('Acknowledge failed:', error);
      alert('Failed to acknowledge alerts. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Water Quality Monitor</h1>
        <p className="text-gray-600 mt-2">Real-time monitoring system</p>
      </div>

      {/* Tab Navigation */}
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
              Historical Charts
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'alerts' && (
        <div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No alerts available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`border-l-4 rounded-xl p-5 shadow-lg bg-white ${getPriorityColor(alert.priority)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{alert.title}</h3>
                  <p className="text-gray-600 font-medium">{alert.station}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                alert.priority === 'critical' ? 'text-red-700' :
                alert.priority === 'high' ? 'text-orange-700' :
                alert.priority === 'medium' ? 'text-yellow-700' : 'text-blue-700'
              }`}>
                {getPriorityText(alert.priority)}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{alert.description}</p>
            
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <span className="mr-2">Time:</span>
              <span>{alert.time}</span>
            </div>
            
            <button 
              onClick={() => handleViewDetails(alert.id)}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                alert.priority === 'critical' ? 'bg-red-600 hover:bg-red-700 text-white' :
                alert.priority === 'high' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                alert.priority === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {expandedAlerts.has(alert.id) ? 'Hide Details' : 'View Details'}
            </button>
            
            {expandedAlerts.has(alert.id) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">Detailed Analysis:</h4>
                <p className="text-gray-700 mb-4">{alert.details}</p>
                
                <h4 className="font-bold text-gray-800 mb-2">Current Parameters:</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {alert.parameters.map((param, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                      {param}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'historical' && (
        <HistoricalDataGraphs />
      )}

      {activeTab === 'alerts' && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Active Alerts Summary</h3>
            <p className="text-blue-600">Total: {alerts.length} alerts</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAcknowledgeAll}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Acknowledge All
            </button>
            <button 
              onClick={handleExportAll}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Export All Alerts
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
