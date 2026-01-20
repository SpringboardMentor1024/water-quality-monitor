import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, AlertCircle, CheckCircle, XCircle, ArrowRight, Download } from 'lucide-react';
import { reportsAPI } from '../services/api';

const ReportDetailsPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Modal states
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showAddNotes, setShowAddNotes] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('');

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const allReports = await reportsAPI.getAllReports();
      const foundReport = allReports.find(r => r.id === parseInt(reportId));
      
      if (foundReport) {
        setReport(foundReport);
        setNewStatus(foundReport.status || 'pending');
      } else {
        setReport(null);
      }
    } catch (error) {
      setReport(null);
    } finally {
      setLoading(false);
    }
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

  // ACTUAL UPDATE STATUS FUNCTION
  const handleUpdateStatus = async () => {
    if (!newStatus || !report) return;
    
    try {
      setUpdating(true);
      console.log(`Updating status to: ${newStatus} for report ${reportId}`);
      
      // In a real app, you would call an API like:
      // const updatedReport = await reportsAPI.updateReportStatus(reportId, newStatus);
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updatedReport = { ...report, status: newStatus };
      setReport(updatedReport);
      
      // Show success message
      alert(`✅ Status updated to: ${newStatus.toUpperCase()}`);
      
      // Close modal
      setShowUpdateStatus(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // ACTUAL ADD NOTES FUNCTION
  const handleAddNotes = async () => {
    if (!newNotes.trim() || !report) return;
    
    try {
      setUpdating(true);
      console.log(`Adding notes: ${newNotes} to report ${reportId}`);
      
      // In a real app:
      // const updatedReport = await reportsAPI.addNotes(reportId, newNotes);
      
      // For demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updatedReport = { 
        ...report, 
        verificationNotes: newNotes,
        verificationDate: new Date().toISOString().split('T')[0]
      };
      setReport(updatedReport);
      
      alert('✅ Notes added successfully!');
      setNewNotes('');
      setShowAddNotes(false);
    } catch (error) {
      console.error('Error adding notes:', error);
      alert('❌ Failed to add notes. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // ACTUAL ASSIGN FUNCTION
  const handleAssignReport = async () => {
    if (!selectedTeamMember || !report) return;
    
    try {
      setUpdating(true);
      console.log(`Assigning report ${reportId} to: ${selectedTeamMember}`);
      
      // In a real app:
      // const updatedReport = await reportsAPI.assignReport(reportId, selectedTeamMember);
      
      // For demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updatedReport = { ...report, assignedTo: selectedTeamMember };
      setReport(updatedReport);
      
      alert(`✅ Report assigned to: ${selectedTeamMember}`);
      setSelectedTeamMember('');
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error assigning report:', error);
      alert('❌ Failed to assign report. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // ACTUAL DOWNLOAD FUNCTION
  const handleDownloadReport = async () => {
    if (!report) return;
    
    try {
      setDownloading(true);
      console.log(`Downloading report ${reportId}`);
      
      // Option 1: If you have a real API endpoint
      // const response = await reportsAPI.downloadReport(reportId);
      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `report-${reportId}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // window.URL.revokeObjectURL(url);
      
      // Option 2: For demo - generate a sample PDF/text file
      const reportData = `
        WATER QUALITY MONITORING REPORT
        ================================
        
        Report ID: ${report.id}
        Location: ${report.location}
        Submitted By: ${report.submittedBy}
        Date: ${report.submittedDate}
        Status: ${report.status}
        Priority: ${report.priority}
        
        Description:
        ${report.description}
        
        ${report.notes ? `Notes: ${report.notes}` : ''}
        ${report.verificationNotes ? `Verification Notes: ${report.verificationNotes}` : ''}
        
        Generated on: ${new Date().toLocaleDateString()}
        Water Quality Monitoring System
      `;
      
      const blob = new Blob([reportData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `water-quality-report-${reportId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert(`✅ Report downloaded successfully!\n\nFile: water-quality-report-${reportId}.txt`);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('❌ Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
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

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-4">The requested report could not be loaded.</p>
          <p className="text-sm text-gray-500">Report ID: {reportId}</p>
          <button
            onClick={() => navigate('/reports')}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Back to Reports
          </button>
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
              <h1 className="text-2xl font-bold text-gray-900">
                Report from {report.location || 'Unknown Location'}
              </h1>
              <p className="text-gray-600 mt-1">Report ID: {reportId}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(report.status || 'pending')}`}>
              {(report.status || 'pending').toUpperCase()}
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
                      {(report.priority || 'medium').toUpperCase()}
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
                      Station {report.stationId}
                      <ArrowRight className="inline h-4 w-4 ml-1" />
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
                      <p className="text-xs text-gray-500 mt-1">
                        Updated: {report.verificationDate || '2024-01-19'}
                      </p>
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
                  <p className="font-medium">{(report.status || 'pending').charAt(0).toUpperCase() + (report.status || 'pending').slice(1)}</p>
                  <p className="text-sm text-gray-600">Last updated: Today</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setShowUpdateStatus(true)}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 flex items-center justify-center"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </button>
                <button
                  onClick={() => setShowAddNotes(true)}
                  className="w-full border border-teal-600 text-teal-600 py-2 px-4 rounded-lg hover:bg-teal-50"
                >
                  Add Notes
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </>
                  )}
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
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="mt-2 text-teal-600 hover:text-teal-800 text-sm flex items-center justify-center"
                  >
                    Assign to team member
                    <ArrowRight className="inline h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Update Status */}
      {showUpdateStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <p className="text-gray-600 mb-4">Select new status for report #{reportId}</p>
            
            <div className="space-y-2 mb-6">
              {['pending', 'verified', 'rejected'].map((status) => (
                <button 
                  key={status}
                  onClick={() => setNewStatus(status)}
                  className={`w-full text-left p-3 border rounded-lg transition-colors ${
                    newStatus === status 
                      ? status === 'pending' ? 'bg-yellow-50 border-yellow-300' :
                        status === 'verified' ? 'bg-green-50 border-green-300' :
                        'bg-red-50 border-red-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`font-medium ${
                    status === 'pending' ? 'text-yellow-600' :
                    status === 'verified' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <p className="text-sm text-gray-500">
                    {status === 'pending' ? 'Waiting for verification' :
                     status === 'verified' ? 'Report has been verified' :
                     'Report has been rejected'}
                  </p>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus || updating}
                className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
              <button
                onClick={() => setShowUpdateStatus(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add Notes */}
      {showAddNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Notes</h3>
            <p className="text-gray-600 mb-4">Add notes for report #{reportId}</p>
            
            <textarea 
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              rows="4" 
              placeholder="Enter your notes here..."
            />
            
            <div className="flex space-x-3">
              <button
                onClick={handleAddNotes}
                disabled={!newNotes.trim() || updating}
                className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Notes'
                )}
              </button>
              <button
                onClick={() => {
                  setShowAddNotes(false);
                  setNewNotes('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Assign */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign to Team Member</h3>
            <p className="text-gray-600 mb-4">Select team member for report #{reportId}</p>
            
            <div className="space-y-2 mb-6">
              {['John Smith', 'Sarah Johnson', 'Michael Chen'].map((member) => (
                <button 
                  key={member}
                  onClick={() => setSelectedTeamMember(member)}
                  className={`w-full text-left p-3 border rounded-lg transition-colors ${
                    selectedTeamMember === member 
                      ? 'bg-teal-50 border-teal-300' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{member}</span>
                  <p className="text-sm text-gray-500">
                    {member === 'John Smith' ? 'Environmental Officer' :
                     member === 'Sarah Johnson' ? 'Quality Analyst' :
                     'Field Inspector'}
                  </p>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleAssignReport}
                disabled={!selectedTeamMember || updating}
                className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Assigning...
                  </>
                ) : (
                  'Assign Report'
                )}
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTeamMember('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailsPage;