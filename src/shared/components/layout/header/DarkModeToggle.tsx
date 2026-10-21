"use client";

import React, { useState } from "react";

export function DarkModeToggle() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsTooltipOpen(!isTooltipOpen)}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        className="p-1.5 rounded-[8px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Toggle dark mode (prepared)"
        title="Mode Tampilan: Terang (Mode Gelap Siap Diaktifkan)"
      >
        {/* Sun / Moon icon indicating daylight enterprise mode */}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>

      {isTooltipOpen && (
        <div className="absolute top-full right-0 mt-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-[8px] shadow-md whitespace-nowrap z-50 animate-in fade-in zoom-in-95 pointer-events-none">
          Tema: Terang (EDS 8pt Foundation)
        </div>
      )}
    </div>
  );
}
