import React from 'react';
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

const WaterQualityMap = ({ data, onLocationSelect, selectedLocation }) => {
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
        
        {data.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.status)}
            eventHandlers={{
              click: () => onLocationSelect(location)
            }}
          >
            <Popup>
              <div className="p-2 min-w-48">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Monitoring Station {location.id}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${getStatusColor(location.status)}`}>
                      {getStatusText(location.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>pH Level:</span>
                    <span>{location.ph}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turbidity:</span>
                    <span>{location.turbidity} NTU</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dissolved O₂:</span>
                    <span>{location.dissolved_oxygen} mg/L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span>{location.temperature}°C</span>
                  </div>
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