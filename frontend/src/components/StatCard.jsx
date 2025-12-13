const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-[#020617] rounded-lg p-4 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="text-slate-400">{icon}</div>
    </div>
  );
};

export default StatCard;
