"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface UserProfileMenuProps {
  user?: {
    name?: string | null;
    role?: string | null;
    email?: string | null;
  };
  onLogout?: () => void;
}

export function UserProfileMenu({ user, onLogout }: UserProfileMenuProps) {
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

  const displayName = user?.name || "Admin Operasional";
  const displayRole = user?.role || "OPERATIONS_LEAD";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-[10px] hover:bg-slate-100 transition-colors cursor-pointer text-left focus:outline-none"
        title="Menu Profil & Sesi"
      >
        <div className="w-8 h-8 rounded-[8px] bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
          {initials}
        </div>
        <div className="hidden xl:flex flex-col text-left">
          <span className="text-[12px] font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
            {displayName}
          </span>
          <span className="text-[10px] text-slate-400 font-mono leading-none">
            {displayRole}
          </span>
        </div>
        <svg className="w-3 h-3 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Profile Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-[12px] border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <div className="text-[13px] font-semibold text-slate-900 leading-tight">
              {displayName}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {user?.email || "admin@zks-catering.com"}
            </div>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold">
              Otoritas: {displayRole}
            </div>
          </div>

          <div className="space-y-0.5">
            <Link
              href="/"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2 text-left rounded-[8px] text-[12px] text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Lihat Website Publik</span>
              </span>
              <span className="text-[10px] text-slate-400">Baru</span>
            </Link>

            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-[8px] text-[12px] text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Beranda Operasional</span>
            </Link>
          </div>

          {onLogout && (
            <div className="pt-1 mt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-[8px] text-[12px] font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Keluar dari Sesi ERP</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
