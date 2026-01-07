import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const dummyData = [
  { month: 'Jan', pH: 7.2, turbidity: 5, DO: 8, lead: 0.002, arsenic: 0.001 },
  { month: 'Feb', pH: 7.4, turbidity: 6, DO: 8.1, lead: 0.0025, arsenic: 0.0012 },
  { month: 'Mar', pH: 6.9, turbidity: 8, DO: 7.8, lead: 0.003, arsenic: 0.0015 },
  { month: 'Apr', pH: 7.1, turbidity: 7, DO: 7.9, lead: 0.0028, arsenic: 0.0013 },
  { month: 'May', pH: 7.0, turbidity: 9, DO: 7.6, lead: 0.0035, arsenic: 0.0018 },
  { month: 'Jun', pH: 7.3, turbidity: 6, DO: 8.0, lead: 0.002, arsenic: 0.0012 },
  { month: 'Jul', pH: 7.5, turbidity: 5, DO: 8.2, lead: 0.0021, arsenic: 0.001 },
  { month: 'Aug', pH: 7.2, turbidity: 6, DO: 8.1, lead: 0.0023, arsenic: 0.0011 }
];

const AlertTrendsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const station = location.state?.station || 'All Stations';

  return (
    <div className="p-6 w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate('/alerts')}
        className="mb-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
      >
        &larr; Back to Alerts
      </button>

      <h1 className="text-2xl font-semibold mb-6">Historical Trends for {station}</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* pH Levels */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">pH Levels Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dummyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pH" stroke="#4ade80" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Turbidity Levels */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Turbidity Levels Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dummyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="turbidity" stroke="#facc15" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dissolved Oxygen */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Dissolved Oxygen (DO)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dummyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="DO" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Concentration */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Lead Concentration</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dummyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lead" stroke="#a78bfa" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Arsenic Concentration */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-white font-semibold mb-2">Arsenic Concentration</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dummyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="arsenic" stroke="#f87171" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AlertTrendsPage;
