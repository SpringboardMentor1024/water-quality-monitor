import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function FlyToLocation({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 2
      });
    }
  }, [center, zoom, map]);
  return null;
}

const createCustomIcon = (status) => {
  const colors = {
    'Active': '#10B981', // green
    'Inactive': '#6B7280', // gray
    'Maintenance': '#F59E0B', // yellow
    'Offline': '#EF4444' // red
  };
  
  return L.divIcon({
    html: `<div style="background-color:${colors[status] || '#6B7280'}; width:20px; height:20px; border-radius:50%; border:2px solid white; box-shadow:0 0 6px rgba(0,0,0,0.5); cursor:pointer;"></div>`,
    iconSize: [24, 24],
    className: 'custom-marker'
  });
};

const EnhancedBaseMap = ({ onStationSelect }) => {
  const defaultCenter = [20.5937, 78.9629];
  const defaultZoom = 5;
  const [flyToCenter, setFlyToCenter] = useState(defaultCenter);
  const [flyToZoom, setFlyToZoom] = useState(defaultZoom);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states with active category
  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({
    region: 'all',
    status: 'all',
    waterSource: 'all'
  });

  // Available filter options
  const filterOptions = {
    regions: ['North India', 'South India', 'East India', 'West India', 'Central India', 'Coastal Areas', 'Himalayan Region'],
    statuses: ['Active', 'Inactive', 'Maintenance', 'Offline'],
    waterSources: ['River', 'Lake', 'Groundwater', 'Reservoir', 'Canal', 'Rainwater', 'Treatment Plant']
  };

  // Region centers for auto-navigation
  const regionCenters = {
    'North India': [28.6139, 77.2090],
    'South India': [12.9716, 77.5946],
    'East India': [22.5726, 88.3639],
    'West India': [19.0760, 72.8777],
    'Central India': [23.2599, 77.4126],
    'Coastal Areas': [15.2993, 74.1240],
    'Himalayan Region': [30.0668, 79.0193]
  };

  // Water station data
  const allStations = [
    // North India Stations
    { id: 1, name: 'Ganges River Station', lat: 25.3176, lng: 83.0058, 
      region: 'North India', status: 'Active', waterSource: 'River',
      ph: 7.2, turbidity: 2.1, dissolvedOxygen: 8.2, temperature: 22,
      address: 'Varanasi, Uttar Pradesh', lastUpdated: '2025-12-24 10:30 AM' },
    
    { id: 2, name: 'Yamuna Monitoring Point', lat: 28.6139, lng: 77.2090, 
      region: 'North India', status: 'Active', waterSource: 'River',
      ph: 6.8, turbidity: 3.5, dissolvedOxygen: 6.8, temperature: 24,
      address: 'Delhi', lastUpdated: '2025-12-24 09:45 AM' },
    
    { id: 3, name: 'Dal Lake Station', lat: 34.0884, lng: 74.8064, 
      region: 'North India', status: 'Maintenance', waterSource: 'Lake',
      ph: 7.4, turbidity: 1.8, dissolvedOxygen: 9.1, temperature: 18,
      address: 'Srinagar, Jammu & Kashmir', lastUpdated: '2025-12-24 11:15 AM' },
    
    // South India Stations
    { id: 4, name: 'Kaveri River Monitoring', lat: 12.2608, lng: 76.3699, 
      region: 'South India', status: 'Active', waterSource: 'River',
      ph: 7.6, turbidity: 1.2, dissolvedOxygen: 9.5, temperature: 26,
      address: 'Mysuru, Karnataka', lastUpdated: '2025-12-24 08:20 AM' },
    
    { id: 5, name: 'Chembarambakkam Plant', lat: 13.0827, lng: 80.2707, 
      region: 'South India', status: 'Active', waterSource: 'Treatment Plant',
      ph: 7.1, turbidity: 0.8, dissolvedOxygen: 8.8, temperature: 28,
      address: 'Chennai, Tamil Nadu', lastUpdated: '2025-12-24 10:00 AM' },
    
    { id: 6, name: 'Hussain Sagar Lake', lat: 17.4239, lng: 78.4738, 
      region: 'South India', status: 'Inactive', waterSource: 'Lake',
      ph: 6.5, turbidity: 4.2, dissolvedOxygen: 5.2, temperature: 27,
      address: 'Hyderabad, Telangana', lastUpdated: '2025-12-24 09:30 AM' },
    
    // East India Stations
    { id: 7, name: 'Hooghly River Station', lat: 22.5726, lng: 88.3639, 
      region: 'East India', status: 'Active', waterSource: 'River',
      ph: 6.9, turbidity: 3.1, dissolvedOxygen: 7.1, temperature: 25,
      address: 'Kolkata, West Bengal', lastUpdated: '2025-12-24 10:45 AM' },
    
    { id: 8, name: 'Brahmaputra Monitoring', lat: 26.7499, lng: 94.2023, 
      region: 'East India', status: 'Active', waterSource: 'River',
      ph: 7.3, turbidity: 2.4, dissolvedOxygen: 8.5, temperature: 23,
      address: 'Dibrugarh, Assam', lastUpdated: '2025-12-24 11:00 AM' },
    
    // West India Stations
    { id: 9, name: 'Arabian Sea Coast', lat: 19.0760, lng: 72.8777, 
      region: 'West India', status: 'Active', waterSource: 'Groundwater',
      ph: 6.2, turbidity: 5.1, dissolvedOxygen: 4.8, temperature: 29,
      address: 'Mumbai, Maharashtra', lastUpdated: '2025-12-24 10:15 AM' },
    
    { id: 10, name: 'Sabarmati River Plant', lat: 23.0225, lng: 72.5714, 
      region: 'West India', status: 'Offline', waterSource: 'River',
      ph: 6.4, turbidity: 3.8, dissolvedOxygen: 5.9, temperature: 26,
      address: 'Ahmedabad, Gujarat', lastUpdated: '2025-12-23 03:30 PM' },
    
    // Central India Stations
    { id: 11, name: 'Godavari River Station', lat: 19.9615, lng: 73.7898, 
      region: 'Central India', status: 'Active', waterSource: 'River',
      ph: 7.2, turbidity: 2.2, dissolvedOxygen: 8.3, temperature: 25,
      address: 'Nashik, Maharashtra', lastUpdated: '2025-12-24 09:00 AM' },
    
    { id: 12, name: 'Narmada Monitoring', lat: 22.9734, lng: 78.6569, 
      region: 'Central India', status: 'Active', waterSource: 'River',
      ph: 7.8, turbidity: 0.9, dissolvedOxygen: 9.8, temperature: 24,
      address: 'Jabalpur, Madhya Pradesh', lastUpdated: '2025-12-24 10:30 AM' },
    
    // Coastal Areas Stations
    { id: 13, name: 'Coastal Rainwater', lat: 8.0883, lng: 77.5385, 
      region: 'Coastal Areas', status: 'Active', waterSource: 'Rainwater',
      ph: 7.5, turbidity: 0.5, dissolvedOxygen: 10.2, temperature: 30,
      address: 'Kanyakumari, Tamil Nadu', lastUpdated: '2025-12-24 11:30 AM' },
    
    // Himalayan Region Stations
    { id: 14, name: 'Himalayan Spring', lat: 30.0668, lng: 79.0193, 
      region: 'Himalayan Region', status: 'Active', waterSource: 'Groundwater',
      ph: 7.9, turbidity: 0.3, dissolvedOxygen: 10.5, temperature: 15,
      address: 'Joshimath, Uttarakhand', lastUpdated: '2025-12-24 08:45 AM' },
    
    { id: 15, name: 'River Canal Station', lat: 20.2961, lng: 85.8245, 
      region: 'East India', status: 'Active', waterSource: 'Canal',
      ph: 7.0, turbidity: 1.5, dissolvedOxygen: 7.8, temperature: 26,
      address: 'Bhubaneswar, Odisha', lastUpdated: '2025-12-24 09:15 AM' },
    
    { id: 16, name: 'Reservoir Monitoring', lat: 18.5204, lng: 73.8567, 
      region: 'West India', status: 'Active', waterSource: 'Reservoir',
      ph: 7.3, turbidity: 1.1, dissolvedOxygen: 8.9, temperature: 27,
      address: 'Pune, Maharashtra', lastUpdated: '2025-12-24 10:20 AM' }
  ];

  // Apply all filters
  const filteredStations = allStations.filter(station => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.waterSource.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Region filter
    const matchesRegion = filters.region === 'all' || 
      station.region === filters.region;
    
    // Status filter
    const matchesStatus = filters.status === 'all' || 
      station.status === filters.status;
    
    // Water source filter
    const matchesWaterSource = filters.waterSource === 'all' || 
      station.waterSource === filters.waterSource;
    
    return matchesSearch && matchesRegion && matchesStatus && matchesWaterSource;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // Auto-center map based on filter
    if (filterType === 'region' && value !== 'all' && regionCenters[value]) {
      setFlyToCenter(regionCenters[value]);
      setFlyToZoom(7);
    } else if (filterType === 'status' && value !== 'all') {
      // Center on first station with this status
      const stationWithStatus = allStations.find(s => s.status === value);
      if (stationWithStatus) {
        setFlyToCenter([stationWithStatus.lat, stationWithStatus.lng]);
        setFlyToZoom(9);
      }
    } else if (filterType === 'waterSource' && value !== 'all') {
      // Center on first station with this water source
      const stationWithSource = allStations.find(s => s.waterSource === value);
      if (stationWithSource) {
        setFlyToCenter([stationWithSource.lat, stationWithSource.lng]);
        setFlyToZoom(9);
      }
    } else if (value === 'all') {
      // Reset to default view
      setFlyToCenter(defaultCenter);
      setFlyToZoom(defaultZoom);
    }
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
    setFlyToCenter([station.lat, station.lng]);
    setFlyToZoom(12);
    if (onStationSelect) {
      onStationSelect(station);
    }
  };

  const resetFilters = () => {
    setFilters({
      region: 'all',
      status: 'all',
      waterSource: 'all'
    });
    setSearchQuery('');
    setActiveFilter(null);
    setFlyToCenter(defaultCenter);
    setFlyToZoom(defaultZoom);
  };

  return (
    <div className="flex h-[650px] rounded-xl overflow-hidden shadow-lg">
      {/* Left Panel - Search and Filters */}
      <div className="w-1/3 bg-white p-6 overflow-y-auto border-r">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Search Water Stations</h3>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stations by name, location, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-500">
              Found {filteredStations.length} station{filteredStations.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.region !== 'all' && (
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                Region: {filters.region} ✕
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Status: {filters.status} ✕
              </span>
            )}
            {filters.waterSource !== 'all' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Source: {filters.waterSource} ✕
              </span>
            )}
          </div>
        </div>

        {/* Horizontal Filter Categories */}
        <div className="space-y-6">
          {/* Region Filter */}
          <div>
            <button
              onClick={() => setActiveFilter(activeFilter === 'region' ? null : 'region')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 mb-2"
            >
              <span className="font-semibold text-gray-700">🌍 Filter by Region</span>
              <span>{activeFilter === 'region' ? '▲' : '▼'}</span>
            </button>
            
            {activeFilter === 'region' && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                <button
                  onClick={() => handleFilterChange('region', 'all')}
                  className={`px-4 py-2 rounded-lg ${
                    filters.region === 'all' 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Regions
                </button>
                {filterOptions.regions.map(region => (
                  <button
                    key={region}
                    onClick={() => handleFilterChange('region', region)}
                    className={`px-4 py-2 rounded-lg ${
                      filters.region === region
                        ? 'bg-teal-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <button
              onClick={() => setActiveFilter(activeFilter === 'status' ? null : 'status')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 mb-2"
            >
              <span className="font-semibold text-gray-700">⚡ Filter by Status</span>
              <span>{activeFilter === 'status' ? '▲' : '▼'}</span>
            </button>
            
            {activeFilter === 'status' && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className={`px-4 py-2 rounded-lg ${
                    filters.status === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Status
                </button>
                {filterOptions.statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange('status', status)}
                    className={`px-4 py-2 rounded-lg ${
                      filters.status === status
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Water Source Filter */}
          <div>
            <button
              onClick={() => setActiveFilter(activeFilter === 'waterSource' ? null : 'waterSource')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 mb-2"
            >
              <span className="font-semibold text-gray-700">💧 Filter by Water Source</span>
              <span>{activeFilter === 'waterSource' ? '▲' : '▼'}</span>
            </button>
            
            {activeFilter === 'waterSource' && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                <button
                  onClick={() => handleFilterChange('waterSource', 'all')}
                  className={`px-4 py-2 rounded-lg ${
                    filters.waterSource === 'all' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Sources
                </button>
                {filterOptions.waterSources.map(source => (
                  <button
                    key={source}
                    onClick={() => handleFilterChange('waterSource', source)}
                    className={`px-4 py-2 rounded-lg ${
                      filters.waterSource === source
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Station Details */}
        {selectedStation && (
          <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h4 className="font-bold text-gray-900 mb-3">📍 Selected Station</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">{selectedStation.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Region:</span>
                <span className="text-gray-900">{selectedStation.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Source:</span>
                <span className="text-gray-900">{selectedStation.waterSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  selectedStation.status === 'Active' ? 'bg-green-100 text-green-800' :
                  selectedStation.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                  selectedStation.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedStation.status}
                </span>
              </div>
              <button
                onClick={() => handleStationClick(selectedStation)}
                className="w-full mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                📊 View Analytics & Reports →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Map */}
      <div className="w-2/3">
        <MapContainer 
          center={defaultCenter} 
          zoom={defaultZoom} 
          className="w-full h-full"
          scrollWheelZoom={true}
        >
          <FlyToLocation center={flyToCenter} zoom={flyToZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={createCustomIcon(station.status)}
              eventHandlers={{
                click: () => handleStationClick(station),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[280px]">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{station.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-600">Region:</span>
                        <p className="font-medium">{station.region}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Source:</span>
                        <p className="font-medium">{station.waterSource}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          station.status === 'Active' ? 'bg-green-100 text-green-800' :
                          station.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                          station.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {station.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Last Updated:</span>
                        <p className="font-medium text-sm">{station.lastUpdated}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Address:</span>
                      <p className="font-medium text-sm">{station.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-600">pH Level:</span>
                        <p className="font-medium">{station.ph}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Turbidity:</span>
                        <p className="font-medium">{station.turbidity} NTU</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <a
                      href={`/station/${station.id}`}
                      className="block w-full py-2 bg-teal-600 text-white text-center rounded-lg hover:bg-teal-700 font-medium no-underline"
                    >
                      🏭 View Station Details
                    </a>
                    
                    <a
                      href={`/station/${station.id}/reports`}
                      className="block w-full py-2 bg-blue-100 text-blue-700 text-center rounded-lg hover:bg-blue-200 font-medium no-underline"
                    >
                      📋 Download Water Quality Reports
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default EnhancedBaseMap;

