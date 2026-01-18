// src/components/NGOMap.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const NGOMap = ({ stations = [] }) => {
  const [mapCenter] = useState([20.5937, 78.9629]); // India center
  const navigate = useNavigate();

  const getMarkerColor = (alertLevel) => {
    switch (alertLevel) {
      case 'critical': return '#ef4444'; // red
      case 'warning': return '#f59e0b'; // yellow
      case 'predictive_alert': return '#8b5cf6'; // purple
      default: return '#10b981'; // green
    }
  };

  const createCustomIcon = (color) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20]
    });
  };

  if (!stations || stations.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No stations assigned</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer 
          center={mapCenter} 
          zoom={5} 
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {stations.map(station => (
            <Marker
              key={station.id}
              position={[
                station.latitude || 20.5937,
                station.longitude || 78.9629
              ]}
              icon={createCustomIcon(
                getMarkerColor(station.alertLevel || 'normal')
              )}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">
                    {station.name || 'Unknown Station'}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {station.location || 'Unknown Location'}
                  </p>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        (station.alertLevel || 'normal') === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : (station.alertLevel || 'normal') === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {station.alertLevel || 'normal'}
                      </span>
                    </p>

                    <p className="text-sm">
                      <span className="font-medium">Last Reading:</span> 
                      <span className="ml-2">
                        {station.lastReadingTime || 'Unknown'}
                      </span>
                    </p>
                  </div>

                  {/* ✅ REQUIRED NAVIGATION TO DETAILS PAGE */}
                  <button
                    onClick={() => navigate(`/ngo/station/${station.id}`)}
                    className="mt-3 text-blue-600 text-sm font-medium hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">Normal</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm">Warning</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm">Critical</span>
        </div>
      </div>
    </>
  );
};

export default NGOMap;
