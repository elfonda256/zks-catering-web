"use client";

import React, { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { useCountUp } from "@/shared/hooks/useCountUp";

export interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
    delta?: string;
  };
  delta?: string;
  lastUpdated?: string;
  isPrimary?: boolean;
  animateCount?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Enterprise KPI Card Component
 * Strictly complies with Sprint 02.2:
 * - One Hero KPI dominance with 3 Secondary cards rhythm
 * - Includes Trend, Delta, Last Updated, and 200–250ms Count-Up Micro-animation
 * - Accessible contrast and iconography (shape cues for color-blind accessibility)
 */
export function KpiCard({
  label,
  value,
  subtext,
  badge,
  icon,
  trend,
  delta,
  lastUpdated,
  isPrimary = false,
  animateCount = true,
  className,
  onClick,
}: KpiCardProps) {
  // Animated numeric count up (220ms ease-out)
  const animatedValue = useCountUp(value, 220, animateCount && typeof value === "number");

  // Primary Hero KPI Card
  if (isPrimary) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "relative bg-slate-900 text-white border border-slate-800 rounded-[12px] p-6 shadow-sm flex flex-col justify-between overflow-hidden group transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md select-none",
          onClick && "cursor-pointer",
          className
        )}
      >
        {/* Subtle Ambient Background Texture */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-600/15 via-transparent to-transparent pointer-events-none rounded-full blur-2xl transform translate-x-12 -translate-y-12" />

        {/* Top Meta: Category + Live Pulsing Dot + Last Updated */}
        <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              {label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                {lastUpdated}
              </span>
            )}
            {badge || (icon && <div className="text-slate-300">{icon}</div>)}
          </div>
        </div>

        {/* Main Metric Display (Hero Size: 36px/44px) */}
        <div className="my-3 relative z-10">
          <div className="text-[34px] sm:text-[36px] leading-tight font-extrabold text-white tracking-tight font-mono tabular-nums">
            {animatedValue}
          </div>
          {subtext && (
            <p className="text-[13px] text-slate-300 mt-1 leading-normal font-normal">
              {subtext}
            </p>
          )}
        </div>

        {/* Bottom Bar: Trend + Delta + Accessible State Badge */}
        {(trend || delta) && (
          <div className="pt-3 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[12px] relative z-10">
            <div className="flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-[4px] text-[11px] font-mono",
                    trend.isPositive
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                      : "bg-amber-950/80 text-amber-300 border border-amber-800/50"
                  )}
                >
                  <span aria-hidden="true">{trend.isPositive ? "▲" : "▼"}</span>
                  <span>{trend.value}</span>
                </span>
              )}

              {(delta || trend?.delta) && (
                <span className="text-slate-400 font-mono text-[11px]">
                  {delta || trend?.delta}
                </span>
              )}
            </div>

            {trend?.label && (
              <span className="text-[11px] text-slate-400 font-medium">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Secondary KPI Card
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border border-slate-200/90 rounded-[12px] p-5 shadow-xs flex flex-col justify-between transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm select-none",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Top Meta: Label + Last Updated / Icon */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {lastUpdated && (
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              {lastUpdated}
            </span>
          )}
          {badge || (icon && <div className="text-slate-400">{icon}</div>)}
        </div>
      </div>

      {/* Main Metric Display (Secondary Size: 26px/32px) */}
      <div className="my-1.5">
        <div className="text-[24px] sm:text-[26px] leading-tight font-bold text-slate-900 tracking-tight font-mono tabular-nums">
          {animatedValue}
        </div>
        {subtext && (
          <p className="text-[12px] text-slate-500 mt-1 leading-normal line-clamp-1">
            {subtext}
          </p>
        )}
      </div>

      {/* Bottom Bar: Trend + Delta */}
      {(trend || delta) && (
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium px-1.5 py-0.2 rounded-[4px] font-mono text-[10px]",
                  trend.isPositive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                )}
              >
                <span aria-hidden="true">{trend.isPositive ? "▲" : "▼"}</span>
                <span>{trend.value}</span>
              </span>
            )}

            {(delta || trend?.delta) && (
              <span className="text-slate-500 font-mono text-[10px]">
                {delta || trend?.delta}
              </span>
            )}
          </div>

          {trend?.label && (
            <span className="text-slate-400 text-[10px] truncate max-w-[120px]">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default KpiCard;
