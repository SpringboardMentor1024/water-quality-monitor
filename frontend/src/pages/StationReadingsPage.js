import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StationReadingsPage = () => {
  const { stationId } = useParams();
  const [station, setStation] = useState(null);
  const [readings, setReadings] = useState([]);
  const [timeRange, setTimeRange] = useState('daily');
  const [loading, setLoading] = useState(true);

  const parameters = [
    { key: 'ph', name: 'pH Level', unit: '', safe: [6.5, 8.5], color: 'blue' },
    { key: 'temperature', name: 'Temperature', unit: '°C', safe: [0, 30], color: 'red' },
    { key: 'turbidity', name: 'Turbidity', unit: 'NTU', safe: [0, 4], color: 'yellow' },
    { key: 'dissolved_oxygen', name: 'Dissolved Oxygen', unit: 'mg/L', safe: [5, 14], color: 'green' },
    { key: 'arsenic', name: 'Arsenic', unit: 'ppb', safe: [0, 10], color: 'purple' },
    { key: 'ecoli', name: 'E.Coli', unit: 'CFU/100ml', safe: [0, 0], color: 'orange' },
    { key: 'iron', name: 'Iron', unit: 'mg/L', safe: [0, 0.3], color: 'gray' }
  ];

  useEffect(() => {
    const loadStationData = async () => {
      try {
        setLoading(true);
        // Backend API integration pending
        setStation({
          id: stationId,
          name: `Water Station ${stationId}`,
          location: 'Central Park, NYC',
          latitude: 40.7829,
          longitude: -73.9654,
          managed_by: 'NYC Water Department'
        });
        setReadings(generateMockReadings());
      } catch (error) {
        console.error('Failed to load station data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (stationId) {
      loadStationData();
    }
  }, [stationId, timeRange]);

  const generateMockReadings = () => {
    const now = new Date();
    const readings = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      readings.push({
        recorded_at: time.toISOString(),
        ph: (7.2 + Math.random() * 0.6).toFixed(1),
        temperature: (22 + Math.random() * 8).toFixed(1),
        turbidity: (1.5 + Math.random() * 2).toFixed(1),
        dissolved_oxygen: (8 + Math.random() * 3).toFixed(1),
        arsenic: (Math.random() * 5).toFixed(1),
        ecoli: Math.floor(Math.random() * 10),
        iron: (Math.random() * 0.2).toFixed(2)
      });
    }
    return readings;
  };

  const getParameterStatus = (value, parameter) => {
    const param = parameters.find(p => p.key === parameter);
    if (!param) return 'unknown';
    
    const numValue = parseFloat(value);
    const [min, max] = param.safe;
    
    if (numValue >= min && numValue <= max) return 'safe';
    if (numValue > max * 1.2 || numValue < min * 0.8) return 'critical';
    return 'warning';
  };

  const getStatusColor = (status) => {
    const colors = {
      safe: 'text-green-600 bg-green-50 border-green-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      critical: 'text-red-600 bg-red-50 border-red-200',
      unknown: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[status] || colors.unknown;
  };

  const getChartData = (parameter) => {
    const labels = readings.map(r => new Date(r.recorded_at).toLocaleTimeString());
    const data = readings.map(r => parseFloat(r[parameter]) || 0);
    
    return {
      labels,
      datasets: [
        {
          label: parameters.find(p => p.key === parameter)?.name || parameter,
          data,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const getCurrentReading = (parameter) => {
    if (readings.length === 0) return 'N/A';
    return readings[readings.length - 1][parameter] || 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading station data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Station Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{station?.name}</h1>
                <p className="text-gray-600">📍 {station?.location}</p>
                <p className="text-sm text-gray-500">Managed by: {station?.managed_by}</p>
              </div>
              <div className="flex space-x-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hourly">Last 24 Hours</option>
                  <option value="daily">Last 7 Days</option>
                  <option value="weekly">Last 4 Weeks</option>
                  <option value="monthly">Last 12 Months</option>
                  <option value="yearly">Last 5 Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Current Readings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {parameters.map((param) => {
            const currentValue = getCurrentReading(param.key);
            const status = getParameterStatus(currentValue, param.key);
            
            return (
              <div key={param.key} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">{param.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                    {status.toUpperCase()}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentValue}{param.unit}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Safe range: {param.safe[0]}-{param.safe[1]}{param.unit}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {parameters.map((param) => (
            <div key={param.key} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {param.name} Trend
              </h3>
              <div className="h-64">
                <Line data={getChartData(param.key)} options={chartOptions} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Readings Table */}
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Readings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    {parameters.map((param) => (
                      <th key={param.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {param.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {readings.slice(-10).reverse().map((reading, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(reading.recorded_at).toLocaleString()}
                      </td>
                      {parameters.map((param) => {
                        const value = reading[param.key];
                        const status = getParameterStatus(value, param.key);
                        return (
                          <td key={param.key} className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                              {value}{param.unit}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationReadingsPage;