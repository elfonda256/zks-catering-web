import React from "react";
import { cn } from "@/shared/utils/cn";

export interface LoadingStateProps {
  rows?: number;
  className?: string;
  label?: string;
}

export function LoadingState({ rows = 4, className, label = "Memuat data operasional..." }: LoadingStateProps) {
  return (
    <div className={cn("p-6 bg-white border border-[#141413]/15 space-y-4", className)}>
      <div className="flex items-center gap-2 text-xs font-mono text-[#626058] uppercase tracking-wider">
        <svg
          className="animate-spin h-3.5 w-3.5 text-[#141413]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span>{label}</span>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-9 bg-[#ECEBE4]/50 animate-pulse border border-[#141413]/5"
            style={{ opacity: 1 - i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
