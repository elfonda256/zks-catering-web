import React, { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefixNode?: ReactNode;
  suffixNode?: ReactNode;
  isMono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefixNode, suffixNode, isMono = true, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center bg-white border border-[#141413]/20 focus-within:border-[#141413] focus-within:ring-1 focus-within:ring-[#141413] transition-all",
          disabled && "opacity-50 pointer-events-none bg-[#ECEBE4]/50"
        )}
      >
        {prefixNode && (
          <div className="pl-3 pr-2 text-[#626058] flex items-center shrink-0">
            {prefixNode}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent px-3 py-2 text-xs text-[#141413] placeholder:text-[#626058]/60 focus:outline-hidden",
            isMono && "font-mono",
            prefixNode ? "pl-0" : "",
            suffixNode ? "pr-0" : "",
            className
          )}
          {...props}
        />
        {suffixNode && (
          <div className="pr-3 pl-2 text-[#626058] flex items-center shrink-0">
            {suffixNode}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
