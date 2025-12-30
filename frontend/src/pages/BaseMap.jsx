import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { getStations } from "../utils/api";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Logic to move the map when a station is selected
const MapController = ({ activeStation }) => {
  const map = useMap();
  useEffect(() => {
    if (activeStation) {
      map.flyTo(
        [activeStation.latitude, activeStation.longitude],
        14,
        { duration: 1.5 }
      );
    }
  }, [activeStation, map]);
  return null;
};

const BaseMap = ({ selectedStation }) => {
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();
  const markerRefs = useRef({}); // Store marker refs to open popups

  // Load stations from backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStations();
        setStations(data || []);
      } catch (e) {
        console.error("Failed to load stations for base map", e);
        setStations([]);
      }
    };
    load();
  }, []);

  // Open popup when a station is selected from the index
  useEffect(() => {
    if (selectedStation && markerRefs.current[selectedStation.id]) {
      markerRefs.current[selectedStation.id].openPopup();
    }
  }, [selectedStation]);

  return (
    <MapContainer
      center={[17.42, 78.5]}
      zoom={11}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController activeStation={selectedStation} />

      {stations.map((stn) => (
        <Marker
          key={stn.id}
          position={[stn.latitude, stn.longitude]}
          ref={(el) => (markerRefs.current[stn.id] = el)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  {stn.id}
                </span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <h4 className="font-black text-blue-900 uppercase text-sm mb-0.5">
                {stn.name}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold mb-3 italic">
                {stn.location}
              </p>

              {/* Placeholder parameter data – replace with real readings later */}
              <div className="grid grid-cols-2 gap-2 bg-blue-50/50 p-2 rounded-xl mb-4 border border-blue-100">
                <div className="text-center border-r border-blue-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                    pH Level
                  </p>
                  <p className="text-xs font-black text-blue-700">7.2</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                    DO (mg/L)
                  </p>
                  <p className="text-xs font-black text-blue-700">8.1</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/station/${stn.id}`)}
                className="w-full bg-blue-600 text-white text-[10px] font-black py-2.5 rounded-xl uppercase tracking-widest shadow-md"
              >
                Analyze Details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default BaseMap;
