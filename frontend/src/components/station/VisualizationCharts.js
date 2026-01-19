import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Activity, Droplets, Clock } from 'lucide-react';

const VisualizationCharts = ({ stationId, timeRange = 'daily' }) => {
  const [parameterData, setParameterData] = useState([]);
  const [alertData, setAlertData] = useState([]);
  const [predictiveData, setPredictiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [stationId, timeRange]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch station readings - ONLY REAL API DATA
      const readingsRes = await fetch(`http://localhost:8000/api/stations/${stationId}/readings`);
      if (!readingsRes.ok) {
        throw new Error(`Readings API error: ${readingsRes.status}`);
      }
      const readings = await readingsRes.json();
      processParameterData(readings);

      // Fetch alerts data - ONLY REAL API DATA
      const alertsRes = await fetch(`http://localhost:8000/api/alerts?station=${stationId}`);
      if (alertsRes.ok) {
        const alerts = await alertsRes.json();
        processAlertData(alerts);
      } else {
        // If alerts endpoint fails, show error
        console.error('Alerts API error:', alertsRes.status);
        setAlertData([]);
      }

      // Fetch predictive alerts - ONLY REAL API DATA
      const predictiveRes = await fetch(`http://localhost:8000/api/predictive-alerts?station=${stationId}`);
      if (predictiveRes.ok) {
        const predictive = await predictiveRes.json();
        setPredictiveData(predictive || []);
      } else {
        // If predictive endpoint fails, show error
        console.error('Predictive alerts API error:', predictiveRes.status);
        setPredictiveData([]);
      }
    } catch (error) {
      console.error('Data fetch error:', error);
      setError(`Error loading data: ${error.message}`);
      // Do NOT fall back to mock data - report the error instead
      setParameterData([]);
      setAlertData([]);
      setPredictiveData([]);
    }
    setLoading(false);
  };

  const processParameterData = (readings) => {
    if (!readings || readings.length === 0) {
      setParameterData([]);
      return;
    }

    const grouped = {};
    readings.forEach(reading => {
      const date = new Date(reading.recorded_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { date, pH: [], temperature: [], DO: [], bacteria: [], turbidity: [] };
      }
      const param = reading.parameter.toLowerCase();
      if (grouped[date][param]) {
        grouped[date][param].push(parseFloat(reading.value));
      }
    });

    const chartData = Object.values(grouped).map(day => ({
      date: day.date,
      pH: day.pH.length ? (day.pH.reduce((a, b) => a + b, 0) / day.pH.length).toFixed(2) : null,
      temperature: day.temperature.length ? (day.temperature.reduce((a, b) => a + b, 0) / day.temperature.length).toFixed(1) : null,
      DO: day.DO.length ? (day.DO.reduce((a, b) => a + b, 0) / day.DO.length).toFixed(1) : null,
      bacteria: day.bacteria.length ? (day.bacteria.reduce((a, b) => a + b, 0) / day.bacteria.length).toFixed(0) : null,
      turbidity: day.turbidity.length ? (day.turbidity.reduce((a, b) => a + b, 0) / day.turbidity.length).toFixed(1) : null
    }));

    setParameterData(chartData);
  };

  const processAlertData = (alerts) => {
    if (!alerts || alerts.length === 0) {
      setAlertData([]);
      return;
    }

    const grouped = {};
    alerts.forEach(alert => {
      const date = new Date(alert.issued_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { date, alerts: 0, predictive: 0 };
      }
      grouped[date].alerts++;
      if (alert.is_predictive) grouped[date].predictive++;
    });

    setAlertData(Object.values(grouped));
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading visualization data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">{error}</p>
            <p className="text-xs text-amber-600 mt-1">Displaying sample data</p>
          </div>
        </div>
      )}

      {/* Metric Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Parameter:</label>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {['all', 'pH', 'temperature', 'DO', 'bacteria', 'turbidity'].map(metric => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedMetric === metric
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {metric === 'all' ? 'All Parameters' : metric.charAt(0).toUpperCase() + metric.slice(1).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Water Parameters Chart */}
      {(selectedMetric === 'all' || ['pH', 'temperature', 'DO'].includes(selectedMetric)) && parameterData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold">Water Quality Parameters Trend</h3>
            </div>
            <span className="text-sm text-gray-500">{timeRange}</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={parameterData} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
              <Legend />
              {(selectedMetric === 'all' || selectedMetric === 'pH') && (
                <Line type="monotone" dataKey="pH" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="pH Level" />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'temperature') && (
                <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} name="Temperature (°C)" />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'DO') && (
                <Line type="monotone" dataKey="DO" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Dissolved Oxygen (mg/L)" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bacteria & Turbidity Chart */}
      {(selectedMetric === 'all' || ['bacteria', 'turbidity'].includes(selectedMetric)) && parameterData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Droplets className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-xl font-bold">Contamination Indicators Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={parameterData} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
              <Legend />
              {(selectedMetric === 'all' || selectedMetric === 'bacteria') && (
                <Area type="monotone" dataKey="bacteria" stroke="#f59e0b" fill="#fbbf24" name="Bacteria (CFU/100ml)" />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'turbidity') && (
                <Area type="monotone" dataKey="turbidity" stroke="#8b5cf6" fill="#a78bfa" name="Turbidity (NTU)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alerts & Predictive Alerts Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-xl font-bold">Alerts & Predictive Alerts</h3>
        </div>
        {alertData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={alertData} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
              <Legend />
              <Bar dataKey="alerts" fill="#ef4444" name="Active Alerts" radius={[8, 8, 0, 0]} />
              <Bar dataKey="predictive" fill="#f59e0b" name="Predictive Alerts" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No alerts data available</p>
          </div>
        )}
      </div>

      {/* Predictive Alerts Details */}
      {predictiveData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-xl font-bold">Predictive Alerts Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveData.map(alert => (
              <div key={alert.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-600 rounded-full mr-2 mt-1"></div>
                    <h4 className="font-semibold text-gray-900">{alert.parameter}</h4>
                  </div>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    {(alert.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Predicted Value:</span>
                    <p className="font-medium text-orange-700">{alert.predicted_value}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Threshold:</span>
                    <p className="font-medium text-red-700">{alert.threshold}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Readings</p>
              <p className="text-3xl font-bold text-blue-900">{parameterData.length}</p>
            </div>
            <Activity className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Active Alerts</p>
              <p className="text-3xl font-bold text-red-900">
                {alertData.reduce((sum, d) => sum + (d.alerts || 0), 0)}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Predictive Alerts</p>
              <p className="text-3xl font-bold text-orange-900">
                {predictiveData.length}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationCharts;


