import React from "react";

const MapComponent = () => {
  return (
    <div style={styles.page}>
      <h2 style={styles.header}>📍 Base Maps - Google Maps Integration</h2>

      <div style={styles.mapContainer}>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.85277436594!2d78.48667121480088!3d17.38504400799321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba3a4b9a4c4a1%3A0x7aab11a8e1d93373!2sHyderabad!5e0!3m2!1sen!2sin!4v1700000000000"
          style={styles.iframe}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "#f4f6f9",
    textAlign: "center",
    padding: "20px",
  },
  header: {
    backgroundColor: "#0078d7",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
  mapContainer: {
    width: "90%",
    maxWidth: "1000px",
    height: "500px",
    margin: "20px auto",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "0",
  },
};

export default MapComponent;
