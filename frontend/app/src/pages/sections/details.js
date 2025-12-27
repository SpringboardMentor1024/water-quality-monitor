import React, { useState } from "react";
import TrendChart from "../../components/TrendChart";
import { 
  FaWater, 
  FaThermometerHalf, 
  FaTint, 
  FaFlask, 
  FaWind, 
  FaChartLine,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaBuilding,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaDownload,
  FaShareAlt,
  FaInfoCircle
} from "react-icons/fa";

/* =================================================
   MOCK DATA (TEMP — BACKEND WILL REPLACE LATER)
================================================= */

// Station info
const mockStation = {
  id: "STN-101",
  name: "Krishna Barrage Monitoring Station",
  location: "Prakasam Barrage, Vijayawada, Andhra Pradesh",
  managed_by: "Irrigation Department",
  status: "active",
  lastUpdated: "2 minutes ago",
  waterSource: "Krishna River",
  elevation: "12.5m above sea level",
  established: "2018",
  contact: "station.manager@waterwatch.gov.in",
  phone: "+91 9876543210"
};

// Latest readings with safety status
const mockReadings = [
  { 
    parameter: "pH", 
    value: "7.2", 
    unit: "pH", 
    safeRange: "6.5-8.5", 
    status: "safe",
    icon: <FaWater className="text-blue-400" />,
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
    description: "Measure of acidity/alkalinity"
  },
  { 
    parameter: "Turbidity", 
    value: "5.8", 
    unit: "NTU", 
    safeRange: "<10 NTU", 
    status: "safe",
    icon: <FaTint className="text-cyan-400" />,
    color: "from-cyan-500/20 to-cyan-600/20",
    borderColor: "border-cyan-500/30",
    description: "Clarity of water"
  },
  { 
    parameter: "Dissolved Oxygen", 
    value: "8.1", 
    unit: "mg/L", 
    safeRange: ">5 mg/L", 
    status: "good",
    icon: <FaWind className="text-green-400" />,
    color: "from-green-500/20 to-green-600/20",
    borderColor: "border-green-500/30",
    description: "Oxygen available for aquatic life"
  },
  { 
    parameter: "Arsenic", 
    value: "0.008", 
    unit: "ppm", 
    safeRange: "<0.01 ppm", 
    status: "warning",
    icon: <FaExclamationTriangle className="text-yellow-400" />,
    color: "from-yellow-500/20 to-yellow-600/20",
    borderColor: "border-yellow-500/30",
    description: "Toxic heavy metal"
  },
  { 
    parameter: "Lead", 
    value: "0.003", 
    unit: "ppm", 
    safeRange: "<0.015 ppm", 
    status: "safe",
    icon: <FaFlask className="text-purple-400" />,
    color: "from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30",
    description: "Heavy metal contamination"
  },
  { 
    parameter: "Temperature", 
    value: "22.5", 
    unit: "°C", 
    safeRange: "15-30°C", 
    status: "safe",
    icon: <FaThermometerHalf className="text-red-400" />,
    color: "from-red-500/20 to-red-600/20",
    borderColor: "border-red-500/30",
    description: "Water temperature"
  },
];

// Trend data with filters
const mockTrendData = {
  daily: {
    pH: [
      { time: "10 AM", value: 7.2 },
      { time: "12 PM", value: 7.3 },
      { time: "2 PM", value: 7.1 },
      { time: "4 PM", value: 7.2 },
      { time: "6 PM", value: 7.4 },
      { time: "8 PM", value: 7.3 },
      { time: "10 PM", value: 7.2 },
    ],
    Turbidity: [
      { time: "10 AM", value: 5.9 },
      { time: "12 PM", value: 5.8 },
      { time: "2 PM", value: 6.0 },
      { time: "4 PM", value: 5.7 },
      { time: "6 PM", value: 5.6 },
      { time: "8 PM", value: 5.8 },
      { time: "10 PM", value: 5.9 },
    ],
    DO: [
      { time: "10 AM", value: 8.0 },
      { time: "12 PM", value: 8.1 },
      { time: "2 PM", value: 7.9 },
      { time: "4 PM", value: 8.2 },
      { time: "6 PM", value: 8.0 },
      { time: "8 PM", value: 7.8 },
      { time: "10 PM", value: 7.9 },
    ],
  },

  weekly: {
    pH: [
      { time: "Mon", value: 7.1 },
      { time: "Tue", value: 7.3 },
      { time: "Wed", value: 7.2 },
      { time: "Thu", value: 7.4 },
      { time: "Fri", value: 7.3 },
      { time: "Sat", value: 7.2 },
      { time: "Sun", value: 7.1 },
    ],
    Turbidity: [
      { time: "Mon", value: 6.1 },
      { time: "Tue", value: 5.8 },
      { time: "Wed", value: 5.6 },
      { time: "Thu", value: 5.9 },
      { time: "Fri", value: 6.0 },
      { time: "Sat", value: 5.7 },
      { time: "Sun", value: 5.8 },
    ],
    DO: [
      { time: "Mon", value: 8.0 },
      { time: "Tue", value: 8.2 },
      { time: "Wed", value: 8.1 },
      { time: "Thu", value: 7.9 },
      { time: "Fri", value: 8.0 },
      { time: "Sat", value: 7.8 },
      { time: "Sun", value: 7.9 },
    ],
  },

  monthly: {
    pH: [
      { time: "Week 1", value: 7.0 },
      { time: "Week 2", value: 7.2 },
      { time: "Week 3", value: 7.3 },
      { time: "Week 4", value: 7.2 },
    ],
    Turbidity: [
      { time: "Week 1", value: 6.2 },
      { time: "Week 2", value: 6.0 },
      { time: "Week 3", value: 5.8 },
      { time: "Week 4", value: 5.9 },
    ],
    DO: [
      { time: "Week 1", value: 8.1 },
      { time: "Week 2", value: 8.0 },
      { time: "Week 3", value: 7.8 },
      { time: "Week 4", value: 7.9 },
    ],
  },
};

