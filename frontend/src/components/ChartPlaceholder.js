// src/components/ChartPlaceholder.js
import React from "react";

const ChartPlaceholder = ({ title }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 h-64 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-slate-50">{title}</h2>
        <span className="text-xs text-slate-400">Mock chart</span>
      </div>
      <div className="flex-1 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-xs text-slate-500">
        Chart will come here (based on backend data)
      </div>
    </div>
  );
};

export default ChartPlaceholder;
