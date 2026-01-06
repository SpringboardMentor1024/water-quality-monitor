import React from "react";

const StationDetails = ({ apiData }) => {
  // FIXED: The data now comes from apiData.latest_readings or apiData.data
  // This ensures the component works with the new station object structure.
  const d = apiData?.latest_readings ?? apiData?.data ?? apiData ?? {};

  const toNum = (v) => {
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isFinite(n) ? n : null;
  };

  const ph = toNum(d.ph);
  const turbidity = toNum(d.turbidity);
  const tds = toNum(toNum(d.tds) ?? toNum(d.total_dissolved_solids));
  const temperature = toNum(d.temperature);

  const readings = {
    ph: ph !== null ? ph.toFixed(2) : "N/A",
    turbidity: turbidity !== null ? turbidity.toFixed(2) : "N/A",
    tds: tds !== null ? String(Math.round(tds)) : "N/A",
    temperature: temperature !== null ? temperature.toFixed(1) : "N/A",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* pH Level Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl shadow-lg border border-blue-200 text-center">
        <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl text-white font-black shadow-lg">
          pH
        </div>
        <p className="text-5xl font-black text-blue-900 mb-2">{readings.ph}</p>
        <p className="text-sm text-blue-700 font-bold uppercase tracking-wide">Acidity Level</p>
      </div>

      {/* Turbidity Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-3xl shadow-lg border border-indigo-200 text-center">
        <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl text-white font-black shadow-lg">
          💧
        </div>
        <p className="text-5xl font-black text-indigo-900 mb-2">{readings.turbidity}</p>
        <p className="text-sm text-indigo-700 font-bold uppercase tracking-wide">Turbidity NTU</p>
      </div>

      {/* TDS Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-3xl shadow-lg border border-green-200 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl text-white font-black shadow-lg">
          TDS
        </div>
        <p className="text-5xl font-black text-green-900 mb-2">{readings.tds}</p>
        <p className="text-sm text-green-700 font-bold uppercase tracking-wide">Dissolved Solids</p>
        <p className="text-xs text-gray-500 mt-2">ppm</p>
      </div>

      {/* Temperature Card */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-3xl shadow-lg border border-orange-200 text-center">
        <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl text-white font-black shadow-lg">
          🌡️
        </div>
        <p className="text-5xl font-black text-orange-900 mb-2">{readings.temperature}</p>
        <p className="text-sm text-orange-700 font-bold uppercase tracking-wide">Temperature</p>
        <p className="text-xs text-gray-500 mt-2">°C</p>
      </div>
    </div>
  );
};

export default StationDetails;
