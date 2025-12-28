import React, { useState } from "react";
import { 
  FaFilter, 
  FaTimes, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaExclamationCircle,
  FaWater,
  FaBell,
  FaSync,
  FaDownload,
  FaSearch,
  FaEye,
  FaChartLine
} from "react-icons/fa";

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAlert, setExpandedAlert] = useState(null);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      station: "STN-101",
      stationName: "Riverhead Main",
      parameter: "pH",
      severity: "High",
      status: "Active",
      message: "pH level exceeded safe threshold (8.9 > 8.5 limit). Immediate attention required.",
      timestamp: "2024-03-15 14:30",
      value: 8.9,
      limit: 8.5,
      unit: "pH",
      duration: "2 hours",
      region: "Northern Region"
    },
    {
      id: 2,
      station: "STN-204",
      stationName: "Industrial Zone",
      parameter: "Arsenic",
      severity: "Critical",
      status: "Active",
      message: "Arsenic detected above permissible limit (0.03 mg/L > 0.01 mg/L). Health risk alert.",
      timestamp: "2024-03-15 10:15",
      value: 0.03,
      limit: 0.01,
      unit: "mg/L",
      duration: "6 hours",
      region: "Eastern Region"
    },
    {
      id: 3,
      station: "STN-305",
      stationName: "Coastal Watch",
      parameter: "Turbidity",
      severity: "Medium",
      status: "Resolved",
      message: "Turbidity levels normalized after rainfall. Back to safe range.",
      timestamp: "2024-03-14 09:45",
      value: 12.5,
      limit: 15.0,
      unit: "NTU",
      duration: "Resolved",
      region: "Southern Region"
    },
    {
      id: 4,
      station: "STN-402",
      stationName: "Urban Reservoir",
      parameter: "Chlorine",
      severity: "Low",
      status: "Active",
      message: "Chlorine levels below minimum required (0.2 mg/L < 0.5 mg/L).",
      timestamp: "2024-03-15 16:20",
      value: 0.2,
      limit: 0.5,
      unit: "mg/L",
      duration: "45 minutes",
      region: "Central Region"
    },
    {
      id: 5,
      station: "STN-508",
      stationName: "Mountain Spring",
      parameter: "Coliform",
      severity: "High",
      status: "Active",
      message: "Coliform bacteria detected. Water not suitable for consumption.",
      timestamp: "2024-03-15 11:05",
      value: 15,
      limit: 0,
      unit: "CFU/100mL",
      duration: "5 hours",
      region: "Northern Region"
    }
  ]);

  // Filter logic
  const filteredAlerts = alerts.filter((alert) => {
    const severityMatch =
      severityFilter === "All" || alert.severity === severityFilter;
    const statusMatch =
      statusFilter === "All" || alert.status === statusFilter;
    const searchMatch = 
      searchTerm === "" || 
      alert.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return severityMatch && statusMatch && searchMatch;
  });

  // Resolve alert
  const resolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Resolved" }
          : alert
      )
    );
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch(severity) {
      case "Critical": return <FaExclamationCircle className="text-red-600" />;
      case "High": return <FaExclamationTriangle className="text-orange-500" />;
      case "Medium": return <FaExclamationTriangle className="text-yellow-500" />;
      case "Low": return <FaExclamationTriangle className="text-blue-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === "Active" 
      ? "bg-red-50 text-red-700 border-red-200" 
      : "bg-green-50 text-green-700 border-green-200";
  };

  // Toggle alert details
  const toggleAlertDetails = (id) => {
    setExpandedAlert(expandedAlert === id ? null : id);
  };

  // Clear all filters
  const clearFilters = () => {
    setSeverityFilter("All");
    setStatusFilter("All");
    setSearchTerm("");
  };

  // Export alerts
  const exportAlerts = () => {
    const dataStr = JSON.stringify(filteredAlerts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'water_alerts_export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Refresh alerts
  const refreshAlerts = () => {
    // Simulate refresh - in real app, this would fetch from API
    console.log("Refreshing alerts...");
  };

  // Stats
  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === "Active").length,
    critical: alerts.filter(a => a.severity === "Critical").length,
    resolved: alerts.filter(a => a.status === "Resolved").length
  };

  return (
    <div className="h-full flex flex-col bg-white p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Water Quality Alerts</h1>
            <p className="text-gray-600 text-sm">Monitor and manage water quality alerts in real-time</p>
          </div>
          
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              onClick={refreshAlerts}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 text-sm"
            >
              <FaSync size={12} /> Refresh
            </button>
            <button
              onClick={exportAlerts}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-medium transition-all duration-200 text-sm"
            >
              <FaDownload size={12} /> Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">TOTAL ALERTS</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FaBell className="text-blue-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-red-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">ACTIVE</p>
                <p className="text-2xl font-bold text-red-600">{stats.active}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <FaExclamationTriangle className="text-red-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">CRITICAL</p>
                <p className="text-2xl font-bold text-orange-600">{stats.critical}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <FaExclamationCircle className="text-orange-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium">RESOLVED</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <FaCheckCircle className="text-green-600 text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="flex flex-col lg:flex-row gap-3 mb-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search alerts by station, parameter, or message..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <select
                className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Results Count and Actions */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              Showing <span className="text-gray-800 font-semibold">{filteredAlerts.length}</span> of <span className="text-gray-800 font-semibold">{alerts.length}</span> alerts
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1.5 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <FaFilter size={12} /> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-y-auto h-full p-2">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 px-4">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <FaBell className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No alerts found</h3>
              <p className="text-gray-500 text-center mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors duration-200 shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden"
                >
                  {/* Alert Header */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleAlertDetails(alert.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity).split(' ')[0]}`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-sm md:text-base">
                              {alert.parameter} Alert
                            </h3>
                            <div className="flex gap-1.5">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity}
                              </span>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(alert.status)}`}>
                                {alert.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                          
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaWater className="text-gray-400" />
                              Station: <span className="font-semibold text-gray-700">{alert.stationName}</span>
                            </span>
                            <span>•</span>
                            <span>ID: <span className="font-mono text-gray-700">{alert.station}</span></span>
                            <span>•</span>
                            <span>Region: <span className="text-gray-700">{alert.region}</span></span>
                            <span>•</span>
                            <span>Time: <span className="text-gray-700">{alert.timestamp}</span></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAlertDetails(alert.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {expandedAlert === alert.id ? (
                            <FaTimes size={16} />
                          ) : (
                            <FaEye size={16} />
                          )}
                        </button>
                        
                        {alert.status === "Active" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              resolveAlert(alert.id);
                            }}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-lg text-white text-xs font-semibold transition-colors duration-200 shadow-sm"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedAlert === alert.id && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-700 text-sm mb-2">Parameter Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">Current Value</span>
                              <span className="font-bold text-gray-800">{alert.value} {alert.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">Safe Limit</span>
                              <span className="font-semibold text-gray-800">{alert.limit} {alert.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">Deviation</span>
                              <span className={`font-bold ${alert.value > alert.limit ? 'text-red-600' : 'text-green-600'}`}>
                                {alert.value > alert.limit ? '+' : ''}{(alert.value - alert.limit).toFixed(2)} {alert.unit}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-700 text-sm mb-2">Alert Information</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">Duration</span>
                              <span className="font-semibold text-gray-800">{alert.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">Alert Triggered</span>
                              <span className="font-semibold text-gray-800">{alert.timestamp}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 text-sm">Station Status</span>
                              <span className={`font-semibold ${alert.status === "Active" ? 'text-red-600' : 'text-green-600'}`}>
                                {alert.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-700 text-sm mb-2">Recommended Actions</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>Isolate affected water supply if critical</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-500 mt-0.5">•</span>
                              <span>Notify regional authorities</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>Schedule immediate testing</span>
                            </li>
                            {alert.status === "Active" && (
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span className="font-semibold">Immediate attention required</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => console.log(`View analytics for ${alert.station}`)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <FaChartLine size={12} />
                          View Station Analytics
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
