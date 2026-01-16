import React, { useState, useEffect } from 'react';
import HistoricalDataGraphs from '../components/alerts/HistoricalDataGraphs';
import { alertsAPI } from '../services/api';
import { getPredictiveAlerts } from "../components/alerts/PredictiveAlerts";

const AlertsPage = () => {
  const [expandedAlerts, setExpandedAlerts] = useState(new Set());
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add state for predictive alerts
  const [predictiveAlerts, setPredictiveAlerts] = useState([]);
  
  // Add state for tracking review
  const [showReviewId, setShowReviewId] = useState(null);

  // Mocked review data for predictive alerts
  const mockedReviewData = {
    1: "Based on historical data from the last 30 days, this station shows a consistent upward trend in turbidity levels. Previous spikes have occurred after heavy rainfall. The model predicts a 75% chance of exceeding safe limits within 48 hours. Recommended action: Increase monitoring frequency and prepare for potential filtration adjustments.",
    2: "Lead levels have shown minor fluctuations over the past two weeks. The trend analysis indicates that industrial activity in the upstream area correlates with these variations. There's a 65% probability that lead concentrations will approach the action level in the next week. Consider testing more frequently and notifying local authorities.",
    3: "pH levels have been gradually decreasing over the past month. This trend, combined with increased industrial discharge reports, suggests a 45% chance of acidic conditions developing. This could affect aquatic life and corrosion rates. Monitoring should be intensified, especially after rainfall events.",
    4: "Coliform bacteria levels show seasonal patterns with higher counts during warmer months. Current weather patterns and temperature trends indicate a 35% probability of increased bacterial activity. While not an immediate threat, enhanced testing is recommended for recreational water areas.",
    5: "Dissolved oxygen levels have been stable but show minor diurnal variations. The model predicts a low risk (20%) of oxygen depletion based on current temperature and flow rates. This is within normal seasonal expectations for this water body.",
    6: "Nitrate concentrations have increased by 15% over the last monitoring period. Agricultural runoff from nearby farms is the likely source. There's a 55% probability that levels will exceed recreational water guidelines. Consider watershed management discussions with local farmers."
  };

  // Load AI predictions in useEffect
  useEffect(() => {
    fetchAlerts();

    // Load AI predictions
    const aiPredictions = getPredictiveAlerts();
    
    // Enhance predictions with proper probability and review data
    const enhancedPredictions = aiPredictions.map(p => {
      // Convert probability if it's in decimal form (0-1 to 0-100)
      let probability = p.probability;
      if (probability && probability <= 1) {
        probability = Math.round(probability * 100);
      } else if (!probability) {
        probability = 0;
      }
      
      // Get review from mocked data or use default
      const review = mockedReviewData[p.id] || 
        `Analysis of historical trends suggests potential issues with ${p.parameter || p.type}. ` +
        `The model has identified patterns that typically precede alert conditions. ` +
        `Regular monitoring is recommended for early detection.`;
      
      return {
        ...p,
        probability,
        review,
        expectedDate: p.expectedDate || getExpectedDate(p.probability)
      };
    });
    
    console.log("Enhanced AI predictions:", enhancedPredictions);
    setPredictiveAlerts(enhancedPredictions);
  }, []);

  const getExpectedDate = (probability) => {
    // Generate realistic expected dates based on probability
    const today = new Date();
    if (probability >= 70) {
      today.setDate(today.getDate() + 2); // High risk: within 2 days
    } else if (probability >= 40) {
      today.setDate(today.getDate() + 7); // Medium risk: within 1 week
    } else {
      today.setDate(today.getDate() + 14); // Low risk: within 2 weeks
    }
    return today.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

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
              onClick={() => setActiveTab('predictive')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'predictive'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Predictive Alerts
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

      {/* Predictive Alerts Section - FIXED VERSION */}
      {activeTab === "predictive" && predictiveAlerts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI Predictive Risk Analysis</h2>
              <p className="text-gray-600 mt-1">Based on sensor trends and threshold analysis</p>
            </div>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {predictiveAlerts.length} Predictions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictiveAlerts.map(p => {
              // Determine border color based on probability
              let borderColor;
              const probability = p.probability || 0;
              if (probability >= 70) borderColor = 'border-red-500';
              else if (probability >= 40) borderColor = 'border-orange-400';
              else borderColor = 'border-green-500';

              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-xl shadow-lg border-l-4 ${borderColor} bg-gradient-to-br from-white to-gray-50`}
                >
                  {/* Header */}
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Potential Contamination Risk
                  </h3>

                  {/* Parameter */}
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Parameter:</span> {p.parameter || p.type || 'Unknown Parameter'}
                  </p>
                  
                  {/* Probability - FIXED: Now shows proper percentage */}
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Probability:</span> {probability}%
                  </p>
                  
                  {/* Expected Date */}
                  <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Expected by:</span> {p.expectedDate || 'Not specified'}
                  </p>

                  {/* Review Button */}
                  <button
                    className="w-full py-2 rounded border border-gray-400 text-gray-800 font-semibold hover:bg-gray-100 transition duration-200"
                    onClick={() => setShowReviewId(showReviewId === p.id ? null : p.id)}
                  >
                    {showReviewId === p.id ? 'Hide Review' : 'Review Prediction'}
                  </button>

                  {/* Review Content - FIXED: Now shows detailed review */}
                  {showReviewId === p.id && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-2">Prediction Review:</h4>
                      <p className="text-gray-700 text-sm">
                        {p.review || 'Detailed review will be available here for this prediction.'}
                      </p>
                      
                      {/* Risk Assessment */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            probability >= 70 ? 'bg-red-100 text-red-800' :
                            probability >= 40 ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {probability >= 70 ? 'High' : probability >= 40 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                        
                        {/* Probability Bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Confidence</span>
                            <span>{probability}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                probability >= 70 ? 'bg-red-500' :
                                probability >= 40 ? 'bg-orange-400' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${probability}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-2">📊 Model Insights:</h4>
            <p className="text-gray-600 text-sm">
              The AI model analyzes historical sensor data trends to predict potential future alert conditions. 
              Red indicators show parameters predicted to exceed safe thresholds within the next monitoring cycle.
            </p>
            <div className="mt-3 flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span className="text-gray-600">High Risk (&gt;70%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-400 rounded mr-2"></div>
                <span className="text-gray-600">Medium Risk (40-70%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-gray-600">Low Risk (&lt;40%)</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p><strong>Note:</strong> These are predictive alerts based on data patterns. Actual conditions may vary.</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state for Predictive tab */}
      {activeTab === "predictive" && predictiveAlerts.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <div className="mb-4">
            <div className="inline-block p-4 bg-purple-100 rounded-full">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-700">No predictive risk data available</p>
          <p className="text-gray-600 mt-1">Predictive alerts will appear here when AI analysis is available</p>
        </div> 
      )}

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