"use client";

import React, { useState, useCallback, ReactNode } from "react";
import { ErpHeader } from "../header/ErpHeader";
import { ErpSidebar } from "../sidebar/ErpSidebar";
import { usePersistentBoolean } from "@/shared/hooks/usePersistentState";

export interface ErpShellProps {
  children: ReactNode;
  user?: {
    name?: string | null;
    role?: string | null;
    email?: string | null;
  };
  onLogout?: () => void;
}

export function ErpShell({ children, user, onLogout }: ErpShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = usePersistentBoolean(
    "zks_erp_sidebar_collapsed",
    false
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, [setIsSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans text-stone-800 antialiased">
      <ErpHeader
        user={user}
        onLogout={onLogout}
        onToggleSidebarMobile={() => setIsMobileNavOpen(true)}
        onToggleSidebarDesktop={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex-1 flex min-h-0">
        <ErpSidebar
          userRole={user?.role}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
