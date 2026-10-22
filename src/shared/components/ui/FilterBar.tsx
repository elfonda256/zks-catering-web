"use client";

import React, { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { Button } from "./Button";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;

  statusValue?: string;
  onStatusChange?: (val: string) => void;
  statusOptions?: FilterOption[];

  categoryValue?: string;
  onCategoryChange?: (val: string) => void;
  categoryOptions?: FilterOption[];

  dateValue?: string;
  onDateChange?: (val: string) => void;

  onReset?: () => void;
  hasActiveFilters?: boolean;

  extraFilters?: ReactNode;
  className?: string;
}

/**
 * Reusable Enterprise Filter Bar
 * Follows EDS standard: Search -> Date -> Status -> Category -> Reset
 */
export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari data...",
  statusValue,
  onStatusChange,
  statusOptions,
  categoryValue,
  onCategoryChange,
  categoryOptions,
  dateValue,
  onDateChange,
  onReset,
  hasActiveFilters,
  extraFilters,
  className,
}: FilterBarProps) {
  const isFiltered =
    hasActiveFilters ??
    Boolean(
      (searchValue && searchValue.trim() !== "") ||
        (statusValue && statusValue !== "all" && statusValue !== "") ||
        (categoryValue && categoryValue !== "all" && categoryValue !== "") ||
        (dateValue && dateValue !== "")
    );

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-[12px] shadow-2xs",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* 1. Search Component */}
        {onSearchChange && (
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-9 pl-8 pr-7 text-[13px] bg-slate-50 border border-slate-200 rounded-[8px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all duration-150 ease-out"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* 2. Date Filter */}
        {onDateChange && (
          <div className="relative">
            <input
              type="date"
              value={dateValue || ""}
              onChange={(e) => onDateChange(e.target.value)}
              className="h-9 px-3 text-[13px] bg-white border border-slate-200 rounded-[8px] text-slate-700 hover:bg-slate-50 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all duration-150 ease-out cursor-pointer"
            />
          </div>
        )}

        {/* 3. Status Select */}
        {statusOptions && onStatusChange && (
          <select
            value={statusValue || "all"}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 px-3 text-[13px] bg-white border border-slate-200 rounded-[8px] text-slate-700 hover:bg-slate-50 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all duration-150 ease-out cursor-pointer"
          >
            <option value="all">Semua Status</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* 4. Category Select */}
        {categoryOptions && onCategoryChange && (
          <select
            value={categoryValue || "all"}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-9 px-3 text-[13px] bg-white border border-slate-200 rounded-[8px] text-slate-700 hover:bg-slate-50 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all duration-150 ease-out cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* 5. Extra Custom Filters */}
        {extraFilters}
      </div>

      {/* 6. Reset Button */}
      {onReset && isFiltered && (
        <div className="shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs"
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  );
}
