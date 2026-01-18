// src/components/NGOMap.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
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
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'predictive_alert':
        return '#8b5cf6';
      default:
        return '#10b981';
    }
  };

  const createCustomIcon = (color) =>
    L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>
      `,
      className: '',
      iconSize: [14, 14],
    });

  return (
    <div className="w-full h-full">
      <div className="h-96 rounded-lg overflow-hidden border">
        <MapContainer
          center={mapCenter}
          zoom={5}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✅ ROBUST MARKER RENDERING */}
          {stations.map((station) => {
            const latitude =
              station.latitude ?? station.lat ?? null;
            const longitude =
              station.longitude ?? station.lng ?? station.long ?? null;

            if (latitude === null || longitude === null) return null;

            return (
              <Marker
                key={station.id}
                position={[latitude, longitude]}
                icon={createCustomIcon(
                  getMarkerColor(station.alertLevel || 'normal')
                )}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-base">
                      {station.name}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {station.location}
                    </p>

                    <p className="mt-2 text-xs">
                      <span className="font-medium">Status:</span>{' '}
                      {station.alertLevel || 'normal'}
                    </p>

                    <button
                      onClick={() =>
                        navigate(`/ngo/water-stations/${station.id}`)
                      }
                      className="mt-3 text-blue-600 text-sm font-medium hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* INFO MESSAGE */}
      {stations.length === 0 && (
        <p className="mt-3 text-center text-gray-500 text-sm">
          No stations assigned
        </p>
      )}

      {/* LEGEND */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Normal
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          Warning
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Critical
        </div>
      </div>
    </div>
  );
};

export default NGOMap;
