"use client";

import React, { ReactNode } from "react";
import { ErpBreadcrumb, BreadcrumbItem } from "../breadcrumb/ErpBreadcrumb";
import { cn } from "@/shared/utils/cn";

export interface ErpPageTemplateProps {
  category?: string;
  title: string;
  description?: string;
  actions?: ReactNode; // Primary Button (top right)
  secondaryActions?: ReactNode; // Secondary Button (top right)
  exportAction?: ReactNode; // Export Button (top right)
  searchBar?: ReactNode; // Search bar (top right / toolbar)
  breadcrumb?: BreadcrumbItem[];
  hideBreadcrumb?: boolean;
  filters?: ReactNode;
  primaryKpi?: ReactNode;
  charts?: ReactNode;
  children?: ReactNode;
  timeline?: ReactNode;
  secondaryPanels?: ReactNode;
  sidePanel?: ReactNode;
  className?: string;
}

/**
 * Standard Enterprise Page Template
 * Follows Sprint 02.1 Standardized Action Area & Layout Hierarchy:
 * Breadcrumb -> Header (Title + Description + Top Right Action Area [Search + Export + Secondary + Primary])
 * -> Primary KPI -> Purposeful Charts -> Filters -> Main Content / Table -> Timeline -> Secondary Panels
 */
export function ErpPageTemplate({
  category,
  title,
  description,
  actions,
  secondaryActions,
  exportAction,
  searchBar,
  breadcrumb,
  hideBreadcrumb = false,
  filters,
  primaryKpi,
  charts,
  children,
  timeline,
  secondaryPanels,
  sidePanel,
  className,
}: ErpPageTemplateProps) {
  return (
    <div className={cn("space-y-6 animate-enterprise-fade-up", className)}>
      {/* 1. Breadcrumb */}
      {!hideBreadcrumb && (
        <div className="pb-1">
          <ErpBreadcrumb customItems={breadcrumb} />
        </div>
      )}

      {/* 2. Page Header: Category + Title + Description + Standardized Top Right Action Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          {category && (
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {category}
            </div>
          )}
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-slate-900 tracking-tight leading-snug">
            {title}
          </h1>
          {description && (
            <p className="text-[13px] sm:text-[14px] text-slate-600 mt-1 max-w-4xl">
              {description}
            </p>
          )}
        </div>

        {/* Standardized Action Area (Top Right: Search -> Export -> Secondary -> Primary) */}
        {(actions || secondaryActions || exportAction || searchBar) && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
            {searchBar && <div className="w-full sm:w-auto">{searchBar}</div>}
            {exportAction}
            {secondaryActions}
            {actions}
          </div>
        )}
      </div>

      {/* 3. Primary KPI Slot */}
      {primaryKpi && <div className="space-y-3">{primaryKpi}</div>}

      {/* 4. Purposeful Operational Charts Slot */}
      {charts && <div className="space-y-3">{charts}</div>}

      {/* 5. Quick Actions / Filter Bar */}
      {filters && <div className="space-y-3">{filters}</div>}

      {/* 6. Main Content / Table + Optional Side Panel */}
      {sidePanel ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            {children}
            {timeline && <div className="space-y-3">{timeline}</div>}
            {secondaryPanels && <div className="space-y-3">{secondaryPanels}</div>}
          </div>
          <div className="lg:col-span-1 space-y-6 sticky top-20">
            {sidePanel}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {children}
          {timeline && <div className="space-y-3">{timeline}</div>}
          {secondaryPanels && <div className="space-y-3">{secondaryPanels}</div>}
        </div>
      )}
    </div>
  );
}
