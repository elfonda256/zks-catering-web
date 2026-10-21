"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  value?: string;
  onChange?: (val: string) => void;
  onClear?: () => void;
  size?: "sm" | "md" | "lg";
  shortcut?: string;
}

/**
 * Enterprise Reusable Search Component
 * Provides clean search field with search icon, clear button, and optional keyboard shortcut hint.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value = "",
      onChange,
      onClear,
      placeholder = "Cari data operasional...",
      size = "md",
      shortcut,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "h-8 pl-8 pr-7 text-xs",
      md: "h-9 pl-9 pr-8 text-[13px]",
      lg: "h-11 pl-10 pr-9 text-sm",
    };

    const iconSizes = {
      sm: "w-3.5 h-3.5 left-2.5",
      md: "w-4 h-4 left-3",
      lg: "w-4.5 h-4.5 left-3.5",
    };

    const hasValue = Boolean(value && value.length > 0);

    const handleClear = () => {
      if (onChange) onChange("");
      if (onClear) onClear();
    };

    return (
      <div className={cn("relative w-full", className)}>
        <div
          className={cn(
            "absolute inset-y-0 flex items-center pointer-events-none text-slate-400",
            iconSizes[size]
          )}
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={ref}
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-[12px] text-slate-900 placeholder:text-slate-400",
            "focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors",
            "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",
            sizeStyles[size]
          )}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition-colors"
              title="Clear search"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {shortcut && !hasValue && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded-[6px]">
              {shortcut}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
