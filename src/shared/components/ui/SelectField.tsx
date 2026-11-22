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
      <select
        id={selectId}
        className={cn(
          "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-500 shadow-xs",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {helperText && <p className="text-[12px] text-slate-500">{helperText}</p>}
    </div>
  );
}
