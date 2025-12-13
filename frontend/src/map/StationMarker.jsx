import { CircleMarker, Popup } from "react-leaflet";

const colors = {
  good: "#22c55e",
  moderate: "#facc15",
  poor: "#ef4444",
};

const StationMarker = ({ station }) => {
  return (
    <CircleMarker
      center={[station.lat, station.lng]}
      radius={10}
      pathOptions={{
        color: colors[station.status],
        fillColor: colors[station.status],
        fillOpacity: 0.9,
      }}
    >
      <Popup>
        <p className="font-semibold">Station #{station.id}</p>
        <p className="capitalize">Status: {station.status}</p>
      </Popup>
    </CircleMarker>
  );
};

export default StationMarker;
