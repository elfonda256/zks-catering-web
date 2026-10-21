"use client";

import React, { ReactNode } from "react";
import { ErpBreadcrumb, BreadcrumbItem } from "../breadcrumb/ErpBreadcrumb";
import { cn } from "@/shared/utils/cn";

export interface ErpPageTemplateProps {
  category?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  secondaryActions?: ReactNode;
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
 * Follows EDS Layout Hierarchy:
 * Breadcrumb -> Header (Title + Description + Primary & Secondary Actions) -> Primary KPI -> Charts -> Main Table/Content -> Timeline/Activity -> Secondary Panels
 */
export function ErpPageTemplate({
  category,
  title,
  description,
  actions,
  secondaryActions,
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
    <div className={cn("space-y-6", className)}>
      {/* 1. Breadcrumb */}
      {!hideBreadcrumb && (
        <div className="pb-1">
          <ErpBreadcrumb customItems={breadcrumb} />
        </div>
      )}

      {/* 2. Page Header: Category + Title + Description + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          {category && (
            <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              {category}
            </div>
          )}
          <h1 className="text-[24px] font-semibold text-slate-900 tracking-tight leading-snug">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] text-slate-600 mt-1 max-w-4xl">
              {description}
            </p>
          )}
        </div>

        {/* Primary & Secondary Actions (Top Right) */}
        {(actions || secondaryActions) && (
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
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
