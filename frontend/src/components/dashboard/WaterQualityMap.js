import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { stationsAPI } from '../../services/api';

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
    critical: '#ef4444',
    active: '#10b981'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${colors[status] || colors.good}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const WaterQualityMap = ({ data, onLocationSelect, selectedLocation, showRealTimeData = true }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStations = async () => {
      try {
        if (data && data.length > 0) {
          setStations(data);
        } else {
          const realStations = await stationsAPI.getAllStations();
          const processedStations = realStations.map(station => ({
            id: station.id,
            name: station.name,
            lat: parseFloat(station.latitude),
            lng: parseFloat(station.longitude),
            status: station.status || 'good',
            ph: station.currentReading?.ph || 7.0,
            turbidity: station.currentReading?.turbidity || 1.0,
            dissolved_oxygen: station.currentReading?.dissolved_oxygen || 8.0,
            temperature: station.currentReading?.temperature || 20.0,
            lastUpdate: station.lastUpdated || new Date().toISOString(),
            managed_by: station.managed_by || 'Water Authority'
          }));
          setStations(processedStations);
        }
      } catch (error) {
        console.error('Failed to load stations:', error);
        setStations([]);
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
      critical: 'text-red-600',
      active: 'text-green-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusText = (status) => {
    const texts = {
      good: 'Good',
      warning: 'Warning',
      critical: 'Critical',
      active: 'Active'
    };
    return texts[status] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden relative">
      <MapContainer
        key="water-quality-map"
        center={stations.length > 0 ? [stations[0].lat, stations[0].lng] : [40.7128, -74.0060]}
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
              click: () => onLocationSelect && onLocationSelect(location)
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
                      <span className="font-medium">{location.ph?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temp:</span>
                      <span className="font-medium">{location.temperature?.toFixed(1) || 'N/A'}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Turbidity:</span>
                      <span className="font-medium">{location.turbidity?.toFixed(1) || 'N/A'} NTU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DO:</span>
                      <span className="font-medium">{location.dissolved_oxygen?.toFixed(1) || 'N/A'} mg/L</span>
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
                    onClick={() => window.location.href = `/stations/${location.id}/readings`}
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
      
      {stations.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-sm text-gray-600">No monitoring stations available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterQualityMap;