import React, { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  moduleExplanation?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  moduleExplanation,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "p-12 text-center bg-white border border-dashed border-slate-300 rounded-[12px] flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto my-8",
        className
      )}
    >
      <div className="w-12 h-12 rounded-[12px] bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
        {icon || (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h4 className="text-[16px] font-semibold text-slate-900 tracking-tight">{title}</h4>
        {description && (
          <p className="text-[14px] leading-relaxed text-slate-600">{description}</p>
        )}
        {moduleExplanation && (
          <p className="text-[12px] text-slate-400 pt-1 leading-normal">
            {moduleExplanation}
          </p>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
