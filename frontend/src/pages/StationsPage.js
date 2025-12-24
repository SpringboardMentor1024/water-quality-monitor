import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import stationService from '../services/stationService';
import { 
  MapPin, Activity, Thermometer, Droplets, 
  Gauge, AlertTriangle, Plus, Filter, 
  Search, Download, Eye, Edit, Trash2,
  RefreshCw, BarChart, Clock
} from 'lucide-react';

const StationsPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const stationsData = await stationService.getStations();
      setStations(stationsData);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      // Mock data for demonstration
      setStations([
        {
          id: 'STN-001',
          name: 'Riverbend Station',
          latitude: 28.6139,
          longitude: 77.2090,
          status: 'active',
          currentReading: {
            ph: 7.2,
            turbidity: 1.5,
            dissolved_oxygen: 8.5,
            temperature: 22,
            arsenic: 0.002,
            lead: 0.001
          },
          lastUpdated: '2024-01-20T10:30:00Z',
          reportsCount: 45,
          alertsCount: 2
        },
        {
          id: 'STN-002',
          name: 'Lakeview Point',
          latitude: 28.7041,
          longitude: 77.1025,
          status: 'warning',
          currentReading: {
            ph: 6.8,
            turbidity: 2.1,
            dissolved_oxygen: 7.8,
            temperature: 24,
            arsenic: 0.005,
            lead: 0.003
          },
          lastUpdated: '2024-01-20T09:15:00Z',
          reportsCount: 32,
          alertsCount: 5
        },
        {
          id: 'STN-003',
          name: 'Ganges Monitoring',
          latitude: 25.3176,
          longitude: 83.0058,
          status: 'critical',
          currentReading: {
            ph: 6.2,
            turbidity: 4.2,
            dissolved_oxygen: 6.1,
            temperature: 26,
            arsenic: 0.012,
            lead: 0.008
          },
          lastUpdated: '2024-01-20T08:45:00Z',
          reportsCount: 67,
          alertsCount: 12
        },
        {
          id: 'STN-004',
          name: 'Coastal Watch',
          latitude: 19.0760,
          longitude: 72.8777,
          status: 'active',
          currentReading: {
            ph: 7.4,
            turbidity: 1.2,
            dissolved_oxygen: 8.8,
            temperature: 28,
            arsenic: 0.001,
            lead: 0.0005
          },
          lastUpdated: '2024-01-20T11:00:00Z',
          reportsCount: 23,
          alertsCount: 1
        },
        {
          id: 'STN-005',
          name: 'Mountain Spring',
          latitude: 30.7333,
          longitude: 76.7794,
          status: 'maintenance',
          currentReading: {
            ph: 7.0,
            turbidity: 0.8,
            dissolved_oxygen: 9.2,
            temperature: 18,
            arsenic: 0.0008,
            lead: 0.0003
          },
          lastUpdated: '2024-01-19T16:20:00Z',
          reportsCount: 18,
          alertsCount: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || station.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance': return <RefreshCw className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const exportStations = () => {
    const dataStr = JSON.stringify(stations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'stations-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Water Stations</h1>
            <p className="text-gray-600 mt-2">Monitor and manage all water quality monitoring stations</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportStations}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <Link
              to="/map"
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stations.length}</div>
                <div className="text-gray-600">Total Stations</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stations.filter(s => s.status === 'active').length}
                </div>
                <div className="text-gray-600">Active</div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stations.filter(s => s.status === 'warning').length}
                </div>
                <div className="text-gray-600">Warnings</div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stations.filter(s => s.status === 'critical').length}
                </div>
                <div className="text-gray-600">Critical</div>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stations by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-400 mr-2" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <button
              onClick={fetchStations}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stations Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stations...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Water Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{station.name}</div>
                            <div className="text-sm text-gray-500">{station.id}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {station.latitude.toFixed(4)}°, {station.longitude.toFixed(4)}°
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(station.status)}`}>
                          {getStatusIcon(station.status)}
                          <span className="ml-2 capitalize">{station.status}</span>
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center text-sm">
                          <Droplets className="w-4 h-4 text-blue-500 mr-1" />
                          <span>pH: {station.currentReading?.ph?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Thermometer className="w-4 h-4 text-red-500 mr-1" />
                          <span>{station.currentReading?.temperature?.toFixed(1) || 'N/A'}°C</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Gauge className="w-4 h-4 text-purple-500 mr-1" />
                          <span>DO: {station.currentReading?.dissolved_oxygen?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Activity className="w-4 h-4 text-orange-500 mr-1" />
                          <span>Turb: {station.currentReading?.turbidity?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(station.lastUpdated).toLocaleString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{station.reportsCount || 0}</span> reports
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{station.alertsCount || 0}</span> alerts
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/station/${station.id}`}
                          className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/map?station=${station.id}`}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View on Map"
                        >
                          <MapPin className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                          title="Edit Station"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Station"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredStations.length === 0 && (
          <div className="p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'No stations available'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-teal-600" />
            Station Health Overview
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Active Stations</span>
                <span className="text-sm font-medium">
                  {stations.filter(s => s.status === 'active').length} / {stations.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(stations.filter(s => s.status === 'active').length / stations.length) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Warning Stations</span>
                <span className="text-sm font-medium">
                  {stations.filter(s => s.status === 'warning').length} / {stations.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${(stations.filter(s => s.status === 'warning').length / stations.length) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Critical Stations</span>
                <span className="text-sm font-medium">
                  {stations.filter(s => s.status === 'critical').length} / {stations.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(stations.filter(s => s.status === 'critical').length / stations.length) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Plus className="w-5 h-5 text-gray-400 mr-3" />
                <span>Add New Station</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <Link
              to="/new-report"
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <span>Submit Station Report</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Download className="w-5 h-5 text-gray-400 mr-3" />
                <span>Download Station Data</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Station STN-001 updated</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Critical alert at STN-003</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New report submitted</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for missing icons
const ChevronRight = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const FileText = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default StationsPage;

