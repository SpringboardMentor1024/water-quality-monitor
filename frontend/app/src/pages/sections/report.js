import React, { useRef, useState } from "react";
import axios from "axios";

export default function Report() {
  const fileInputRef = useRef(null);

  /* =========================
     FORM STATE (CONTROLLED)
  ========================= */
  const [subject, setSubject] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [description, setDescription] = useState("");

  /* =========================
     FILE + AUTOFILL STATE
  ========================= */
  const [fileName, setFileName] = useState("");
  const [autoFilledFields, setAutoFilledFields] = useState({});
  const [loadingPdf, setLoadingPdf] = useState(false);

  /* =========================
     FILE HANDLERS
  ========================= */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handlePdfUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0]);
    }
  };

  /* =========================
     PDF → BACKEND → AUTOFILL
  ========================= */
  const handlePdfUpload = async (file) => {
    setFileName(file.name);
    setLoadingPdf(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/reports/parse-pdf",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      autofillFromBackend(res.data);
    } catch (err) {
      console.error("PDF parsing failed", err);
    } finally {
      setLoadingPdf(false);
    }
  };

  /* =========================
     AUTOFILL MAPPING
  ========================= */
  const autofillFromBackend = (data) => {
    const filled = {};

    if (data.subject) {
      setSubject(data.subject);
      filled.subject = true;
    }
    if (data.latitude) {
      setLatitude(data.latitude);
      filled.latitude = true;
    }
    if (data.longitude) {
      setLongitude(data.longitude);
      filled.longitude = true;
    }
    if (data.water_source) {
      setWaterSource(data.water_source);
      filled.waterSource = true;
    }
    if (data.description) {
      setDescription(data.description);
      filled.description = true;
    }

    setAutoFilledFields(filled);
  };

  /* =========================
     HELPER: AUTOFILL HIGHLIGHT
  ========================= */
  const autoFillClass = (field) =>
    autoFilledFields[field]
      ? "ring-2 ring-green-400"
      : "";

  return (
    <div className="p-6 text-white">
      <div className="max-w-3xl mx-auto bg-[#222831] rounded-xl p-6 space-y-6">

        <h1 className="text-xl font-bold">
          Submit New Water Quality Report
        </h1>

        {/* =========================
            SUBJECT
        ========================= */}
        <div>
          <label className="text-sm text-gray-400">Subject / Title</label>
          <input
            className={`w-full mt-1 p-2 bg-black rounded ${autoFillClass("subject")}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Unusual discoloration in local river"
          />
        </div>

        {/* =========================
            PDF UPLOAD
        ========================= */}
        <div>
          <label className="text-sm text-gray-400">Upload PDF</label>

          <div
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="mt-2 border border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
          >
            <p className="text-gray-300">
              Drag & drop PDF here or click to upload
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF up to 10MB
            </p>

            {fileName && (
              <p className="text-sm text-green-400 mt-2">
                {loadingPdf ? "Parsing PDF…" : `Uploaded: ${fileName}`}
              </p>
            )}
          </div>

          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* =========================
            LOCATION
        ========================= */}
        <div>
          <h3 className="font-semibold mb-2">Location Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <input
              className={`p-2 bg-black rounded ${autoFillClass("latitude")}`}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude"
            />
            <input
              className={`p-2 bg-black rounded ${autoFillClass("longitude")}`}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
            />
          </div>
        </div>

        {/* =========================
            WATER SOURCE
        ========================= */}
        <div>
          <label className="text-sm text-gray-400">Water Source</label>
          <select
            className={`w-full mt-1 p-2 bg-black rounded ${autoFillClass("waterSource")}`}
            value={waterSource}
            onChange={(e) => setWaterSource(e.target.value)}
          >
            <option value="">Select water source</option>
            <option value="River">River</option>
            <option value="Lake">Lake</option>
            <option value="Groundwater">Groundwater</option>
          </select>
        </div>

        {/* =========================
            DESCRIPTION
        ========================= */}
        <div>
          <label className="text-sm text-gray-400">
            Detailed Description
          </label>
          <textarea
            rows="4"
            className={`w-full mt-1 p-2 bg-black rounded ${autoFillClass("description")}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you observed..."
          />
        </div>

        {/* =========================
            STATUS
        ========================= */}
        <div>
          <h3 className="font-semibold mb-2">
            Report Status & Notes
          </h3>

          <span className="inline-block px-3 py-1 bg-yellow-500 text-black rounded-full text-xs">
            Pending Review
          </span>

          <textarea
            readOnly
            className="w-full mt-3 p-3 bg-black rounded text-gray-400"
            value="Your report is currently being reviewed."
          />
        </div>

        {/* =========================
            ACTIONS
        ========================= */}
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 bg-gray-700 rounded">
            Cancel
          </button>
          <button className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold">
            Submit Report
          </button>
        </div>

      </div>
    </div>
  );
}
