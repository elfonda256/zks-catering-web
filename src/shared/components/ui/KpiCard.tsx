"use client";

import { cn } from "@/shared/utils/cn";
import { useCountUp } from "@/shared/hooks/useCountUp";

export type KpiTone = "neutral" | "brand" | "success" | "warning" | "danger";

export interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  /** Colour of the marker beside the label; says what kind of number this is. */
  tone?: KpiTone;
  className?: string;
}

const TONE_MARKER: Record<KpiTone, string> = {
  neutral: "bg-slate-300",
  brand: "bg-brand-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};

/** One headline number with its label and a short explanation. */
export function KpiCard({ label, value, subtext, tone = "neutral", className }: KpiCardProps) {
  const shown = useCountUp(value, 220, typeof value === "number");

  return (
    <div
      className={cn(
        "flex flex-col rounded-[12px] border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(26,31,34,0.04)] sm:p-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full", TONE_MARKER[tone])} />
        <span className="truncate text-[12px] font-semibold text-slate-500 sm:text-[13px]">{label}</span>
      </div>
      <div className="mt-3 whitespace-nowrap text-[22px] font-bold leading-none tracking-[-0.02em] text-ink tabular-nums sm:text-[28px]">
        {shown}
      </div>
      {subtext && <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-slate-500 sm:line-clamp-1">{subtext}</p>}
    </div>
  );
}

export default KpiCard;
