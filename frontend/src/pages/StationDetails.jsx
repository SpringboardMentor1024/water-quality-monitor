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
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStationDetails();
  }, [id]);

  const fetchStationDetails = async () => {
    try {
      const stationsRes = await axios.get(
        "http://127.0.0.1:8000/api/stations"
      );
      const found = stationsRes.data.find(
        (s) => s.id === Number(id)
      );
      setStation(found);

      if (found) {
        const reportsRes = await axios.get(
          `http://127.0.0.1:8000/api/reports?station=${found.name}`
        );
        setReadings(reportsRes.data);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
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

  const latest = readings[0] || {};

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

  const PARAMETERS = [
    { key: "ph", label: "pH", unit: "" },
    { key: "turbidity", label: "Turbidity", unit: " NTU" },
    { key: "temperature", label: "Temperature", unit: " °C" },
    { key: "arsenic", label: "Arsenic", unit: " mg/L" },
    { key: "dissolved_oxygen", label: "Dissolved Oxygen", unit: " mg/L" },
    { key: "nitrate", label: "Nitrate", unit: " mg/L" },
    { key: "fluoride", label: "Fluoride", unit: " mg/L" },
  ];

  return (
    <div className="min-h-screen bg-[#F4FBFD] p-6 space-y-6">
      {/* Header */}
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

      {/* Map */}
      <div className="h-[300px] rounded-xl overflow-hidden border">
        <MapContainer
          center={[station.latitude, station.longitude]}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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

      {/* Current Readings */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Current Readings
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {PARAMETERS.map((p) => (
            <div key={p.key} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">{p.label}</p>
              <p className="text-xl font-bold">
                {station[p.key] ?? latest[p.key] ?? "-"}
                {p.unit}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4">
          Status:{" "}
          <span
            className={`font-semibold ${
              station.status === "Safe"
                ? "text-green-600"
                : station.status === "Warning"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {station.status}
          </span>
        </p>
      </div>

      {/* Historical Trends */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Historical Trends
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PARAMETERS.map((p) => (
            <div key={p.key} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{p.label}</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={
                    readings.length
                      ? readings.slice().reverse()
                      : []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="recorded_at" hide />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={p.key}
                    stroke="#4FA3B5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
