// src/components/ButtonHelper.js
export const getButtonClass = (page, currentPage) =>
  `w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors duration-150 ${
    currentPage === page
      ? "bg-cyan-600 text-slate-900 font-semibold" // Active State
      : "hover:bg-slate-800/70 text-slate-50" // Inactive State
  }`;
