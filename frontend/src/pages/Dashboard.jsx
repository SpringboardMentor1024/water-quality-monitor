import React, { useEffect, useState } from "react";
import { getStations } from "../utils/api";
import StationCard from "../components/StationCard";
import { Activity, Shield, Globe, Zap, ExternalLink, Menu, X } from "lucide-react";

const Dashboard = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data || []);
      } catch (err) {
        console.error("Link failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const filteredStations = stations.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.id).includes(searchTerm)
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center font-black text-blue-800 animate-pulse uppercase tracking-[0.2em] text-sm px-6">
        Authenticating Network Hubs...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans transition-all duration-500">
      
      {/* 1. HEADER SECTION (Mobile Optimized) */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-[#1e3a8a] tracking-tighter mb-4 leading-tight">
          Water Quality <br className="block md:hidden" /> Monitoring Dashboard
        </h1>
        <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed w-full border-l-4 border-blue-600 pl-4 md:pl-6 py-2">
          Welcome to the next generation of surveillance. Real-time telemetry from thousands of sensors worldwide, ensuring global safety through precision analytics.
        </p>
      </div>

      {/* 2. TAB NAVIGATION (Mobile Friendly) */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-12">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex p-1.5 md:p-2 overflow-hidden">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 md:py-5 rounded-xl md:rounded-[20px] font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all duration-500 ${
              activeTab === "overview" ? "bg-[#1e3a8a] text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("stations")}
            className={`flex-1 py-3 md:py-5 rounded-xl md:rounded-[20px] font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all duration-500 ${
              activeTab === "stations" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            Stations
          </button>
        </div>
      </div>

      {/* 3. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-12">
          
          {/* STATS (Stacked on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 cursor-pointer">
            <div className="bg-white rounded-[30px] md:rounded-[45px] p-6 md:p-12 shadow-sm border border-slate-100 flex items-center gap-6 md:gap-10 group hover:shadow-xl transition-all duration-500">
              <div className="bg-blue-50 p-5 md:p-8 rounded-2xl md:rounded-[30px] group-hover:bg-[#1e3a8a] transition-colors">
                <Globe className="w-6 h-6 md:w-10 md:h-10 text-[#1e3a8a] group-hover:text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Active Hubs</p>
                <p className="text-3xl md:text-6xl font-black text-[#1e3a8a] tracking-tighter">{stations.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-[30px] md:rounded-[45px] p-6 md:p-12 shadow-sm border border-slate-100 flex items-center gap-6 md:gap-10 group hover:shadow-xl transition-all duration-500">
              <div className="bg-rose-50 p-5 md:p-8 rounded-2xl md:rounded-[30px] group-hover:bg-rose-600 transition-colors">
                <Shield className="w-6 h-6 md:w-10 md:h-10 text-rose-500 group-hover:text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">Detection</p>
                <p className="text-3xl md:text-6xl font-black text-rose-600 tracking-tighter uppercase">Secure</p>
              </div>
            </div>
          </div>

          {/* NETWORK MODULE (Columns to Rows on Mobile) */}
          <div className="bg-white rounded-[35px] md:rounded-[50px] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <div>
                <h3 className="text-xl md:text-3xl font-black text-[#1e3a8a] uppercase tracking-tighter mb-4 md:mb-8">Integrated Telemetry</h3>
                <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed mb-6 md:mb-10">
                  Decentralized sync-engine ingests data from global smart grids. Edge-computing validates pH, Turbidity, and Oxygen before dashboard transmission.
                </p>
                
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-[25px] flex items-center gap-3 md:gap-4">
                    <Zap className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                    <span className="text-[9px] md:text-[11px] font-black text-[#1e3a8a] uppercase tracking-widest">Sync</span>
                  </div>
                  <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-[25px] flex items-center gap-3 md:gap-4">
                    <Activity className="w-4 h-4 md:w-6 md:h-6 text-emerald-600" />
                    <span className="text-[9px] md:text-[11px] font-black text-[#1e3a8a] uppercase tracking-widest">Live</span>
                  </div>
                </div>
              </div>

              {/* HD IMAGE (Fixed height for Mobile) */}
              <div className="bg-white rounded-3xl md:rounded-[40px] overflow-hidden border border-slate-100 h-64 md:h-96 relative cursor-pointer shadow-inner">
                <img 
                  src="/Water network map.png" 
                  alt="Network Map" 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl">
                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-[#1e3a8a]" />
                </div>
              </div>
            </div>
            {/* Background design (Hidden on Mobile) */}
            <div className="hidden md:block absolute -left-20 -bottom-20 text-[20rem] font-black text-slate-50/50 italic pointer-events-none select-none">DATA</div>
          </div>
        </div>
      )}

      {/* 4. STATIONS TAB */}
      {activeTab === "stations" && (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-12">
            <input
              type="text"
              placeholder="Search ID or Region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-white border-none rounded-2xl md:rounded-[25px] px-6 md:px-10 py-4 md:py-5 shadow-sm text-sm md:text-base text-[#1e3a8a] font-bold focus:ring-4 focus:ring-blue-50"
            />
            <button className="bg-[#1e3a8a] text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-[25px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg">
              + New Hub
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {filteredStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
