import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const QualityChart = ({ data, selectedLocation }) => {
  // Generate chart data from real backend data
  const currentData = data.map(location => ({
    station: `Station ${location.id}`,
    ph: location.ph,
    turbidity: location.turbidity,
    dissolved_oxygen: location.dissolved_oxygen,
    temperature: location.temperature
  }));

  // If no data available, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Water Quality Trends</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600">No data available</p>
          <p className="text-sm text-gray-500">Connect to backend to view charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Water Quality Trends</h2>
      
      <div className="space-y-4 sm:space-y-6">
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
    </div>
  );
};

export default QualityChart;