// Helper function for CSV export
const generateCSVData = () => {
  const headers = ["Parameter", "Value", "Unit", "Safe Range", "Status", "Description"];
  const rows = mockReadings.map(reading => [
    reading.parameter,
    reading.value,
    reading.unit,
    reading.safeRange,
    reading.status.charAt(0).toUpperCase() + reading.status.slice(1),
    reading.description
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  return csvContent;
};

// Helper function for sharing
const generateShareContent = () => {
  return `Station: ${mockStation.name}\n` +
         `Location: ${mockStation.location}\n` +
         `Status: ${mockStation.status.toUpperCase()}\n` +
         `Last Updated: ${mockStation.lastUpdated}\n\n` +
         `Water Quality Parameters:\n` +
         mockReadings.map(r => `${r.parameter}: ${r.value} ${r.unit} (${r.status})`).join('\n') +
         `\n\nSource: WaterWatch Monitoring System`;
};

export default function Details({ stationId, goToReports }) {
  const [showTrends, setShowTrends] = useState(false);
  const [timeFilter, setTimeFilter] = useState("daily");
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [showAllParameters, setShowAllParameters] = useState(false);

  // Function to handle Export Data
  const handleExportData = () => {
    const csvContent = generateCSVData();
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${mockStation.id}_water_quality_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    alert(`Data exported successfully!\nFile: ${mockStation.id}_water_quality_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Function to handle Share Report
  const handleShareReport = () => {
    const shareContent = generateShareContent();
    
    if (navigator.share) {
      // Use Web Share API if available
      navigator.share({
        title: `Water Quality Report - ${mockStation.name}`,
        text: shareContent,
        url: window.location.href,
      })
      .then(() => console.log('Report shared successfully'))
      .catch((error) => {
        console.log('Error sharing:', error);
        fallbackShare(shareContent);
      });
    } else {
      fallbackShare(shareContent);
    }
  };

  // Fallback sharing method
  const fallbackShare = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        alert('Report copied to clipboard! You can now paste it anywhere.');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Report content:\n\n' + content + '\n\n(Copy this text manually)');
      });
  };

  // Function to handle Get Help
  const handleGetHelp = () => {
    const helpMessage = `
WaterWatch Station Details Help:

📊 QUICK ACTIONS:
• Export Data: Downloads current readings as CSV
• Share Report: Shares station details via clipboard or share dialog
• Get Help: Shows this help message

📈 VIEWING DATA:
• Click on any parameter card to see detailed information
• Use "View Trends" to show historical data charts
• Switch between Daily/Weekly/Monthly time filters

🔍 TIPS:
• Green indicators = Safe levels
• Yellow indicators = Warning levels
• Red indicators = Critical levels
• Click "View All" to see all parameters

Need more help? Contact: support@waterwatch.gov.in
`;
    
    alert(helpMessage);
  };

  // If no station selected
  if (!stationId) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl inline-block mb-4">
            <FaWater className="text-4xl text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Station Selected</h3>
          <p className="text-gray-400 mb-4">
            Select a water monitoring station from the map to view detailed information and analytics.
          </p>
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-300">💡 <strong>Tip:</strong> Click on any station marker on the map to load its details here.</p>
          </div>
        </div>
      </div>
    );
  }

  const displayedReadings = showAllParameters 
    ? mockReadings 
    : mockReadings.slice(0, 6);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* =============================
            STATION HEADER
        ============================== */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <FaWater className="text-3xl text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{mockStation.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    mockStation.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {mockStation.status === 'active' ? '● Active' : '● Inactive'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span>{mockStation.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-500" />
                    <span>{mockStation.managed_by}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span>Updated {mockStation.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowTrends(!showTrends)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <FaChartLine />
                {showTrends ? "Hide Trends" : "View Trends"}
              </button>

              <button
                onClick={goToReports}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <FaExclamationTriangle />
                View Reports
              </button>
            </div>
          </div>

          {/* Station Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Water Source</p>
              <p className="font-medium text-gray-800">{mockStation.waterSource}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Elevation</p>
              <p className="font-medium text-gray-800">{mockStation.elevation}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Established</p>
              <p className="font-medium text-gray-800">{mockStation.established}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Contact</p>
              <p className="font-medium text-gray-800 truncate">{mockStation.contact}</p>
            </div>
          </div>
        </div>

        {/* =============================
            QUICK ACTIONS BAR - NOW FUNCTIONAL
        ============================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Quick Actions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleExportData}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors border border-gray-300"
            >
              <FaDownload size={14} />
              Export Data
            </button>
            <button 
              onClick={handleShareReport}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors border border-gray-300"
            >
              <FaShareAlt size={14} />
              Share Report
            </button>
            <button 
              onClick={handleGetHelp}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <FaInfoCircle size={14} />
              Get Help
            </button>
          </div>
        </div>

        {/* =============================
            CURRENT READINGS - ENHANCED
        ============================== */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaChartLine className="text-blue-600" />
                Live Water Quality Parameters
              </h2>
              <p className="text-gray-600 text-sm mt-1">Real-time monitoring data from sensors</p>
            </div>
            {mockReadings.length > 6 && (
              <button
                onClick={() => setShowAllParameters(!showAllParameters)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors border border-gray-300"
              >
                {showAllParameters ? "Show Less" : `View All (${mockReadings.length})`}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedReadings.map((reading) => (
              <div
                key={reading.parameter}
                className={`p-4 rounded-lg border cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${
                  selectedParameter === reading.parameter 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => setSelectedParameter(selectedParameter === reading.parameter ? null : reading.parameter)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {reading.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{reading.parameter}</h3>
                      <p className="text-xs text-gray-500">{reading.description}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reading.status === 'safe' 
                      ? 'bg-green-100 text-green-800' 
                      : reading.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {reading.status === 'safe' ? <FaCheckCircle /> : 
                     reading.status === 'warning' ? <FaExclamationTriangle /> : 
                     <FaTimesCircle />}
                  </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-800">{reading.value}</p>
                    <p className="text-gray-500 text-sm">{reading.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Safe Range</p>
                    <p className="text-sm font-medium text-gray-700">{reading.safeRange}</p>
                  </div>
                </div>

                {/* Safety Indicator */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Low</span>
                    <span>Safe Range</span>
                    <span>High</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        reading.status === 'safe' ? 'bg-green-500' :
                        reading.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(
                          ((parseFloat(reading.value) / 
                            parseFloat(reading.safeRange.split('-')[1] || reading.safeRange.split('<')[1])) * 100), 100
                        )}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedParameter && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-gray-800">Details for {selectedParameter}</h3>
                <button 
                  onClick={() => setSelectedParameter(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimesCircle />
                </button>
              </div>
              <p className="text-gray-700">
                This parameter is currently within safe limits. Regular monitoring ensures water quality standards are maintained.
              </p>
            </div>
          )}
        </div>

        {/* =============================
            TREND CHARTS - ENHANCED
        ============================== */}
        {showTrends && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" />
                  Water Quality Trends Analysis
                </h2>
                <p className="text-gray-600 text-sm mt-1">Historical data visualization for informed decision making</p>
              </div>
              
              {/* Time Filters */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                {["daily", "weekly", "monthly"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTimeFilter(f)}
                    className={`px-4 py-2 rounded capitalize text-sm font-medium transition-all duration-200 ${
                      timeFilter === f
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrendChart
                  title="pH Level Trend"
                  data={mockTrendData[timeFilter].pH}
                  unit="pH"
                  color="#3b82f6"
                  timeRange={timeFilter}
                />
              </div>
              <div>
                <TrendChart
                  title="Turbidity Trend"
                  data={mockTrendData[timeFilter].Turbidity}
                  unit="NTU"
                  color="#22c55e"
                  timeRange={timeFilter}
                />
              </div>
              <div className="lg:col-span-3">
                <TrendChart
                  title="Dissolved Oxygen Trend"
                  data={mockTrendData[timeFilter].DO}
                  unit="mg/L"
                  color="#f59e0b"
                  timeRange={timeFilter}
                  height={200}
                />
              </div>
            </div>

            {/* Trend Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3">
                  <p className="text-sm text-gray-600">Average pH</p>
                  <p className="text-2xl font-bold text-blue-600">7.2</p>
                </div>
                <div className="text-center p-3">
                  <p className="text-sm text-gray-600">Avg Turbidity</p>
                  <p className="text-2xl font-bold text-green-600">5.8 NTU</p>
                </div>
                <div className="text-center p-3">
                  <p className="text-sm text-gray-600">Avg DO</p>
                  <p className="text-2xl font-bold text-yellow-600">8.1 mg/L</p>
                </div>
                <div className="text-center p-3">
                  <p className="text-sm text-gray-600">Overall Status</p>
                  <p className="text-2xl font-bold text-green-600">Good</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================
            STATION HEALTH SUMMARY
        ============================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Health</p>
                <p className="text-xl font-bold text-green-600">Good</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaClock className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-xl font-bold text-blue-600">99.8%</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaFlask className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tests Today</p>
                <p className="text-xl font-bold text-purple-600">24</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
