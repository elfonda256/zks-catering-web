import React, { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  isMono?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, isMono = true, disabled, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center bg-white border border-[#141413]/20 focus-within:border-[#141413] focus-within:ring-1 focus-within:ring-[#141413] transition-all",
          disabled && "opacity-50 pointer-events-none bg-[#ECEBE4]/50"
        )}
      >
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full appearance-none bg-transparent px-3 py-2 pr-8 text-xs text-[#141413] focus:outline-hidden cursor-pointer",
            isMono && "font-mono uppercase",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#626058]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
