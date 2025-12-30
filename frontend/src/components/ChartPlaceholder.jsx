import React from "react";

const ChartPlaceholder = ({ title, children }) => {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-blue-50 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-blue-800 uppercase tracking-widest italic border-l-4 border-blue-600 pl-3">
          {title}
        </h3>
        <div className="flex gap-2">
           <span className="w-2 h-2 rounded-full bg-blue-200 animate-pulse"></span>
           <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-75"></span>
           <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-150"></span>
        </div>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full relative">
        {children}
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-50 flex justify-center">
         <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Real-time Telemetry Streamed</p>
      </div>
    </div>
  );
};

export default ChartPlaceholder;