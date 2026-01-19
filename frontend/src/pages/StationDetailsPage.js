import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Droplets, Activity, Gauge, Thermometer, 
  AlertTriangle, TrendingUp, Clock, MapPin, Plus, Trash2, Edit2,
  FileText, X
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ComposedChart
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
  
  // NEW: Report Management States
  const [reports, setReports] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    status: 'pending'
  });
  
  // NEW: Visualization States
  const [parameterData, setParameterData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [predictiveData, setPredictiveData] = useState([]);
  const [activeTab, setActiveTab] = useState('parameters');

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
    // For now, show empty trend data until backend provides historical data
    setTrendData([]);
  }, [timeRange]);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/stations/${stationId}`);
        if (response.ok) {
          const data = await response.json();
          setStation(data);
        } else {
          setStation(null);
        }
      } catch (error) {
        console.error('Failed to fetch station:', error);
        setStation(null);
      }
      setLoading(false);
    };
    
    fetchStation();
  }, [stationId]);

  // NEW: Fetch Reports for this Station
  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
      try {
        const response = await fetch(`http://localhost:8000/api/reports?station_id=${stationId}`);
        if (response.ok) {
          const data = await response.json();
          setReports(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
      setLoadingReports(false);
    };
    
    if (stationId) fetchReports();
  }, [stationId]);

  // NEW: Fetch Visualization Data
  useEffect(() => {
    const fetchVisualizationData = async () => {
      try {
        // Fetch parameter readings
        const readingsResponse = await fetch(`http://localhost:8000/api/stations/${stationId}/readings`);
        if (readingsResponse.ok) {
          const readings = await readingsResponse.json();
          setParameterData(readings || []);
        }
        
        // Fetch alerts
        const alertsResponse = await fetch(`http://localhost:8000/api/alerts?station_id=${stationId}`);
        if (alertsResponse.ok) {
          const alerts = await alertsResponse.json();
          setAlertsData(alerts || []);
        }
        
        // Fetch predictive alerts
        const predictiveResponse = await fetch(`http://localhost:8000/api/predictions?station_id=${stationId}`);
        if (predictiveResponse.ok) {
          const predictions = await predictiveResponse.json();
          setPredictiveData(predictions || []);
        }
      } catch (error) {
        console.error('Failed to fetch visualization data:', error);
      }
    };
    
    if (stationId) fetchVisualizationData();
  }, [stationId]);

  // NEW: Handle Report Operations
  const handleCreateReport = async () => {
    if (!newReport.title.trim()) {
      alert('Please enter a report title');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newReport.title,
          description: newReport.description,
          station_id: parseInt(stationId),
          status: newReport.status
        })
      });
      
      if (response.ok) {
        const created = await response.json();
        setReports([...reports, created]);
        setNewReport({ title: '', description: '', status: 'pending' });
        setShowReportForm(false);
        alert('Report created successfully');
      }
    } catch (error) {
      console.error('Failed to create report:', error);
      alert('Failed to create report');
    }
  };

  const handleUpdateReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingReport.title,
          description: editingReport.description,
          status: editingReport.status
        })
      });
      
      if (response.ok) {
        setReports(reports.map(r => r.id === reportId ? { ...r, ...editingReport } : r));
        setEditingReport(null);
        alert('Report updated successfully');
      }
    } catch (error) {
      console.error('Failed to update report:', error);
      alert('Failed to update report');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${reportId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setReports(reports.filter(r => r.id !== reportId));
        alert('Report deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report');
    }
  };

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
          <div className="text-3xl font-bold">{station.currentReading?.bacteria_concentration}</div>
          <div className="text-sm text-green-600 mt-2">Normal</div>
        </div>
      </div>

      {/* Tabs for Visualization */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('parameters')}
            className={`flex-1 py-4 px-6 text-center font-semibold ${
              activeTab === 'parameters'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Parameter Trends
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-4 px-6 text-center font-semibold ${
              activeTab === 'alerts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Alerts History
          </button>
          <button
            onClick={() => setActiveTab('predictive')}
            className={`flex-1 py-4 px-6 text-center font-semibold ${
              activeTab === 'predictive'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Predictive Alerts
          </button>
        </div>

        <div className="p-6">
          {/* Parameter Trends Chart */}
          {activeTab === 'parameters' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Water Quality Parameter Trends</h3>
              {parameterData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={parameterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="recorded_at" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Value" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  No parameter data available
                </div>
              )}
            </div>
          )}

          {/* Alerts History Chart */}
          {activeTab === 'alerts' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Alerts Timeline</h3>
              {alertsData.length > 0 ? (
                <div className="space-y-4">
                  {alertsData.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 border-l-4 border-red-500 bg-red-50 rounded"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-red-900">{alert.parameter}</h4>
                          <p className="text-sm text-red-700">{alert.description}</p>
                          <p className="text-xs text-red-600 mt-2">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                          alert.severity === 'critical' ? 'bg-red-600' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}>
                          {alert.severity?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  No alerts recorded for this station
                </div>
              )}
            </div>
          )}

          {/* Predictive Alerts */}
          {activeTab === 'predictive' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Predictive Alert Analysis</h3>
              {predictiveData.length > 0 ? (
                <div className="space-y-4">
                  {predictiveData.map((pred) => (
                    <div
                      key={pred.id}
                      className="p-4 border rounded-lg bg-blue-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900">{pred.parameter}</h4>
                          <p className="text-sm text-blue-700 mt-2">
                            Current: {pred.currentValue} | Predicted: {pred.predictedValue}
                          </p>
                          <p className="text-xs text-blue-600 mt-2">
                            Expected date: {pred.expectedDate}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Trend: {pred.trend}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {pred.probability}%
                          </div>
                          <p className="text-xs text-blue-600">Probability</p>
                          <span className={`inline-block mt-2 px-2 py-1 rounded text-white text-xs font-semibold ${
                            pred.riskLevel === 'High' ? 'bg-red-500' : 'bg-green-500'
                          }`}>
                            {pred.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  No predictive data available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Report Management Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-600" />
            Report Management
          </h2>
          <button
            onClick={() => setShowReportForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </button>
        </div>

        {/* Report Form */}
        {showReportForm && (
          <div className="p-6 bg-blue-50 border-b">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Report Title</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder="Enter report title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  placeholder="Enter report description"
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Status</label>
                <select
                  value={newReport.status}
                  onChange={(e) => setNewReport({ ...newReport, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleCreateReport}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create Report
                </button>
                <button
                  onClick={() => {
                    setShowReportForm(false);
                    setNewReport({ title: '', description: '', status: 'pending' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="p-6">
          {loadingReports ? (
            <div className="text-center text-gray-500">Loading reports...</div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg hover:shadow-md transition">
                  {editingReport?.id === report.id ? (
                    // Edit Form
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingReport.title}
                        onChange={(e) => setEditingReport({ ...editingReport, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <textarea
                        value={editingReport.description}
                        onChange={(e) => setEditingReport({ ...editingReport, description: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <select
                        value={editingReport.status}
                        onChange={(e) => setEditingReport({ ...editingReport, status: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="pending">Pending</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                      </select>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateReport(report.id)}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingReport(null)}
                          className="flex-1 px-3 py-2 bg-gray-400 text-white rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <span className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                            report.status === 'approved' ? 'bg-green-500' :
                            report.status === 'submitted' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}>
                            {report.status?.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingReport(report)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No reports yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationDetailsPage;

