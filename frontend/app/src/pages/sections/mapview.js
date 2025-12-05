import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const MapView = ({ filter }) => {
const [stations, setStations] = useState([]);

useEffect(() => {
axios.get("[http://localhost:8000/waterstations](http://localhost:8000/waterstations)") // fetch all water stations
.then(res => setStations(res.data))
.catch(err => console.error(err));
}, []);

// Filter stations based on StatsPanel selection
const filteredStations = stations.filter(station => {
if (!filter) return true; // no filter applied
switch (filter) {
case "alerts":
return station.active_alerts > 0;
case "reports":
return station.open_reports > 0;
case "contaminated":
return station.contaminated;
case "quality":
return station.water_quality_index < 7; // example threshold for poor quality
default:
return true;
}
});

// Marker color based on water quality
const getMarkerColor = (station) => {
if (station.water_quality_index >= 8) return "green";
if (station.water_quality_index >= 5) return "orange";
return "red";
};

return (
<MapContainer center={[20.5937, 78.9629]} zoom={5} className="w-full h-full rounded-lg"> <TileLayer
     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
     attribution="&copy; OpenStreetMap contributors"
   />
{filteredStations.map(station => (
<CircleMarker
key={station.id}
center={[station.latitude, station.longitude]}
radius={10}
color={getMarkerColor(station)}
> <Popup> <div> <strong>{station.name}</strong><br />
Location: {station.location}<br />
Active Alerts: {station.active_alerts}<br />
Open Reports: {station.open_reports}<br />
Contaminated: {station.contaminated ? "Yes" : "No"}<br />
Water Quality Index: {station.water_quality_index} </div> </Popup> </CircleMarker>
))} </MapContainer>
);
};

export default MapView;
