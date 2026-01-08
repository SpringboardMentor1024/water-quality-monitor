import React, { useState } from 'react';

const AlertsPage = () => {
  const [expandedAlerts, setExpandedAlerts] = useState(new Set());

  const alerts = [
    {
      id: 1,
      title: "High Turbidity Detected",
      station: "Station Alpha",
      priority: "high",
      time: "5 minutes ago",
      description: "Turbidity levels exceed 10 NTU",
      details: "Turbidity reading: 12.5 NTU (Normal range: 0-5 NTU). This indicates potential sediment runoff or algae bloom. Recommended actions: 1. Collect water samples for lab analysis 2. Check upstream for construction activity 3. Monitor for 24 hours.",
      parameters: ["Turbidity: 12.5 NTU", "Temperature: 22C", "pH: 7.2"]
    },
    {
      id: 2,
      title: "Low Dissolved Oxygen",
      station: "River Delta Station",
      priority: "high",
      time: "10 minutes ago",
      description: "DO levels critical at 2.1 mg/L",
      details: "Dissolved Oxygen: 2.1 mg/L (Minimum required: 5.0 mg/L). This can cause fish kills and indicate organic pollution. Immediate action required.",
      parameters: ["DO: 2.1 mg/L", "Temperature: 25C", "BOD: 8.2 mg/L"]
    },
    {
      id: 3,
      title: "Bacteria Contamination",
      station: "Lake Reservoir",
      priority: "critical",
      time: "25 minutes ago",
      description: "E. coli levels above safety limit",
      details: "E. coli count: 450 CFU/100mL (Maximum safe level: 235 CFU/100mL). This indicates fecal contamination. URGENT action required.",
      parameters: ["E. coli: 450 CFU/100mL", "Coliform: 620 CFU/100mL", "Turbidity: 8.3 NTU"]
    },
    {
      id: 4,
      title: "Temperature Spike",
      station: "Lake Monitor",
      priority: "medium",
      time: "1 hour ago",
      description: "Water temperature increased by 5C",
      details: "Temperature increase from 18C to 23C within 3 hours. This may affect oxygen solubility and aquatic life.",
      parameters: ["Temperature: 23C", "DO: 4.8 mg/L", "pH: 6.9"]
    },
    {
      id: 5,
      title: "Low pH Alert",
      station: "River Station 3",
      priority: "medium",
      time: "15 minutes ago",
      description: "pH level dropped to 6.2",
      details: "pH dropped from 7.1 to 6.2. Acidic conditions can harm aquatic life and indicate acid rain or industrial discharge.",
      parameters: ["pH: 6.2", "Alkalinity: 42 mg/L", "Hardness: 85 mg/L"]
    }
  ];

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

  // Function to export as JSON
  const exportToJSON = () => {
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
  };

  // Function to export as CSV
  const exportToCSV = () => {
    // Convert alerts to CSV format
    const headers = ['ID', 'Title', 'Station', 'Priority', 'Time', 'Description', 'Details', 'Parameters'];
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    alerts.forEach(alert => {
      const row = [
        alert.id,
        `"${alert.title.replace(/"/g, '""')}"`,
        `"${alert.station.replace(/"/g, '""')}"`,
        alert.priority,
        `"${alert.time}"`,
        `"${alert.description.replace(/"/g, '""')}"`,
        `"${alert.details.replace(/"/g, '""')}"`,
        `"${alert.parameters.join('; ').replace(/"/g, '""')}"`
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
  };

  const handleExportAll = () => {
    // Show options dialog
    const format = prompt('Choose export format:\n1. JSON\n2. CSV\n\nEnter 1 or 2:', '1');
    
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
  };

  const handleAcknowledgeAll = () => {
    if (window.confirm(`Are you sure you want to acknowledge all ${alerts.length} alerts?`)) {
      alert(`All ${alerts.length} alerts have been acknowledged.`);
      console.log('All alerts acknowledged');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Water Quality Monitor</h1>
        <p className="text-gray-600 mt-2">Real-time monitoring system</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Alerts Page</h2>
      </div>

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
    </div>
  );
};

export default AlertsPage;
