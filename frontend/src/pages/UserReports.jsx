import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    water_source: "",
    description: "",
    photo_url: "",
  });

  // ✅ FIX: Always fetch the actual token stored during login
  const token = localStorage.getItem("authToken");

  /* ================= FETCH REPORTS ================= */
  const fetchReports = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`, // use the login token
        },
      });
      setReports(res.data || []);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReports();
  }, [token]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You are not authenticated!");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/reports`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // use the login token
            "Content-Type": "application/json",
          },
        }
      );

      setReports((prev) => [res.data, ...prev]);

      setFormData({
        title: "",
        location: "",
        water_source: "",
        description: "",
        photo_url: "",
      });
    } catch (err) {
      console.error("Submit failed", err);
      alert(
        "Submit failed: " +
          (err.response?.data?.detail || err.message)
      );
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

        {/* SUBMIT REPORT */}
        <section className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-blue-600">
            Submit New Water Quality Report
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Subject / Title"
              className="w-full border px-3 py-2 rounded"
              required
            />

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border px-3 py-2 rounded"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the water quality issue"
              className="w-full border px-3 py-2 rounded"
            />

            <select
              name="water_source"
              value={formData.water_source}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select water source</option>
              <option value="River">River</option>
              <option value="Lake">Lake</option>
              <option value="Well">Well</option>
              <option value="Tap">Tap</option>
              <option value="Other">Other</option>
            </select>

            <input
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              placeholder="Photo URL (optional)"
              className="w-full border px-3 py-2 rounded"
            />

            <div className="text-right">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </section>

        {/* REPORT LIST */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            Report Status and Notes
          </h2>

          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-500">No reports submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="border rounded p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      {r.title || "No Title"}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        r.status === "verified"
                          ? "bg-green-100 text-green-700"
                          : r.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status === "verified"
                        ? "Completed"
                        : r.status === "rejected"
                        ? "Rejected"
                        : "Pending"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Location: {r.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Water Source: {r.water_source || "-"}
                  </p>
                  <p className="text-sm mt-1">
                    {r.description || "-"}
                  </p>

                  {r.moderation_notes && (
                    <div className="mt-2 text-xs text-gray-700 border-t pt-2">
                      <strong>Notes:</strong> {r.moderation_notes}
                    </div>
                  )}

                  {r.photo_url && (
                    <img
                      src={r.photo_url}
                      alt="Report"
                      className="mt-2 w-full max-h-60 object-cover rounded"
                    />
                  )}
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
