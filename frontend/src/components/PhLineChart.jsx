import React from "react";

const PhLineChart = ({ barHeights, isWarning }) => {
  return (
    <div className="w-full h-full flex items-end justify-between p-4 gap-3 bg-blue-50/30 rounded-2xl border border-dashed border-blue-100">
      {barHeights.map((h, index) => (
        <div 
          key={index}
          style={{ height: `${h}%` }}
          className={`w-full rounded-t-xl transition-all duration-500 ease-in-out cursor-help relative group ${
            isWarning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {/* Tooltip to show value on hover */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {h}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default PhLineChart;