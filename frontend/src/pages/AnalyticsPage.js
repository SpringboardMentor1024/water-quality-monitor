import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { stationsAPI } from '../services/api';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch real data from backend
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // Try to get station readings for analytics
        const stations = await stationsAPI.getAllStations();
        if (stations && stations.length > 0) {
          // Transform station data for analytics
          const analyticsData = stations.map((station, index) => ({
            date: new Date(Date.now() - (stations.length - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            pH: station.currentReading?.ph || 7.0,
            temperature: station.currentReading?.temperature || 20.0,
            dissolvedOxygen: station.currentReading?.dissolved_oxygen || 8.0,
            turbidity: station.currentReading?.turbidity || 2.0,
          }));
          setChartData(analyticsData);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [timeRange]);

  // Color scheme for each parameter
  const colors = {
    pH: '#8884d8',
    temperature: '#ff7300',
    dissolvedOxygen: '#82ca9d',
    turbidity: '#ffc658',
  };

  // Optimal ranges for each parameter
  const optimalRanges = {
    pH: { min: 6.5, max: 8.5, unit: '' },
    temperature: { min: 10, max: 25, unit: 'Â°C' },
    dissolvedOxygen: { min: 5, max: 12, unit: 'mg/L' },
    turbidity: { min: 0, max: 5, unit: 'NTU' },
  };

  // Calculate statistics from real data
  const calculateStats = () => {
    if (!chartData || chartData.length === 0) {
      return {
        pH: { avg: 0, min: 0, max: 0, withinOptimal: 0 },
        temperature: { avg: 0, min: 0, max: 0, withinOptimal: 0 },
        dissolvedOxygen: { avg: 0, min: 0, max: 0, withinOptimal: 0 },
        turbidity: { avg: 0, min: 0, max: 0, withinOptimal: 0 }
      };
    }
    
    const stats = {};
    ['pH', 'temperature', 'dissolvedOxygen', 'turbidity'].forEach(param => {
      const values = chartData.map(d => d[param]).filter(v => v != null);
      if (values.length === 0) {
        stats[param] = { avg: 0, min: 0, max: 0, withinOptimal: 0 };
        return;
      }
      
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const withinOptimal = values.filter(v => 
        v >= optimalRanges[param].min && v <= optimalRanges[param].max
      ).length / values.length * 100;
      
      stats[param] = { avg, min, max, withinOptimal };
    });
    return stats;
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Available</h2>
          <p className="text-gray-600">Connect to backend to view water quality analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Water Quality Analytics</h1>
        <p className="text-gray-600 mt-2">Trend analysis for all water quality parameters</p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">Time Range</h3>
          <div className="flex space-x-2">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition ${
                  timeRange === range 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">Chart Type</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded-lg transition ${
                chartType === 'line' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-lg transition ${
                chartType === 'bar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bar Chart
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          All Water Quality Parameters Over Time
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="pH" 
                  stroke={colors.pH} 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="pH Level"
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke={colors.temperature} 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Temperature (Â°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="dissolvedOxygen" 
                  stroke={colors.dissolvedOxygen} 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Dissolved Oxygen (mg/L)"
                />
                <Line 
                  type="monotone" 
                  dataKey="turbidity" 
                  stroke={colors.turbidity} 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Turbidity (NTU)"
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Bar dataKey="pH" fill={colors.pH} name="pH Level" />
                <Bar dataKey="temperature" fill={colors.temperature} name="Temperature (Â°C)" />
                <Bar dataKey="dissolvedOxygen" fill={colors.dissolvedOxygen} name="Dissolved Oxygen (mg/L)" />
                <Bar dataKey="turbidity" fill={colors.turbidity} name="Turbidity (NTU)" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(stats).map(([param, data]) => (
          <div key={param} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">
                {param === 'dissolvedOxygen' ? 'Dissolved Oâ‚‚' : 
                 param.charAt(0).toUpperCase() + param.slice(1)}
              </h3>
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[param] }}
              ></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Average:</span>
                <span className="font-bold text-lg" style={{ color: colors[param] }}>
                  {data.avg.toFixed(2)}{optimalRanges[param].unit}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Range:</span>
                <span className="font-semibold">
                  {data.min.toFixed(1)} - {data.max.toFixed(1)}{optimalRanges[param].unit}
                </span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Within Optimal Range:</span>
                  <span className={`font-semibold ${
                    data.withinOptimal > 80 ? 'text-green-600' : 
                    data.withinOptimal > 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {data.withinOptimal.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${data.withinOptimal}%`,
                      backgroundColor: colors[param]
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Optimal: {optimalRanges[param].min} - {optimalRanges[param].max}{optimalRanges[param].unit}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Detailed Data</h2>
          <p className="text-gray-600 text-sm">Raw measurements for all parameters</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  pH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature (Â°C)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dissolved Oâ‚‚ (mg/L)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turbidity (NTU)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.slice(-10).map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.pH.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.temperature.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.dissolvedOxygen.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.turbidity.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;



