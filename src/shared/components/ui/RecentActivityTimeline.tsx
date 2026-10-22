"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { Badge } from "./Badge";

export interface TimelineActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  type?: "order" | "inventory" | "procurement" | "system" | "qc";
  status?: string;
  badge?: string;
  action?: string;
}

export interface RecentActivityTimelineProps {
  title?: string;
  subtitle?: string;
  items: TimelineActivityItem[];
  className?: string;
}

/**
 * Enterprise Audit Timeline
 * Strictly complies with Sprint 02.2:
 * - Structured audit columns: Timestamp -> Actor -> Action -> Status -> Vertical connector
 * - Accessible iconography and muted status indicators
 * - Duration 200ms ease-out micro-interactions
 */
export function RecentActivityTimeline({
  title = "Jejak Audit & Aktivitas Operasional Terkini",
  subtitle = "Pencatatan real-time seluruh transaksi pesanan, pergerakan stok gudang, dan otorisasi manajerial",
  items,
  className,
}: RecentActivityTimelineProps) {
  if (items.length === 0) return null;

  const getNodeIcon = (type?: TimelineActivityItem["type"]) => {
    switch (type) {
      case "order":
        return (
          <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <svg className="w-3 h-3 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        );
      case "inventory":
        return (
          <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xs">
            <svg className="w-3 h-3 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        );
      case "procurement":
        return (
          <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xs">
            <svg className="w-3 h-3 text-slate-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case "qc":
        return (
          <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <svg className="w-3 h-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "system":
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-xs">
            <svg className="w-3 h-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-200/90 rounded-[12px] p-5 sm:p-6 shadow-2xs space-y-5 animate-enterprise-fade-in select-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-600 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Audit Log Immutable</span>
        </div>
      </div>

      {/* Structured Enterprise Audit Flow */}
      <div className="relative space-y-4">
        {/* Continuous Hairline Vertical Connector */}
        <div className="absolute left-[13px] top-4 bottom-4 w-px bg-slate-200 hidden sm:block pointer-events-none" />

        {items.slice(0, 5).map((item, idx) => {
          return (
            <div
              key={item.id}
              style={{ animationDelay: `${idx * 45}ms` }}
              className="relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-[8px] transition-all duration-150 ease-out hover:bg-slate-50/70 border border-transparent hover:border-slate-200/60 animate-enterprise-fade-up"
            >
              {/* Node Icon on Connector */}
              <div className="hidden sm:flex items-center justify-center z-10 shrink-0">
                {getNodeIcon(item.type)}
              </div>

              {/* Main Content Details */}
              <div className="flex-1 space-y-1.5 min-w-0">
                {/* Action + Status Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-semibold text-slate-900 leading-snug">
                      {item.title}
                    </span>
                    {(item.badge || item.status) && (
                      <Badge variant="neutral" size="sm" dot>
                        {item.badge || item.status}
                      </Badge>
                    )}
                  </div>

                  {/* Monospace Tabular Timestamp */}
                  <span className="text-[11px] font-mono text-slate-500 shrink-0 tabular-nums">
                    {item.timestamp}
                  </span>
                </div>

                {/* Audit Context Description */}
                <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>

                {/* Actor / Operator Metadata */}
                <div className="pt-1 flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-500">Aktor:</span>{" "}
                    <span className="text-slate-700 font-medium">
                      {item.user || "Petugas Terotorisasi"}
                    </span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-400">ID: {item.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivityTimeline;
