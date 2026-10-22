import React from "react";
import { cn } from "@/shared/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

/**
 * Enterprise Shimmer Skeleton
 * Hardware accelerated linear sweep, no layout shift, respects prefers-reduced-motion
 */
export function Skeleton({ className, variant = "rect", ...props }: SkeletonProps) {
  const variantStyles = {
    rect: "rounded-[8px]",
    circle: "rounded-full",
    text: "rounded-[4px] h-4",
  };

  return (
    <div
      className={cn(
        "bg-slate-100 border border-slate-200/50 relative overflow-hidden after:absolute after:inset-0 after:-translate-x-full after:animate-enterprise-shimmer after:bg-gradient-to-r after:from-transparent after:via-slate-200/60 after:to-transparent",
        variantStyles[variant],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Dedicated KPI Card Skeleton
 */
export function KpiCardSkeleton({ isPrimary = false }: { isPrimary?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[12px] p-5 sm:p-6 border flex flex-col justify-between space-y-4 shadow-xs",
        isPrimary ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className={cn("h-3.5 w-24", isPrimary ? "bg-slate-800 border-slate-700" : "")} />
        <Skeleton className={cn("h-3 w-12", isPrimary ? "bg-slate-800 border-slate-700" : "")} />
      </div>
      <Skeleton className={cn("h-8 w-36", isPrimary ? "bg-slate-800 border-slate-700" : "")} />
      <div className="pt-2 border-t border-slate-100/10 flex items-center justify-between">
        <Skeleton className={cn("h-3 w-20", isPrimary ? "bg-slate-800 border-slate-700" : "")} />
        <Skeleton className={cn("h-3 w-16", isPrimary ? "bg-slate-800 border-slate-700" : "")} />
      </div>
    </div>
  );
}

/**
 * Dedicated Chart Skeleton
 */
export function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[12px] p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-7 w-28 rounded-[8px]" />
      </div>
      <div className={cn("w-full flex items-end justify-around gap-3 pt-6 pb-2", height)}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-8 rounded-t-[4px]"
            style={{ height: `${30 + (i % 4) * 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export interface LoadingStateProps {
  rows?: number;
  className?: string;
  label?: string;
}

export function LoadingState({ rows = 5, className, label = "Memuat data operasional..." }: LoadingStateProps) {
  return (
    <div className={cn("p-6 bg-white border border-slate-200 rounded-[12px] space-y-4 shadow-xs", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <span className="text-[12px] font-medium text-slate-400 font-mono">{label}</span>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24 hidden md:block" />
            <Skeleton className="h-4 w-32 ml-auto" />
            <Skeleton className="h-8 w-20 rounded-[8px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
