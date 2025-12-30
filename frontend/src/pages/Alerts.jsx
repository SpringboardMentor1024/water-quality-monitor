import React from "react";

const Alerts = () => {
  const activeAlerts = [
    { id: 1, type: "High Turbidity Spike", location: "Intake Site A", value: "15 NTU", limit: "5 NTU", status: "CRITICAL", time: "10:52 AM" },
    { id: 2, type: "pH Level Low", location: "Storage Tank B", value: "6.2", limit: "6.5", status: "WARNING", time: "09:50 AM" },
    { id: 3, type: "Dissolved Oxygen Crash", location: "Aeration Pond D", value: "3.2 mg/L", limit: "4.0 mg/L", status: "CRITICAL", time: "07:15 AM" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-blue-100 pb-4">
        <h1 className="text-3xl font-bold text-blue-900">System Alerts & Event Log</h1>
        <div className="flex gap-4 text-sm font-bold">
          <span className="text-red-600 border-b-2 border-red-600 pb-1 cursor-pointer">Active Alerts (3)</span>
          <span className="text-gray-400 hover:text-blue-600 cursor-pointer transition">Historical Log</span>
        </div>
      </div>

      <div className="space-y-4">
        {activeAlerts.map((alert) => (
          <div key={alert.id} className="bg-white p-5 rounded-xl shadow-sm border border-blue-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-gray-800 text-lg uppercase">{alert.type}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${alert.status === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-white'}`}>
                  {alert.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-bold">{alert.location} • {alert.time}</p>
              <p className="text-sm text-gray-600">Current value <span className="font-bold text-blue-700">{alert.value}</span> exceeded the safety limit of <span className="font-bold text-gray-800">{alert.limit}</span>.</p>
            </div>
            <button className="w-full md:w-auto bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest px-6 py-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition">
              Acknowledge Alert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;