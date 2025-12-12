// src/pages/Locations.js
import React from "react";
import MapComponent from "../components/MapComponent";
import { FiMapPin, FiList } from "react-icons/fi";

const sampleSites = [
  { id: 1, name: "Intake Site A", status: "Normal", lastReading: "7.2 pH" },
  { id: 2, name: "Storage Tank B", status: "Warning", lastReading: "8.8 NTU" },
  { id: 3, name: "Filter Output C", status: "Normal", lastReading: "23°C" },
];

const Locations = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-50"><FiMapPin className="text-cyan-400" /> Sensor Locations & Base Map</h2>

      <MapComponent />

      <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiList className="text-slate-400" /> Site Status Overview</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Site Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Reading</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sampleSites.map(site => (
                <tr key={site.id} className="hover:bg-slate-700/30 transition duration-100">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-100">{site.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{site.lastReading}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      site.status === 'Normal' ? 'bg-emerald-500/20 text-emerald-400' :
                      site.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                    }`}>{site.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Locations;
