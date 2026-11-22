"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UserProfileMenu } from "./UserProfileMenu";

interface ErpHeaderProps {
  user?: {
    name?: string | null;
    role?: string | null;
    email?: string | null;
  };
  onLogout?: () => void;
  onToggleSidebarMobile: () => void;
  onToggleSidebarDesktop?: () => void;
  isSidebarCollapsed?: boolean;
}

export function ErpHeader({
  user,
  onLogout,
  onToggleSidebarMobile,
  onToggleSidebarDesktop,
  isSidebarCollapsed,
}: ErpHeaderProps) {
  const sidebarLabel = isSidebarCollapsed ? "Buka sidebar" : "Perkecil sidebar";

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className="md:hidden p-1.5 rounded-[8px] text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Buka menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {onToggleSidebarDesktop && (
          <button
            type="button"
            onClick={onToggleSidebarDesktop}
            className="hidden md:flex p-1.5 rounded-[8px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={sidebarLabel}
            title={sidebarLabel}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
        )}

        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 rounded-[8px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Admin ZKS Catering"
        >
          {/* Served unoptimized: the emblem file is already sized for 2x displays */}
          <Image src="/images/zks-emblem.png" alt="" width={38} height={24} unoptimized priority />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight text-ink">ZKS Catering</span>
            <span className="text-[11px] font-medium text-brand-600 mt-1">Panel admin</span>
          </span>
        </Link>
      </div>

      <UserProfileMenu user={user} onLogout={onLogout} />
    </header>
  );
}
