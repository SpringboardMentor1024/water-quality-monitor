import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import StationMarker from "./StationMarker";
import { stations } from "./mapConfig";

const BaseMap = () => {
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[22.57, 88.36]}
        zoom={9}
        zoomControl={true}
        scrollWheelZoom={true}
        className="h-full w-full"
        easeLinearity={0.35}
        inertia={true}
        inertiaDeceleration={3000}
      >
        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {stations.map((station) => (
          <StationMarker key={station.id} station={station} />
        ))}
      </MapContainer>
    </div>
  );
};

export default BaseMap;
