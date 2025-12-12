// src/pages/Settings.js
import React, { useState } from "react";
import { FiSettings, FiBell, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const Settings = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const [phWarning, setPhWarning] = useState(7.8);
  const [phCritical, setPhCritical] = useState(6.5);
  const [turbidityWarning, setTurbidityWarning] = useState(5);
  const [turbidityCritical, setTurbidityCritical] = useState(10);
  const [tempCritical, setTempCritical] = useState(30);

  const handleSave = () => {
    console.log("Saving settings payload:", { phWarning, phCritical, turbidityWarning, turbidityCritical, tempCritical, emailNotifications });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-50"><FiSettings className="text-cyan-400" /> System Configuration</h2>

      {isSaved && (
        <div className="p-3 bg-emerald-700/50 text-emerald-100 rounded-lg border border-emerald-600 flex items-center gap-2">
          <FiCheckCircle className="w-5 h-5" /> <span>Settings UI complete. Payload logged for backend team.</span>
        </div>
      )}

      <section className="bg-slate-800/60 p-5 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400"><FiBell /> Notification Channels</h3>
        {/* TODO: add toggle switches if needed */}
        <button onClick={handleSave} className="mt-4 px-6 py-2 rounded-full bg-cyan-600 text-slate-900 text-sm font-bold hover:bg-cyan-500 transition duration-150">Save All Settings</button>
      </section>

      <section className="bg-slate-800/60 p-5 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-red-400"><FiAlertTriangle /> Critical Thresholds</h3>

        <div className="mb-6 pb-4 border-b border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1"><h4 className="font-medium mb-3 text-slate-200">pH Level</h4></div>
          <div>
            <label htmlFor="ph_warning" className="block text-xs font-medium text-slate-400 mb-1">Warning (Min)</label>
            <input type="number" id="ph_warning" min="0" max="14" step="0.1" value={phWarning} onChange={(e) => setPhWarning(e.target.value)} className="w-full p-2 rounded-md bg-slate-900 border border-slate-700 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
          <div>
            <label htmlFor="ph_critical" className="block text-xs font-medium text-slate-400 mb-1">Critical (Max)</label>
            <input type="number" id="ph_critical" min="0" max="14" step="0.1" value={phCritical} onChange={(e) => setPhCritical(e.target.value)} className="w-full p-2 rounded-md bg-slate-900 border border-slate-700 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
        </div>

        <div className="mb-6 pb-4 border-b border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1"><h4 className="font-medium mb-3 text-slate-200">Turbidity (NTU)</h4></div>
          <div>
            <label htmlFor="turbidity_warning" className="block text-xs font-medium text-slate-400 mb-1">Warning (Above)</label>
            <input type="number" id="turbidity_warning" min="0" max="1000" step="1" value={turbidityWarning} onChange={(e) => setTurbidityWarning(e.target.value)} className="w-full p-2 rounded-md bg-slate-900 border border-slate-700 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
          <div>
            <label htmlFor="turbidity_critical" className="block text-xs font-medium text-slate-400 mb-1">Critical (Above)</label>
            <input type="number" id="turbidity_critical" min="0" max="1000" step="1" value={turbidityCritical} onChange={(e) => setTurbidityCritical(e.target.value)} className="w-full p-2 rounded-md bg-slate-900 border border-slate-700 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1"><h4 className="font-medium mb-3 text-slate-200">Temperature (°C)</h4></div>
          <div className="col-span-2">
            <label htmlFor="temp_critical" className="block text-xs font-medium text-slate-400 mb-1">Critical (Above)</label>
            <input type="number" id="temp_critical" min="0" max="100" step="0.1" value={tempCritical} onChange={(e) => setTempCritical(e.target.value)} className="w-full p-2 rounded-md bg-slate-900 border border-slate-700 text-sm focus:ring-cyan-500 focus:border-cyan-500" />
          </div>
        </div>

      </section>

      <button onClick={handleSave} className="mt-4 px-6 py-2 rounded-full bg-cyan-600 text-slate-900 text-sm font-bold hover:bg-cyan-500 transition duration-150 shadow-lg shadow-cyan-500/30">Save All Settings</button>
    </div>
  );
};

export default Settings;
