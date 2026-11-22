import type { ReactNode } from "react";

interface DetailListProps {
  items: { label: string; value: ReactNode }[];
}

/** Label–value pairs for detail dialogs. */
export function DetailList({ items }: DetailListProps) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[14px]">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-[12px] font-medium text-stone-500">{item.label}</dt>
          <dd className="mt-1 text-stone-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
