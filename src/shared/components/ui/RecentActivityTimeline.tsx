import React from "react";
import { cn } from "@/shared/utils/cn";

export interface TimelineActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  type?: "order" | "inventory" | "procurement" | "system" | "qc";
  badge?: string;
}

export interface RecentActivityTimelineProps {
  title?: string;
  subtitle?: string;
  items: TimelineActivityItem[];
  className?: string;
}

export function RecentActivityTimeline({
  title = "Aktivitas & Log Operasional Terkini",
  subtitle = "Jejak audit transaksi, perubahan status, dan intervensi operator sistem",
  items,
  className,
}: RecentActivityTimelineProps) {
  if (items.length === 0) return null;

  const getTypeDot = (type?: TimelineActivityItem["type"]) => {
    switch (type) {
      case "order":
        return "bg-blue-600 ring-blue-100";
      case "inventory":
        return "bg-amber-500 ring-amber-100";
      case "procurement":
        return "bg-indigo-600 ring-indigo-100";
      case "qc":
        return "bg-rose-500 ring-rose-100";
      case "system":
      default:
        return "bg-slate-400 ring-slate-100";
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-[12px] p-5 shadow-2xs space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <span className="text-[11px] font-mono text-slate-400">Live Audit Trail</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            {/* Dot Indicator */}
            <div
              className={cn(
                "absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 transition-transform group-hover:scale-110",
                getTypeDot(item.type)
              )}
            />

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-slate-900 leading-snug">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-[4px] bg-slate-100 text-slate-600 font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {item.timestamp}
              </span>
            </div>

            <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">
              {item.description}
            </p>

            {item.user && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Operator:</span>
                <span className="font-medium text-slate-700">{item.user}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
