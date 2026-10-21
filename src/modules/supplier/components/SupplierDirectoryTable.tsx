"use client";

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/components/ui/Table";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { SUPPLIER_CATEGORIES, SUPPLIER_STATUS_OPTIONS } from "../constants";
import { getSupplierStatusBadge, getTierBadge } from "../utils";
import type { Supplier, SupplierDirectoryFilter } from "../types";

export interface SupplierDirectoryTableProps {
  suppliers: Supplier[];
  selectedSupplierId: string;
  onSelectSupplier: (id: string) => void;
  filter: SupplierDirectoryFilter;
  onFilterChange: (newFilter: SupplierDirectoryFilter) => void;
  onOpenNewSupplier: () => void;
}

export function SupplierDirectoryTable({
  suppliers,
  selectedSupplierId,
  onSelectSupplier,
  filter,
  onFilterChange,
}: SupplierDirectoryTableProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#141413]/15 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Cari Perusahaan, Kode, NPWP, PIC, Kota, atau Kategori..."
            value={filter.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filter, searchQuery: e.target.value })
            }
            prefixNode={
              <svg className="w-4 h-4 text-[#626058]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="w-40 sm:w-44">
            <Select
              value={filter.category}
              onChange={(e) =>
                onFilterChange({ ...filter, category: e.target.value })
              }
            >
              <option value="ALL">Semua Kategori</option>
              {SUPPLIER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-36 sm:w-40">
            <Select
              value={filter.status}
              onChange={(e) =>
                onFilterChange({ ...filter, status: e.target.value })
              }
            >
              {SUPPLIER_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Tier Filter */}
          <div className="w-32">
            <Select
              value={filter.tier}
              onChange={(e) =>
                onFilterChange({ ...filter, tier: e.target.value })
              }
            >
              <option value="ALL">Semua Tier</option>
              <option value="GOLD">Tier Gold</option>
              <option value="SILVER">Tier Silver</option>
              <option value="BRONZE">Tier Bronze</option>
            </Select>
          </div>

          {/* Reset button if active filter */}
          {(filter.searchQuery || filter.category !== "ALL" || filter.status !== "ALL" || filter.tier !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onFilterChange({
                  searchQuery: "",
                  category: "ALL",
                  status: "ALL",
                  tier: "ALL",
                })
              }
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-[#141413]/15 shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Kode Vendor</TableHead>
              <TableHead>Perusahaan &amp; Domisili</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>PIC &amp; Kontak</TableHead>
              <TableHead className="text-center">Scorecard &amp; Tier</TableHead>
              <TableHead className="text-center">Status Vendor</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-[#626058] font-mono">
                  Tidak ditemukan rekanan dengan kriteria pencarian ini.
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => {
                const isSelected = supplier.id === selectedSupplierId;
                const statusBadge = getSupplierStatusBadge(supplier.status);
                const tierInfo = getTierBadge(supplier.scorecard.tier);

                return (
                  <TableRow
                    key={supplier.id}
                    onClick={() => onSelectSupplier(supplier.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#141413]/5 border-l-4 border-l-[#141413]"
                        : "hover:bg-[#FAF9F5]"
                    }`}
                  >
                    {/* Supplier Code */}
                    <TableCell className="font-mono font-bold text-xs text-[#141413]">
                      {supplier.code}
                    </TableCell>

                    {/* Company Name & City */}
                    <TableCell>
                      <div className="font-bold text-xs text-[#141413] tracking-tight">
                        {supplier.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#626058] flex items-center gap-2 mt-0.5">
                        <span>{supplier.city}</span>
                        <span>•</span>
                        <span>NPWP: {supplier.npwp}</span>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="text-xs text-[#141413]">
                      <span className="px-2 py-0.5 bg-[#ECEBE4] border border-[#141413]/10 font-mono text-[11px]">
                        {supplier.category}
                      </span>
                    </TableCell>

                    {/* PIC & Phone */}
                    <TableCell>
                      <div className="text-xs font-semibold text-[#141413]">
                        {supplier.picName}
                      </div>
                      <div className="text-[11px] font-mono text-[#626058] mt-0.5">
                        {supplier.phone}
                      </div>
                    </TableCell>

                    {/* Performance Score & Tier */}
                    <TableCell className="text-center">
                      <div className="font-mono font-bold text-xs text-[#141413]">
                        {supplier.scorecard.overallScore}{" "}
                        <span className="text-[10px] text-[#626058] font-normal">/ 100</span>
                      </div>
                      <div className="mt-1">
                        <span className={`inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider border ${tierInfo.className}`}>
                          {supplier.scorecard.tier}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <Badge variant={statusBadge.variant} size="sm">
                        {statusBadge.label}
                      </Badge>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        variant={isSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSupplier(supplier.id);
                        }}
                      >
                        {isSelected ? "Dossier Aktif" : "Buka Profil →"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Directory Footer Info */}
        <div className="p-3 bg-[#FAF9F5] border-t border-[#141413]/10 text-xs font-mono text-[#626058] flex items-center justify-between">
          <div>
            Menampilkan <strong>{suppliers.length}</strong> rekanan aktif tersaring
          </div>
          <div className="text-[11px]">
            Klik pada baris rekanan untuk membuka Digital Dossier lengkap di bawah
          </div>
        </div>
      </div>
    </div>
  );
}
