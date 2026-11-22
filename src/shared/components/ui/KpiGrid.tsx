import type { ReactNode } from "react";

interface KpiGridProps {
  label: string;
  /** Number of tiles on large screens. */
  columns: 3 | 4;
  children: ReactNode;
}

const LARGE_COLUMNS = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" } as const;

/** KPI tiles: two per row on phones (an odd last tile takes the full row), one row on desktop. */
export function KpiGrid({ label, columns, children }: KpiGridProps) {
  return (
    <section
      aria-label={label}
      className={`grid grid-cols-2 gap-3 sm:gap-4 ${LARGE_COLUMNS[columns]} [&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(odd)]:col-span-1`}
    >
      {children}
    </section>
  );
}
