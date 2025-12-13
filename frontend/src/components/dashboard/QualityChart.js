import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const QualityChart = ({ data, selectedLocation }) => {
  // Mock historical data for the chart
  const historicalData = [
    { time: '00:00', ph: 7.2, turbidity: 1.5, dissolved_oxygen: 8.5 },
    { time: '04:00', ph: 7.1, turbidity: 1.8, dissolved_oxygen: 8.2 },
    { time: '08:00', ph: 7.0, turbidity: 2.1, dissolved_oxygen: 7.9 },
    { time: '12:00', ph: 6.9, turbidity: 2.4, dissolved_oxygen: 7.6 },
    { time: '16:00', ph: 7.1, turbidity: 2.0, dissolved_oxygen: 8.0 },
    { time: '20:00', ph: 7.2, turbidity: 1.7, dissolved_oxygen: 8.3 },
  ];

  const currentData = data.map(location => ({
    station: `Station ${location.id}`,
    ph: location.ph,
    turbidity: location.turbidity,
    dissolved_oxygen: location.dissolved_oxygen,
    temperature: location.temperature
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Historical Trends */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">24-Hour Trends</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend fontSize={12} />
            <Line type="monotone" dataKey="ph" stroke="#3b82f6" strokeWidth={2} name="pH Level" />
            <Line type="monotone" dataKey="dissolved_oxygen" stroke="#10b981" strokeWidth={2} name="Dissolved O₂" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Station Comparison */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Current Station Comparison</h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="station" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend fontSize={12} />
            <Bar dataKey="ph" fill="#3b82f6" name="pH Level" />
            <Bar dataKey="turbidity" fill="#f59e0b" name="Turbidity" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QualityChart;