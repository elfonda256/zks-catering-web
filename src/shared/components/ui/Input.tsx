import React, { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixNode?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, prefixNode, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[14px] font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative w-full">
          {prefixNode && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {prefixNode}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-10 w-full rounded-[12px] border border-slate-200 bg-white px-3.5 py-2 text-[14px] text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500 transition-colors shadow-xs",
              prefixNode && "pl-9",
              error && "border-red-500 focus:border-red-600 focus:ring-red-600",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[12px] text-red-600">{error}</p>}
        {helperText && !error && <p className="text-[12px] text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
