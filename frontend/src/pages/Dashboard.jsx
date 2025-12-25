import React, { useEffect, useState } from "react";
import { getStations, addStation } from "../utils/api";
import StationCard from "../components/StationCard";
import ChartPlaceholder from "../components/ChartPlaceholder";
import PhLineChart from "../components/PhLineChart";

const Dashboard = () => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStations().then((data) => {
      setStations(data);
      setLoading(false);
    });
  }, []);

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center font-black text-blue-800 animate-pulse">SYNCING NETWORK...</div>;

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Top Overview Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tighter uppercase italic">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium">Live monitoring of your water quality network.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 min-w-[140px] text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Stations</p>
            <p className="text-3xl font-black text-blue-700">4</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 min-w-[140px] text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Alerts</p>
            <p className="text-3xl font-black text-red-500">2</p>
          </div>
        </div>
      </div>

      {/* Analytical Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartPlaceholder title="Network pH Stability (Avg)">
          <PhLineChart barHeights={[40, 60, 90, 70, 85, 50]} isWarning={false} />
        </ChartPlaceholder>
        <ChartPlaceholder title="Turbidity & Dissolved Oxygen Index">
          <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50/30 rounded-[40px] border-2 border-dashed border-blue-100 p-10">
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="animate-bounce text-xl">🌊</span>
             </div>
             <p className="text-blue-400 italic text-[10px] font-black uppercase tracking-widest text-center">Stream Processing Dynamic Data...</p>
          </div>
        </ChartPlaceholder>
      </div>

      {/* SEARCH AND STATION LIST SECTION */}
      <section className="space-y-8 pt-6 border-t border-blue-50">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative group w-full">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale group-focus-within:grayscale-0 transition-all opacity-50">🔍</span>
            <input 
              type="text"
              placeholder="Search stations by name, ID, or location..."
              className="w-full bg-white border-2 border-blue-50 rounded-2xl py-4 px-6 pl-14 text-sm font-bold shadow-sm focus:border-blue-400 focus:ring-0 outline-none transition-all placeholder:text-gray-300"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="w-full lg:w-auto bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-800 transition-all active:scale-95">
            ＋ Add Monitoring Point
          </button>
        </div>

        <h2 className="text-2xl font-black text-blue-900 tracking-tighter uppercase italic border-l-8 border-blue-700 pl-4">
          Active River Stations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredStations.map((s) => (
            <StationCard key={s.id} station={s} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;