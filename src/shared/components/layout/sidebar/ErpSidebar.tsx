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

/**
 * Standard enterprise SVG icons (18x18, strokeWidth 1.75)
 */
function getNavIcon(id: string) {
  switch (id) {
    case "dash-main":
    case "dash-orders":
    case "dashboard":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "sales-orders":
    case "sales":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case "inv-command":
    case "inventory":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case "inv-items":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      );
    case "inv-receiving":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "inv-transfers":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    case "inv-movements":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    case "inv-opname":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "proc-pr":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "proc-po":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "proc-supplier":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "prod-dash":
    case "prod-recipe":
    case "prod-planning":
    case "production":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case "kitchen-dash":
    case "kitchen":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      );
    case "deliv-dash":
    case "delivery":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 11-4 0m10 0a2 2 0 11-4 0" />
        </svg>
      );
    case "fin-settle":
    case "finance":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "rep-exec":
    case "reports":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case "admin-users":
    case "set-company":
    case "settings":
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
  }
}

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
          <div key={section.id} className="space-y-1">
            {/* Section Header */}
            {!collapsed ? (
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-700 tracking-wider uppercase transition-colors"
              >
                <span className={cn(hasActiveChild && "text-blue-700 font-bold")}>
                  {section.title}
                </span>
                <svg
                  className={cn(
                    "w-3 h-3 text-slate-400 transition-transform duration-200",
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
              <div className="h-1.5" />
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
                        "group relative flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-150 ease-out",
                        active
                          ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent",
                        isRoadmap && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-500",
                        collapsed && "justify-center px-0 py-2.5"
                      )}
                    >
                      {/* Crisp Uniform Nav Icon */}
                      <span
                        className={cn(
                          "transition-colors duration-150",
                          active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      >
                        {getNavIcon(item.id)}
                      </span>

                      {!collapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

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

                      {/* Active indicator bar on collapsed */}
                      {collapsed && active && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r-full" />
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
              "p-1.5 rounded-[8px] text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer",
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-enterprise-fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-enterprise-drawer">
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
                className="p-1.5 rounded-[8px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
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
