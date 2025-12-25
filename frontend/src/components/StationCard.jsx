import React from "react";
import { useNavigate } from "react-router-dom";

const StationCard = ({ station }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/station/${station.id}`)}
      className="bg-white p-6 rounded-3xl shadow-md border border-blue-50 hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
          📍
        </div>
        <span className="text-[10px] font-black px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-widest">
          Online
        </span>
      </div>

      <h3 className="text-xl font-black text-blue-900 uppercase tracking-tighter mb-1">{station.name}</h3>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-4">{station.location}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-blue-50">
        <span className="text-[10px] font-black text-gray-400 uppercase">Managed by: {station.managed_by}</span>
        <span className="text-blue-600 font-black text-xs group-hover:translate-x-1 transition-transform">VIEW DETAILS →</span>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-4 -bottom-4 text-blue-50 text-6xl font-black opacity-20 group-hover:text-blue-100 transition-colors">
        {station.id}
      </div>
    </div>
  );
};

export default StationCard;