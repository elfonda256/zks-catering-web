import React from "react";
import { cn } from "@/shared/utils/cn";

export interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  const variantStyles = {
    rect: "rounded-[8px]",
    circle: "rounded-full",
    text: "rounded-[4px] h-4",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-100 border border-slate-200/50",
        variantStyles[variant],
        className
      )}
      aria-hidden="true"
    />
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
        <span className="text-[12px] font-medium text-slate-400">{label}</span>
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
