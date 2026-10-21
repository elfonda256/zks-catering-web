"use client";

import React from "react";
import { CompanyBranchSwitch } from "./CompanyBranchSwitch";
import { UserProfileMenu } from "./UserProfileMenu";
import { DarkModeToggle } from "./DarkModeToggle";
import { ErpNotificationCenter } from "../navigation/ErpNotificationCenter";

interface ErpHeaderProps {
  user?: {
    name?: string | null;
    role?: string | null;
    email?: string | null;
  };
  onLogout?: () => void;
  onOpenSearch: () => void;
  onToggleSidebarMobile: () => void;
  onToggleSidebarDesktop?: () => void;
  isSidebarCollapsed?: boolean;
}

export function ErpHeader({
  user,
  onLogout,
  onOpenSearch,
  onToggleSidebarMobile,
  onToggleSidebarDesktop,
  isSidebarCollapsed,
}: ErpHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Nav Toggle + Desktop Sidebar Toggle + Current Company & Branch */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className="md:hidden p-1.5 rounded-[8px] text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Buka navigasi mobile"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Sidebar Toggle Button */}
        {onToggleSidebarDesktop && (
          <button
            type="button"
            onClick={onToggleSidebarDesktop}
            className="hidden md:flex p-1.5 rounded-[8px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Buka Sidebar (⌘B)" : "Perkecil Sidebar (⌘B)"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
        )}

        {/* 1. Current Company & 2. Current Branch */}
        <div className="pl-1 border-l border-slate-200 ml-1">
          <CompanyBranchSwitch />
        </div>
      </div>

      {/* Center: 3. Global Search Input Bar (⌘K Trigger) */}
      <div className="flex-1 max-w-md mx-4 lg:mx-8">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full h-8 pl-3 pr-2 flex items-center justify-between text-[12px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-[8px] text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Buka Pencarian Global (⌘K)"
        >
          <div className="flex items-center gap-2 truncate">
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="truncate">Cari Item, Supplier, PO, PR (⌘K)...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded-[4px] shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Notification, Dark Mode Toggle, Current User & Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 4. Notification Center */}
        <ErpNotificationCenter />

        {/* 5. Dark Mode Toggle (prepare only) */}
        <DarkModeToggle />

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* 6. Current User & 7. Profile Menu */}
        <UserProfileMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}
