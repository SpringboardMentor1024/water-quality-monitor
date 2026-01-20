import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NgoMap from "../components/NgoMap";
import api from "../utils/api";

export default function NgoDashboard() {
  const navigate = useNavigate();
  const [selectedNgo, setSelectedNgo] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [allStations, setAllStations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stationsRes = await api.get("/stations/");
        setAllStations(stationsRes.data);
        
        const stationNgos = [...new Set(stationsRes.data.map(s => s.managed_by).filter(Boolean))];
        const ngoData = stationNgos.map((name, i) => ({ 
          id: i + 1, 
          name: name || "Government"
        }));
        setNgos(ngoData);
        
        const collabData = stationsRes.data.slice(0, 12).map((station, i) => ({
          id: i + 1,
          ngo_id: i % ngoData.length + 1,
          ngo: ngoData[i % ngoData.length],
          station_id: station.id,
          role: "Water Quality Monitoring"
        }));
        setCollaborations(collabData);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStationStatus = (station) => {
    const rand = Math.random();
    if (rand < 0.05) return "offline";
    if (rand < 0.15) return "warning";
    return "active";
  };

  const filteredStations = allStations.filter(station => {
    const status = getStationStatus(station);
    const ngoMatch = selectedNgo === "All" || 
      station.managed_by === selectedNgo ||
      collaborations.some(c => c.station_id === station.id && 
        ngos.find(n => n.id === c.ngo_id)?.name === selectedNgo);
    
    const statusMatch = selectedStatus === "all" || status === selectedStatus;
    const searchMatch = !searchTerm || 
      station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return ngoMatch && statusMatch && searchMatch;
  });

  const statusCounts = {
    all: filteredStations.length,
    active: filteredStations.filter(s => getStationStatus(s) === "active").length,
    warning: filteredStations.filter(s => getStationStatus(s) === "warning").length,
    offline: filteredStations.filter(s => getStationStatus(s) === "offline").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="text-center max-w-sm w-full">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6 shadow-lg"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Loading WaterWatch Dashboard</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-25 to-white">
      {/* Responsive Blue Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-lg sm:text-xl lg:text-2xl font-black text-white drop-shadow-lg">WW</span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-lg leading-tight truncate">WaterWatch</h1>
                <p className="text-sm sm:text-base lg:text-lg text-blue-100 font-semibold mt-1">NGO Dashboard</p>
              </div>
            </div>
            <div className="ml-auto text-right flex-shrink-0">
              <div className="text-lg sm:text-xl lg:text-3xl font-black">{filteredStations.length} Stations</div>
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 text-sm sm:text-base lg:text-lg font-semibold mt-1 sm:mt-2 text-blue-100 justify-end">
                <span>{statusCounts.active} Active</span>
                <span className="hidden sm:inline mx-1">•</span>
                <span>{statusCounts.warning} Warnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-5 sm:space-y-6 lg:space-y-8 xl:space-y-12">
        {/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-5 sm:mb-6 lg:mb-8">
          {[
            { status: 'all', label: 'Total', count: statusCounts.all, color: 'text-blue-600' },
            { status: 'active', label: 'Active', count: statusCounts.active, color: 'text-emerald-600' },
            { status: 'warning', label: 'Warnings', count: statusCounts.warning, color: 'text-orange-600' },
            { status: 'offline', label: 'Offline', count: statusCounts.offline, color: 'text-slate-600' }
          ].map(({ status, label, count, color }) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`group h-20 sm:h-24 lg:h-28 bg-white/95 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100/50 p-3 sm:p-4 lg:p-5 flex flex-col items-center justify-center font-bold uppercase tracking-wide hover:bg-white hover:border-blue-200 text-left sm:text-center touch-manipulation ${
                selectedStatus === status 
                  ? `ring-4 ring-blue-200/60 border-blue-300 bg-white shadow-blue-300 scale-[1.02]` 
                  : 'hover:scale-[1.02]'
              }`}
            >
              <div className={`text-xl sm:text-2xl lg:text-3xl font-black mb-1 sm:mb-2 group-hover:-translate-y-1 transition-transform ${color}`}>
                {count}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-700 opacity-90 leading-tight">{label}</div>
            </button>
          ))}
        </div>

        {/* PERFECT RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 h-full">
          {/* Sidebar - Filters + Collaborations */}
          <div className="lg:col-span-1 lg:order-1 order-2 space-y-4 sm:space-y-5 lg:space-y-6">
            
            {/* Filters */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-xl border border-blue-100/50 p-4 sm:p-5 lg:p-6 lg:p-8">
              <h3 className="font-black text-base sm:text-lg lg:text-2xl text-gray-900 mb-3 sm:mb-4 lg:mb-6 uppercase tracking-wider border-b border-blue-100 pb-2 sm:pb-3 lg:pb-4">Filters</h3>
              
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <label className="block text-xs sm:text-sm font-bold text-blue-700 mb-2 uppercase tracking-wide">NGO Partner</label>
                <select 
                  value={selectedNgo} 
                  onChange={(e) => setSelectedNgo(e.target.value)}
                  className="w-full p-2.5 sm:p-3 lg:p-4 border-2 border-blue-100 rounded-xl bg-white/90 focus:ring-3 focus:ring-blue-200 focus:border-blue-500 text-sm sm:text-base font-semibold shadow-sm hover:border-blue-200 transition-all"
                >
                  <option>All ({allStations.length})</option>
                  {ngos.slice(0, 8).map(ngo => (
                    <option key={ngo.id} value={ngo.name}>{ngo.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-blue-700 mb-2 uppercase tracking-wide">Search Stations</label>
                <input 
                  type="text" 
                  placeholder="Station name, location..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full p-2.5 sm:p-3 lg:p-4 border-2 border-blue-100 rounded-xl bg-white/90 focus:ring-3 focus:ring-blue-200 focus:border-blue-500 text-sm shadow-sm hover:border-blue-200 transition-all"
                />
              </div>
            </div>

            {/* FIXED Collaborations - SMOOTH SCROLL */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-blue-100/50 flex flex-col h-[380px] sm:h-[420px] lg:h-[500px] xl:h-[550px]">
              <div className="font-black text-base sm:text-lg lg:text-2xl text-gray-900 mb-3 sm:mb-4 lg:mb-6 uppercase tracking-wider flex items-center gap-2 p-4 sm:p-5 lg:p-6 lg:p-8 border-b border-blue-100">
                Collaborations
                <span className="text-lg sm:text-xl lg:text-3xl font-black text-blue-600 ml-auto">{collaborations.length}</span>
              </div>
              
              {/* FIXED SCROLL CONTAINER */}
              <div className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6 scrollbar-thin scrollbar-thumb-blue-300/80 scrollbar-track-blue-100/50 scrollbar-thumb-rounded scrollbar-w-2 hover:scrollbar-thumb-blue-400 transition-all duration-300">
                <div className="space-y-2.5 sm:space-y-3 pb-4 sm:pb-6">
                  {collaborations.slice(0, 8).map((collab, i) => (
                    <div 
                      key={collab.id}
                      className="group p-3 sm:p-4 lg:p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-200/50 hover:border-blue-300 hover:bg-white shadow-sm bg-white/80 touch-manipulation flex-shrink-0"
                      onClick={() => setSelectedNgo(collab.ngo.name)}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md flex-shrink-0 mt-0.5">
                          {collab.ngo.name.slice(0,2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="font-bold text-sm sm:text-base lg:text-base text-gray-900 mb-1 group-hover:text-blue-700 truncate leading-tight">
                            {collab.ngo.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2 leading-tight">Water Quality Monitoring</p>
                          <div className="flex items-center gap-2 text-xs sm:text-sm leading-tight">
                            <span className="px-2.5 sm:px-3 py-1 bg-white/90 border border-blue-200/60 rounded-lg font-bold text-blue-700 text-xs shadow-sm">
                              STN-{collab.station_id}
                            </span>
                            <span className="text-gray-500 font-medium whitespace-nowrap">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-1 xl:col-span-3 order-1 lg:order-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Map */}
            <div className="bg-gradient-to-b from-gray-900/95 to-black/90 rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-800/50 overflow-hidden">
              <div className="bg-black/95 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 text-white border-b border-gray-700/50 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4">
                  <h2 className="text-lg sm:text-xl lg:text-3xl font-black tracking-tight">Live Stations Map</h2>
                  <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-xs sm:text-sm lg:text-lg">
                    <span>{filteredStations.length} stations</span>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-3 lg:h-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="h-56 sm:h-64 lg:h-72 xl:h-96 p-3 sm:p-4 lg:p-6 xl:p-8 bg-gradient-to-b from-gray-900/80 to-black/70 border-t border-gray-700/30">
                <NgoMap stations={filteredStations} />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-blue-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 text-white shadow-lg">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight">Stations Overview</h2>
              </div>
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <table className="w-full min-w-[480px] sm:min-w-[520px]">
                  <thead>
                    <tr className="bg-white/60">
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wider border-b border-blue-100">Station</th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wider border-b border-blue-100 hidden md:table-cell">Status</th>
                      <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wider border-b border-blue-100 hidden lg:table-cell">Partner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStations.slice(0, 5).map((station, i) => {
                      const status = getStationStatus(station);
                      const statusColors = {
                        active: 'text-emerald-600 bg-emerald-100/60 border-emerald-200',
                        warning: 'text-orange-600 bg-orange-100/60 border-orange-200',
                        offline: 'text-slate-600 bg-slate-100/60 border-slate-200'
                      }[status];
                      
                      return (
                        <tr 
                          key={station.id}
                          className="border-t border-blue-50/50 hover:bg-blue-25/30 transition-all cursor-pointer group"
                          onClick={() => navigate(`/ngo/station/${station.id}`)}
                        >
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                            <div className="font-black text-sm sm:text-base lg:text-xl text-gray-900 group-hover:text-blue-700 leading-tight">
                              {station.name || `STN-${station.id}`}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 mt-0.5">{station.location || 'Location'}</div>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden md:table-cell">
                            <span className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold capitalize shadow-sm border font-semibold ${statusColors}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden lg:table-cell">
                            <div className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900">
                              {station.managed_by || "Government"}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
