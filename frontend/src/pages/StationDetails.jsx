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
      const res = await axios.get("http://127.0.0.1:8000/api/stations");
      const found = res.data.find((s) => s.id === Number(id));
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
          className="mt-4 px-4 py-2 bg-[#4FA3B5] text-white rounded hover:bg-[#3D91A3]"
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
          box-shadow:0 0 5px rgba(0,0,0,0.3);
        "></div>
      `,
    });

  return (
    <div className="min-h-screen bg-[#F4FBFD] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-700">
          {station.name} Details
        </h2>
        <button
          onClick={() => navigate("/map")}
          className="bg-[#4FA3B5] hover:bg-[#3D91A3] text-white px-4 py-2 rounded-lg transition"
        >
          ← Back to Map
        </button>
      </div>

      {/* Mini Map Preview */}
      <div className="h-[300px] rounded-xl overflow-hidden border border-[#A4CCD9] shadow">
        <MapContainer
          center={[station.latitude, station.longitude]}
          zoom={9}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker
            position={[station.latitude, station.longitude]}
            icon={getMarkerIcon(station.status)}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              Status: {station.status}
              <br />
              pH: {station.ph}
              <br />
              Turbidity: {station.turbidity}
              <br />
              Temperature: {station.temperature}°C
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Station Summary */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#C4E1E6]">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Current Readings
        </h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">pH</p>
            <p className="text-2xl font-bold text-gray-800">
              {station.ph || latest.ph || "-"}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Turbidity</p>
            <p className="text-2xl font-bold text-gray-800">
              {station.turbidity || latest.turbidity || "-"}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Temperature</p>
            <p className="text-2xl font-bold text-gray-800">
              {station.temperature || latest.temperature || "-"}°C
            </p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-4">
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

      {/* Historical Chart */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#C4E1E6]">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Historical Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["ph", "turbidity", "temperature"].map((param) => (
            <div
              key={param}
              className="bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <h4 className="font-semibold mb-2 capitalize text-gray-700">
                {param}
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={readings.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="recorded_at" hide />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={param}
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