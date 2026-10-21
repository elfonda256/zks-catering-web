"use client";

import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isMono?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      isMono = true,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all select-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-px";

    const variantStyles: Record<ButtonVariant, string> = {
      primary: "bg-[#141413] hover:bg-[#2A2926] text-white shadow-2xs border border-transparent",
      secondary: "bg-[#ECEBE4] hover:bg-[#E2E0D8] text-[#141413] border border-[#141413]/10",
      outline: "bg-transparent hover:bg-[#141413]/5 text-[#141413] border border-[#141413]/20",
      ghost: "bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-transparent",
      danger: "bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-2xs border border-transparent",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "px-2.5 py-1 text-xs",
      md: "px-4 py-2 text-xs",
      lg: "px-6 py-3 text-sm",
    };

    const fontStyles = isMono ? "font-mono uppercase tracking-wider" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], fontStyles, className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current"
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
