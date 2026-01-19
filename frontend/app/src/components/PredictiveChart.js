// src/components/PredictiveChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PredictiveChart = ({ stationId, parameter = 'pH' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stationId) return;

    setLoading(true);

    axios
      .get(`http://127.0.0.1:8000/predictive/station/${stationId}/trend`, {
        params: { parameter }
      })
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error('Failed to load predictive trend', err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [stationId, parameter]);

  if (loading) {
    return <p className="text-gray-500">Loading predictive trends…</p>;
  }

  if (!data.length) {
    return <p className="text-gray-500">No predictive data available</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">
        Historical vs Predictive Values ({parameter})
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

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
              stroke="#2563eb"
              strokeWidth={2}
              name="Actual"
              dot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#7c3aed"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted"
              dot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="threshold"
              stroke="#dc2626"
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
