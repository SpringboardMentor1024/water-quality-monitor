// UserReports.jsx - COMPLETE UPDATED (Connected to api.js)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyReports, createReport } from "../utils/api"; 

const UserReports = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    latitude: "",
    longitude: "",
    water_source: "",
    description: "",
    photo: null,
  });

  /* ================= FETCH REPORTS ================= */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getMyReports(); 
        setReports(data || []);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  /* ========== READ LOCATION FROM MAP ========== */
  useEffect(() => {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      const loc = JSON.parse(saved);
      setFormData((prev) => ({
        ...prev,
        latitude: loc.latitude.toFixed(6),
        longitude: loc.longitude.toFixed(6),
      }));
      localStorage.removeItem("selectedLocation");
    }
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setFormData({ ...formData, photo: file });
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      },
      () => alert("Unable to fetch location")
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const res = await createReport(data); 
      setReports((prev) => [res, ...prev]); 

      // Reset form
      setFormData({
        title: "",
        latitude: "",
        longitude: "",
        water_source: "",
        description: "",
        photo: null,
      });
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-blue-700">
            User Water Quality Reports
          </h1>
          <p className="text-sm text-gray-600">
            Submit and track water quality issues
          </p>
        </div>

        {/* ================= SUBMIT REPORT ================= */}
        <section className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-blue-600">
            Submit New Water Quality Report
          </h2>

          <p className="text-sm text-gray-600">
            Provide details of the water quality issue observed at a specific location
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* OBSERVATION DETAILS */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Observation Details
              </h3>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Subject / Title (e.g. 'Murky water in village tank')"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* PHOTO UPLOAD */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Upload Supporting Photo
              </h3>
              <div
                className="border-2 border-dashed border-blue-300 p-6 rounded-lg text-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
                onClick={() => document.getElementById("photo").click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileSelect(e.dataTransfer.files[0]);
                }}
              >
                <p className="text-gray-500 mb-2">📸 Click or drag & drop JPG/PNG</p>
                {formData.photo ? (
                  <p className="text-xs text-green-600 font-medium">
                    ✅ {formData.photo.name} ({(formData.photo.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">Optional but recommended</p>
                )}
              </div>
              <input
                id="photo"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>

            {/* LOCATION INFORMATION */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                📍 Location Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  value={formData.latitude}
                  readOnly
                  placeholder="Latitude"
                  className="border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                />
                <input
                  value={formData.longitude}
                  readOnly
                  placeholder="Longitude"
                  className="border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={detectCurrentLocation}
                  className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors"
                >
                  📱 Detect Current Location
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/map")}
                  className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-200 transition-colors"
                >
                  🗺️ Select on Map
                </button>
              </div>
            </div>

            {/* WATER SOURCE */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                💧 Water Source
              </h3>
              <select
                name="water_source"
                value={formData.water_source}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select water source type</option>
                <option value="River">🌊 River</option>
                <option value="Lake">🏞️ Lake/Pond</option>
                <option value="Well">🕳️ Well/Borewell</option>
                <option value="Tap">🚰 Tap/Municipal</option>
                <option value="Other">❓ Other</option>
              </select>
            </div>

            {/* DETAILED DESCRIPTION */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                📝 Detailed Description
              </h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the issue (color, smell, etc.)"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 resize-vertical"
              />
            </div>

            {/* SUBMIT */}
            <div className="text-right pt-4 border-t">
              <button
                type="submit"
                disabled={submitting || !formData.title || !formData.latitude || !formData.water_source}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {submitting ? "📤 Submitting..." : "🚨 Submit Water Quality Report"}
              </button>
            </div>

          </form>
        </section>

        {/* ================= MY REPORTS ================= */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-6 flex items-center gap-2">
            📋 My Submitted Reports ({reports.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 animate-pulse">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No reports submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reports.map((r) => (
                <div key={r.id} className="border rounded-xl p-6 bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-800 pr-4 flex-1 truncate">
                      {r.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      r.status === "verified" ? "bg-green-100 text-green-800" : 
                      r.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {r.status === "verified" ? "✅ Verified" : r.status === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <p><strong>📍 Location:</strong> {r.latitude}, {r.longitude}</p>
                    <p><strong>💧 Source:</strong> {r.water_source}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{r.description}</p>
                  {r.photo_path && (
                    <img src={`http://127.0.0.1:8000/${r.photo_path}`} alt="Report" className="w-24 h-24 object-cover rounded-lg shadow-md" />
                  )}
                  <p className="text-xs text-gray-400 mt-2">Submitted: {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserReports;
