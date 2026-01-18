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
        return "bg-green-100 text-green-800 border border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Verified":
        return "✓";
      case "Rejected":
        return "✗";
      default:
        return "⏳";
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
  const detectLocation = (event) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // Show loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = "Detecting...";
    button.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        button.textContent = "✓ Location Detected";
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 1500);
      },
      (error) => {
        alert("Failed to detect location. Please enable location services.");
        button.textContent = originalText;
        button.disabled = false;
      }
    );
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

    // Add animation effect
    setReports([newReport, ...reports]);

    // Show success message
    const submitBtn = document.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "✓ Submitted!";
    submitBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
    submitBtn.classList.add("bg-green-600");

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.classList.remove("bg-green-600");
      submitBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
    }, 2000);

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
    // SIMPLE CONTAINER - NO COMPLEX FLEX
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* =========================
            REPORT HISTORY
        ========================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Submitted Reports</h1>
              <p className="text-gray-600 text-sm">Track your water quality reports</p>
            </div>
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
              {reports.length} Reports
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Subject</th>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Date</th>
                    <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map((report) => (
                    <tr 
                      key={report.id} 
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            report.status === "Verified" ? "bg-green-500" :
                            report.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"
                          }`}></div>
                          <span className="text-gray-800">{report.subject}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{report.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(report.status)}`}>
                            <span className="text-sm">{getStatusIcon(report.status)}</span>
                            {report.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t">
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <span className="text-blue-500">ℹ</span>
                Reports are reviewed by NGO/Admin before updating official station readings.
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            SUBMIT NEW REPORT
        ========================= */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Submit New Water Quality Report</h1>
            <p className="text-gray-600 text-sm">Help monitor water quality in your area</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border space-y-6">
            
            {/* SUBJECT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject / Title</label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief summary of the issue"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800"
              />
            </div>

            {/* UPLOAD PHOTO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
              <label
                className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition ${
                  preview ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {preview ? (
                  <div className="relative w-full h-full">
                    <img src={preview} alt="preview" className="h-full w-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center rounded-lg">
                      <span className="text-white opacity-0 hover:opacity-100">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="text-3xl mb-2">📷</div>
                    <p className="text-sm text-gray-600 font-medium">Click to upload photo</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Location Information</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Optional</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                  <input
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    placeholder="e.g., 12.345678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                  <input
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    placeholder="e.g., 98.765432"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition">
                  🌍 Select on Map
                </button>
                <button
                  onClick={detectLocation}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition flex items-center gap-2"
                >
                  📍 Detect Current Location
                </button>
              </div>
            </div>

            {/* WATER SOURCE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Water Source</label>
              <select
                value={form.waterSource}
                onChange={(e) => setForm({ ...form, waterSource: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800"
              >
                <option value="">Select water source</option>
                <option value="River">River</option>
                <option value="Lake">Lake</option>
                <option value="Reservoir">Reservoir</option>
                <option value="Groundwater">Groundwater</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <textarea
                rows="4"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what you observed..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-800"
              />
            </div>

            {/* STATUS & ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm font-medium">
                  <span className="animate-pulse">●</span>
                  Pending Review
                </span>
                <span className="text-sm text-gray-500">Reviewed within 24-48 hours</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setForm({ subject: "", latitude: "", longitude: "", waterSource: "", description: "" });
                    setPhoto(null);
                    setPreview(null);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                >
                  Clear Form
                </button>
                <button
                  onClick={handleSubmit}
                  className="submit-btn px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                >
                  Submit Report
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}