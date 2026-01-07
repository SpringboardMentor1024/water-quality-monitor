import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stationsAPI } from '../services/api';

const StationReadingsPage = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    fetchStationData();
  }, [stationId]);

  const fetchStationData = async () => {
    try {
      setLoading(true);
      const [stationData, readingsData] = await Promise.all([
        stationsAPI.getStationById(stationId),
        stationsAPI.getStationReadings(stationId)
      ]);
      setStation(stationData);
      setReadings(readingsData);
    } catch (error) {
      console.error('Error fetching station data:', error);
      // Mock data for demo
      setStation({
        id: stationId,
        name: 'Demo Water Station',
        location: 'Sample Location',
        managed_by: 'Demo Authority'
      });
      setReadings([
        { id: 1, parameter: 'pH', value: 7.2, recorded_at: new Date().toISOString() },
        { id: 2, parameter: 'turbidity', value: 2.5, recorded_at: new Date().toISOString() },
        { id: 3, parameter: 'DO', value: 8.1, recorded_at: new Date().toISOString() },
        { id: 4, parameter: 'temperature', value: 22.5, recorded_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getParameterInfo = (parameter) => {
    const info = {
      pH: { name: 'pH Level', unit: '', icon: '🧪', safe: [6.5, 8.5] },
      turbidity: { name: 'Turbidity', unit: 'NTU', icon: '🌊', safe: [0, 4] },
      DO: { name: 'Dissolved Oxygen', unit: 'mg/L', icon: '💨', safe: [5, 14] },
      temperature: { name: 'Temperature', unit: '°C', icon: '🌡️', safe: [0, 30] },
      lead: { name: 'Lead', unit: 'ppb', icon: '⚠️', safe: [0, 15] },
      arsenic: { name: 'Arsenic', unit: 'ppb', icon: '☠️', safe: [0, 10] }
    };
    return info[parameter] || { name: parameter, unit: '', icon: '📊', safe: [0, 100] };
  };

  const getStatusColor = (parameter, value) => {
    const info = getParameterInfo(parameter);
    const [min, max] = info.safe;
    if (value >= min && value <= max) return 'text-green-600 bg-green-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading station data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/stations')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <span className="mr-2">←</span>
          Back to Stations
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{station?.name}</h1>
        <p className="text-gray-600">{station?.location}</p>
        <p className="text-sm text-gray-500">Managed by: {station?.managed_by}</p>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-700">Time Range:</span>
          {['1h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {readings.map((reading) => {
          const info = getParameterInfo(reading.parameter);
          return (
            <div key={reading.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{info.icon}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(reading.parameter, reading.value)}`}>
                  {reading.value >= info.safe[0] && reading.value <= info.safe[1] ? 'SAFE' : 'ALERT'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{info.name}</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {reading.value} {info.unit}
              </div>
              <p className="text-xs text-gray-500">
                Safe range: {info.safe[0]}-{info.safe[1]} {info.unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trends ({timeRange})</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {readings.slice(0, 4).map((reading) => {
            const info = getParameterInfo(reading.parameter);
            return (
              <div key={reading.parameter} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">{info.icon}</span>
                  {info.name}
                </h3>
                <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-3xl mb-2">📈</div>
                    <p className="text-sm">Chart visualization</p>
                    <p className="text-xs">Current: {reading.value} {info.unit}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Readings Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Recent Readings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {readings.map((reading) => {
                const info = getParameterInfo(reading.parameter);
                const isNormal = reading.value >= info.safe[0] && reading.value <= info.safe[1];
                return (
                  <tr key={reading.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{info.icon}</span>
                        {info.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {reading.value} {info.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        isNormal ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                      }`}>
                        {isNormal ? 'Normal' : 'Alert'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reading.recorded_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StationReadingsPage;