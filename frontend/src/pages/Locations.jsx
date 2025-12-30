import React, { useState, useEffect } from "react";
import BaseMap from "./BaseMap";
import { getStations } from "../utils/api";

const Locations = () => {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStation, setActiveStation] = useState(null);

  useEffect(() => { getStations().then(setStations); }, []);

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="px-2">
        <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter italic">Geospatial Inventory</h1>
      </div>

      {/* Search Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 relative group w-full">
          <input 
            type="text"
            placeholder="Search geospatial markers..."
            className="w-full bg-white border-2 border-blue-50 rounded-2xl py-3 px-6 pl-12 text-[10px] font-bold shadow-sm focus:border-blue-400 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-full lg:w-auto bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
          ＋ Register Site
        </button>
      </div>

      {/* Map Section */} 
      <div className="bg-blue-900 rounded-[32px] shadow-2xl overflow-hidden border-4 border-white relative z-0 h-[650px]">
        <BaseMap selectedStation={activeStation} />
        
        {/* COMPACT RIGHT-SIDE INDEX */}
        <div className="absolute top-4 right-4 bg-blue-900/85 backdrop-blur-md p-3 rounded-2xl border border-blue-400 text-white z-10 shadow-2xl w-48">
          <h4 className="text-[8px] font-black uppercase tracking-widest text-blue-300 mb-2 italic border-b border-blue-800 pb-1">Station Index</h4>
          
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredStations.map(stn => (
              <button 
                key={stn.id} 
                onClick={() => setActiveStation(stn)}
                className={`w-full text-left p-2 rounded-xl transition-all border ${
                  activeStation?.id === stn.id ? 'bg-blue-800 border-blue-400 shadow-sm' : 'hover:bg-blue-800/40 border-transparent'
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <p className="text-[8px] font-black uppercase text-white truncate leading-none">{stn.name}</p>
                  <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${activeStation?.id === stn.id ? 'bg-yellow-400' : 'bg-green-500'}`}></span>
                </div>
                <p className="text-[7px] font-bold text-blue-400 uppercase italic mt-0.5 truncate">{stn.location}</p>
              </button>
            ))}
          </div>
          
          <p className="text-[6px] font-black text-blue-500 mt-2 uppercase text-center opacity-60 tracking-tighter italic">Select to zoom</p>
        </div>
      </div>
    </div>
  );
};

export default Locations;