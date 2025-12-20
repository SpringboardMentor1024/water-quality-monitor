import React from "react";

export default function StatCard({
  title,
  value,
  unit = "",
  status = "Normal",
  updatedAt = ""
}) {
  // Status-based color (can later come from backend)
  const statusColor =
    status === "Critical"
      ? "bg-red-600"
      : status === "Warning"
      ? "bg-yellow-500 text-black"
      : "bg-green-600";

  return (
    <div className="bg-[#222831] p-6 rounded-xl flex flex-col justify-between space-y-4">

      {/* Title */}
      <div>
        <p className="text-sm text-gray-400 capitalize">
          {title}
        </p>
        <p className="text-3xl font-bold mt-1">
          {value}
          {unit && <span className="text-base ml-1">{unit}</span>}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs">
        <span className={`px-3 py-1 rounded-full ${statusColor}`}>
          {status}
        </span>

        {updatedAt && (
          <span className="text-gray-400">
            {updatedAt}
          </span>
        )}
      </div>

    </div>
  );
}
