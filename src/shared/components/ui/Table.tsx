import React, {
  TableHTMLAttributes,
  HTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";
import { cn } from "@/shared/utils/cn";

export function Table({ className, children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <table className={cn("w-full text-left text-[14px] border-collapse", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sticky top-0 z-10 select-none",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-slate-100 bg-white", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  isSelected,
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { isSelected?: boolean }) {
  return (
    <tr
      className={cn(
        "hover:bg-slate-50/80 transition-colors duration-150 ease-out group focus-within:bg-slate-50/90",
        isSelected && "bg-blue-50/40 hover:bg-blue-50/60",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  isCheckbox?: boolean;
}

export function TableHead({
  className,
  align = "left",
  sortable = false,
  sortDirection,
  onSort,
  isCheckbox = false,
  children,
  ...props
}: TableHeadProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  if (sortable && onSort) {
    return (
      <th
        className={cn(
          "py-3 px-4 font-semibold text-slate-700 whitespace-nowrap cursor-pointer hover:bg-slate-100/70 transition-colors",
          alignClass,
          isCheckbox && "w-10 px-3",
          className
        )}
        onClick={onSort}
        {...props}
      >
        <div
          className={cn(
            "inline-flex items-center gap-1.5",
            align === "right" && "flex-row-reverse"
          )}
        >
          <span>{children}</span>
          <span className="text-slate-400 text-xs">
            {sortDirection === "asc" ? "▲" : sortDirection === "desc" ? "▼" : "⇅"}
          </span>
        </div>
      </th>
    );
  }

  return (
    <th
      className={cn(
        "py-3 px-4 font-semibold text-slate-700 whitespace-nowrap",
        alignClass,
        isCheckbox && "w-10 px-3",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  isNumeric?: boolean;
  isCheckbox?: boolean;
}

export function TableCell({
  className,
  align = "left",
  isNumeric = false,
  isCheckbox = false,
  children,
  ...props
}: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <td
      className={cn(
        "py-3.5 px-4 text-slate-700 align-middle",
        alignClass,
        isNumeric && "font-mono tabular-nums text-slate-900",
        isCheckbox && "w-10 px-3",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableEmptyRow({
  colSpan,
  message = "Tidak ada data yang ditemukan",
  subMessage = "Coba ubah filter atau kata kunci pencarian Anda.",
}: {
  colSpan: number;
  message?: string;
  subMessage?: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center space-y-1">
          <p className="text-[14px] font-medium text-slate-700">{message}</p>
          <p className="text-[12px] text-slate-400 max-w-sm">{subMessage}</p>
        </div>
      </td>
    </tr>
  );
}

export function TableLoadingRow({
  colSpan,
  rows = 4,
}: {
  colSpan: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className="border-b border-slate-100 last:border-0">
          <td colSpan={colSpan} className="py-4 px-4">
            <div className="h-4 bg-slate-100 rounded-[6px] w-full relative overflow-hidden after:absolute after:inset-0 after:-translate-x-full after:animate-enterprise-shimmer after:bg-gradient-to-r after:from-transparent after:via-slate-200/50 after:to-transparent" />
          </td>
        </tr>
      ))}
    </>
  );
}
