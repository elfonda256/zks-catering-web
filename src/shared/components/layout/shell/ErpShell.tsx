"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { ErpHeader } from "../header/ErpHeader";
import { ErpSidebar } from "../sidebar/ErpSidebar";
import { ErpGlobalSearch } from "../navigation/ErpGlobalSearch";
import { ErpStatusBar } from "./ErpStatusBar";
import { usePersistentBoolean } from "@/shared/hooks/usePersistentState";

export interface ErpShellProps {
  children: ReactNode;
  user?: {
    name?: string | null;
    role?: string | null;
    email?: string | null;
  };
  onLogout?: () => void;
  showStatusBar?: boolean;
}

export function ErpShell({
  children,
  user,
  onLogout,
  showStatusBar = true,
}: ErpShellProps) {
  // Persistent Sidebar Collapse State via useSyncExternalStore
  const [isSidebarCollapsed, setIsSidebarCollapsed] = usePersistentBoolean(
    "zks_erp_sidebar_collapsed",
    false
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, [setIsSidebarCollapsed]);

  // Global Keyboard Shortcuts (⌘K for Search, ⌘B for Sidebar Toggle)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggleSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggleSidebar]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. TOP HEADER */}
      <ErpHeader
        user={user}
        onLogout={onLogout}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleSidebarMobile={() => setIsMobileNavOpen(true)}
        onToggleSidebarDesktop={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* 2. BODY LAYOUT (Persistent Sidebar + Main Canvas) */}
      <div className="flex-1 flex min-h-0">
        {/* Persistent Collapsible Sidebar */}
        <ErpSidebar
          userRole={user?.role}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-slate-50/60 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* 3. OPTIONAL STATUS BAR */}
      {showStatusBar && (
        <ErpStatusBar
          role={user?.role}
          branchName="Dapur Sentral Karawang (ZKS-HQ)"
        />
      )}

      {/* 4. GLOBAL SEARCH MODAL (⌘K) */}
      <ErpGlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
