import React from 'react';

const AlertsPanel = ({ alerts, onViewAll }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[severity] || colors.info;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      warning: '⚠️',
      critical: '🚨',
      info: 'ℹ️'
    };
    return icons[severity] || icons.info;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Active Alerts</h2>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {alerts.length} Active
        </span>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <div className="text-3xl sm:text-4xl mb-2">✅</div>
            <p className="text-sm sm:text-base">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 sm:p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start">
                <span className="text-base sm:text-lg mr-2 sm:mr-3">{getSeverityIcon(alert.severity)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-1 space-y-1 sm:space-y-0">
                    <h3 className="font-medium text-sm sm:text-base truncate">{alert.location}</h3>
                    <span className="text-xs opacity-75 flex-shrink-0">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs sm:text-sm">{alert.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {alerts.length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
          <button 
            onClick={onViewAll}
            className="w-full text-center text-xs sm:text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View All Alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;