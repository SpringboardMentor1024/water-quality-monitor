import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Droplets, Activity, Gauge, Thermometer, 
  AlertTriangle, TrendingUp, Clock, MapPin 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const StationDetailsPage = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  
  // STATES - ONLY ONE trendData declaration!
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRealTime, setIsRealTime] = useState(true);
  const [timeRange, setTimeRange] = useState('daily');
  const [trendData, setTrendData] = useState([]);

  // Real-time updates every 5 seconds (5000ms)
  useEffect(() => {
    if (!isRealTime || !station) return;
    
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isRealTime, station]);

  // Generate trend data based on time range
  useEffect(() => {
    const generateData = () => {
      const data = [];
      let points = 24; // daily
      
      if (timeRange === 'weekly') points = 7 * 24;
      if (timeRange === 'monthly') points = 30 * 24;
      
      for (let i = 0; i < points; i++) {
        data.push({
          hour: `Point ${i+1}`,
          ph: 6.5 + Math.random() * 2,
          turbidity: 3 + Math.random() * 7,
          dissolvedOxygen: 4 + Math.random() * 6,
          temperature: 20 + Math.random() * 10
        });
      }
      return data;
    };
    
    setTrendData(generateData());
  }, [timeRange]);

  // Mock station data
  useEffect(() => {
    setTimeout(() => {
      setStation({
        id: stationId,
        name: 'Ganga River Station',
        location: 'Haridwar, Uttarakhand',
        status: 'active',
        currentReading: {
          ph: 7.2,
          turbidity: 2.1,
          dissolved_oxygen: 8.3,
          temperature: 24.5,
          bacteriaConcentration: 120
        }
      });
      setLoading(false);
    }, 1000);
  }, [stationId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading station data...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Station Not Found</h2>
          <p className="mb-6">Station with ID "{stationId}" was not found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Station: {station.name}</h1>
            <p className="text-gray-600">{station.location}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className="px-3 py-1 bg-gray-100 rounded text-sm"
            >
              {isRealTime ? 'Pause' : 'Resume'}
            </button>
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        </div>
      </div>

      {/* Water Quality Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <Droplets className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold">pH Level</h3>
          </div>
          <div className="text-3xl font-bold">{station.currentReading?.ph?.toFixed(2)}</div>
          <div className="text-sm text-green-600 mt-2">Normal</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <Thermometer className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold">Temperature</h3>
          </div>
          <div className="text-3xl font-bold">{station.currentReading?.temperature?.toFixed(1)}°C</div>
          <div className="text-sm text-green-600 mt-2">Normal</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <Gauge className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold">Dissolved Oxygen</h3>
          </div>
          <div className="text-3xl font-bold">{station.currentReading?.dissolved_oxygen?.toFixed(1)} mg/L</div>
          <div className="text-sm text-green-600 mt-2">Normal</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-semibold">Bacteria</h3>
          </div>
          <div className="text-3xl font-bold">{station.currentReading?.bacteriaConcentration}</div>
          <div className="text-sm text-green-600 mt-2">Normal</div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Trend Analysis</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-4 py-2 rounded ${timeRange === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 rounded ${timeRange === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 rounded ${timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Showing {timeRange} trends for {station.name}
        </p>
      </div>

      {/* Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ph" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="dissolved_oxygen" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StationDetailsPage;

