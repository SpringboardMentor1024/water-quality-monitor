import React, { useEffect, useState } from "react";

const PredictiveAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/predictive/analyze", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error("Failed to load predictive alerts", err));
  }, []);

  const getRiskColor = (risk) => {
    if (risk === "HIGH") return "#ff4d4d";
    if (risk === "MODERATE") return "#ffa500";
    return "#4caf50";
  };

  return (
    <div style={{ padding: "30px", background: "#0d0d0d", minHeight: "100vh", color: "#fff" }}>
      <h2 style={{ marginBottom: "20px" }}>Predictive Alert Preview</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {alerts.map((alert) => (
          <div
            key={alert.station_id}
            style={{
              background: "#1a1a1a",
              padding: "20px",
              borderRadius: "10px",
              borderLeft: `5px solid ${getRiskColor(alert.risk_level)}`,
            }}
          >
            <h3>{alert.station_name}</h3>
            <p>
              Risk Level:{" "}
              <strong style={{ color: getRiskColor(alert.risk_level) }}>
                {alert.risk_level}
              </strong>
            </p>
            <p>Probability: {alert.probability}%</p>
            <p>
              Predicted On:{" "}
              {new Date(alert.predicted_on).toLocaleString()}
            </p>

            <button
              style={btnStyle}
              onClick={() => setSelectedAlert(alert)}
            >
              Review Prediction
            </button>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedAlert && (
  <div style={modalOverlay}>
    <div style={modalBox}>
      <h3>{selectedAlert.station_name}</h3>

      <p><strong>Risk Level:</strong> {selectedAlert.risk_level}</p>
      <p><strong>Probability:</strong> {selectedAlert.probability}%</p>

      <hr style={{ margin: "15px 0", borderColor: "#333" }} />

      <p><strong>Average pH:</strong> {selectedAlert.avg_ph}</p>
      <p><strong>Dissolved Oxygen (DO):</strong> {selectedAlert.avg_do} mg/L</p>
      <p><strong>Turbidity:</strong> {selectedAlert.avg_turbidity} NTU</p>

      <p>
        First Predicted On:{" "}
        {new Date(selectedAlert.predicted_on).toLocaleString()}
      </p>

      <button
        style={{ ...btnStyle, background: "#555" }}
        onClick={() => setSelectedAlert(null)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

const btnStyle = {
  marginTop: "10px",
  padding: "8px 12px",
  background: "#d4af37",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "#1a1a1a",
  padding: "25px",
  borderRadius: "10px",
  width: "350px",
};

export default PredictiveAlerts;
