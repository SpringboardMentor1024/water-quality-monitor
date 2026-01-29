import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewReport() {
  const navigate = useNavigate();

  const [waterSource, setWaterSource] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ ALWAYS read token INSIDE submit (important)
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Session expired. Please login again.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/user-reports",
        {
          // ✅ backend expected fields
          location: `${latitude}, ${longitude}`,
          water_source: waterSource,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ success
      navigate("/reports");
    } catch (error) {
      console.error("REPORT SUBMIT ERROR:", error.response?.data || error);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FBFD] flex justify-center items-start p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-6 rounded-xl shadow border space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Submit New Water Quality Report
        </h2>

        {/* WATER SOURCE */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Water Source
          </label>
          <select
            className="w-full mt-1 p-2 border rounded-lg"
            value={waterSource}
            onChange={(e) => setWaterSource(e.target.value)}
            required
          >
            <option value="">Select water source</option>
            <option value="River">River</option>
            <option value="Lake">Lake</option>
            <option value="Pond">Pond</option>
            <option value="Canal">Canal</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* LATITUDE */}
        <div>
          <label className="text-sm font-medium text-gray-600">Latitude</label>
          <input
            type="number"
            step="any"
            className="w-full mt-1 p-2 border rounded-lg"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </div>

        {/* LONGITUDE */}
        <div>
          <label className="text-sm font-medium text-gray-600">Longitude</label>
          <input
            type="number"
            step="any"
            className="w-full mt-1 p-2 border rounded-lg"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Detailed Description
          </label>
          <textarea
            className="w-full mt-1 p-2 border rounded-lg"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4FA3B5] text-white py-2 rounded-lg hover:bg-[#3D91A3] disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
