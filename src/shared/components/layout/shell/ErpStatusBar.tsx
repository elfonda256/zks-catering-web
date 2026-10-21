"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

interface ErpStatusBarProps {
  branchName?: string;
  role?: string | null;
  className?: string;
}

export function ErpStatusBar({
  branchName = "Dapur Sentral Karawang (ZKS-HQ)",
  role = "OPERATIONS_LEAD",
  className,
}: ErpStatusBarProps) {
  return (
    <footer
      className={cn(
        "h-7 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0 select-none z-10",
        className
      )}
    >
      {/* Left: Operational status and DB connection */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-700 font-medium font-sans">Sistem Operasional</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <span className="text-slate-500 hidden sm:inline">DB: PostgreSQL Local (zks_catering_dev)</span>
      </div>

      {/* Center: Keyboard helpers (hidden on small screens) */}
      <div className="hidden md:flex items-center gap-4 text-slate-400 font-sans text-[10px]">
        <span><kbd className="font-mono bg-slate-100 border border-slate-200 px-1 py-0.2 rounded">⌘K</kbd> Cari Objek</span>
        <span><kbd className="font-mono bg-slate-100 border border-slate-200 px-1 py-0.2 rounded">⌘B</kbd> Toggle Sidebar</span>
        <span><kbd className="font-mono bg-slate-100 border border-slate-200 px-1 py-0.2 rounded">ESC</kbd> Tutup Dialog</span>
      </div>

      {/* Right: Active branch and latency */}
      <div className="flex items-center gap-3">
        <span className="hidden lg:inline text-slate-600 truncate max-w-[200px]">
          {branchName}
        </span>
        <span className="text-slate-300 hidden lg:inline">|</span>
        <span className="text-slate-400 font-mono text-[10px]">
          Otoritas: {role || "ADMIN"}
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-emerald-700 font-medium">Sync OK · 12ms</span>
      </div>
    </footer>
  );
}
