import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddReport() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    title: "",
    latitude: "",
    longitude: "",
    water_source: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://127.0.0.1:8000/api/user-reports",
      {
        location: `${form.title} (${form.latitude}, ${form.longitude})`,
        water_source: form.water_source,
        description: form.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    navigate("/reports");
  };

  return (
    <div className="p-6 bg-[#F4FBFD] min-h-screen">
      <h2 className="text-2xl font-bold mb-4">
        Submit New Water Quality Report
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg space-y-4"
      >
        <div>
          <label>Subject / Title</label>
          <input
            name="title"
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="Unusual discoloration in local river"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="latitude"
            placeholder="Latitude"
            onChange={handleChange}
            className="border p-2"
            required
          />
          <input
            name="longitude"
            placeholder="Longitude"
            onChange={handleChange}
            className="border p-2"
            required
          />
        </div>

        <div>
          <label>Water Source</label>
          <select
            name="water_source"
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option>River</option>
            <option>Lake</option>
            <option>Canal</option>
            <option>Reservoir</option>
          </select>
        </div>

        <div>
          <label>Detailed Description</label>
          <textarea
            name="description"
            rows="4"
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="Describe color, odor, foam, debris, etc."
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/reports")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[#4FA3B5] text-white rounded"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
