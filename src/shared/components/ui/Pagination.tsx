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
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 bg-white border border-[#141413]/15 text-xs font-mono",
        className
      )}
    >
      <div className="text-[#626058]">
        {totalItems !== undefined && itemsPerPage !== undefined ? (
          <>
            Menampilkan{" "}
            <strong className="text-[#141413]">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </strong>
            -
            <strong className="text-[#141413]">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </strong>{" "}
            dari <strong className="text-[#141413]">{totalItems}</strong> baris
          </>
        ) : (
          <>
            Halaman <strong className="text-[#141413]">{currentPage}</strong> dari{" "}
            <strong className="text-[#141413]">{totalPages}</strong>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ← Sebelumnya
        </Button>

        <span className="px-3 py-1 bg-[#ECEBE4] border border-[#141413]/15 text-[#141413] font-bold">
          {currentPage} / {Math.max(1, totalPages)}
        </span>

        <Button
          variant="outline"
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
