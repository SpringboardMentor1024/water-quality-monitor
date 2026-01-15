import React, { useState, useEffect, useMemo } from "react";
import BaseMap from "./BaseMap";
import { getStations } from "../utils/api";

const Locations = () => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStation, setActiveStation] = useState(null);

  useEffect(() => {
    getStations()
      .then((data) => setStations(data || []))
      .catch((err) => console.error("Failed to fetch stations:", err));
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      const search = searchTerm.toLowerCase().trim();
      return (
        s.name?.toLowerCase().includes(search) ||
        s.id?.toString().toLowerCase().includes(search) ||
        s.location?.toLowerCase().includes(search)
      );
    });
  }, [stations, searchTerm]);

  useEffect(() => {
    if (searchTerm.length > 2 && filteredStations.length > 0) {
      setActiveStation(filteredStations[0]);
    }
  }, [searchTerm, filteredStations]);

  return (
    // Responsive padding: p-4 on mobile, p-10 on desktop
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-10 min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans">
      
      {/* Header Container: Responsive padding and font size */}
      <div className="bg-[#1e3a8a] rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="text-center md:text-left">
            {/* Font size: text-3xl on mobile, text-6xl on desktop */}
            <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-tight md:leading-none">
              Geospatial Inventory
            </h1>
            <p className="text-blue-200 text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] mt-2 md:mt-4 font-black">
              Global Node Monitoring // Live System Status
            </p>
          </div>
          
          <button className="w-full md:w-auto bg-white hover:bg-blue-50 text-[#1e3a8a] px-8 md:px-12 py-4 md:py-5 rounded-[18px] md:rounded-[24px] font-black text-[10px] md:text-[12px] uppercase tracking-widest shadow-xl transition-all active:scale-95">
            ＋ Register New Site
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-8 md:mt-10 relative z-10 max-w-2xl mx-auto md:mx-0">
          <input 
            type="text"
            value={searchTerm}
            placeholder="SEARCH STATION OR ID..."
            className="w-full bg-[#314a9c] border border-white/20 rounded-[16px] md:rounded-[20px] py-4 px-6 md:px-8 text-[11px] md:text-[12px] font-black text-white placeholder-blue-300/60 focus:ring-4 focus:ring-white/10 outline-none transition-all uppercase tracking-widest shadow-inner"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid: Stacks on mobile (grid-cols-1), side-by-side on desktop (lg:grid-cols-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 h-auto lg:h-[700px]">
        
        {/* Map Area: Takes full width on mobile, 8 cols on desktop */}
        <div className="order-1 lg:order-none lg:col-span-8 bg-white rounded-[32px] md:rounded-[40px] shadow-xl overflow-hidden border border-blue-100 relative h-[400px] lg:h-full">
          <BaseMap selectedStation={activeStation} />
        </div>

        {/* Site Registry: Stacks below map on mobile, 4 cols on desktop */}
        <div className="order-2 lg:order-none lg:col-span-4 bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-blue-50 shadow-xl flex flex-col overflow-hidden max-h-[500px] lg:max-h-full">
          <div className="flex items-center justify-between mb-6 md:mb-8 border-b-2 border-blue-50 pb-4 md:pb-6">
            <div>
              <h4 className="text-[12px] md:text-[14px] font-black uppercase tracking-widest text-[#1e3a8a] italic">Site Registry</h4>
              <p className="text-[9px] md:text-[10px] text-blue-500 font-bold uppercase mt-1 tracking-wider">{filteredStations.length} Results Found</p>
            </div>
            <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-blue-50 text-[#1e3a8a] text-[10px] md:text-[11px] font-black">
              LIVE
            </div>
          </div>
          
          <div className="flex-1 space-y-3 md:space-y-4 overflow-y-auto pr-2 md:pr-3 custom-scrollbar">
            {filteredStations.map(stn => (
              <button 
                key={stn.id} 
                onClick={() => setActiveStation(stn)}
                className={`w-full text-left p-5 md:p-6 rounded-[24px] md:rounded-[32px] transition-all duration-300 group border-2 ${
                  activeStation?.id === stn.id 
                  ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-xl' 
                  : 'bg-white border-blue-50 text-[#1e3a8a] hover:border-[#1e3a8a] hover:bg-blue-50/50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] md:text-[12px] font-black uppercase truncate leading-tight">
                      {stn.name}
                    </p>
                    <p className={`text-[9px] md:text-[10px] font-black uppercase mt-2 tracking-tighter ${activeStation?.id === stn.id ? 'text-blue-300' : 'text-blue-600'}`}>
                      GEO-NODE: {stn.id}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full mt-1 ${activeStation?.id === stn.id ? 'bg-white animate-pulse' : 'bg-blue-100'}`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
