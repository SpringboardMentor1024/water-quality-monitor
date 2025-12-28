import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Reports() {
  const [formData, setFormData] = useState({
    title: "",
    photo: null,
    latitude: "",
    longitude: "",
    waterSource: "",
    description: "",
  });
  const [status, setStatus] = useState("Pending Review");
  const [message, setMessage] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [marker, setMarker] = useState(null);

  // Update marker whenever lat/long changes manually
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      setMarker([parseFloat(formData.latitude), parseFloat(formData.longitude)]);
    }
  }, [formData.latitude, formData.longitude]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData({
          ...formData,
          latitude: pos.coords.latitude.toFixed(4),
          longitude: pos.coords.longitude.toFixed(4),
        });
      });
    } else {
      alert("Geolocation not supported on this device.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        latitude: formData.latitude,
        longitude: formData.longitude,
        water_source: formData.waterSource,
        description: formData.description,
        status: "Pending",
      };
      await axios.post("http://127.0.0.1:8000/api/reports", payload);
      setMessage("Report submitted successfully!");
      setFormData({
        title: "",
        photo: null,
        latitude: "",
        longitude: "",
        waterSource: "",
        description: "",
      });
      setMarker(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit report.");
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setFormData({ ...formData, photo: file });
  };
  const handleDragOver = (e) => e.preventDefault();

  function LocationSelector() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
        setFormData({
          ...formData,
          latitude: lat.toFixed(4),
          longitude: lng.toFixed(4),
        });
      },
    });
    return marker ? <Marker position={marker}></Marker> : null;
  }

  return (
    <div className="p-8 bg-[#F4FBFD] min-h-screen">
      <div className="bg-white p-10 rounded-2xl shadow border border-[#C4E1E6] w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Submit New Water Quality Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Subject/Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Brief summary of the issue"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8D6]"
              required
            />
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Upload Photo
            </label>
            <div
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("fileInput").click()}
              className="w-full mt-2 border-2 border-dashed border-[#C4E1E6] rounded-xl p-10 text-center cursor-pointer hover:bg-[#F4FBFD] transition"
            >
              {formData.photo ? (
                <p className="text-gray-700 font-medium">
                  📷 {formData.photo.name} selected
                </p>
              ) : (
                <p className="text-gray-600">
                  Drag & drop photo here, or{" "}
                  <span className="text-[#4FA3B5] font-semibold">
                    click to select file
                  </span>
                  <br />
                  <span className="text-sm text-gray-400">
                    PNG, JPG — up to 10MB
                  </span>
                </p>
              )}
              <input
                id="fileInput"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Location Information
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8D6]"
                required
              />
              <input
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8D6]"
                required
              />
            </div>

            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={detectLocation}
                className="px-5 py-2 bg-[#4FA3B5] text-white rounded-lg hover:bg-[#3D91A3] transition"
              >
                Detect Current Location
              </button>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Select on Map
              </button>
            </div>

            {/* Small preview map below inputs */}
            {marker && (
              <div className="mt-4 h-[250px] border border-[#C4E1E6] rounded-lg overflow-hidden">
                <MapContainer
                  center={marker}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  <Marker position={marker}></Marker>
                </MapContainer>
              </div>
            )}
          </div>

          {/* Water Source and Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Water Source
            </label>
            <select
              name="waterSource"
              value={formData.waterSource}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8D6]"
              required
            >
              <option value="">Select water source</option>
              <option value="River">River</option>
              <option value="Lake">Lake</option>
              <option value="Tap">Tap</option>
              <option value="Groundwater">Groundwater</option>
            </select>

            <label className="block text-sm font-medium text-gray-600 mt-3">
              Detailed Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your observation"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FC8D6]"
              rows="5"
              required
            ></textarea>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Current Status
            </label>
            <input
              type="text"
              readOnly
              value={status}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
            />
            <label className="block text-sm font-medium text-gray-600 mt-3">
              Moderation Notes
            </label>
            <textarea
              readOnly
              value="Your report is under review by moderators."
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
              rows="3"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <a
              href="/my-reports"
              className="px-5 py-2 bg-[#4FA3B5] text-white rounded-lg hover:bg-[#3D91A3] transition"
            >
              View My Reports
            </a>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#4FA3B5] text-white rounded-lg hover:bg-[#3D91A3] transition"
              >
                Submit Report
              </button>
            </div>
          </div>
        </form>

        {message && (
          <p className="text-center mt-4 font-medium text-[#4FA3B5]">{message}</p>
        )}
      </div>

      {/* --- MAP MODAL --- */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg border border-[#C4E1E6] w-[90%] max-w-3xl p-4 relative">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Select Location on Map
            </h3>
            <div className="h-[400px] rounded-lg overflow-hidden border border-[#C4E1E6]">
              <MapContainer
                center={[20.5937, 78.9629]} // India center
                zoom={5}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <LocationSelector />
              </MapContainer>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowMap(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
