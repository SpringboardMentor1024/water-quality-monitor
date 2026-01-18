import React, { useState } from "react";

const Stations = ({ stations }) => {
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <div>
      {stations.map((station) => (
        <div
          key={station.station_id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <h3>{station.station_name}</h3>
          <p>
            <strong>Risk:</strong> {station.risk_level}
          </p>
          <p>
            <strong>Probability:</strong> {station.probability}%
          </p>

          <button
            onClick={() =>
              setSelectedStation(
                selectedStation === station.station_id
                  ? null
                  : station.station_id
              )
            }
          >
            Review Prediction
          </button>

          {selectedStation === station.station_id && (
            <div style={{ marginTop: "10px" }}>
              <p><strong>pH:</strong> {station.avg_ph}</p>
              <p><strong>Dissolved Oxygen (DO):</strong> {station.avg_do}</p>
              <p><strong>Turbidity:</strong> {station.avg_turbidity}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stations;
