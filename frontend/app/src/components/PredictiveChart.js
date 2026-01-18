//src/components/PredictiveChart.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PredictiveChart = ({ stationId, parameter = 'pH' }) => {
  // Sample data for testing
  const sampleData = [
    { date: '2024-01-01', actual: 7.2, predicted: 7.3, threshold: 8.0 },
    { date: '2024-01-02', actual: 7.3, predicted: 7.4, threshold: 8.0 },
    { date: '2024-01-03', actual: 7.5, predicted: 7.6, threshold: 8.0 },
    { date: '2024-01-04', actual: 7.6, predicted: 7.7, threshold: 8.0 },
    { date: '2024-01-05', actual: 7.8, predicted: 7.9, threshold: 8.0 },
    { date: '2024-01-06', actual: 8.0, predicted: 8.1, threshold: 8.0 },
    { date: '2024-01-07', actual: 8.1, predicted: 8.2, threshold: 8.0 },
  ];

  return (
    <div className="space-y-8">
      <div className="h-80">
        <h3 className="text-lg font-bold mb-4">Historical vs Predictive Values</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: parameter, angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Actual"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="threshold" 
              stroke="#ef4444" 
              strokeWidth={1}
              strokeDasharray="3 3"
              name="Safe Threshold"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictiveChart;