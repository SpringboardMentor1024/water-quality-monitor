import React, { useState, useEffect } from 'react';
import Navigation from '../components/layout/Navigation';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    region: '',
    area: '',
    stationName: '',
    stationId: '',
    waterSource: '',
    status: ''
  });

  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
  const waterSources = ['River', 'Lake', 'Well', 'Tap Water', 'Groundwater', 'Ocean'];
  const statusOptions = ['Active', 'Inactive', 'Maintenance'];

  const mockStations = [
    {
      id: 'WS001',
      name: 'Hudson River Station Alpha',
      location: 'Hudson River, NY',
      region: 'North America',
      area: 'New York',
      waterSource: 'River',
      status: 'Active',
      latitude: 40.7589,
      longitude: -73.9851,
      lastReading: '2024-01-15T14:30:00Z',
      parameters: ['pH', 'Temperature', 'Turbidity', 'DO']
    },
    {
      id: 'WS002',
      name: 'Central Park Lake Monitor',
      location: 'Central Park Lake, NYC',
      region: 'North America',
      area: 'New York',
      waterSource: 'Lake',
      status: 'Active',
      latitude: 40.7829,
      longitude: -73.9654,
      lastReading: '2024-01-15T14:25:00Z',
      parameters: ['pH', 'Temperature', 'Turbidity', 'E.Coli']
    },
    {
      id: 'WS003',
      name: 'Brooklyn Water Treatment',
      location: 'Brooklyn, NY',
      region: 'North America',
      area: 'New York',
      waterSource: 'Tap Water',
      status: 'Active',
      latitude: 40.6782,
      longitude: -73.9442,
      lastReading: '2024-01-15T14:20:00Z',
      parameters: ['pH', 'Chlorine', 'Lead', 'Iron']
    },
    {
      id: 'WS004',
      name: 'Queens Community Well',
      location: 'Queens, NY',
      region: 'North America',
      area: 'New York',
      waterSource: 'Well',
      status: 'Maintenance',
      latitude: 40.7282,
      longitude: -73.7949,
      lastReading: '2024-01-14T16:45:00Z',
      parameters: ['pH', 'Arsenic', 'Iron', 'Bacteria']
    }
  ];

  useEffect(() => {
    // Load initial results
    setSearchResults(mockStations);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Filter mock data based on search criteria
      let filtered = mockStations.filter(station => {
        return (
          (!filters.region || station.region === filters.region) &&
          (!filters.area || station.area.toLowerCase().includes(filters.area.toLowerCase())) &&
          (!filters.stationName || station.name.toLowerCase().includes(filters.stationName.toLowerCase())) &&
          (!filters.stationId || station.id.toLowerCase().includes(filters.stationId.toLowerCase())) &&
          (!filters.waterSource || station.waterSource === filters.waterSource) &&
          (!filters.status || station.status === filters.status)
        );
      });
      
      setSearchResults(filtered);
      
      // Backend API integration pending
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      area: '',
      stationName: '',
      stationId: '',
      waterSource: '',
      status: ''
    });
    setSearchResults(mockStations);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Inactive': 'bg-red-100 text-red-800 border-red-200',
      'Maintenance': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Water Station Search</h1>
          <p className="text-gray-600">Find water monitoring stations by location, type, and status</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Filters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  placeholder="e.g., New York, California"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
                <input
                  type="text"
                  value={filters.stationName}
                  onChange={(e) => handleFilterChange('stationName', e.target.value)}
                  placeholder="Search by station name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station ID</label>
                <input
                  type="text"
                  value={filters.stationId}
                  onChange={(e) => handleFilterChange('stationId', e.target.value)}
                  placeholder="e.g., WS001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Water Source</label>
                <select
                  value={filters.waterSource}
                  onChange={(e) => handleFilterChange('waterSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  {waterSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Stations'}
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({searchResults.length} stations found)
              </h2>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p>No stations found matching your criteria</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((station) => (
                  <div key={station.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{station.name}</h3>
                          <span className="text-sm text-gray-500">ID: {station.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(station.status)}`}>
                            {station.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Location:</span> {station.location}
                          </div>
                          <div>
                            <span className="font-medium">Region:</span> {station.region}
                          </div>
                          <div>
                            <span className="font-medium">Water Source:</span> {station.waterSource}
                          </div>
                          <div>
                            <span className="font-medium">Last Reading:</span> {new Date(station.lastReading).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">Parameters: </span>
                          <div className="inline-flex flex-wrap gap-1 mt-1">
                            {station.parameters.map((param) => (
                              <span key={param} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {param}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => window.location.href = `/stations/${station.id}`}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => alert(`Coordinates: ${station.latitude}, ${station.longitude}`)}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                        >
                          Show on Map
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

export default SearchPage;