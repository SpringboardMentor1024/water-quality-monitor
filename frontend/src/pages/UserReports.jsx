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

  /* ================= FETCH REPORTS ================= */
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/reports`);
      setReports(res.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post(`${BASE_URL}/reports`, formData);
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
      alert("Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            User Water Quality Reports
          </h1>
          <p className="text-gray-600">
            Submit water quality issues and track their status
          </p>
        </div>

        {/* SUBMIT REPORT FORM */}
        <section className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-blue-600">
            Submit New Report
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              name="title"
              placeholder="Report title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2"
            />

            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2"
            />

            <select
              name="water_source"
              value={formData.water_source}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
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
              placeholder="Photo URL (optional)"
              value={formData.photo_url}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />

            <textarea
              name="description"
              placeholder="Describe the water quality issue"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="border rounded-lg px-3 py-2 md:col-span-2"
            />

            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </section>

        {/* REPORT LIST */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            Submitted Reports
          </h2>

          {loading ? (
            <p>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-500">No reports submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{r.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                      {r.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    📍 {r.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    💧 Source: {r.water_source || "-"}
                  </p>

                  {r.description && (
                    <p className="text-sm mt-2">
                      {r.description}
                    </p>
                  )}

                  {r.photo_url && (
                    <img
                      src={r.photo_url}
                      alt="Report"
                      className="mt-3 w-full max-h-60 object-cover rounded-lg"
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
