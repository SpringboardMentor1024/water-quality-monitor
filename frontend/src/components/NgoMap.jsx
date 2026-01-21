import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

export default function NgoMap({ stations = [] }) {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const center = [20.5937, 78.9629];

  useEffect(() => {
    // Fix Leaflet default markers
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [stations]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return '🟢';
      case 'warning': return '🟡';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  const handleViewDetails = (stationId) => {
    // 🚀 DIRECT NAVIGATION TO NGO STATION DETAILS
    navigate(`/ngo/station/${stationId}`);
  };

  return (
    <div className="w-full h-full rounded-2xl shadow-xl overflow-hidden">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
          >
            {/* ✅ SMALL POPUP - Shows for ALL stations */}
            <Popup className="min-w-[300px] p-0 rounded-2xl shadow-2xl max-w-xs">
              <div className="p-4 space-y-3 bg-white/95 backdrop-blur-sm rounded-2xl">
                {/* Header: Status + Station Name */}
                <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100">
                  <div className={`w-4 h-4 rounded-full ${
                    station.status === 'active' ? 'bg-emerald-500' :
                    station.status === 'warning' ? 'bg-orange-500' : 
                    station.status === 'offline' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <h4 className="font-bold text-lg text-gray-900 truncate pr-2">
                    {station.name}
                  </h4>
                  <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-gray-100">
                    {station.status?.toUpperCase()}
                  </span>
                </div>

                {/* NGO & Location */}
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex items-center gap-2 text-blue-900 font-semibold bg-blue-50 px-2 py-1 rounded-lg">
                    🏢 {station.managed_by || station.ngo?.name || 'NGO Managed'}
                  </div>
                  <div className="text-xs opacity-75 flex items-center gap-1">
                    📍 {station.location}
                  </div>
                </div>

                {/* Latest Readings */}
                {(station.pH || station.tds) && (
                  <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-t border-gray-100 text-xs">
                    {station.pH && (
                      <div className="bg-emerald-50 text-emerald-800 p-2 rounded-lg text-center font-mono">
                        pH<br/><span className="text-sm font-bold">{station.pH?.toFixed(1)}</span>
                      </div>
                    )}
                    {station.tds && (
                      <div className="bg-blue-50 text-blue-800 p-2 rounded-lg text-center font-mono">
                        TDS<br/><span className="text-sm font-bold">{station.tds?.toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 🚀 VIEW DETAILS BUTTON */}
                <button
                  onClick={() => handleViewDetails(station.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  📊 View Full Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
