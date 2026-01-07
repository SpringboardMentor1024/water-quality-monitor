import React, { useState, useEffect } from 'react';
import { alertsAPI } from '../../services/api';

const AlertTrigger = ({ stationData, onAlertTriggered }) => {
  const [alertConditions, setAlertConditions] = useState({
    boil_notice: {
      enabled: true,
      temperature_threshold: 85, // Celsius
      ph_threshold_low: 6.0,
      ph_threshold_high: 8.5
    },
    contamination: {
      enabled: true,
      bacteria_threshold: 235, // CFU/100mL
      turbidity_threshold: 10, // NTU
      chemical_threshold: 50 // mg/L
    },
    outage: {
      enabled: true,
      connection_timeout: 300, // seconds
      data_gap_threshold: 600 // seconds
    }
  });

  const [activeAlerts, setActiveAlerts] = useState([]);
  const [lastCheck, setLastCheck] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      checkAlertConditions();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [stationData, alertConditions]);

  const checkAlertConditions = () => {
    if (!stationData || !stationData.length) return;

    const newAlerts = [];
    const currentTime = new Date();

    stationData.forEach(station => {
      // Check Boil Notice conditions
      if (alertConditions.boil_notice.enabled) {
        if (station.temperature > alertConditions.boil_notice.temperature_threshold) {
          newAlerts.push({
            type: 'boil_notice',
            location: station.name,
            message: `High temperature detected: ${station.temperature}°C exceeds threshold of ${alertConditions.boil_notice.temperature_threshold}°C`,
            severity: 'high',
            triggered_at: currentTime.toISOString()
          });
        }

        if (station.ph < alertConditions.boil_notice.ph_threshold_low || 
            station.ph > alertConditions.boil_notice.ph_threshold_high) {
          newAlerts.push({
            type: 'boil_notice',
            location: station.name,
            message: `pH level out of safe range: ${station.ph} (Safe range: ${alertConditions.boil_notice.ph_threshold_low}-${alertConditions.boil_notice.ph_threshold_high})`,
            severity: 'medium',
            triggered_at: currentTime.toISOString()
          });
        }
      }

      // Check Contamination conditions
      if (alertConditions.contamination.enabled) {
        if (station.bacteria_count > alertConditions.contamination.bacteria_threshold) {
          newAlerts.push({
            type: 'contamination',
            location: station.name,
            message: `Bacteria contamination detected: ${station.bacteria_count} CFU/100mL exceeds safe limit of ${alertConditions.contamination.bacteria_threshold} CFU/100mL`,
            severity: 'critical',
            triggered_at: currentTime.toISOString()
          });
        }

        if (station.turbidity > alertConditions.contamination.turbidity_threshold) {
          newAlerts.push({
            type: 'contamination',
            location: station.name,
            message: `High turbidity detected: ${station.turbidity} NTU exceeds threshold of ${alertConditions.contamination.turbidity_threshold} NTU`,
            severity: 'high',
            triggered_at: currentTime.toISOString()
          });
        }
      }

      // Check Outage conditions
      if (alertConditions.outage.enabled) {
        const lastUpdate = new Date(station.last_updated);
        const timeDiff = (currentTime - lastUpdate) / 1000; // seconds

        if (timeDiff > alertConditions.outage.connection_timeout) {
          newAlerts.push({
            type: 'outage',
            location: station.name,
            message: `Station connection lost: No data received for ${Math.floor(timeDiff / 60)} minutes`,
            severity: 'high',
            triggered_at: currentTime.toISOString()
          });
        }
      }
    });

    if (newAlerts.length > 0) {
      setActiveAlerts(prev => [...prev, ...newAlerts]);
      newAlerts.forEach(alert => {
        triggerAlert(alert);
        if (onAlertTriggered) {
          onAlertTriggered(alert);
        }
      });
    }

    setLastCheck(currentTime);
  };

  const triggerAlert = async (alert) => {
    try {
      await alertsAPI.createAlert(alert);
      console.log('Alert triggered:', alert);
    } catch (error) {
      console.error('Failed to trigger alert:', error);
    }
  };

  const updateAlertCondition = (alertType, field, value) => {
    setAlertConditions(prev => ({
      ...prev,
      [alertType]: {
        ...prev[alertType],
        [field]: value
      }
    }));
  };

  const toggleAlertType = (alertType) => {
    setAlertConditions(prev => ({
      ...prev,
      [alertType]: {
        ...prev[alertType],
        enabled: !prev[alertType].enabled
      }
    }));
  };

  const clearAlert = (index) => {
    setActiveAlerts(prev => prev.filter((_, i) => i !== index));
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      'boil_notice': '🔥',
      'contamination': '☣️',
      'outage': '⚠️'
    };
    return icons[type] || '📢';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'bg-red-100 border-red-500 text-red-800',
      'high': 'bg-orange-100 border-orange-500 text-orange-800',
      'medium': 'bg-yellow-100 border-yellow-500 text-yellow-800',
      'low': 'bg-blue-100 border-blue-500 text-blue-800'
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Alert Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Alert Trigger Configuration</h3>
        
        <div className="space-y-6">
          {/* Boil Notice Settings */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔥</span>
                <h4 className="text-lg font-medium text-gray-800">Boil Notice Alerts</h4>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={alertConditions.boil_notice.enabled}
                  onChange={() => toggleAlertType('boil_notice')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
            
            {alertConditions.boil_notice.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature Threshold (°C)
                  </label>
                  <input
                    type="number"
                    value={alertConditions.boil_notice.temperature_threshold}
                    onChange={(e) => updateAlertCondition('boil_notice', 'temperature_threshold', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    pH Low Threshold
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={alertConditions.boil_notice.ph_threshold_low}
                    onChange={(e) => updateAlertCondition('boil_notice', 'ph_threshold_low', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    pH High Threshold
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={alertConditions.boil_notice.ph_threshold_high}
                    onChange={(e) => updateAlertCondition('boil_notice', 'ph_threshold_high', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contamination Settings */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">☣️</span>
                <h4 className="text-lg font-medium text-gray-800">Contamination Alerts</h4>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={alertConditions.contamination.enabled}
                  onChange={() => toggleAlertType('contamination')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
            
            {alertConditions.contamination.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bacteria Threshold (CFU/100mL)
                  </label>
                  <input
                    type="number"
                    value={alertConditions.contamination.bacteria_threshold}
                    onChange={(e) => updateAlertCondition('contamination', 'bacteria_threshold', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turbidity Threshold (NTU)
                  </label>
                  <input
                    type="number"
                    value={alertConditions.contamination.turbidity_threshold}
                    onChange={(e) => updateAlertCondition('contamination', 'turbidity_threshold', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chemical Threshold (mg/L)
                  </label>
                  <input
                    type="number"
                    value={alertConditions.contamination.chemical_threshold}
                    onChange={(e) => updateAlertCondition('contamination', 'chemical_threshold', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Outage Settings */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <h4 className="text-lg font-medium text-gray-800">Outage Alerts</h4>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={alertConditions.outage.enabled}
                  onChange={() => toggleAlertType('outage')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
            
            {alertConditions.outage.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Connection Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={alertConditions.outage.connection_timeout}
                    onChange={(e) => updateAlertCondition('outage', 'connection_timeout', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Gap Threshold (seconds)
                  </label>
                  <input
                    type="number"
                    value={alertConditions.outage.data_gap_threshold}
                    onChange={(e) => updateAlertCondition('outage', 'data_gap_threshold', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Last check: {lastCheck.toLocaleTimeString()}</span>
            <span>Active monitoring: {Object.values(alertConditions).filter(c => c.enabled).length} alert types</span>
          </div>
        </div>
      </div>

      {/* Recent Triggered Alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recently Triggered Alerts</h3>
          
          <div className="space-y-3">
            {activeAlerts.slice(-5).map((alert, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getAlertTypeIcon(alert.type)}</span>
                    <div>
                      <h4 className="font-semibold">{alert.location}</h4>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(alert.triggered_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => clearAlert(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertTrigger;