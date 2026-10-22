"use client";

import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isMono?: boolean;
  isIcon?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      isMono = false,
      isIcon = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-out active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 cursor-pointer";

    const variantStyles: Record<ButtonVariant, string> = {
      primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-xs border border-transparent",
      secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs",
      outline: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent",
      danger: "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-xs",
      icon: "bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/90 shadow-xs",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: isIcon || variant === "icon" ? "w-8 h-8 p-0 text-xs" : "h-8 px-3 text-xs gap-1.5",
      md: isIcon || variant === "icon" ? "w-9 h-9 p-0 text-sm" : "h-9 px-4 text-sm gap-2",
      lg: isIcon || variant === "icon" ? "w-11 h-11 p-0 text-sm" : "h-11 px-5 text-sm gap-2.5",
    };

    const fontStyles = isMono ? "font-mono" : "font-sans";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], fontStyles, className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-current"
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
