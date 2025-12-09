import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const center = {
  lat: 16.7107, // Example: Eluru latitude
  lng: 81.1050, // Example: Eluru longitude
};

function GoogleMapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAeMYcURw7ex-KyeHJ5_3ZJwF9ebKKio54", 
  });

  return (
    <div style={{ padding: "20px", textAlign: "center", background: "#f4f6f9" }}>
      <h2
        style={{
          backgroundColor: "#0078d7",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        }}
      >
        📍 Base Map - Interactive Google Map
      </h2>

      {isLoaded ? (
        <div style={{ width: "90%", maxWidth: "1000px", margin: "20px auto" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          >
            <Marker position={center} />
          </GoogleMap>
        </div>
      ) : (
        <p>Loading Map...</p>
      )}
    </div>
  );
}

export default React.memo(GoogleMapComponent);
