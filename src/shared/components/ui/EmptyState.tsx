import React, { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode; // Primary CTA
  secondaryAction?: ReactNode; // Secondary CTA
  moduleExplanation?: string; // Why it exists
  moduleCategory?: string; // What this module is
  gettingStartedSteps?: string[]; // How to start (1, 2, 3)
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  moduleExplanation,
  moduleCategory,
  gettingStartedSteps,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "p-8 sm:p-12 text-center bg-white border border-dashed border-stone-300 rounded-[12px] flex flex-col items-center justify-center space-y-5 max-w-2xl mx-auto my-6 shadow-2xs",
        className
      )}
    >
      {/* Icon or Status Badge */}
      <div className="w-12 h-12 rounded-[10px] bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 shadow-2xs">
        {icon || (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>

      {/* Module Context & Purpose (What & Why) */}
      <div className="space-y-1.5 max-w-lg">
        {moduleCategory && (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded-[4px] mb-1">
            {moduleCategory}
          </span>
        )}
        <h4 className="text-[17px] font-semibold text-stone-900 tracking-tight">{title}</h4>
        {description && (
          <p className="text-[13px] leading-relaxed text-stone-600">{description}</p>
        )}
        {moduleExplanation && (
          <p className="text-[12px] text-stone-500 pt-1 leading-normal italic border-t border-stone-100 mt-2">
            Fungsi: {moduleExplanation}
          </p>
        )}
      </div>

      {/* Getting Started Guide (How to start) */}
      {gettingStartedSteps && gettingStartedSteps.length > 0 && (
        <div className="w-full max-w-md bg-stone-50/80 border border-stone-200/80 rounded-[8px] p-3 text-left space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Langkah Memulai:
          </div>
          <ol className="text-[12px] text-stone-600 space-y-1 pl-4 list-decimal">
            {gettingStartedSteps.map((step, idx) => (
              <li key={idx} className="leading-snug">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Primary & Secondary CTA */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          {secondaryAction}
          {action}
        </div>
      )}
    </div>
  );
}
