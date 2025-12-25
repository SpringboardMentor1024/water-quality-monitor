import React, { useState } from "react";

export default function Reports() {
  const [photo, setPhoto] = useState(null);

  /* =========================
     REPORT HISTORY (UI STATE)
  ========================= */
  const [reports, setReports] = useState([
    {
      id: 1,
      subject: "High turbidity observed",
      status: "Pending",
      date: "2025-02-10",
    },
    {
      id: 2,
      subject: "Unusual smell in water",
      status: "Verified",
      date: "2025-02-08",
    },
    {
      id: 3,
      subject: "Possible chemical discharge",
      status: "Rejected",
      date: "2025-02-06",
    },
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
     SUBMIT HANDLER (UI ONLY)
  ========================= */
  const handleSubmit = () => {
    const newReport = {
      id: reports.length + 1,
      subject: "New Water Quality Report",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setReports([newReport, ...reports]);
    setPhoto(null);
  };

  return (
    <div className="p-4 md:p-8 text-white space-y-10">

      {/* =========================
          REPORT HISTORY
      ========================= */}
      <div>
        <h1 className="text-2xl font-bold mb-4">
          My Submitted Reports
        </h1>

        <div className="bg-[#222831] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#1b1f24] text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Subject</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-t border-gray-700 hover:bg-[#1b1f24]"
                >
                  <td className="px-4 py-3">{report.subject}</td>
                  <td>{report.date}</td>
                  <td>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(
                        report.status
                      )}`}
                    >
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
        <h1 className="text-2xl font-bold mb-6">
          Submit New Water Quality Report
        </h1>

        <div className="max-w-3xl bg-[#222831] p-6 rounded-xl space-y-6">

          {/* SUBJECT */}
          <div>
            <label className="block text-sm mb-2">Subject / Title</label>
            <input
              type="text"
              placeholder="Brief summary of the issue"
              className="w-full bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>

          {/* UPLOAD PHOTO */}
          <div>
            <label className="block text-sm mb-2">Upload Photo</label>

            <label
              htmlFor="upload"
              className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition"
            >
              {photo ? (
                <p className="text-sm text-green-400">
                  {photo.name} selected
                </p>
              ) : (
                <>
                  <span className="text-lg">⬆</span>
                  <p className="text-sm text-gray-400">
                    Drag & drop photo here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}
            </label>

            <input
              id="upload"
              type="file"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>

          {/* LOCATION INFO */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Location Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Latitude"
                className="bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Longitude"
                className="bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2"
              />
            </div>

            <div className="flex gap-3 mt-3">
              <button className="bg-[#2c3440] px-4 py-2 rounded-lg text-sm">
                Select on Map
              </button>
              <button className="bg-[#2c3440] px-4 py-2 rounded-lg text-sm">
                Detect Current Location
              </button>
            </div>
          </div>

          {/* WATER SOURCE */}
          <div>
            <label className="block text-sm mb-2">
              Water Source
            </label>
            <select className="w-full bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2">
              <option>Select water source</option>
              <option>River</option>
              <option>Lake</option>
              <option>Reservoir</option>
              <option>Groundwater</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm mb-2">
              Detailed Description
            </label>
            <textarea
              rows="4"
              placeholder="Describe what you observed..."
              className="w-full bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2 resize-none"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm mb-2">
              Current Status
            </label>
            <span className="inline-block bg-yellow-500 text-black text-xs px-3 py-1 rounded-full">
              Pending Review
            </span>
          </div>

          {/* MODERATION NOTES */}
          <div>
            <label className="block text-sm mb-2">
              Moderation Notes (Read-only)
            </label>
            <textarea
              rows="3"
              readOnly
              className="w-full bg-[#1b1f24] border border-gray-700 rounded-lg px-4 py-2 text-gray-400 resize-none"
              value="Your report is currently being reviewed by our team."
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3">
            <button className="px-5 py-2 rounded-lg bg-gray-600">
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
