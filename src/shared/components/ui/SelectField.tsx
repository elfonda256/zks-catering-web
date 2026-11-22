import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helperText?: string;
  /** <option> or <optgroup> elements. */
  children: ReactNode;
}

/** Native select styled like Input, with its label tied to it. */
export function SelectField({ label, helperText, className, children, id, ...props }: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={selectId} className="block text-[14px] font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-9 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15 disabled:bg-slate-50 disabled:text-slate-500 shadow-xs cursor-pointer",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {helperText && <p className="text-[12px] text-slate-500">{helperText}</p>}
    </div>
  );
}
