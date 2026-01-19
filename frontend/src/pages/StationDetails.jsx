import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../utils/fixLeafletIcons";

export default function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [station, setStation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStationAndHistory();
  }, [id]);

  const fetchStationAndHistory = async () => {
    try {
      const stationsRes = await axios.get(
        "http://127.0.0.1:8000/api/stations"
      );

      const found = stationsRes.data.find(
        (s) => s.id === Number(id)
      );

      if (!found) {
        setStation(null);
        setLoading(false);
        return;
      }

      setStation(found);

      const historyRes = await axios.get(
        `http://127.0.0.1:8000/api/history/${encodeURIComponent(found.name)}`
      );

      setHistory(historyRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Station details error:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading station details...</p>;
  }

  if (!station) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">Station not found.</p>
        <button
          onClick={() => navigate("/map")}
          className="mt-4 px-4 py-2 bg-[#4FA3B5] text-white rounded"
        >
          Back to Map
        </button>
      </div>
    );
  }

  const getMarkerIcon = (status) =>
    L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background:${
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
        "></div>
      `,
    });

  // 🔹 CURRENT SNAPSHOT (from Station table)
  const CURRENT_PARAMETERS = [
    { key: "ph", label: "pH", unit: "" },
    { key: "turbidity", label: "Turbidity", unit: " NTU" },
    { key: "temperature", label: "Temperature", unit: " °C" },
    { key: "arsenic", label: "Arsenic", unit: " mg/L" },
    { key: "dissolved_oxygen", label: "Dissolved Oxygen", unit: " mg/L" },
    { key: "nitrate", label: "Nitrate", unit: " mg/L" },
    { key: "fluoride", label: "Fluoride", unit: " mg/L" },
  ];

  // 🔹 HISTORICAL TRENDS (from WaterReading table)
  const TREND_PARAMETERS = [
    { key: "ph", label: "pH" },
    { key: "turbidity", label: "Turbidity" },
    { key: "temperature", label: "Temperature" },
    { key: "arsenic", label: "Arsenic" },
    { key: "dissolved_oxygen", label: "Dissolved Oxygen" },
    { key: "nitrate", label: "Nitrate" },
    { key: "fluoride", label: "Fluoride" },
  ];

  return (
    <div className="min-h-screen bg-[#F4FBFD] p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">
          {station.name}
        </h2>
        <button
          onClick={() => navigate("/map")}
          className="bg-[#4FA3B5] text-white px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      {/* MAP */}
      <div className="h-[300px] rounded-xl overflow-hidden border">
        <MapContainer
          center={[station.latitude, station.longitude]}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[station.latitude, station.longitude]}
            icon={getMarkerIcon(station.status)}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              Status: {station.status}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* CURRENT READINGS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Current Readings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {CURRENT_PARAMETERS.map((p) => (
            <div key={p.key} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">{p.label}</p>
              <p className="text-xl font-bold">
                {station[p.key] ?? "-"}
                {p.unit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORICAL TRENDS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Historical Trends</h3>

        {history.length === 0 ? (
          <p className="text-gray-500 text-center">
            No historical data available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TREND_PARAMETERS.map((p) => (
              <div key={p.key} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{p.label}</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" hide />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey={p.key}
                      stroke="#4FA3B5"
                      strokeWidth={2}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
