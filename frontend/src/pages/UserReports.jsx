import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserReports() {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    location: "",
    water_source: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  // ---------------- FETCH REPORTS ----------------
  const fetchReports = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/reports/my",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReports(res.data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ---------------- SUBMIT ----------------
  const submitReport = async (e) => {
    e.preventDefault();
    await axios.post(
      "http://127.0.0.1:8000/api/reports",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setShowForm(false);
    setForm({ location: "", water_source: "", description: "" });
    fetchReports();
  };

  return (
    <div className="p-8 bg-[#F4FBFD] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          My Water Reports
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-[#4FA3B5] text-white rounded-lg"
        >
          + Report an Issue
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white p-5 rounded-xl shadow border"
          >
            <p className="text-sm text-gray-500">
              {new Date(r.created_at).toLocaleString()}
            </p>
            <p className="mt-2 font-medium">{r.location}</p>
            <p className="text-gray-600 mt-1">{r.description}</p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                r.status === "verified"
                  ? "bg-green-100 text-green-700"
                  : r.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[95%] max-w-xl">
            <h3 className="text-lg font-semibold mb-4">
              Submit Water Issue Report
            </h3>

            <form onSubmit={submitReport} className="space-y-4">
              <input
                placeholder="Location / Station name"
                className="w-full p-3 border rounded-lg"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                required
              />

              <select
                className="w-full p-3 border rounded-lg"
                value={form.water_source}
                onChange={(e) =>
                  setForm({ ...form, water_source: e.target.value })
                }
                required
              >
                <option value="">Select Water Source</option>
                <option>River</option>
                <option>Lake</option>
                <option>Groundwater</option>
                <option>Tap</option>
              </select>

              <textarea
                placeholder="Describe the issue"
                className="w-full p-3 border rounded-lg"
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4FA3B5] text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
