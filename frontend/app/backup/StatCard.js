import React from "react";

export default function StatCard({
  title,
  value,
  unit,
  status = "Normal",
  updatedAt
}) {
  const statusStyles = {
    Normal: "bg-green-700/30 text-green-400",
    Warning: "bg-yellow-600/30 text-yellow-400",
    Alert: "bg-red-700/30 text-red-400"
  };

  return (
    <div className="bg-[#222831] p-6 rounded-xl flex flex-col justify-between">
      {/* Title */}
      <p className="text-sm text-gray-400 capitalize mb-2">
        {title}
      </p>

      {/* Value */}
      <div>
        <span className="text-3xl font-bold">
          {value ?? "—"}
        </span>
        {unit && (
          <span className="text-sm text-gray-400 ml-1">
            {unit}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            statusStyles[status] || statusStyles.Normal
          }`}
        >
          {status}
        </span>

        {updatedAt && (
          <span className="text-xs text-gray-500">
            {updatedAt}
          </span>
        )}
      </div>
    </div>
  );
}
