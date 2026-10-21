import React, { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, options, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="block text-[14px] font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-10 w-full rounded-[12px] border border-slate-200 bg-white px-3.5 py-2 text-[14px] text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-500 transition-colors shadow-xs cursor-pointer",
            error && "border-red-500 focus:border-red-600 focus:ring-red-600",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-[12px] text-red-600">{error}</p>}
        {helperText && !error && <p className="text-[12px] text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
