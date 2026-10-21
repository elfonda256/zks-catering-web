import React from "react";
import { Card } from "@/shared/components/ui/Card";
import { formatRupiah } from "@/shared/utils/formatters";
import type { SupplierExecutiveMetrics } from "../services/supplier.service";

export interface SupplierExecutiveCardsProps {
  metrics: SupplierExecutiveMetrics;
}

export function SupplierExecutiveCards({ metrics }: SupplierExecutiveCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* Total Suppliers */}
      <Card className="p-4 bg-white border border-[#141413]/15">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#626058]">
          Total Rekanan
        </div>
        <div className="text-2xl font-bold font-mono text-[#141413] mt-1">
          {metrics.totalSuppliers}
        </div>
        <div className="text-[11px] text-[#626058] mt-1 font-mono">
          Vendor terdaftar aktif
        </div>
      </Card>

      {/* Active Suppliers */}
      <Card className="p-4 bg-white border border-[#141413]/15">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#626058]">
          Rekanan Aktif
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
          {metrics.activeSuppliers}
        </div>
        <div className="text-[11px] text-emerald-800 mt-1 font-mono">
          Siap rilis purchase order
        </div>
      </Card>

      {/* Preferred Suppliers */}
      <Card className="p-4 bg-white border border-[#141413]/15">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#626058]">
          Preferred (Prioritas)
        </div>
        <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
          {metrics.preferredSuppliers}
        </div>
        <div className="text-[11px] text-[#626058] mt-1 font-mono">
          Tier 1 Gold SLA terjamin
        </div>
      </Card>

      {/* Suppliers Requiring Review */}
      <Card className="p-4 bg-white border border-[#141413]/15">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#626058]">
          Perlu Evaluasi
        </div>
        <div className="text-2xl font-bold font-mono text-rose-700 mt-1">
          {metrics.reviewRequiredCount}
        </div>
        <div className="text-[11px] text-rose-800 mt-1 font-mono">
          Dokumen exp / delay
        </div>
      </Card>

      {/* Average Supplier Rating */}
      <Card className="p-4 bg-white border border-[#141413]/15">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#626058]">
          Rata-rata Rating
        </div>
        <div className="text-2xl font-bold font-mono text-[#141413] mt-1">
          {metrics.averageRating}
          <span className="text-xs text-[#626058] font-normal"> / 100</span>
        </div>
        <div className="text-[11px] text-[#626058] mt-1 font-mono">
          Weighted scorecard Q4
        </div>
      </Card>

      {/* Monthly Procurement Value */}
      <Card className="p-4 bg-white border border-[#141413]/15">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#626058]">
          Nilai Pengadaan Bln Ini
        </div>
        <div className="text-xl font-bold font-mono text-[#141413] mt-1 tracking-tight truncate">
          {formatRupiah(metrics.monthlyProcurementTotal)}
        </div>
        <div className="text-[11px] text-emerald-800 mt-1 font-mono">
          Realisasi PO terserap
        </div>
      </Card>
    </div>
  );
}
