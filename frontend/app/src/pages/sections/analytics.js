import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const BASE_URL = "http://127.0.0.1:8000";

const PARAMETERS = [
  { label: "pH", value: "pH", unit: "", safeRange: "6.5-8.5", color: "#3b82f6" },
  { label: "Turbidity", value: "turbidity", unit: "NTU", safeRange: "<5 NTU", color: "#10b981" },
  { label: "DO", value: "DO", unit: "mg/L", safeRange: ">5 mg/L", color: "#f59e0b" },
  { label: "Arsenic", value: "arsenic", unit: "μg/L", safeRange: "<10 μg/L", color: "#ef4444" },
  { label: "Iron", value: "iron", unit: "mg/L", safeRange: "<0.3 mg/L", color: "#8b5cf6" },
  { label: "E. Coli", value: "ecoli", unit: "CFU/mL", safeRange: "0 CFU/mL", color: "#ec4899" },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Analytics() {
  const [parameter, setParameter] = useState("pH");
  const [range, setRange] = useState("daily");
  const [chartType, setChartType] = useState("line");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/readings/analytics`, {
        params: { parameter, range },
      })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
        setIsLoading(false);
      });
  }, [parameter, range]);

  const pieData = data.map((d) => ({
    name: d.time,
    value: d.value,
  }));

  const currentParam = PARAMETERS.find(p => p.value === parameter);
  const avgValue = data.length > 0 ? (data.reduce((a, b) => a + b.value, 0) / data.length).toFixed(2) : 0;
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)).toFixed(2) : 0;
  const minValue = data.length > 0 ? Math.min(...data.map(d => d.value)).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-white p-3 overflow-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Water Quality Dashboard</h1>
              <p className="text-xs text-gray-600">Monitor water stations & analyze parameters</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable Area */}
      <div className="mt-3 space-y-4">
        {/* Parameter Selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Select Water Quality Parameter</h3>
          <div className="flex flex-wrap gap-1">
            {PARAMETERS.map((p) => (
              <button
                key={p.value}
                onClick={() => setParameter(p.value)}
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                  parameter === p.value
                    ? "text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
                style={parameter === p.value ? {backgroundColor: p.color} : {}}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Time Range */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Time Range</h3>
              <div className="grid grid-cols-2 gap-2">
                {["daily", "weekly", "monthly", "yearly"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`py-2 text-xs rounded-md transition-colors ${
                      range === r
                        ? "bg-green-500 text-white font-medium"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Chart Type</h3>
              <div className="grid grid-cols-3 gap-2">
                {["line", "bar", "pie"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setChartType(c)}
                    className={`py-2 text-xs rounded-md transition-colors ${
                      chartType === c
                        ? "bg-purple-600 text-white font-medium"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Parameter Info */}
            {currentParam && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: currentParam.color}}></div>
                  <h3 className="text-sm font-semibold text-gray-800">{currentParam.label}</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit:</span>
                    <span className="font-medium">{currentParam.unit || "unitless"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Safe Range:</span>
                    <span className="font-medium text-green-600">{currentParam.safeRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Avg:</span>
                    <span className="font-medium text-blue-600">{avgValue} {currentParam.unit}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {/* Chart Header */}
              <div className="p-3 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-gray-800">{currentParam?.label} Analysis</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {range.charAt(0).toUpperCase() + range.slice(1)} View
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {chartType.toUpperCase()} Chart
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  {data.length > 0 && !isLoading && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-sm font-bold text-blue-600">{data.length}</div>
                        <div className="text-xs text-blue-500">Points</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-sm font-bold text-green-600">{maxValue}</div>
                        <div className="text-xs text-green-500">Max</div>
                      </div>
                      <div className="text-center p-2 bg-amber-50 rounded">
                        <div className="text-sm font-bold text-amber-600">{avgValue}</div>
                        <div className="text-xs text-amber-500">Avg</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chart Container */}
              <div className="p-3">
                {isLoading ? (
                  <div className="flex items-center justify-center h-56">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                      <p className="text-gray-600 text-xs">Loading data...</p>
                    </div>
                  </div>
                ) : data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-56 text-gray-400">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-600 text-sm mb-1">No data available</p>
                    <p className="text-gray-400 text-xs">Select different parameters or time range</p>
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "line" && (
                        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="time" 
                            stroke="#6b7280"
                            tick={{ fill: '#4b5563', fontSize: 11 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            tick={{ fill: '#4b5563', fontSize: 11 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                              fontSize: '11px'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={currentParam?.color || "#3b82f6"}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      )}

                      {chartType === "bar" && (
                        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="time" 
                            stroke="#6b7280"
                            tick={{ fill: '#4b5563', fontSize: 11 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            tick={{ fill: '#4b5563', fontSize: 11 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                              fontSize: '11px'
                            }}
                          />
                          <Bar 
                            dataKey="value" 
                            fill={currentParam?.color || "#10b981"}
                            radius={[3, 3, 0, 0]}
                          />
                        </BarChart>
                      )}

                      {chartType === "pie" && (
                        <PieChart>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                              fontSize: '11px'
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: '11px' }}
                          />
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={30}
                            paddingAngle={1}
                            label={(entry) => `${entry.name}`}
                            labelStyle={{ fontSize: '9px' }}
                          >
                            {pieData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={COLORS[i % COLORS.length]}
                                stroke="white"
                                strokeWidth={1}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-blue-50 rounded">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">Data Points</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{data.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total readings analyzed</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-green-50 rounded">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">Average Value</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{avgValue}</p>
                <p className="text-xs text-gray-500 mt-1">{currentParam?.unit} • {range} average</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-purple-50 rounded">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">Range</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{minValue} - {maxValue}</p>
                <p className="text-xs text-gray-500 mt-1">Min to Max values</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              <p><span className="font-medium">Monitor:</span> Tracking {currentParam?.label} levels for water safety compliance</p>
              <p className="mt-1"><span className="font-medium">Safe Range:</span> {currentParam?.safeRange} • <span className="font-medium">Current:</span> {avgValue} {currentParam?.unit}</p>
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}