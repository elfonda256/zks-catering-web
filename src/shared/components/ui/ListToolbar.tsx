"use client";

import { Tabs, TabsList, TabsTrigger } from "./Tabs";
import { SearchInput } from "./SearchInput";

export interface ListTab<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface ListToolbarProps<T extends string> {
  tabs: ListTab<T>[];
  tab: T;
  onTabChange: (tab: T) => void;
  query: string;
  onQueryChange: (query: string) => void;
  searchPlaceholder: string;
  /** Tabs only, for lists too short to need a search. */
  hideSearch?: boolean;
}

const MAX_INLINE_TABS = 6;

/** Filter tabs on the left, search on the right: the header of every admin list. */
export function ListToolbar<T extends string>({
  tabs,
  tab,
  onTabChange,
  query,
  onQueryChange,
  searchPlaceholder,
  hideSearch = false,
}: ListToolbarProps<T>) {
  // Many tabs get their own row so none is pushed out of view.
  const stacked = tabs.length > MAX_INLINE_TABS;

  return (
    <div
      className={
        stacked
          ? "flex flex-col gap-4"
          : "flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      }
    >
      <Tabs defaultValue={tab} value={tab} onValueChange={(v) => onTabChange(v as T)} className="min-w-0 overflow-x-auto">
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="whitespace-nowrap">
              {t.label}
              {t.count !== undefined && (
                <span className="ml-1 tabular-nums text-stone-400">{t.count}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {!hideSearch && (
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className="lg:max-w-xs"
      />
      )}
    </div>
  );
}
