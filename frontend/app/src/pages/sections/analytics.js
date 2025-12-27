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
  Area
} from "recharts";
import {
  FaChartLine,
  FaWater,
  FaExclamationTriangle,
  FaFlask,
  FaThermometerHalf,
  FaTint,
  FaWind,
  FaFilter,
  FaDownload,
  FaShareAlt,
  FaInfoCircle,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEquals
} from "react-icons/fa";

export default function Analytics() {
  const [activeParam, setActiveParam] = useState("pH");
  const [timeRange, setTimeRange] = useState("Daily");
  const [chartType, setChartType] = useState("line");

  // Analytics data for different parameters
  const analyticsData = {
    pH: {
      Daily: { wqi: 72, status: "Good", trend: "up", change: 2.5 },
      Weekly: { wqi: 70, status: "Good", trend: "stable", change: 0.8 },
      Monthly: { wqi: 65, status: "Moderate", trend: "down", change: -1.2 },
      Yearly: { wqi: 60, status: "Moderate", trend: "down", change: -3.4 },
      unit: "pH",
      safeRange: "6.5-8.5",
      description: "Measure of acidity/alkalinity"
    },
    "Dissolved Oxygen": {
      Daily: { wqi: 75, status: "Good", trend: "up", change: 3.2 },
      Weekly: { wqi: 72, status: "Good", trend: "stable", change: 0.5 },
      Monthly: { wqi: 68, status: "Moderate", trend: "down", change: -2.1 },
      Yearly: { wqi: 62, status: "Moderate", trend: "down", change: -4.8 },
      unit: "mg/L",
      safeRange: ">5 mg/L",
      description: "Oxygen available for aquatic life"
    },
    Turbidity: {
      Daily: { wqi: 60, status: "Moderate", trend: "down", change: -1.8 },
      Weekly: { wqi: 55, status: "Moderate", trend: "down", change: -3.5 },
      Monthly: { wqi: 48, status: "Poor", trend: "down", change: -5.2 },
      Yearly: { wqi: 42, status: "Poor", trend: "down", change: -8.7 },
      unit: "NTU",
      safeRange: "<10 NTU",
      description: "Clarity of water"
    },
    Arsenic: {
      Daily: { wqi: 50, status: "Poor", trend: "stable", change: 0.3 },
      Weekly: { wqi: 48, status: "Poor", trend: "down", change: -1.2 },
      Monthly: { wqi: 45, status: "Poor", trend: "down", change: -2.8 },
      Yearly: { wqi: 40, status: "Critical", trend: "down", change: -5.6 },
      unit: "ppm",
      safeRange: "<0.01 ppm",
      description: "Toxic heavy metal"
    },
    "E. Coli": {
      Daily: { wqi: 58, status: "Poor", trend: "up", change: 1.5 },
      Weekly: { wqi: 55, status: "Poor", trend: "stable", change: 0.2 },
      Monthly: { wqi: 50, status: "Poor", trend: "down", change: -3.1 },
      Yearly: { wqi: 45, status: "Critical", trend: "down", change: -6.4 },
      unit: "CFU/100mL",
      safeRange: "0 CFU",
      description: "Bacterial contamination indicator"
    },
    Iron: {
      Daily: { wqi: 68, status: "Moderate", trend: "up", change: 2.1 },
      Weekly: { wqi: 65, status: "Moderate", trend: "stable", change: 0.4 },
      Monthly: { wqi: 60, status: "Moderate", trend: "down", change: -1.8 },
      Yearly: { wqi: 55, status: "Poor", trend: "down", change: -4.2 },
      unit: "ppm",
      safeRange: "<0.3 ppm",
      description: "Heavy metal content"
    },
  };

  // FIXED: Comprehensive trend data for ALL parameters with correct property names
  const trendData = {
    Daily: [
      { time: "6 AM", pH: 7.0, dissolvedOxygen: 7.8, turbidity: 6.2, arsenic: 0.009, iron: 0.25, eColi: 12 },
      { time: "9 AM", pH: 7.1, dissolvedOxygen: 8.0, turbidity: 5.9, arsenic: 0.008, iron: 0.24, eColi: 10 },
      { time: "12 PM", pH: 7.3, dissolvedOxygen: 8.2, turbidity: 5.8, arsenic: 0.008, iron: 0.23, eColi: 8 },
      { time: "3 PM", pH: 7.2, dissolvedOxygen: 8.1, turbidity: 6.0, arsenic: 0.009, iron: 0.24, eColi: 9 },
      { time: "6 PM", pH: 7.1, dissolvedOxygen: 7.9, turbidity: 6.1, arsenic: 0.010, iron: 0.26, eColi: 11 },
    ],
    Weekly: [
      { time: "Mon", pH: 7.0, dissolvedOxygen: 7.9, turbidity: 6.3, arsenic: 0.010, iron: 0.27, eColi: 13 },
      { time: "Tue", pH: 7.1, dissolvedOxygen: 8.0, turbidity: 6.1, arsenic: 0.009, iron: 0.26, eColi: 11 },
      { time: "Wed", pH: 7.2, dissolvedOxygen: 8.1, turbidity: 6.0, arsenic: 0.009, iron: 0.25, eColi: 10 },
      { time: "Thu", pH: 7.3, dissolvedOxygen: 8.2, turbidity: 5.9, arsenic: 0.008, iron: 0.24, eColi: 9 },
      { time: "Fri", pH: 7.2, dissolvedOxygen: 8.1, turbidity: 5.8, arsenic: 0.008, iron: 0.23, eColi: 8 },
      { time: "Sat", pH: 7.1, dissolvedOxygen: 8.0, turbidity: 5.9, arsenic: 0.009, iron: 0.24, eColi: 10 },
      { time: "Sun", pH: 7.0, dissolvedOxygen: 7.9, turbidity: 6.0, arsenic: 0.010, iron: 0.26, eColi: 12 },
    ],
    Monthly: [
      { time: "Week 1", pH: 7.0, dissolvedOxygen: 7.8, turbidity: 6.4, arsenic: 0.011, iron: 0.28, eColi: 14 },
      { time: "Week 2", pH: 7.1, dissolvedOxygen: 7.9, turbidity: 6.2, arsenic: 0.010, iron: 0.26, eColi: 12 },
      { time: "Week 3", pH: 7.2, dissolvedOxygen: 8.0, turbidity: 6.1, arsenic: 0.009, iron: 0.25, eColi: 11 },
      { time: "Week 4", pH: 7.3, dissolvedOxygen: 8.1, turbidity: 5.9, arsenic: 0.008, iron: 0.23, eColi: 9 },
    ],
    Yearly: [
      { time: "2022", pH: 7.4, dissolvedOxygen: 8.3, turbidity: 5.5, arsenic: 0.007, iron: 0.22, eColi: 7 },
      { time: "2023", pH: 7.2, dissolvedOxygen: 8.1, turbidity: 5.8, arsenic: 0.008, iron: 0.24, eColi: 9 },
      { time: "2024", pH: 7.0, dissolvedOxygen: 7.9, turbidity: 6.2, arsenic: 0.010, iron: 0.26, eColi: 12 },
    ],
  };

  // Parameter icons mapping
  const paramIcons = {
    "pH": <FaWater className="text-blue-500" />,
    "Dissolved Oxygen": <FaWind className="text-green-500" />,
    "Turbidity": <FaTint className="text-cyan-500" />,
    "Arsenic": <FaFlask className="text-purple-500" />,
    "E. Coli": <FaExclamationTriangle className="text-red-500" />,
    "Iron": <FaThermometerHalf className="text-orange-500" />
  };

  const parameters = Object.keys(analyticsData);
  const current = analyticsData[activeParam][timeRange];
  const paramData = analyticsData[activeParam];

  // FIXED: Correct mapping function for ALL parameters
  const getDataKey = (param) => {
    switch(param) {
      case "pH": return "pH";
      case "Dissolved Oxygen": return "dissolvedOxygen";
      case "Turbidity": return "turbidity";
      case "Arsenic": return "arsenic";
      case "E. Coli": return "eColi";
      case "Iron": return "iron";
      default: return param.toLowerCase();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Good": return "bg-green-100 text-green-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Poor": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return <FaArrowUp className="text-green-600" />;
      case "down": return <FaArrowDown className="text-red-600" />;
      default: return <FaEquals className="text-yellow-600" />;
    }
  };

  // Overall stats
  const overallStats = {
    totalStations: 120,
    contaminatedSites: 5,
    activeAlerts: 2,
    avgWQI: 65.4
  };

  // Station distribution data
  const stationDistribution = [
    { name: "Good", value: 85, color: "#10B981" },
    { name: "Moderate", value: 25, color: "#F59E0B" },
    { name: "Poor", value: 7, color: "#F97316" },
    { name: "Critical", value: 3, color: "#EF4444" },
  ];

  // FIXED: Export Data Function with correct headers
  const handleExportData = () => {
    // Create CSV data
    const headers = ["Time", "pH", "Dissolved Oxygen", "Turbidity", "Arsenic", "Iron", "E. Coli"];
    const rows = trendData[timeRange].map(row => [
      row.time,
      row.pH,
      row.dissolvedOxygen,
      row.turbidity,
      row.arsenic,
      row.iron,
      row.eColi
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `water_quality_${timeRange.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    alert(`Data exported successfully! File: water_quality_${timeRange.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // FIXED: Share Report Function
  const handleShareReport = () => {
    if (navigator.share) {
      // Use Web Share API if available
      navigator.share({
        title: `Water Quality Analytics - ${activeParam} (${timeRange})`,
        text: `Current ${activeParam} value: ${trendData[timeRange][trendData[timeRange].length - 1][getDataKey(activeParam)]} ${paramData.unit}. Status: ${current.status}. Water Quality Index: ${current.wqi}`,
        url: window.location.href,
      })
      .then(() => console.log('Report shared successfully'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: Copy to clipboard
      const shareText = `Water Quality Analytics Report\n\n` +
        `Parameter: ${activeParam}\n` +
        `Time Range: ${timeRange}\n` +
        `Current Value: ${trendData[timeRange][trendData[timeRange].length - 1][getDataKey(activeParam)]} ${paramData.unit}\n` +
        `Water Quality Index: ${current.wqi}\n` +
        `Status: ${current.status}\n` +
        `Trend: ${current.trend} (${Math.abs(current.change)}%)\n` +
        `Safe Range: ${paramData.safeRange}\n\n` +
        `Report generated from WaterWatch Monitoring System`;
      
      navigator.clipboard.writeText(shareText)
        .then(() => {
          alert('Report copied to clipboard! You can now paste it anywhere.');
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          alert('Could not copy to clipboard. Please try again.');
        });
    }
  };

  return (
    // Simple scrollable container
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaChartLine className="text-blue-600" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">Real-time monitoring and analytics</p>
            </div>
            <div className="flex items-center gap-2">
              {/* FIXED: Export Data Button with functionality */}
              <button 
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm transition-colors text-gray-700"
              >
                <FaDownload />
                Export Data
              </button>
              
              {/* FIXED: Share Report Button with functionality */}
              <button 
                onClick={handleShareReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                <FaShareAlt />
                Share Report
              </button>
            </div>
          </div>

          {/* =========================
              TIME RANGE SELECTOR
          ========================= */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {["Daily", "Weekly", "Monthly", "Yearly"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    timeRange === range
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <FaCalendarAlt />
                  {range}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaFilter className="text-gray-400" />
              <span>Viewing: {timeRange} Data</span>
            </div>
          </div>

          {/* =========================
              OVERVIEW CARDS
          ========================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FaWater className="text-blue-600 text-lg" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(current.status)}`}>
                  {getTrendIcon(current.trend)} {Math.abs(current.change)}%
                </div>
              </div>
              <p className="text-gray-600 text-sm">Water Quality Index</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-2xl font-bold text-gray-800">{current.wqi}</p>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(current.status)}`}>
                  {current.status}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border">
              <div className="p-2 bg-green-50 rounded-lg mb-3 inline-block">
                <FaChartLine className="text-green-600 text-lg" />
              </div>
              <p className="text-gray-600 text-sm">Total Stations</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{overallStats.totalStations}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '85%' }} />
                </div>
                <span className="text-xs text-gray-500">85% operational</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border">
              <div className="p-2 bg-red-50 rounded-lg mb-3 inline-block">
                <FaFlask className="text-red-600 text-lg" />
              </div>
              <p className="text-gray-600 text-sm">Contaminated Sites</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{overallStats.contaminatedSites}</p>
              <div className="mt-2 text-sm text-gray-600">
                <span className="text-green-600 font-medium">↓ 12%</span> from last month
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border">
              <div className="p-2 bg-yellow-50 rounded-lg mb-3 inline-block">
                <FaExclamationTriangle className="text-yellow-600 text-lg" />
              </div>
              <p className="text-gray-600 text-sm">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{overallStats.activeAlerts}</p>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">System Normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              MAIN CONTENT AREA
          ========================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN: PARAMETER SELECTION */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaFilter className="text-blue-600" />
                    Water Quality Parameters
                  </h2>
                  <span className="text-sm text-gray-500">{parameters.length} parameters</span>
                </div>

                <div className="space-y-3">
                  {parameters.map((param) => {
                    const paramCurrent = analyticsData[param][timeRange];
                    return (
                      <div
                        key={param}
                        onClick={() => setActiveParam(param)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                          activeParam === param
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {paramIcons[param]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{param}</p>
                              <p className="text-xs text-gray-500">{analyticsData[param].unit}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800">{paramCurrent.wqi}</span>
                              <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(paramCurrent.status)}`}>
                                {paramCurrent.status}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              {getTrendIcon(paramCurrent.trend)}
                              <span>{Math.abs(paramCurrent.change)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Station Distribution */}
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-blue-600" />
                  Station Health Distribution
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stationDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stationDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DETAILED ANALYTICS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      {paramIcons[activeParam]}
                      {activeParam} Analytics
                    </h2>
                    <p className="text-gray-600 text-sm">{paramData.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType("line")}
                      className={`px-3 py-1.5 rounded text-sm ${chartType === "line" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Line
                    </button>
                    <button
                      onClick={() => setChartType("area")}
                      className={`px-3 py-1.5 rounded text-sm ${chartType === "area" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setChartType("bar")}
                      className={`px-3 py-1.5 rounded text-sm ${chartType === "bar" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Bar
                    </button>
                  </div>
                </div>

                {/* FIXED: Main Chart - Now shows data for ALL parameters */}
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <LineChart data={trendData[timeRange]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#6B7280"
                          tick={{ fill: '#6B7280' }}
                        />
                        <YAxis 
                          stroke="#6B7280"
                          tick={{ fill: '#6B7280' }}
                          label={{ value: paramData.unit, angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            color: '#374151'
                          }}
                          formatter={(value) => [`${value} ${paramData.unit}`, activeParam]}
                        />
                        <Line
                          type="monotone"
                          dataKey={getDataKey(activeParam)}
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ r: 3, strokeWidth: 2 }}
                          activeDot={{ r: 5, strokeWidth: 2 }}
                        />
                      </LineChart>
                    ) : chartType === "area" ? (
                      <AreaChart data={trendData[timeRange]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey={getDataKey(activeParam)}
                          stroke="#3B82F6"
                          fill="url(#colorUv)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    ) : (
                      <BarChart data={trendData[timeRange]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Bar
                          dataKey={getDataKey(activeParam)}
                          fill="#3B82F6"
                          radius={[3, 3, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Parameter Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="text-xl font-bold text-gray-800 mt-1">
                    {trendData[timeRange][trendData[timeRange].length - 1][getDataKey(activeParam)]} {paramData.unit}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-gray-600">Safe Range</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">{paramData.safeRange}</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-sm text-gray-600">Trend</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(current.trend)}
                    <span className="text-lg font-bold text-gray-800">{Math.abs(current.change)}%</span>
                    <span className={`text-sm ${current.trend === "up" ? "text-green-600" : current.trend === "down" ? "text-red-600" : "text-yellow-600"}`}>
                      ({current.trend})
                    </span>
                  </div>
                </div>
              </div>

              {/* FIXED: All Parameters Mini Charts - Now shows all parameters */}
              <div className="bg-white p-5 rounded-lg shadow-sm border">
                <h3 className="font-bold text-gray-800 mb-4">All Parameter Trends</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {parameters.map((param) => (
                    <div key={param} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2 mb-2">
                        {paramIcons[param]}
                        <span className="text-sm font-medium text-gray-700">{param}</span>
                      </div>
                      <div className="h-16">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData[timeRange].slice(-4)}>
                            <Line
                              type="monotone"
                              dataKey={getDataKey(param)}
                              stroke={param === activeParam ? "#3B82F6" : "#9CA3AF"}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
            © WaterWatch Monitoring System v2.0 • System Status: Operational • Last Updated: Just now
          </div>
        </div>
      </div>
    </div>
  );
}
