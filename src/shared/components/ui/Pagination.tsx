"use client";

import React from "react";
import { Button } from "./Button";
import { cn } from "@/shared/utils/cn";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
}: PaginationProps) {
  if (totalPages <= 1 && !totalItems) return null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 bg-white border border-slate-200 rounded-[12px] text-[13px] shadow-xs",
        className
      )}
    >
      <div className="text-slate-600">
        {totalItems !== undefined && itemsPerPage !== undefined ? (
          <>
            Menampilkan{" "}
            <span className="font-mono tabular-nums font-semibold text-slate-900">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </span>
            -
            <span className="font-mono tabular-nums font-semibold text-slate-900">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            dari <span className="font-mono tabular-nums font-semibold text-slate-900">{totalItems}</span> total data
          </>
        ) : (
          <>
            Halaman <span className="font-mono tabular-nums font-semibold text-slate-900">{currentPage}</span> dari{" "}
            <span className="font-mono tabular-nums font-semibold text-slate-900">{totalPages}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ← Sebelumnya
        </Button>

        <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-[8px] text-[12px]">
          {currentPage} / {Math.max(1, totalPages)}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Selanjutnya →
        </Button>
      </div>
    </div>
  );
}
