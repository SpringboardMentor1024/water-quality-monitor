import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { fetchStations } from "../../services/api";

const MapView = ({ filter, onHoverStation, onViewDetails }) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchStations()
      .then((res) => setStations(res.data || []))
      .catch((err) => console.error("Failed to fetch water stations", err));
  }, []);

  const filteredStations = stations.filter(
    (station) => station.latitude && station.longitude
  );

  const getMarkerColor = () => "blue";

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {filteredStations.map((station) => (
          <CircleMarker
            key={station.id}
            center={[station.latitude, station.longitude]}
            radius={8}
            pathOptions={{
              color: getMarkerColor(),
              fillOpacity: 0.8,
            }}
            eventHandlers={{
              mouseover: () => onHoverStation?.(station),
              mouseout: () => onHoverStation?.(null),
            }}
          >
            <Popup>
              <div className="text-sm space-y-1">
                <p className="font-bold">{station.name}</p>
                <p>
                  <strong>Location:</strong> {station.location}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(station.id);
                    }}
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    View Details
                  </button>
                </p>

                {station.managed_by && (
                  <p>
                    <strong>Managed By:</strong> {station.managed_by}
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
