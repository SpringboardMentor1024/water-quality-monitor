import React, { useState } from "react";

export default function Reports() {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    latitude: "",
    longitude: "",
    waterSource: "",
    description: "",
  });

  /* =========================
     REPORT HISTORY (UI STATE)
  ========================= */
  const [reports, setReports] = useState([
    { id: 1, subject: "High turbidity observed", status: "Pending", date: "2025-02-10" },
    { id: 2, subject: "Unusual smell in water", status: "Verified", date: "2025-02-08" },
    { id: 3, subject: "Possible chemical discharge", status: "Rejected", date: "2025-02-06" },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Verified":
        return "bg-green-500 text-black";
      case "Rejected":
        return "bg-red-500 text-black";
      default:
        return "bg-yellow-500 text-black";
    }
  };

  /* =========================
     FILE HANDLER
  ========================= */
  const handleFileChange = (file) => {
    setPhoto(file);
    setPreview(URL.createObjectURL(file));

    // auto-fill subject if empty
    if (!form.subject) {
      setForm((prev) => ({
        ...prev,
        subject: file.name.replace(/\.[^/.]+$/, ""),
      }));
    }
  };

  /* =========================
     LOCATION DETECTION
  ========================= */
  const detectLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
      }));
    });
  };

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const handleSubmit = () => {
    if (!form.subject || !photo) {
      alert("Please provide subject and photo");
      return;
    }

    const newReport = {
      id: reports.length + 1,
      subject: form.subject,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setReports([newReport, ...reports]);

    // reset form
    setForm({
      subject: "",
      latitude: "",
      longitude: "",
      waterSource: "",
      description: "",
    });
    setPhoto(null);
    setPreview(null);
  };

  return (
    <div className="p-4 md:p-8 text-white space-y-10">

      {/* =========================
          REPORT HISTORY
      ========================= */}
      <div>
        <h1 className="text-2xl font-bold mb-4">My Submitted Reports</h1>

        <div className="bg-[#222831] rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-[#1b1f24] text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Subject</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t border-gray-700 hover:bg-[#1b1f24]">
                  <td className="px-4 py-3">{report.subject}</td>
                  <td>{report.date}</td>
                  <td>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs text-gray-400 px-4 py-3">
            Reports are reviewed by NGO/Admin before updating official station readings.
          </p>
        </div>
      </div>

      {/* =========================
          SUBMIT NEW REPORT
      ========================= */}
      <div>
        <h1 className="text-2xl font-bold mb-6">Submit New Water Quality Report</h1>

        <div className="max-w-3xl bg-[#222831] p-6 rounded-xl space-y-6">

          {/* SUBJECT */}
          <div>
            <label className="block text-sm mb-2">Subject / Title</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Brief summary of the issue"
              className="w-full bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2"
            />
          </div>

          {/* UPLOAD PHOTO */}
          <div>
            <label className="block text-sm mb-2">Upload Photo</label>

            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition">
              {preview ? (
                <img src={preview} alt="preview" className="h-full object-cover rounded-lg" />
              ) : (
                <>
                  <span className="text-lg">⬆</span>
                  <p className="text-sm text-gray-400">Drag & drop photo here or click to upload</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </label>
          </div>

          {/* LOCATION */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Location Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={form.latitude}
                placeholder="Latitude"
                className="bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                value={form.longitude}
                placeholder="Longitude"
                className="bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div className="flex gap-3 mt-3 flex-wrap">
              <button className="bg-[#2c3440] px-4 py-2 rounded-lg text-sm">
                Select on Map
              </button>
              <button
                onClick={detectLocation}
                className="bg-[#2c3440] px-4 py-2 rounded-lg text-sm"
              >
                Detect Current Location
              </button>
            </div>
          </div>

          {/* WATER SOURCE */}
          <div>
            <label className="block text-sm mb-2">Water Source</label>
            <select
              value={form.waterSource}
              onChange={(e) => setForm({ ...form, waterSource: e.target.value })}
              className="w-full bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Select water source</option>
              <option>River</option>
              <option>Lake</option>
              <option>Reservoir</option>
              <option>Groundwater</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm mb-2">Detailed Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what you observed..."
              className="w-full bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2 resize-none"
            />
          </div>

          {/* STATUS */}
          <span className="inline-block bg-yellow-500 text-black text-xs px-3 py-1 rounded-full">
            Pending Review
          </span>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 flex-wrap">
            <button
              onClick={() => setForm({ subject: "", latitude: "", longitude: "", waterSource: "", description: "" })}
              className="px-5 py-2 rounded-lg bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-yellow-500 text-black font-semibold"
            >
              Submit Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
