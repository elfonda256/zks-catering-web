import React, { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

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
  };
  isPrimary?: boolean;
  className?: string;
}

export function KpiCard({
  label,
  value,
  subtext,
  badge,
  icon,
  trend,
  isPrimary = false,
  className,
}: KpiCardProps) {
  if (isPrimary) {
    return (
      <div
        className={cn(
          "bg-white border-2 border-blue-600 rounded-[12px] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between",
          className
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-blue-700">
              {label}
            </span>
          </div>
          {badge || (icon && <div className="text-blue-600">{icon}</div>)}
        </div>

        <div className="my-2">
          <div className="text-[32px] leading-[40px] font-bold text-slate-900 tracking-tight tabular-nums">
            {value}
          </div>
          {subtext && (
            <p className="text-[13px] text-slate-600 mt-1 leading-normal font-normal">
              {subtext}
            </p>
          )}
        </div>

        {trend && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[12px]">
            <span
              className={cn(
                "font-semibold",
                trend.isPositive ? "text-emerald-600" : "text-amber-600"
              )}
            >
              {trend.value}
            </span>
            {trend.label && <span className="text-slate-500">{trend.label}</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-[12px] p-5 shadow-xs flex flex-col justify-between transition-colors hover:border-slate-300",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[12px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {badge || (icon && <div className="text-slate-400">{icon}</div>)}
      </div>

      <div className="my-1">
        <div className="text-[24px] leading-[32px] font-semibold text-slate-900 tracking-tight tabular-nums">
          {value}
        </div>
        {subtext && (
          <p className="text-[12px] text-slate-500 mt-0.5 leading-normal">
            {subtext}
          </p>
        )}
      </div>

      {trend && (
        <div className="pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px]">
          <span
            className={cn(
              "font-medium",
              trend.isPositive ? "text-emerald-600" : "text-amber-600"
            )}
          >
            {trend.value}
          </span>
          {trend.label && <span className="text-slate-400">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
