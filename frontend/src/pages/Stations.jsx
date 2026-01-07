import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react"; // 👁️ Eye icon

export default function Stations() {
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/stations");
      setStations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load stations");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Safe":
        return "bg-green-100 text-green-700 border-green-300";
      case "Warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Unsafe":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="p-6 bg-[#F4FBFD] min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">All Water Stations</h2>

      {stations.length === 0 ? (
        <p className="text-gray-600 text-center">No stations available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div
              key={station.id}
              className="bg-white border border-[#C4E1E6] rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#2C7A7B] mb-1">
                  {station.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Latitude: {station.latitude} | Longitude: {station.longitude}
                </p>
                <p
                  className={`inline-block text-xs px-3 py-1 rounded-full border ${statusColor(
                    station.status
                  )}`}
                >
                  {station.status}
                </p>
              </div>

              {/* Readings */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-600">pH</p>
                  <p className="font-bold text-gray-800">{station.ph}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-600">Turbidity</p>
                  <p className="font-bold text-gray-800">{station.turbidity}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-600">Temp (°C)</p>
                  <p className="font-bold text-gray-800">
                    {station.temperature}
                  </p>
                </div>
              </div>

              {/* Eye Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate(`/stations/${station.id}`)}
                  className="flex items-center gap-1 bg-[#4FA3B5] hover:bg-[#3D91A3] text-white px-3 py-2 rounded-lg text-sm transition"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}