// src/components/StatCard.js
import React from "react";

export default function StatCard({
  title,
  value,
  unit = "",
  status = "Normal",
  updatedAt = "",
  color = "",
  icon = ""
}) {
  // Status-based color
  const statusColor =
    status === "Critical"
      ? "bg-red-600 text-white"
      : status === "Warning"
      ? "bg-yellow-400 text-black"
      : "bg-green-600 text-white";

  // Left border colors
  const colorClasses = {
    blue: "border-l-4 border-blue-500",
    green: "border-l-4 border-green-500",
    red: "border-l-4 border-red-500",
    yellow: "border-l-4 border-yellow-500",
    purple: "border-l-4 border-purple-500",
    indigo: "border-l-4 border-indigo-500",
    pink: "border-l-4 border-pink-500",
    gray: "border-l-4 border-gray-500"
  };

  const borderClass = colorClasses[color] || "";

  return (
    <div
      className={`bg-[#222831] p-6 rounded-xl flex flex-col justify-between 
      space-y-4 shadow-md transition hover:shadow-lg ${borderClass}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-400 capitalize">
            {title}
          </p>

          {/* 🔥 VALUE – FIXED */}
          <p className="text-3xl font-bold mt-1 text-white">
            {value}
            {unit && (
              <span className="text-base ml-1 text-gray-300">
                {unit}
              </span>
            )}
          </p>
        </div>

        {icon && (
          <div className="text-2xl opacity-80 text-gray-300">
            {icon}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center text-xs">
        {status && status !== "Normal" ? (
          <span className={`px-3 py-1 rounded-full ${statusColor}`}>
            {status}
          </span>
        ) : (
          <div />
        )}

        {updatedAt && (
          <span className="text-gray-400">
            {updatedAt}
          </span>
        )}
      </div>
    </div>
  );
}
