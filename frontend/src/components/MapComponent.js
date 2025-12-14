// src/components/MapComponent.js
import React, { useEffect, useRef } from 'react';
import { FiMapPin } from 'react-icons/fi';

// --- MOCK DATA FOR MAP INTEGRATION ---
const mockSensorLocations = [
  { id: 1, lat: 34.05, lng: -118.25, name: "Intake Site A", status: "Normal" },
  { id: 2, lat: 34.06, lng: -118.20, name: "Storage Tank B", status: "Warning" },
  { id: 3, lat: 34.04, lng: -118.30, name: "Filter Output C", status: "Critical" },
];

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Integration point for Leaflet / Google Maps
    // Example placeholder code commented:
    /*
      if (mapRef.current && typeof L !== 'undefined') {
        const map = L.map(mapRef.current).setView([34.05, -118.25], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        // add markers...
      }
    */
    console.log("Map Component structure is ready.");
    return () => {
      // cleanup (e.g., map.remove()) when integrating a real map
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-red-400';
      case 'Warning': return 'text-yellow-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-50">
        <FiMapPin className="text-cyan-400" /> Live Sensor Map
      </h3>

      <div
        ref={mapRef}
        id="map-container"
        className="flex-1 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-center text-slate-500 p-4 overflow-hidden"
      >
        <div className="space-y-3">
          <p className="text-lg font-medium">Map Integration Point Ready</p>
          <p className="text-xs text-slate-400">Your team will anchor the map library here (using `mapRef`).</p>
          <p className="text-xs text-slate-400 mt-4">--- MOCK SENSOR STATUS ---</p>
          {mockSensorLocations.map(sensor => (
            <p key={sensor.id} className={`text-sm font-medium ${getStatusColor(sensor.status)}`}>
              {sensor.name}: {sensor.status}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
