import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  fetchStations,
  fetchBatchReadings
} from "../../services/api";

const MapView = ({ filter, onHoverStation, onViewDetails }) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const loadStationsWithReadings = async () => {
      try {
        // 1️⃣ Fetch stations
        const res = await fetchStations();
        const stationList = res.data || [];

        const stationIds = stationList.map((s) => s.id);

        // 2️⃣ Fetch readings in ONE call (batch)
        const batchRes = await fetchBatchReadings(stationIds);
        const readingsByStation = batchRes.data || {};

        // 3️⃣ Attach readings to stations
        const enrichedStations = stationList.map((station) => ({
          ...station,
          readingSummary: {
            hasData: !!readingsByStation[station.id],
            readings: readingsByStation[station.id] || []
          }
        }));

        setStations(enrichedStations);
      } catch (err) {
        console.error("Failed to load stations with readings", err);
      }
    };

    loadStationsWithReadings();
  }, []);

  const filteredStations = stations.filter(
    (station) => station.latitude && station.longitude
  );

  // ✅ EXISTING MARKER COLOR LOGIC (UNCHANGED)
  const getMarkerColor = (station) => {
    const summary = station.readingSummary;

    if (!summary || !summary.hasData) return "gray";

    const phReading = summary.readings.find(
      (r) => r.parameter?.toLowerCase() === "ph"
    );

    if (!phReading) return "green";

    if (phReading.value < 6.5 || phReading.value > 8.5) {
      return "red";
    }

    return "green";
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative z-0">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* 🔵 NORMAL STATION MARKERS (UNCHANGED) */}
        {filteredStations.map((station) => (
          <CircleMarker
            key={station.id}
            center={[station.latitude, station.longitude]}
            radius={8}
            pathOptions={{
              color: getMarkerColor(station),
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

        {/* 🌐 USGS LIVE MARKER (NEW – ONLY ADDITION) */}
        <CircleMarker
          center={[38.033, -78.491]} // USGS 01646500 approx location
          radius={10}
          pathOptions={{
            color: "blue",
            fillOpacity: 0.9
          }}
        >
          <Popup>
            <div className="text-sm space-y-1">
              <p className="font-bold text-blue-700">
                USGS Live Water Station
              </p>

              <p>
                <strong>Site ID:</strong> 01646500
              </p>

              <p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails("USGS-01646500");
                  }}
                  className="text-blue-500 underline hover:text-blue-400"
                >
                  View Details
                </button>
              </p>
            </div>
          </Popup>
        </CircleMarker>

      </MapContainer>
    </div>
  );
};

export default MapView;
