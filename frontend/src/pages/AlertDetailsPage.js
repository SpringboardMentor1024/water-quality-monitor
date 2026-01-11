import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { alertsAPI } from '../services/api';

const AlertDetailsPage = () => {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlertDetails();
  }, [alertId]);

  const fetchAlertDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alertsAPI.getAlertById(alertId);
      setAlert(data);
    } catch (err) {
      console.error('Error fetching alert:', err);
      setError('Failed to load alert details');
    } finally {
      setLoading(false);
    }
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      'boil_notice': '🔥',
      'contamination': '☣️',
      'outage': '⚠️'
    };
    return icons[type] || '📢';
  };

  const getAlertTypeColor = (type) => {
    const colors = {
      'boil_notice': 'bg-orange-50 border-orange-500 text-orange-800',
      'contamination': 'bg-red-50 border-red-500 text-red-800',
      'outage': 'bg-yellow-50 border-yellow-500 text-yellow-800'
    };
    return colors[type] || 'bg-blue-50 border-blue-500 text-blue-800';
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alert details...</p>
        </div>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Alert Not Found</h2>
          <p className="text-red-600 mb-4">{error || 'The requested alert could not be found.'}</p>
          <button
            onClick={() => navigate('/alerts')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Back to Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <span className="mr-2">←</span>
          Back to Alerts
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Alert Details</h1>
      </div>

      {/* Alert Card */}
      <div className={`border-l-4 rounded-xl p-6 shadow-lg bg-white mb-6 ${getAlertTypeColor(alert.type)}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <span className="text-4xl mr-4">{getAlertTypeIcon(alert.type)}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {alert.type.replace('_', ' ').toUpperCase()} ALERT
              </h2>
              <p className="text-lg text-gray-600">{alert.location}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Alert ID</div>
            <div className="font-mono text-lg">#{alert.id}</div>
          </div>
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Alert Message</h3>
          <p className="text-gray-700">{alert.message}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Issued At</h4>
            <p className="text-gray-700">{formatDateTime(alert.issued_at)}</p>
          </div>
          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Alert Type</h4>
            <p className="text-gray-700 capitalize">{alert.type.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
          Mark as Resolved
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
          Send Notification
        </button>
        <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold">
          Export Report
        </button>
      </div>

      {/* Related Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-600">Location:</span>
              <span className="ml-2 text-gray-800">{alert.location}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Coordinates:</span>
              <span className="ml-2 text-gray-800 font-mono">N/A</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Affected Area:</span>
              <span className="ml-2 text-gray-800">Estimated radius: 2km</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Response Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></span>
              <span className="text-gray-700">Authorities notified</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></span>
              <span className="text-gray-700">Public alert issued</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-gray-300 rounded-full mr-3"></span>
              <span className="text-gray-500">Investigation pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsPage;