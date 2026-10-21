"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/shared/utils/cn";

export interface BranchOption {
  id: string;
  name: string;
  code: string;
  isMain?: boolean;
}

const AVAILABLE_BRANCHES: BranchOption[] = [
  { id: "b-krw", name: "Dapur Sentral Karawang", code: "ZKS-HQ", isMain: true },
  { id: "b-kiic", name: "Dapur Satelit Kawasan KIIC", code: "ZKS-SAT1" },
  { id: "b-sc", name: "Hub Distribusi Surya Cipta", code: "ZKS-HUB1" },
];

export function CompanyBranchSwitch() {
  const [selectedBranch, setSelectedBranch] = useState<BranchOption>(AVAILABLE_BRANCHES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <div className="w-7 h-7 rounded-[8px] bg-blue-600 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-2xs shrink-0">
        Z
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-slate-900 tracking-tight leading-tight">
            PT. Zahdan Kamal Sentosa
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 rounded-[4px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Branch Selector Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors leading-none text-left cursor-pointer"
        >
          <span className="font-medium text-slate-700 truncate max-w-[170px]">
            {selectedBranch.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">({selectedBranch.code})</span>
          <svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Branch Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[12px] border border-slate-200 shadow-lg p-1.5 z-50">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Pilih Unit &amp; Cabang Operasional
          </div>
          <div className="space-y-0.5">
            {AVAILABLE_BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedBranch(b);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 text-left rounded-[8px] text-[12px] transition-colors cursor-pointer",
                  selectedBranch.id === b.id
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <div>
                  <div className="leading-tight">{b.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{b.code}</div>
                </div>
                {selectedBranch.id === b.id && (
                  <span className="text-blue-600 font-bold text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
