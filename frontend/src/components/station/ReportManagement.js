import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Eye, Filter, Trash2, Edit2, Plus } from 'lucide-react';

const ReportManagement = ({ stationId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    water_source: '',
    photo_url: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [stationId]);

  const fetchReports = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/reports`);
      if (response.ok) {
        const data = await response.json();
        setReports(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setError('Failed to load reports');
    }
    setLoading(false);
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setSuccess(`Report status updated to ${newStatus}`);
        fetchReports();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update report:', error);
      setError('Failed to update report status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `http://localhost:8000/api/reports/${editingId}` : 'http://localhost:8000/api/reports';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSuccess(editingId ? 'Report updated successfully' : 'Report created successfully');
        setFormData({ location: '', description: '', water_source: '', photo_url: '' });
        setShowForm(false);
        setEditingId(null);
        fetchReports();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to save report:', error);
      setError('Failed to save report');
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:8000/api/reports/${reportId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setSuccess('Report deleted successfully');
          fetchReports();
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (error) {
        console.error('Failed to delete report:', error);
        setError('Failed to delete report');
      }
    }
  };

  const handleEdit = (report) => {
    setFormData({
      location: report.location,
      description: report.description,
      water_source: report.water_source,
      photo_url: report.photo_url || ''
    });
    setEditingId(report.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ location: '', description: '', water_source: '', photo_url: '' });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      verified: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <FileText className="w-4 h-4" />;
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <div className="text-red-600 mr-3">⚠️</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">✕</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <div className="text-green-600 mr-3">✓</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">✕</button>
        </div>
      )}

      {/* Create Report Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">{editingId ? 'Edit Report' : 'Create New Report'}</h4>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Station 001, Riverbend Area"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Source</label>
              <select
                required
                value={formData.water_source}
                onChange={(e) => setFormData({ ...formData, water_source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select water source</option>
                <option value="river">River</option>
                <option value="groundwater">Groundwater</option>
                <option value="lake">Lake</option>
                <option value="tap_water">Tap Water</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Describe the water quality observations, parameters measured, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (optional)</label>
              <input
                type="url"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                {editingId ? 'Update Report' : 'Create Report'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Report Management Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            <h3 className="text-xl font-bold">Report Management</h3>
            <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {filteredReports.length} reports
            </span>
          </div>
          <button
            onClick={() => !showForm && setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {['all', 'pending', 'verified', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded text-sm transition-colors flex-shrink-0 ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No reports found</p>
            <p className="text-sm mb-4">Reports with status "{filter}" will appear here</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create first report
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredReports.map(report => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 flex-shrink-0 ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span>{report.status}</span>
                      </span>
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1 break-words">{report.water_source}</p>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                    <p className="text-xs text-gray-500 flex items-center">📍 {report.location}</p>
                    {report.photo_url && (
                      <a
                        href={report.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-xs"
                      >
                        View photo
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 flex-shrink-0">
                    <button 
                      onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                      className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateReportStatus(report.id, 'verified')}
                          className="text-green-600 hover:text-green-800 p-1 transition-colors"
                          title="Verify"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => updateReportStatus(report.id, 'rejected')}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {(report.status === 'pending' || report.status === 'rejected') && (
                      <button
                        onClick={() => handleEdit(report)}
                        className="text-orange-600 hover:text-orange-800 p-1 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 hover:text-red-800 p-1 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedReport?.id === report.id && (
                  <div className="mt-4 pt-4 border-t bg-gray-50 rounded p-4">
                    <h4 className="font-semibold mb-3">Full Report Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Report ID:</span>
                        <p className="font-medium">{report.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className="font-medium capitalize">{report.status}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">{report.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Water Source:</span>
                        <p className="font-medium capitalize">{report.water_source}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Description:</span>
                        <p className="font-medium">{report.description}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <p className="font-medium">{new Date(report.created_at).toLocaleString()}</p>
                      </div>
                      {report.user_id && (
                        <div>
                          <span className="text-gray-600">User ID:</span>
                          <p className="font-medium">{report.user_id}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportManagement;
