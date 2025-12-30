import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const locations = [
  {
    name: "Hyderabad",
    position: [17.385, 78.4867],
    color: "green",
  },
  {
    name: "Bengaluru",
    position: [12.9716, 77.5946],
    color: "red",
  },
  {
    name: "Chennai",
    position: [13.0827, 80.2707],
    color: "yellow",
  },
  {
    name: "Mumbai",
    position: [19.076, 72.8777],
    color: "gray",
  },
];

const MapComponent = () => {
  return (
    <MapContainer
      center={[20.5937, 78.9629]} // India center
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {locations.map((loc, index) => (
        <CircleMarker
          key={index}
          center={loc.position}
          radius={8}
          pathOptions={{ color: loc.color, fillColor: loc.color, fillOpacity: 0.9 }}
        >
          <Popup>
            <strong>{loc.name}</strong>
            <br />
            Water Quality Status
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
