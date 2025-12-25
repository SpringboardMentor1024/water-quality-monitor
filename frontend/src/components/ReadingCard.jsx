const ReadingCard = ({ label, value, unit, status }) => {
  const statusStyles = {
    Normal: "bg-green-500 text-white",
    Warning: "bg-yellow-500 text-white",
    Alert: "bg-red-600 text-white",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-50 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-4xl font-black text-blue-900 tracking-tighter">{value}</h2>
        <span className="text-sm font-bold text-gray-400">{unit}</span>
      </div>
    </div>
  );
};

export default ReadingCard;