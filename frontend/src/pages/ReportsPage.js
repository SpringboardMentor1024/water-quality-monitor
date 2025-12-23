import React, { useState, useEffect } from 'react';
import Navigation from '../components/layout/Navigation';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    station_id: '',
    ph: '',
    temperature: '',
    turbidity: '',
    dissolved_oxygen: '',
    arsenic: '',
    ecoli: '',
    iron: ''
  });

  // Mock user reports data - replace with API call
  const mockReports = [
    { 
      id: 1, 
      location: 'Hudson River, NY', 
      description: 'Unusual green color and strong odor detected', 
      water_source: 'River', 
      status: 'pending', 
      created_at: '2024-01-15T10:30:00Z',
      photo_url: null
    },
    { 
      id: 2, 
      location: 'Central Park Lake', 
      description: 'High turbidity levels observed after recent rainfall', 
      water_source: 'Lake', 
      status: 'verified', 
      created_at: '2024-01-12T14:20:00Z',
      photo_url: 'https://example.com/sample-photo.jpg'
    },
    { 
      id: 3, 
      location: 'Brooklyn Bridge Water Station', 
      description: 'pH levels seem abnormal, water tastes metallic', 
      water_source: 'Tap Water', 
      status: 'rejected', 
      created_at: '2024-01-10T09:15:00Z',
      photo_url: null
    },
    { 
      id: 4, 
      location: 'Queens Community Well', 
      description: 'Suspected bacterial contamination, multiple residents affected', 
      water_source: 'Well', 
      status: 'verified', 
      created_at: '2024-01-08T16:45:00Z',
      photo_url: 'https://example.com/sample-photo2.jpg'
    }
  ];

  useEffect(() => {
    const loadReports = async () => {
      try {
        // Backend API integration pending
        setReports(mockReports);
      } catch (error) {
        console.error('Failed to load reports:', error);
        setReports(mockReports);
      }
    };
    
    loadReports();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      verified: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      verified: '✅',
      rejected: '❌'
    };
    return icons[status] || '⏳';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend API integration pending
      const newReport = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setReports([newReport, ...reports]);
      setFormData({ station_id: '', ph: '', temperature: '', turbidity: '', dissolved_oxygen: '', arsenic: '', ecoli: '', iron: '' });
      setShowForm(false);
      alert('Reading data submitted successfully! Pending NGO/Admin verification.');
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Water Quality Reports</h1>
            <p className="text-gray-600">Track your submitted reports and their verification status</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>📝</span>
            <span>{showForm ? 'Cancel' : 'Submit Reading Data'}</span>
          </button>
        </div>

        {/* Report Submission Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Reading Data to Station Records</h2>
              <p className="text-sm text-gray-600 mb-4">Submit water quality reading data that will be updated to station records after NGO/Admin verification</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Station ID *
                    </label>
                    <input
                      type="text"
                      name="station_id"
                      required
                      value={formData.station_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., WS001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      pH Level *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="ph"
                      required
                      value={formData.ph}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="7.2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature (°C) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="temperature"
                      required
                      value={formData.temperature}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="22.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Turbidity (NTU) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="turbidity"
                      required
                      value={formData.turbidity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dissolved Oxygen (mg/L) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="dissolved_oxygen"
                      required
                      value={formData.dissolved_oxygen}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="8.2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arsenic (ppb)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="arsenic"
                      value={formData.arsenic}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E.Coli (CFU/100ml)
                    </label>
                    <input
                      type="number"
                      name="ecoli"
                      value={formData.ecoli}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Iron (mg/L)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="iron"
                      value={formData.iron}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.15"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Submit Reading Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Previous Reports</h2>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-yellow-200 rounded-full"></span>
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-green-200 rounded-full"></span>
                  <span>Verified</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-red-200 rounded-full"></span>
                  <span>Rejected</span>
                </div>
              </div>
            </div>
            
            {reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📋</span>
                <p>No reports submitted yet</p>
                <p className="text-sm">Click "Submit New Report" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-2xl">{getStatusIcon(report.status)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{report.location}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                              {report.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>📍 {report.water_source}</span>
                            <span>•</span>
                            <span>📅 {new Date(report.created_at).toLocaleDateString()}</span>
                            {report.photo_url && (
                              <>
                                <span>•</span>
                                <span>📷 Photo attached</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {report.photo_url && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (report.photo_url.startsWith('http')) {
                                window.open(report.photo_url, '_blank');
                              } else {
                                alert('Photo not available - placeholder URL');
                              }
                            }}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                          >
                            View Photo
                          </button>
                        )}
                        <button 
                          onClick={() => alert(`Report ID: ${report.id}\nStatus: ${report.status}\nSubmitted: ${new Date(report.created_at).toLocaleString()}`)}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;