import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on water quality status
const createCustomIcon = (status) => {
  const colors = {
    good: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${colors[status]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const WaterQualityMap = ({ data, onLocationSelect, selectedLocation, showRealTimeData = true }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockStations = [
    {
      id: 1,
      name: 'Hudson River Station',
      lat: 40.7589,
      lng: -73.9851,
      status: 'good',
      ph: 7.2,
      turbidity: 2.1,
      dissolved_oxygen: 8.5,
      temperature: 18.5,
      lastUpdate: '2024-01-15T14:30:00Z',
      managed_by: 'NYC Water Dept'
    },
    {
      id: 2,
      name: 'Central Park Lake',
      lat: 40.7829,
      lng: -73.9654,
      status: 'warning',
      ph: 6.8,
      turbidity: 4.2,
      dissolved_oxygen: 6.2,
      temperature: 22.1,
      lastUpdate: '2024-01-15T14:25:00Z',
      managed_by: 'Parks Department'
    },
    {
      id: 3,
      name: 'Brooklyn Water Station',
      lat: 40.6782,
      lng: -73.9442,
      status: 'critical',
      ph: 8.9,
      turbidity: 6.8,
      dissolved_oxygen: 4.1,
      temperature: 25.3,
      lastUpdate: '2024-01-15T14:20:00Z',
      managed_by: 'Brooklyn Water Works'
    }
  ];

  useEffect(() => {
    const loadStations = async () => {
      try {
        // Backend API integration pending
        setStations(data || mockStations);
      } catch (error) {
        console.error('Failed to load stations:', error);
        setStations(mockStations);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, [data, showRealTimeData]);
  const getStatusColor = (status) => {
    const colors = {
      good: 'text-green-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusText = (status) => {
    const texts = {
      good: 'Good',
      warning: 'Warning',
      critical: 'Critical'
    };
    return texts[status] || 'Unknown';
  };

  return (
    <div className="h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden">
      <MapContainer
        key="water-quality-map"
        center={[40.7128, -74.0060]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance) => {
          // Map is ready
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {stations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.status)}
            eventHandlers={{
              click: () => onLocationSelect(location)
            }}
          >
            <Popup>
              <div className="p-3 min-w-64">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {location.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(location.status)}`}>
                    {getStatusText(location.status)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">pH:</span>
                      <span className="font-medium">{location.ph}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temp:</span>
                      <span className="font-medium">{location.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Turbidity:</span>
                      <span className="font-medium">{location.turbidity} NTU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DO:</span>
                      <span className="font-medium">{location.dissolved_oxygen} mg/L</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  <div>Managed by: {location.managed_by}</div>
                  <div>Last update: {new Date(location.lastUpdate).toLocaleString()}</div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = `/stations/${location.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => alert(`Real-time data for ${location.name}`)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Live Data
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WaterQualityMap;