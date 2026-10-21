import React, { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type BadgeVariant =
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
    success: "bg-emerald-50 text-emerald-800 border-emerald-300",
    warning: "bg-amber-50 text-amber-800 border-amber-300",
    danger: "bg-rose-50 text-rose-800 border-rose-300",
    neutral: "bg-[#141413]/5 text-[#626058] border-[#141413]/15",
    info: "bg-blue-50 text-blue-800 border-blue-300",
    accent: "bg-[#141413] text-white border-transparent",
  };

  const dotStyles: Record<BadgeVariant, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    neutral: "bg-[#626058]",
    info: "bg-blue-500",
    accent: "bg-white",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
