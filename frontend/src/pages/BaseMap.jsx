import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { getStations } from "../utils/api";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function BaseMap() {
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStations = async () => {
      try {
        const data = await getStations();
        setStations(data || []);
      } catch (err) {
        console.error("Failed to load stations", err);
      }
    };
    loadStations();
  }, []);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {stations.map((stn) => (
        <Marker
          key={stn.id}
          position={[Number(stn.latitude), Number(stn.longitude)]}
        >
          <Popup>
            <div className="p-3 min-w-[220px]">
              <h4 className="font-bold text-blue-900 text-sm">{stn.name}</h4>
              <p className="text-xs text-gray-500 mb-3">{stn.location}</p>

              {/* 🔴 FIXED: URL PARAM */}
              <button
                onClick={() => navigate(`/analysis/${stn.id}`)}
                className="w-full bg-blue-600 text-white text-xs py-2 rounded"
              >
                Analyze Details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
