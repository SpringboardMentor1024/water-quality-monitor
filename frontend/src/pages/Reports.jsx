import React, { useState } from "react";

export default function Reports() {
  const [reports] = useState([
    { id: 1, title: "High turbidity in creek", status: "Pending Review" },
    { id: 2, title: "E.Coli alert in lake", status: "Verified" },
    { id: 3, title: "Chemical odor detected", status: "Rejected" },
  ]);

  const [form, setForm] = useState({
    title: "",
    latitude: "",
    longitude: "",
    source: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Report submitted successfully!");
    setForm({
      title: "",
      latitude: "",
      longitude: "",
      source: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#F4FBFD] p-8 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-[#4FA3B5] mb-8">
        Submit New Water Quality Report
      </h1>

      {/* Form Section */}
      <div className="bg-white border border-[#C4E1E6] rounded-xl p-6 shadow mb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Subject / Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Unusual discoloration in local river"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7FC8D6]"
              required
            />
          </div>

          {/* Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                placeholder="e.g., 34.0522"
                value={form.latitude}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7FC8D6]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                placeholder="e.g., -118.2437"
                value={form.longitude}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7FC8D6]"
                required
              />
            </div>
          </div>

          {/* Observation Details */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Water Source
            </label>
            <input
              type="text"
              name="source"
              placeholder="e.g., River, Lake, Pond"
              value={form.source}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7FC8D6]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Detailed Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your observation..."
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7FC8D6]"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#4FA3B5] text-white px-4 py-2 rounded-lg hover:bg-[#3D91A3] transition"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>

      {/* Report Status Table */}
      <div className="bg-white border border-[#C4E1E6] rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold text-[#4FA3B5] mb-4">
          Previous Reports
        </h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E8F7FA]">
            <tr>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-3">{r.title}</td>
                <td
                  className={`p-3 ${
                    r.status === "Verified"
                      ? "text-green-600"
                      : r.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
