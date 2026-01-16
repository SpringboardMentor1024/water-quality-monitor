import L from "leaflet";

export const getMarkerIcon = (status) =>
  L.divIcon({
    className: "custom-marker-wrapper",
    html: `
      <div style="
        background: ${
          status === "Safe"
            ? "#22c55e"
            : status === "Warning"
            ? "#facc15"
            : "#ef4444"
        };
        width:14px;
        height:14px;
        border-radius:50%;
        border:2px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.35);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7],
  });
