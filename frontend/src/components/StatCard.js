// src/components/StatCard.js
import React from "react";

const StatCard = ({ label, value, status }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm flex flex-col gap-1">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-emerald-400">{status}</p>
    </div>
  );
};

export default StatCard;
