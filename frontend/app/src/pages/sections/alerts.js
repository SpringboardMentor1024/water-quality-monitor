import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from "recharts";
import {
  FaBell,
  FaExclamationTriangle,
  FaFire,
  FaWater,
  FaFlask,
  FaTint,
  FaThermometerHalf,
  FaWind,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaChartLine,
  FaHistory,
  FaClock,
  FaMapMarkerAlt,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaShareAlt,
  FaInfoCircle,
  FaCog,
  FaBellSlash,
  FaEnvelope,
  FaSms,
  FaMobileAlt,
  FaSlidersH,
  FaUserShield,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaFileCode,
  FaPaperPlane,
  FaCalendar,
  FaTrash,
  FaEdit,
  FaUsers,
  FaChartBar,
  FaDatabase,
  FaArrowUp,
  FaArrowDown,
  FaChartPie
} from "react-icons/fa";

// Main Alerts Component
export default function Alerts() {
  const [activeTab, setActiveTab] = useState("alerts");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaBell className="text-red-600" />
                Water Quality Alerts
              </h1>
              <p className="text-gray-600 mt-1">Monitor and manage water quality alerts in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FaCog />
                Alert Settings
              </button>
              <button 
                onClick={() => setShowExport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                <FaDownload />
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-4 py-3 font-medium text-sm md:text-base relative ${
                activeTab === "alerts"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaExclamationTriangle className="inline mr-2" />
              Active Alerts
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-3 font-medium text-sm md:text-base relative ${
                activeTab === "history"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaHistory className="inline mr-2" />
              Alert History
            </button>
            <button
              onClick={() => setActiveTab("trends")}
              className={`px-4 py-3 font-medium text-sm md:text-base relative ${
                activeTab === "trends"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaChartLine className="inline mr-2" />
              Alert Trends
            </button>
            <button
              onClick={() => setActiveTab("triggers")}
              className={`px-4 py-3 font-medium text-sm md:text-base relative ${
                activeTab === "triggers"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaCog className="inline mr-2" />
              Alert Triggers
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "alerts" && (
          <AlertsList 
            onSelectAlert={setSelectedAlert}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
        
        {activeTab === "history" && (
          <AlertHistory 
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        )}
        
        {activeTab === "trends" && (
          <AlertTrends />
        )}
        
        {activeTab === "triggers" && (
          <AlertTriggers />
        )}

        {/* Alert Details Modal */}
        {selectedAlert && (
          <AlertDetails 
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
          />
        )}

        {/* Alert Settings Modal */}
        {showSettings && (
          <AlertSettingsModal onClose={() => setShowSettings(false)} />
        )}

        {/* Export Modal */}
        {showExport && (
          <ExportModal onClose={() => setShowExport(false)} />
        )}
      </div>
    </div>
  );
}

// Alerts List Component
function AlertsList({ onSelectAlert, severityFilter, setSeverityFilter, statusFilter, setStatusFilter }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Mock alerts data
  const alerts = [
    {
      id: "ALERT-001",
      title: "High Temperature Alert",
      station: "Krishna Barrage",
      location: "Vijayawada, AP",
      parameter: "Temperature",
      severity: "critical",
      status: "active",
      value: "38.5°C",
      threshold: "30°C",
      timestamp: "10 minutes ago",
      description: "Water temperature exceeded safe limits for drinking",
      icon: <FaFire className="text-red-500" />,
      color: "bg-red-500",
      trend: "rising"
    },
    {
      id: "ALERT-002",
      title: "pH Level Critical",
      station: "Godavari River Station",
      location: "Rajahmundry, AP",
      parameter: "pH",
      severity: "high",
      status: "active",
      value: "8.9 pH",
      threshold: "8.5 pH",
      timestamp: "1 hour ago",
      description: "pH level above safe drinking water standards",
      icon: <FaWater className="text-orange-500" />,
      color: "bg-orange-500",
      trend: "stable"
    },
    {
      id: "ALERT-003",
      title: "Chemical Contamination",
      station: "Musi River",
      location: "Hyderabad, TS",
      parameter: "Arsenic",
      severity: "critical",
      status: "active",
      value: "0.015 ppm",
      threshold: "0.01 ppm",
      timestamp: "2 hours ago",
      description: "Arsenic levels exceed safe drinking water limits",
      icon: <FaFlask className="text-red-500" />,
      color: "bg-red-500",
      trend: "rising"
    },
    {
      id: "ALERT-004",
      title: "Low Dissolved Oxygen",
      station: "Hussainsagar Lake",
      location: "Hyderabad, TS",
      parameter: "Dissolved Oxygen",
      severity: "medium",
      status: "active",
      value: "3.2 mg/L",
      threshold: "5 mg/L",
      timestamp: "3 hours ago",
      description: "Low oxygen levels affecting aquatic life",
      icon: <FaWind className="text-yellow-500" />,
      color: "bg-yellow-500",
      trend: "falling"
    },
    {
      id: "ALERT-005",
      title: "High Turbidity",
      station: "Krishna River",
      location: "Amaravati, AP",
      parameter: "Turbidity",
      severity: "medium",
      status: "resolved",
      value: "15 NTU",
      threshold: "10 NTU",
      timestamp: "5 hours ago",
      description: "Water clarity below acceptable levels",
      icon: <FaTint className="text-yellow-500" />,
      color: "bg-yellow-500",
      trend: "falling"
    },
    {
      id: "ALERT-006",
      title: "Boil Water Advisory",
      station: "Local Water Supply",
      location: "Chennai, TN",
      parameter: "E. Coli",
      severity: "critical",
      status: "active",
      value: "Detected",
      threshold: "0 CFU",
      timestamp: "1 day ago",
      description: "Bacterial contamination detected - Boil water before use",
      icon: <FaExclamationTriangle className="text-red-500" />,
      color: "bg-red-500",
      trend: "stable"
    },
    {
      id: "ALERT-007",
      title: "Heavy Metal Alert",
      station: "Industrial Zone",
      location: "Visakhapatnam, AP",
      parameter: "Lead",
      severity: "high",
      status: "active",
      value: "0.02 ppm",
      threshold: "0.015 ppm",
      timestamp: "1 day ago",
      description: "Lead concentration above safe limits",
      icon: <FaFlask className="text-orange-500" />,
      color: "bg-orange-500",
      trend: "rising"
    },
    {
      id: "ALERT-008",
      title: "Temperature Warning",
      station: "Coastal Station",
      location: "Kakinada, AP",
      parameter: "Temperature",
      severity: "low",
      status: "resolved",
      value: "28°C",
      threshold: "25°C",
      timestamp: "2 days ago",
      description: "Water temperature slightly elevated",
      icon: <FaThermometerHalf className="text-blue-500" />,
      color: "bg-blue-500",
      trend: "stable"
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: "bg-red-100 text-red-800 border border-red-200",
      high: "bg-orange-100 text-orange-800 border border-orange-200",
      medium: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      low: "bg-blue-100 text-blue-800 border border-blue-200"
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    return status === "active" 
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const exportAlertData = (alertId, format = 'csv') => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    let data;
    switch(format) {
      case 'csv':
        data = `Alert ID,Title,Station,Parameter,Value,Threshold,Severity,Status,Time\n${alert.id},${alert.title},${alert.station},${alert.parameter},${alert.value},${alert.threshold},${alert.severity},${alert.status},${alert.timestamp}`;
        downloadFile(data, `alert-${alert.id}.csv`, 'text/csv');
        break;
      case 'pdf':
        alert(`PDF export for ${alert.title} would be generated`);
        break;
      case 'json':
        data = JSON.stringify(alert, null, 2);
        downloadFile(data, `alert-${alert.id}.json`, 'application/json');
        break;
    }
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts by title, station, or parameter..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="active">Active Only</option>
              <option value="all">All Status</option>
              <option value="resolved">Resolved</option>
            </select>

            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FaDownload />
                Export
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button 
                    onClick={() => {
                      const data = filteredAlerts.map(a => ({
                        id: a.id,
                        title: a.title,
                        station: a.station,
                        parameter: a.parameter,
                        value: a.value,
                        threshold: a.threshold,
                        severity: a.severity,
                        status: a.status,
                        timestamp: a.timestamp
                      }));
                      const csvContent = 'data:text/csv;charset=utf-8,' + 
                        'ID,Title,Station,Parameter,Value,Threshold,Severity,Status,Time\n' +
                        data.map(row => Object.values(row).join(',')).join('\n');
                      window.open(encodeURI(csvContent));
                      setShowExportMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 text-left text-sm text-gray-700"
                  >
                    <FaFileCsv className="text-green-500" />
                    Export as CSV
                  </button>
                  <button 
                    onClick={() => {
                      const jsonData = JSON.stringify(filteredAlerts, null, 2);
                      downloadFile(jsonData, 'alerts-export.json', 'application/json');
                      setShowExportMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 text-left text-sm text-gray-700"
                  >
                    <FaFileCode className="text-yellow-500" />
                    Export as JSON
                  </button>
                  <button 
                    onClick={() => {
                      alert('PDF generation would be handled by backend API');
                      setShowExportMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 text-left text-sm text-gray-700"
                  >
                    <FaFilePdf className="text-red-500" />
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-800">{filteredAlerts.filter(a => a.status === 'active').length}</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <FaBell className="text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-green-600">+1.2</span> from yesterday
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-800">{filteredAlerts.filter(a => a.severity === 'critical').length}</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <FaExclamationTriangle className="text-orange-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Immediate attention required
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-800">2.4h</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaClock className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-green-600">↓ 1.05h</span> improvement
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <FaCheckCircle className="text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            92% resolution rate
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Current Alerts ({filteredAlerts.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {alert.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{alert.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{alert.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{alert.station}</p>
                      <p className="text-xs text-gray-500">{alert.location}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{alert.parameter}</p>
                      <p className="text-xs text-gray-500">{alert.value} / {alert.threshold}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(alert.status)}`}>
                      {alert.status === "active" ? "● Active" : "✓ Resolved"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FaClock className="text-gray-400" />
                      {alert.timestamp}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectAlert(alert)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors"
                      >
                        <FaEye />
                        View
                      </button>
                      <button 
                        onClick={() => exportAlertData(alert.id, 'csv')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium transition-colors"
                      >
                        <FaDownload />
                        Download
                      </button>
                      {alert.status === "active" && (
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium transition-colors">
                          <FaCheckCircle />
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center">
            <FaBellSlash className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No alerts found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Alert History Component
function AlertHistory({ timeRange, setTimeRange }) {
  const historyData = [
    { date: "2024-01-15", critical: 3, high: 5, medium: 8, low: 12, total: 28 },
    { date: "2024-01-14", critical: 2, high: 4, medium: 7, low: 10, total: 23 },
    { date: "2024-01-13", critical: 4, high: 6, medium: 9, low: 15, total: 34 },
    { date: "2024-01-12", critical: 1, high: 3, medium: 6, low: 8, total: 18 },
    { date: "2024-01-11", critical: 3, high: 5, medium: 8, low: 11, total: 27 },
    { date: "2024-01-10", critical: 2, high: 4, medium: 7, low: 9, total: 22 },
    { date: "2024-01-09", critical: 5, high: 7, medium: 10, low: 14, total: 36 },
  ];

  const parameterDistribution = [
    { name: "Temperature", value: 28, color: "#EF4444" },
    { name: "pH Levels", value: 22, color: "#F97316" },
    { name: "Turbidity", value: 18, color: "#EAB308" },
    { name: "Dissolved Oxygen", value: 15, color: "#22C55E" },
    { name: "Chemical", value: 12, color: "#8B5CF6" },
    { name: "Bacterial", value: 8, color: "#EC4899" },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Alert History & Analytics</h2>
          <p className="text-gray-600 text-sm">Historical alert patterns and trends</p>
        </div>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Alert Trends Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="critical" 
                  stackId="1" 
                  stroke="#EF4444" 
                  fill="#FEE2E2" 
                  name="Critical"
                />
                <Area 
                  type="monotone" 
                  dataKey="high" 
                  stackId="1" 
                  stroke="#F97316" 
                  fill="#FFEDD5" 
                  name="High"
                />
                <Area 
                  type="monotone" 
                  dataKey="medium" 
                  stackId="1" 
                  stroke="#EAB308" 
                  fill="#FEF9C3" 
                  name="Medium"
                />
                <Area 
                  type="monotone" 
                  dataKey="low" 
                  stackId="1" 
                  stroke="#22C55E" 
                  fill="#DCFCE7" 
                  name="Low"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameter Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Alert Distribution by Parameter</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={parameterDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {parameterDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Average Response Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { parameter: "Temperature", time: 2.1 },
                { parameter: "pH Levels", time: 3.4 },
                { parameter: "Chemical", time: 4.2 },
                { parameter: "Bacterial", time: 1.8 },
                { parameter: "Turbidity", time: 5.1 },
                { parameter: "Dissolved O₂", time: 2.9 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="parameter" stroke="#6B7280" />
                <YAxis stroke="#6B7280" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} hours`, 'Response Time']} />
                <Bar dataKey="time" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Alert Resolution Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Critical Alerts</span>
                <span>85% resolved</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>High Severity</span>
                <span>92% resolved</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Medium Severity</span>
                <span>95% resolved</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '95%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Low Severity</span>
                <span>98% resolved</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '98%' }} />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Overall Resolution Rate: <span className="font-bold text-green-600">93.5%</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Alert Trends Component
function AlertTrends() {
  const [selectedParameter, setSelectedParameter] = useState("Temperature");
  
  const trendData = {
    Temperature: [
      { time: "Jan 1", alerts: 3 },
      { time: "Jan 2", alerts: 2 },
      { time: "Jan 3", alerts: 4 },
      { time: "Jan 4", alerts: 1 },
      { time: "Jan 5", alerts: 3 },
      { time: "Jan 6", alerts: 2 },
      { time: "Jan 7", alerts: 5 },
    ],
    "pH Levels": [
      { time: "Jan 1", alerts: 2 },
      { time: "Jan 2", alerts: 3 },
      { time: "Jan 3", alerts: 1 },
      { time: "Jan 4", alerts: 2 },
      { time: "Jan 5", alerts: 4 },
      { time: "Jan 6", alerts: 2 },
      { time: "Jan 7", alerts: 3 },
    ],
    "Chemical": [
      { time: "Jan 1", alerts: 1 },
      { time: "Jan 2", alerts: 2 },
      { time: "Jan 3", alerts: 1 },
      { time: "Jan 4", alerts: 0 },
      { time: "Jan 5", alerts: 3 },
      { time: "Jan 6", alerts: 2 },
      { time: "Jan 7", alerts: 1 },
    ],
  };

  const parameters = ["Temperature", "pH Levels", "Chemical", "Turbidity", "Dissolved Oxygen", "Bacterial"];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Alert Trends Analysis</h2>
            <p className="text-gray-600 text-sm">Track alert patterns by water quality parameters</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {parameters.map((param) => (
              <button
                key={param}
                onClick={() => setSelectedParameter(param)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  selectedParameter === param
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {param}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData[selectedParameter] || trendData.Temperature}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" label={{ value: 'Number of Alerts', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="alerts" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="alerts" 
                fill="url(#colorGradient)" 
                strokeWidth={0}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Peak Alert Time</p>
            <p className="text-xl font-bold text-gray-800">3:00 PM</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Weekly Avg Alerts</p>
            <p className="text-xl font-bold text-gray-800">24</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600">Trend Direction</p>
            <p className="text-xl font-bold text-gray-800 text-green-600">↓ Decreasing</p>
          </div>
        </div>
      </div>

      {/* Seasonal Pattern */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Seasonal Alert Patterns</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { month: "Jan", alerts: 120 },
              { month: "Feb", alerts: 135 },
              { month: "Mar", alerts: 110 },
              { month: "Apr", alerts: 95 },
              { month: "May", alerts: 150 },
              { month: "Jun", alerts: 180 },
              { month: "Jul", alerts: 220 },
              { month: "Aug", alerts: 200 },
              { month: "Sep", alerts: 170 },
              { month: "Oct", alerts: 140 },
              { month: "Nov", alerts: 110 },
              { month: "Dec", alerts: 100 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="alerts" fill="#10B981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Alert Triggers Component
function AlertTriggers() {
  const [triggers, setTriggers] = useState([
    {
      id: 1,
      parameter: "Temperature",
      condition: ">",
      value: "30°C",
      severity: "critical",
      enabled: true,
      description: "Trigger when water temperature exceeds 30°C",
      stations: ["All Stations"],
      notifications: ["Email", "SMS"]
    },
    {
      id: 2,
      parameter: "pH",
      condition: "<",
      value: "6.5",
      severity: "high",
      enabled: true,
      description: "Trigger when pH falls below 6.5",
      stations: ["All Stations"],
      notifications: ["Email", "App"]
    },
    {
      id: 3,
      parameter: "Arsenic",
      condition: ">",
      value: "0.01 ppm",
      severity: "critical",
      enabled: true,
      description: "Trigger when arsenic exceeds safe limits",
      stations: ["Industrial Zones"],
      notifications: ["Email", "SMS", "App"]
    },
    {
      id: 4,
      parameter: "E. Coli",
      condition: "Detected",
      value: "Any",
      severity: "critical",
      enabled: true,
      description: "Trigger when E. Coli is detected",
      stations: ["All Stations"],
      notifications: ["Email", "SMS", "App"]
    },
    {
      id: 5,
      parameter: "Turbidity",
      condition: ">",
      value: "10 NTU",
      severity: "medium",
      enabled: true,
      description: "Trigger when water clarity is poor",
      stations: ["Surface Water"],
      notifications: ["Email"]
    },
    {
      id: 6,
      parameter: "Dissolved Oxygen",
      condition: "<",
      value: "5 mg/L",
      severity: "medium",
      enabled: false,
      description: "Trigger when oxygen levels are low",
      stations: ["All Stations"],
      notifications: ["Email", "App"]
    },
  ]);

  const toggleTrigger = (id) => {
    setTriggers(triggers.map(trigger =>
      trigger.id === id ? { ...trigger, enabled: !trigger.enabled } : trigger
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Alert Trigger Settings</h2>
            <p className="text-gray-600 text-sm">Configure automated alert triggers based on water quality thresholds</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <FaCog />
            Add New Trigger
          </button>
        </div>

        <div className="space-y-4">
          {triggers.map((trigger) => (
            <div key={trigger.id} className={`p-4 rounded-lg border ${
              trigger.enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-800">{trigger.parameter}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trigger.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      trigger.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trigger.severity.charAt(0).toUpperCase() + trigger.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{trigger.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                      Condition: {trigger.condition} {trigger.value}
                    </div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                      Stations: {trigger.stations.join(", ")}
                    </div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                      Notify: {trigger.notifications.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTrigger(trigger.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      trigger.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        trigger.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <FaCog />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Thresholds */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Standard Water Quality Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { param: "Temperature", safe: "15-30°C", warning: "30-35°C", danger: ">35°C" },
            { param: "pH Level", safe: "6.5-8.5", warning: "6.0-6.5 or 8.5-9.0", danger: "<6.0 or >9.0" },
            { param: "Turbidity", safe: "<5 NTU", warning: "5-10 NTU", danger: ">10 NTU" },
            { param: "Dissolved Oxygen", safe: ">5 mg/L", warning: "3-5 mg/L", danger: "<3 mg/L" },
            { param: "Arsenic", safe: "<0.01 ppm", warning: "0.01-0.02 ppm", danger: ">0.02 ppm" },
            { param: "E. Coli", safe: "0 CFU", warning: "1-10 CFU", danger: ">10 CFU" },
          ].map((threshold, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2">{threshold.param}</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Safe:</span>
                  <span>{threshold.safe}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600">Warning:</span>
                  <span>{threshold.warning}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Danger:</span>
                  <span>{threshold.danger}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Alert Details Modal
function AlertDetails({ alert, onClose }) {
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");

  const handleResolve = () => {
    alert(`Alert ${alert.id} marked as resolved`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {alert.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{alert.title}</h2>
                <p className="text-gray-600">Alert ID: {alert.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Station</p>
              <p className="font-medium text-gray-800">{alert.station}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <FaMapMarkerAlt /> {alert.location}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Parameter</p>
              <p className="font-medium text-gray-800">{alert.parameter}</p>
              <p className="text-sm text-gray-600 mt-1">Current: {alert.value}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Threshold</p>
              <p className="font-medium text-gray-800">{alert.threshold}</p>
              <p className="text-sm text-gray-600 mt-1">Exceeded by: {alert.value}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium text-gray-800">{alert.timestamp}</p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <FaClock /> Triggered recently
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600">{alert.description}</p>
          </div>

          {/* Trend Chart */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Parameter Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { time: "2h ago", value: 25 },
                  { time: "1h ago", value: 30 },
                  { time: "30m ago", value: 35 },
                  { time: "15m ago", value: 38 },
                  { time: "Now", value: alert.value.split('°C')[0] || 38.5 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="time" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Take Action</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Action Type</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select action...</option>
                  <option value="investigate">Investigate</option>
                  <option value="sample">Take Sample</option>
                  <option value="notify">Notify Authorities</option>
                  <option value="resolve">Mark as Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Add notes about this alert..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleResolve}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  Mark as Resolved
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Alert Settings Modal Component
function AlertSettingsModal({ onClose }) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      webhook: false
    },
    thresholds: {
      temperature: 30,
      ph: { min: 6.5, max: 8.5 },
      turbidity: 10,
      arsenic: 0.01,
      ecoli: 0
    },
    escalation: {
      enable: true,
      levels: 3,
      delay: 30 // minutes
    },
    userRoles: {
      admin: ['all'],
      operator: ['view', 'resolve'],
      viewer: ['view']
    },
    alertSchedule: {
      quietHours: false,
      start: '22:00',
      end: '06:00'
    }
  });

  const [activeTab, setActiveTab] = useState("notifications");

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('alertSettings', JSON.stringify(settings));
    alert('Alert settings saved successfully!');
    onClose();
  };

  const handleThresholdChange = (param, value) => {
    setSettings(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [param]: value
      }
    }));
  };

  const handleNotificationToggle = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCog className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Alert Settings</h2>
                <p className="text-gray-600">Configure alert preferences and thresholds</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimesCircle className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {["notifications", "thresholds", "escalation", "users", "schedule"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Notification Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'email', icon: FaEnvelope, label: 'Email', description: 'Send alerts to registered email addresses' },
                    { key: 'sms', icon: FaSms, label: 'SMS', description: 'Send text message alerts to mobile phones' },
                    { key: 'push', icon: FaMobileAlt, label: 'Push Notification', description: 'Send notifications to mobile app' },
                    { key: 'webhook', icon: FaShareAlt, label: 'Webhook', description: 'Send alerts to external systems via API' }
                  ].map(({ key, icon: Icon, label, description }) => (
                    <div key={key} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className="text-blue-500" />
                          <span className="font-medium text-gray-800">{label}</span>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications[key] ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.notifications[key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3">Notification Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                    <div>
                      <p className="font-medium text-gray-800">Critical Alerts</p>
                      <p className="text-sm text-gray-600">Immediate notification for critical water quality issues</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                    <div>
                      <p className="font-medium text-gray-800">Warning Alerts</p>
                      <p className="text-sm text-gray-600">Notifications for warning-level parameter breaches</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    <div>
                      <p className="font-medium text-gray-800">Daily Summary</p>
                      <p className="text-sm text-gray-600">Daily digest of all alerts and status updates</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "thresholds" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Parameter Thresholds</h3>
              <div className="space-y-4">
                {[
                  { param: 'temperature', label: 'Temperature (°C)', min: 0, max: 50, step: 0.5, unit: '°C' },
                  { param: 'turbidity', label: 'Turbidity (NTU)', min: 0, max: 100, step: 1, unit: 'NTU' },
                  { param: 'arsenic', label: 'Arsenic (ppm)', min: 0, max: 0.05, step: 0.001, unit: 'ppm' },
                ].map(({ param, label, min, max, step, unit }) => (
                  <div key={param} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-gray-800">{label}</label>
                      <span className="text-lg font-bold text-blue-600">
                        {settings.thresholds[param]}{unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={settings.thresholds[param]}
                      onChange={(e) => handleThresholdChange(param, parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{min}{unit}</span>
                      <span>Current: {settings.thresholds[param]}{unit}</span>
                      <span>{max}{unit}</span>
                    </div>
                  </div>
                ))}

                <div className="p-4 border border-gray-200 rounded-lg">
                  <label className="font-medium text-gray-800 mb-2 block">pH Range</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 mb-1 block">Minimum</label>
                      <input
                        type="number"
                        value={settings.thresholds.ph.min}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          thresholds: {
                            ...prev.thresholds,
                            ph: { ...prev.thresholds.ph, min: parseFloat(e.target.value) }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        step="0.1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 mb-1 block">Maximum</label>
                      <input
                        type="number"
                        value={settings.thresholds.ph.max}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          thresholds: {
                            ...prev.thresholds,
                            ph: { ...prev.thresholds.ph, max: parseFloat(e.target.value) }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "escalation" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Escalation Rules</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-800">Enable Escalation</p>
                      <p className="text-sm text-gray-600">Automatically escalate unresolved alerts</p>
                    </div>
                    <button
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        escalation: { ...prev.escalation, enable: !prev.escalation.enable }
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.escalation.enable ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.escalation.enable ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {settings.escalation.enable && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Escalation Levels</label>
                        <select
                          value={settings.escalation.levels}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            escalation: { ...prev.escalation, levels: parseInt(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value={1}>1 Level</option>
                          <option value={2}>2 Levels</option>
                          <option value={3}>3 Levels</option>
                          <option value={4}>4 Levels</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Delay Between Levels (minutes)</label>
                        <input
                          type="number"
                          value={settings.escalation.delay}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            escalation: { ...prev.escalation, delay: parseInt(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="5"
                          max="240"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export Modal Component
function ExportModal({ onClose }) {
  const [exportType, setExportType] = useState('csv');
  const [dateRange, setDateRange] = useState('7d');
  const [includeResolved, setIncludeResolved] = useState(true);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [scheduleExport, setScheduleExport] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('daily');

  const handleExport = () => {
    // Generate export data based on selections
    let exportData;
    
    switch(exportType) {
      case 'csv':
        exportData = 'CSV data would be generated here';
        break;
      case 'pdf':
        exportData = 'PDF report would be generated here';
        break;
      case 'json':
        exportData = JSON.stringify({ message: 'JSON export data' }, null, 2);
        break;
      default:
        exportData = '';
    }

    // For demo, just show alert
    alert(`Exporting ${exportType.toUpperCase()} data for ${dateRange} range. ${scheduleExport ? `Scheduled ${scheduleFrequency}` : 'Immediate download.'}`);
    
    // In real app, trigger actual export/download
    if (!scheduleExport) {
      // Trigger download
      const blob = new Blob([exportData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `water-alerts-export-${new Date().toISOString().split('T')[0]}.${exportType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    
    onClose();
  };

  const handleEmailExport = () => {
    const emails = emailRecipients.split(',').map(email => email.trim()).filter(email => email);
    if (emails.length === 0) {
      alert('Please enter at least one email address');
      return;
    }
    
    alert(`Export will be emailed to: ${emails.join(', ')}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaDownload className="text-green-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Export Alerts</h2>
                <p className="text-gray-600">Export alert data in various formats</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimesCircle className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Type */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Export Format</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'csv', icon: FaFileCsv, label: 'CSV', color: 'bg-green-100 text-green-700', description: 'Excel compatible format' },
                { key: 'pdf', icon: FaFilePdf, label: 'PDF', color: 'bg-red-100 text-red-700', description: 'Printable report format' },
                { key: 'json', icon: FaFileCode, label: 'JSON', color: 'bg-yellow-100 text-yellow-700', description: 'API data format' },
              ].map(({ key, icon: Icon, label, color, description }) => (
                <button
                  key={key}
                  onClick={() => setExportType(key)}
                  className={`p-4 border rounded-lg text-left transition-all ${exportType === key ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${color.split(' ')[0]}`}>
                      <Icon className={`text-lg ${color.split(' ')[1]}`} />
                    </div>
                    <span className="font-bold text-gray-800">{label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Date Range</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: '24h', label: 'Last 24 Hours' },
                { key: '7d', label: 'Last 7 Days' },
                { key: '30d', label: 'Last 30 Days' },
                { key: 'custom', label: 'Custom Range' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setDateRange(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Include Resolved Alerts</p>
                <p className="text-sm text-gray-600">Include previously resolved alerts in export</p>
              </div>
              <button
                onClick={() => setIncludeResolved(!includeResolved)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  includeResolved ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    includeResolved ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-800">Schedule Export</p>
                  <p className="text-sm text-gray-600">Automatically generate and send exports</p>
                </div>
                <button
                  onClick={() => setScheduleExport(!scheduleExport)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    scheduleExport ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      scheduleExport ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {scheduleExport && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Frequency</label>
                    <select
                      value={scheduleFrequency}
                      onChange={(e) => setScheduleFrequency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email Recipients</label>
                    <input
                      type="text"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      placeholder="Enter comma-separated email addresses"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Export */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-blue-500 text-xl mt-1" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Email Export</p>
                <p className="text-sm text-gray-600 mb-3">Send export directly to email addresses</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                    placeholder="recipient@example.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleEmailExport}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FaPaperPlane />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Export Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
