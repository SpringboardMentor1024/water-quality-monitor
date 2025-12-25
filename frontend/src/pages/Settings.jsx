import React from "react";

const Settings = () => {
  const thresholds = [
    { label: "pH Level", warning: "7.8", critical: "6.5", unit: "" },
    { label: "Turbidity (NTU)", warning: "5", critical: "10", unit: "(Above)" },
    { label: "Temperature (°C)", warning: "30", critical: "35", unit: "" },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">System Configuration</h1>
          <p className="text-sm text-gray-500">Manage monitoring parameters and alert thresholds.</p>
        </div>
        <button className="bg-blue-600 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-95">
          Save All Settings
        </button>
      </div>

      {/* Notification Section */}
      <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-5">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-2xl border border-blue-100">🔔</div>
        <div>
          <h3 className="font-bold text-blue-900">Notification Channels</h3>
          <p className="text-xs text-gray-500 italic">Configure automated SMS, Email, and Webhook alerts for field technicians.</p>
        </div>
      </div>

      {/* Critical Thresholds Table Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-red-600 uppercase flex items-center gap-2 italic underline decoration-red-200 underline-offset-4 tracking-widest">
          ⚠ Critical Safety Thresholds
        </h3>
        <div className="bg-white rounded-2xl shadow-md border border-blue-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-900 text-white text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="p-5">Monitoring Parameter</th>
                  <th className="p-5">Warning (Min)</th>
                  <th className="p-5">Critical (Max)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 text-sm">
                {thresholds.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-5 font-bold text-gray-800">{row.label}</td>
                    <td className="p-5">
                      <input 
                        type="text" 
                        defaultValue={row.warning} 
                        className="w-20 bg-blue-50 border border-blue-100 p-2.5 rounded-lg text-center font-black text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                      />
                    </td>
                    <td className="p-5 flex items-center gap-3">
                      <input 
                        type="text" 
                        defaultValue={row.critical} 
                        className="w-20 bg-red-50 border border-red-100 p-2.5 rounded-lg text-center font-black text-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none" 
                      />
                      <span className="text-[10px] text-gray-400 uppercase font-bold italic">{row.unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;