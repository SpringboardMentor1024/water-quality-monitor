import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ReportDetailsPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      setReport({
        id: reportId,
        title: 'Unusual discoloration in river',
        description: 'Brownish water observed near the bridge. Strong odor detected. Fish showing unusual behavior.',
        location: 'Mumbai River, near Willow Creek Bridge',
        latitude: 19.0760,
        longitude: 72.8777,
        status: 'pending',
        severity: 'high',
        submittedBy: 'John Doe',
        submittedDate: '2024-01-18',
        stationId: 'STN-001',
        photos: [],
        notes: 'Report submitted, awaiting field verification.',
        verificationNotes: '',
        assignedTo: null,
        priority: 'high'
      });
      setLoading(false);
    }, 500);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case 'verified': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected': return <XCircle className="h-6 w-6 text-red-500" />;
      default: return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-teal-600 hover:text-teal-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
              <p className="text-gray-600 mt-1">Report ID: {report.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(report.status)}`}>
              {report.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Description</h3>
                  <p className="text-gray-600 mt-1">{report.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Location</h3>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {report.location}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Submitted By</h3>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {report.submittedBy}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Date Submitted</h3>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {report.submittedDate}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Priority</h3>
                    <p className={`mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                      report.priority === 'high' ? 'bg-red-100 text-red-800' :
                      report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {report.priority.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                {report.stationId && (
                  <div>
                    <h3 className="font-medium text-gray-700">Associated Station</h3>
                    <button
                      onClick={() => navigate(`/station/${report.stationId}`)}
                      className="mt-1 text-teal-600 hover:text-teal-800 flex items-center"
                    >
                      Station {report.stationId} â†’
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Updates */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Updates</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-full mr-4">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Report Submitted</h4>
                    <p className="text-sm text-gray-600 mt-1">{report.notes}</p>
                    <p className="text-xs text-gray-500 mt-1">{report.submittedDate}</p>
                  </div>
                </div>
                
                {report.verificationNotes && (
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-full mr-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Verification Update</h4>
                      <p className="text-sm text-gray-600 mt-1">{report.verificationNotes}</p>
                      <p className="text-xs text-gray-500 mt-1">Updated: 2024-01-19</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Current Status</h3>
              <div className="flex items-center">
                {getStatusIcon(report.status)}
                <div className="ml-4">
                  <p className="font-medium">{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</p>
                  <p className="text-sm text-gray-600">Last updated: Today</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700">
                  Update Status
                </button>
                <button className="w-full border border-teal-600 text-teal-600 py-2 px-4 rounded-lg hover:bg-teal-50">
                  Add Notes
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                  Download Report
                </button>
              </div>
            </div>

            {/* Assigned To */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Assigned To</h3>
              {report.assignedTo ? (
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {report.assignedTo.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{report.assignedTo}</p>
                    <p className="text-sm text-gray-600">Environmental Officer</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">Not assigned yet</p>
                  <button className="mt-2 text-teal-600 hover:text-teal-800 text-sm">
                    Assign to team member â†’
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportDetailsPage;
