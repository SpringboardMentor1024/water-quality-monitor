// src/pages/UserReportsPage.js - ENHANCED VERSION
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Clock, CheckCircle, XCircle, AlertCircle,
  Plus, Filter, Eye, Calendar, MapPin, User, Search,
  Download, Edit, Trash2, ChevronRight, ChevronLeft,
  BarChart3, Upload, Image, AlertTriangle
} from 'lucide-react';
import { reportsAPI } from '../services/api';

const UserReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterAndSearchReports();
  }, [reports, filter, searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const data = await reportsAPI.getReports();
      // setReports(data);
      
      // Mock data for development
      const mockReports = generateMockReports();
      setReports(mockReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockReports = () => {
    return [
      {
        id: 'RPT-001',
        title: 'Unusual discoloration in Mumbai River',
        description: 'Brownish water observed near Mahim Bridge, unusual odor detected',
        location: 'Mumbai River, Mahim Creek',
        coordinates: { lat: 19.045, lng: 72.845 },
        status: 'pending',
        severity: 'high',
        submittedBy: 'John Doe',
        submittedDate: '2024-01-20T10:30:00Z',
        stationId: 'STN-001',
        stationName: 'Riverbend Monitoring Station A',
        waterSource: 'river',
        photos: ['photo1.jpg', 'photo2.jpg'],
        parameters: {
          ph: 6.2,
          temperature: 28.5,
          turbidity: 8.5,
          notes: 'Water appears brown with oily surface'
        },
        adminNotes: 'Awaiting field verification'
      },
      {
        id: 'RPT-002',
        title: 'Foam accumulation at Bangalore Lake',
        description: 'White foam accumulation near eastern shoreline, dead fish observed',
        location: 'Ulsoor Lake, Bangalore',
        coordinates: { lat: 12.981, lng: 77.617 },
        status: 'verified',
        severity: 'medium',
        submittedBy: 'Jane Smith',
        submittedDate: '2024-01-18T14:20:00Z',
        stationId: 'STN-002',
        stationName: 'Lakeview Monitoring Point',
        waterSource: 'lake',
        photos: ['lake-foam.jpg'],
        parameters: {
          ph: 7.8,
          temperature: 24.3,
          turbidity: 4.2,
          notes: 'Chemical odor detected near foam'
        },
        adminNotes: 'Confirmed industrial discharge, investigation ongoing'
      },
      {
        id: 'RPT-003',
        title: 'Low water level in Chennai Reservoir',
        description: 'Water level 40% below seasonal average, affecting supply',
        location: 'Chembarambakkam Reservoir',
        coordinates: { lat: 13.013, lng: 80.074 },
        status: 'verified',
        severity: 'high',
        submittedBy: 'Robert Johnson',
        submittedDate: '2024-01-15T09:15:00Z',
        stationId: 'STN-004',
        stationName: 'Chennai Reservoir Station',
        waterSource: 'reservoir',
        photos: ['reservoir-low.jpg'],
        parameters: {
          ph: 7.0,
          temperature: 26.8,
          turbidity: 2.1,
          notes: 'Concern about drinking water supply'
        },
        adminNotes: 'Verified, escalated to water management board'
      },
      {
        id: 'RPT-004',
        title: 'Oil spill in Delhi Canal',
        description: 'Visible oil slick on water surface, strong petroleum odor',
        location: 'Najafgarh Drain, Delhi',
        coordinates: { lat: 28.613, lng: 77.229 },
        status: 'rejected',
        severity: 'critical',
        submittedBy: 'Priya Sharma',
        submittedDate: '2024-01-12T16:45:00Z',
        stationId: 'STN-005',
        stationName: 'Delhi Canal Monitoring',
        waterSource: 'canal',
        photos: ['oil-spill1.jpg', 'oil-spill2.jpg'],
        parameters: {
          ph: 5.8,
          temperature: 22.5,
          turbidity: 9.8,
          notes: 'Immediate action required'
        },
        adminNotes: 'Duplicate report, already being addressed'
      },
      {
        id: 'RPT-005',
        title: 'Algae bloom in Kolkata Pond',
        description: 'Green algae covering entire pond surface',
        location: 'Rabindra Sarobar, Kolkata',
        coordinates: { lat: 22.508, lng: 88.351 },
        status: 'pending',
        severity: 'medium',
        submittedBy: 'Amit Kumar',
        submittedDate: '2024-01-10T11:20:00Z',
        stationId: 'STN-006',
        stationName: 'Kolkata Pond Station',
        waterSource: 'pond',
        photos: ['algae-bloom.jpg'],
        parameters: {
          ph: 8.2,
          temperature: 29.5,
          turbidity: 6.3,
          notes: 'Potential toxicity concern'
        },
        adminNotes: 'Sample collected for testing'
      }
    ];
  };

  const filterAndSearchReports = () => {
    let results = [...reports];

    // Apply status filter
    if (filter !== 'all') {
      results = results.filter(report => report.status === filter);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(report =>
        report.title.toLowerCase().includes(term) ||
        report.location.toLowerCase().includes(term) ||
        report.id.toLowerCase().includes(term) ||
        report.submittedBy.toLowerCase().includes(term)
      );
    }

    setFilteredReports(results);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const icons = {
      pending: <AlertCircle className="w-3 h-3 mr-1" />,
      verified: <CheckCircle className="w-3 h-3 mr-1" />,
      rejected: <XCircle className="w-3 h-3 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[severity]}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Water Quality Reports</h1>
              <p className="mt-2 text-gray-600">Track and manage user-submitted water quality reports</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                to="/new-report"
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit New Report
              </Link>
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports by title, location, or ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Filter by Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{reports.length}</div>
                <div className="text-sm text-blue-600">Total Reports</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">
                  {reports.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {reports.filter(r => r.status === 'verified').length}
                </div>
                <div className="text-sm text-green-600">Verified</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {reports.filter(r => r.status === 'rejected').length}
                </div>
                <div className="text-sm text-red-600">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReports.length > 0 ? (
                  currentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium text-gray-900">{report.title}</div>
                              <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {report.description}
                              </div>
                              <div className="flex items-center mt-2">
                                <User className="w-3 h-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-600">{report.submittedBy}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{report.location}</div>
                            <div className="text-xs text-gray-500">{report.waterSource}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getStatusBadge(report.status)}
                          {getSeverityBadge(report.severity)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(report.submittedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/report/${report.id}`)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                          {report.status === 'pending' && (
                            <>
                              <button className="inline-flex items-center px-3 py-1 border border-teal-300 rounded text-sm text-teal-700 hover:bg-teal-50">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </button>
                              <button className="inline-flex items-center px-3 py-1 border border-red-300 rounded text-sm text-red-700 hover:bg-red-50">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || filter !== 'all' 
                          ? 'Try adjusting your search or filter'
                          : 'Submit your first water quality report'}
                      </p>
                      <Link
                        to="/new-report"
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Submit New Report
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredReports.length > reportsPerPage && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstReport + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastReport, filteredReports.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredReports.length}</span> reports
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-teal-600 text-white border-teal-600' : 'hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-teal-600" />
              Report Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Response Time</span>
                <span className="font-medium">2.5 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verification Rate</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Critical Reports</span>
                <span className="font-medium text-red-600">12%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Report #RPT-002 verified</div>
                <div className="text-gray-500">2 hours ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New report submitted</div>
                <div className="text-gray-500">5 hours ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Field investigation scheduled</div>
                <div className="text-gray-500">Yesterday</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-blue-600" />
              Photo Reports
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {reports.filter(r => r.photos && r.photos.length > 0).length}
              </div>
              <div className="text-gray-600">Reports with photos</div>
              <div className="text-sm text-gray-500 mt-2">Photos increase verification accuracy by 40%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReportsPage;

