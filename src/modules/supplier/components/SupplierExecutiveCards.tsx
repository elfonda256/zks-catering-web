import React from "react";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { formatRupiah } from "@/shared/utils/formatters";
import type { SupplierExecutiveMetrics } from "../services/supplier.service";

export interface SupplierExecutiveCardsProps {
  metrics: SupplierExecutiveMetrics;
}

export function SupplierExecutiveCards({ metrics }: SupplierExecutiveCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Primary KPI: Nilai Pengadaan Bulan Ini (Takes 4 cols on desktop) */}
      <div className="md:col-span-5 lg:col-span-4">
        <KpiCard
          isPrimary={true}
          label="Nilai Pengadaan Bulan Ini"
          value={formatRupiah(metrics.monthlyProcurementTotal)}
          subtext="Total realisasi PO terbayar & terserap bulan berjalan"
          trend={{
            value: "+12.4%",
            isPositive: true,
            label: "vs bulan lalu",
          }}
        />
      </div>

      {/* Secondary KPIs: 4 cards in a 4-col grid (Takes 7/8 cols on desktop) */}
      <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Total Vendor"
          value={metrics.totalSuppliers}
          subtext="Vendor terdaftar aktif"
        />

        <KpiCard
          label="Vendor Aktif"
          value={metrics.activeSuppliers}
          subtext="Siap rilis PO"
          trend={{
            value: "96.5%",
            isPositive: true,
            label: "SLA delivery",
          }}
        />

        <KpiCard
          label="Tier-1 Gold"
          value={metrics.preferredSuppliers}
          subtext="Rekanan prioritas"
        />

        <KpiCard
          label="Perlu Review"
          value={metrics.reviewRequiredCount}
          subtext="Dokumen exp / delay"
          trend={{
            value: metrics.reviewRequiredCount > 0 ? "Perlu Tindakan" : "Aman",
            isPositive: metrics.reviewRequiredCount === 0,
          }}
        />
      </div>
    </div>
  );
}
