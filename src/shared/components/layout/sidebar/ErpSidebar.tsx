"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { erpNavSections } from "./sidebar-config";
import { ErpUserRole } from "./types";
import { usePersistentRecord } from "@/shared/hooks/usePersistentState";

interface ErpSidebarProps {
  userRole?: ErpUserRole | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const DEFAULT_EXPANDED_SECTIONS: Record<string, boolean> = (() => {
  const initial: Record<string, boolean> = {};
  erpNavSections.forEach((s) => {
    initial[s.id] = s.defaultExpanded ?? true;
  });
  return initial;
})();

export function ErpSidebar({
  userRole,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: ErpSidebarProps) {
  const pathname = usePathname();

  // Persistent section expanded state via useSyncExternalStore
  const [expandedSections, setExpandedSections] = usePersistentRecord(
    "zks_erp_sidebar_expanded_sections",
    DEFAULT_EXPANDED_SECTIONS
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Filter sections and items based on role
  const visibleSections = useMemo(() => {
    const normalizedRole = (userRole || "ADMIN").toUpperCase();
    const isAdmin =
      normalizedRole === "ADMIN" ||
      normalizedRole === "SUPERADMIN" ||
      normalizedRole === "MANAGEMENT";

    return erpNavSections
      .filter((section) => {
        if (isAdmin) return true;
        if (!section.allowedRoles) return true;
        return section.allowedRoles.includes(normalizedRole);
      })
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (isAdmin) return true;
          if (!item.allowedRoles) return true;
          return item.allowedRoles.includes(normalizedRole);
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [userRole]);

  const isActive = (href: string, exact?: boolean) => {
    if (href === "#") return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const renderNavContent = (collapsed: boolean) => (
    <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 select-none">
      {visibleSections.map((section) => {
        const isSectionExpanded = expandedSections[section.id] ?? true;
        const hasActiveChild = section.items.some((item) => isActive(item.href, item.exact));

        return (
          <div key={section.id} className="space-y-0.5">
            {/* Section Header */}
            {!collapsed ? (
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 tracking-wider uppercase transition-colors"
              >
                <span className={cn(hasActiveChild && "text-blue-700 font-bold")}>
                  {section.title}
                </span>
                <svg
                  className={cn(
                    "w-3 h-3 text-slate-400 transition-transform duration-150",
                    isSectionExpanded ? "rotate-90" : "rotate-0"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div className="h-2" />
            )}

            {/* Section Items */}
            {(!collapsed ? isSectionExpanded : true) && (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  const isRoadmap = item.href === "#";

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      onClick={(e) => {
                        if (isRoadmap) {
                          e.preventDefault();
                          return;
                        }
                        if (isMobileOpen) onCloseMobile();
                      }}
                      className={cn(
                        "group relative flex items-center justify-between px-3 py-2 rounded-[12px] text-[13px] font-medium transition-all duration-100",
                        active
                          ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent",
                        isRoadmap && "opacity-55 cursor-not-allowed hover:bg-transparent hover:text-slate-500",
                        collapsed && "justify-center px-0 py-2.5"
                      )}
                    >
                      {/* Active indicator bar on collapsed */}
                      {collapsed && active && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
                      )}

                      <span className="truncate">
                        {collapsed ? item.label.slice(0, 2).toUpperCase() : item.label}
                      </span>

                      {!collapsed && item.badge && (
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-[6px] font-medium transition-colors",
                            item.badgeVariant === "warning" && "bg-amber-100 text-amber-800",
                            item.badgeVariant === "danger" && "bg-rose-100 text-rose-800",
                            item.badgeVariant === "success" && "bg-emerald-100 text-emerald-800",
                            (!item.badgeVariant || item.badgeVariant === "neutral") &&
                              "bg-slate-100 text-slate-500"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-slate-200 shrink-0 transition-all duration-200 ease-in-out sticky top-14 h-[calc(100vh-3.5rem)] z-20",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {renderNavContent(isCollapsed)}

        {/* Sidebar Footer with Collapse Toggle Button & Version */}
        <div className="p-2.5 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-400">
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-[10px] text-slate-500">ZKS ERP v2.5</span>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "p-1.5 rounded-[8px] text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors",
              isCollapsed && "mx-auto"
            )}
            title={isCollapsed ? "Buka Sidebar (⌘B)" : "Perkecil Sidebar (⌘B)"}
          >
            <svg
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[6px] bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  Z
                </div>
                <span className="font-semibold text-slate-900 text-[14px]">ZKS ERP Navigation</span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-[8px] text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            {renderNavContent(false)}
          </div>
        </div>
      )}
    </>
  );
}
