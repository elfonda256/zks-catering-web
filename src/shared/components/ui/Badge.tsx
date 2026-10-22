import React, { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type BadgeVariant =
  | "draft"
  | "pending"
  | "approved"
  | "completed"
  | "cancelled"
  | "rejected"
  | "processing"
  | "low_stock"
  | "critical"
  | "expired"
  | "reserved"
  | "consumed"
  | "delivered"
  // Semantic standard fallbacks
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "info"
  | "accent";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

/**
 * Enterprise Badge Component
 * Strictly complies with Sprint 02.2:
 * - Reduced color saturation (soft executive pastel tints)
 * - Maximum readability with high-contrast text
 * - Accessible dot indicator with contrast ring
 */
export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  // Desaturated executive palette: Calm background + Deep high-contrast text + Subtle border
  const variantStyles: Record<BadgeVariant, string> = {
    // Operational States
    draft: "bg-slate-100/80 text-slate-700 border-slate-200/90",
    pending: "bg-amber-50/70 text-amber-900 border-amber-200/80",
    approved: "bg-slate-100 text-slate-900 border-slate-300 font-semibold",
    completed: "bg-emerald-50/70 text-emerald-950 border-emerald-200/80",
    cancelled: "bg-rose-50/70 text-rose-950 border-rose-200/80",
    rejected: "bg-rose-50/70 text-rose-950 border-rose-200/80",
    processing: "bg-sky-50/70 text-sky-950 border-sky-200/80",
    low_stock: "bg-amber-50/70 text-amber-950 border-amber-200/80",
    critical: "bg-rose-50/80 text-rose-950 border-rose-200/90 font-semibold",
    expired: "bg-rose-50/70 text-rose-950 border-rose-200/80",
    reserved: "bg-indigo-50/70 text-indigo-950 border-indigo-200/80",
    consumed: "bg-slate-100 text-slate-700 border-slate-200/80",
    delivered: "bg-emerald-50/70 text-emerald-950 border-emerald-200/80",

    // Semantic Fallbacks
    success: "bg-emerald-50/70 text-emerald-950 border-emerald-200/80",
    warning: "bg-amber-50/70 text-amber-950 border-amber-200/80",
    danger: "bg-rose-50/70 text-rose-950 border-rose-200/80",
    neutral: "bg-slate-100/90 text-slate-800 border-slate-200/90",
    info: "bg-sky-50/70 text-sky-950 border-sky-200/80",
    accent: "bg-slate-900 text-white border-transparent shadow-2xs",
  };

  const dotStyles: Record<BadgeVariant, string> = {
    draft: "bg-slate-400 ring-slate-200/50",
    pending: "bg-amber-600 ring-amber-200/60",
    approved: "bg-slate-800 ring-slate-300/60",
    completed: "bg-emerald-600 ring-emerald-200/60",
    cancelled: "bg-rose-600 ring-rose-200/60",
    rejected: "bg-rose-600 ring-rose-200/60",
    processing: "bg-sky-600 ring-sky-200/60",
    low_stock: "bg-amber-600 ring-amber-200/60",
    critical: "bg-rose-700 ring-rose-300/60",
    expired: "bg-rose-600 ring-rose-200/60",
    reserved: "bg-indigo-600 ring-indigo-200/60",
    consumed: "bg-slate-500 ring-slate-200/50",
    delivered: "bg-emerald-600 ring-emerald-200/60",

    success: "bg-emerald-600 ring-emerald-200/60",
    warning: "bg-amber-600 ring-amber-200/60",
    danger: "bg-rose-600 ring-rose-200/60",
    neutral: "bg-slate-500 ring-slate-200/50",
    info: "bg-sky-600 ring-sky-200/60",
    accent: "bg-emerald-400 ring-emerald-400/40",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] leading-tight font-medium",
    md: "px-2.5 py-1 text-xs leading-normal font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[5px] border select-none transition-all duration-150 ease-out hover:brightness-[0.98]",
        variantStyles[variant] || variantStyles.neutral,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0 ring-2",
            dotStyles[variant] || dotStyles.neutral
          )}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
