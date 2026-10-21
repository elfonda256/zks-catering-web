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
  // Semantic fallbacks
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

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    // Standard EDS Status Badges
    draft: "bg-slate-100 text-slate-700 border-slate-200",
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    approved: "bg-blue-50 text-blue-800 border-blue-200",
    completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-50 text-red-800 border-red-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    processing: "bg-sky-50 text-sky-800 border-sky-200",
    low_stock: "bg-amber-50 text-amber-800 border-amber-200",
    critical: "bg-red-50 text-red-800 border-red-200",
    expired: "bg-rose-50 text-rose-800 border-rose-200",
    reserved: "bg-indigo-50 text-indigo-800 border-indigo-200",
    consumed: "bg-slate-100 text-slate-600 border-slate-200",
    delivered: "bg-teal-50 text-teal-800 border-teal-200",

    // Semantic fallbacks
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-red-50 text-red-800 border-red-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    accent: "bg-slate-900 text-white border-transparent",
  };

  const dotStyles: Record<BadgeVariant, string> = {
    draft: "bg-slate-400",
    pending: "bg-amber-500",
    approved: "bg-blue-500",
    completed: "bg-emerald-500",
    cancelled: "bg-red-500",
    rejected: "bg-red-500",
    processing: "bg-sky-500",
    low_stock: "bg-amber-500",
    critical: "bg-red-500",
    expired: "bg-rose-600",
    reserved: "bg-indigo-500",
    consumed: "bg-slate-400",
    delivered: "bg-teal-600",

    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    neutral: "bg-slate-400",
    info: "bg-blue-500",
    accent: "bg-white",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] leading-tight",
    md: "px-2.5 py-1 text-xs leading-normal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-[6px] border select-none",
        variantStyles[variant] || variantStyles.neutral,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant] || dotStyles.neutral)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
