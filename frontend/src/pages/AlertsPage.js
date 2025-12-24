import React, { useState } from 'react';

const AlertsPage = () => {
  const [expandedAlert, setExpandedAlert] = useState(null);

  const alerts = [
    {
      id: 1,
      title: "High Turbidity Detected",
      station: "Station Alpha",
      priority: "high",
      time: "5 minutes ago",
      description: "Turbidity levels exceed 10 NTU",
      details: "Turbidity reading: 12.5 NTU (Normal range: 0-5 NTU). This indicates potential sediment runoff or algae bloom. Recommended actions: 1. Collect water samples for lab analysis 2. Check upstream for construction activity 3. Monitor for 24 hours.",
      icon: "ðŸŒŠ",
      parameters: ["Turbidity: 12.5 NTU", "Temperature: 22Â°C", "pH: 7.2"]
    },
    {
      id: 2,
      title: "Low Dissolved Oxygen",
      station: "River Delta Station",
      priority: "high",
      time: "10 minutes ago",
      description: "DO levels critical at 2.1 mg/L",
      details: "Dissolved Oxygen: 2.1 mg/L (Minimum required: 5.0 mg/L). This can cause fish kills and indicate organic pollution. Immediate action required.",
      icon: "ðŸŸ",
      parameters: ["DO: 2.1 mg/L", "Temperature: 25Â°C", "BOD: 8.2 mg/L"]
    },
    {
      id: 3,
      title: "Bacteria Contamination",
      station: "Lake Reservoir",
      priority: "critical",
      time: "25 minutes ago",
      description: "E. coli levels above safety limit",
      details: "E. coli count: 450 CFU/100mL (Maximum safe level: 235 CFU/100mL). This indicates fecal contamination. URGENT action required.",
      icon: "ðŸ¦ ",
      parameters: ["E. coli: 450 CFU/100mL", "Coliform: 620 CFU/100mL", "Turbidity: 8.3 NTU"]
    },
    {
      id: 4,
      title: "Temperature Spike",
      station: "Lake Monitor",
      priority: "medium",
      time: "1 hour ago",
      description: "Water temperature increased by 5Â°C",
      details: "Temperature increase from 18Â°C to 23Â°C within 3 hours. This may affect oxygen solubility and aquatic life.",
      icon: "ðŸŒ¡ï¸",
      parameters: ["Temperature: 23Â°C", "DO: 4.8 mg/L", "pH: 6.9"]
    },
    {
      id: 5,
      title: "Low pH Alert",
      station: "River Station 3",
      priority: "medium",
      time: "15 minutes ago",
      description: "pH level dropped to 6.2",
      details: "pH dropped from 7.1 to 6.2. Acidic conditions can harm aquatic life and indicate acid rain or industrial discharge.",
      icon: "ðŸ“Š",
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
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Water Quality Monitor</h1>
        <p className="text-gray-600 mt-2">Real-time monitoring system</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Alerts Page</h2>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">âœ“</span>
            </div>
            <div>
              <p className="text-green-800 font-medium">If you see this, the page works correctly!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`border-l-4 rounded-xl p-5 shadow-lg bg-white ${getPriorityColor(alert.priority)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{alert.icon}</span>
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
              <span className="mr-2">ðŸ•’</span>
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
              {expandedAlert === alert.id ? 'Hide Details' : 'View Details'}
            </button>
            
            {expandedAlert === alert.id && (
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
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            Export All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;



