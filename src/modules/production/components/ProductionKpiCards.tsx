import React from "react";
import type { ProductionKpiSummary } from "../types";
import { formatNumber } from "@/shared/utils/formatters";

interface ProductionKpiCardsProps {
  kpis: ProductionKpiSummary;
}

export function ProductionKpiCards({ kpis }: ProductionKpiCardsProps) {
  const percentCompleted =
    kpis.totalPortionsScheduled > 0
      ? Math.round((kpis.totalPortionsPacked / kpis.totalPortionsScheduled) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
      {/* Metric 1: Fulfillment Produksi (Primary) */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Fulfillment Produksi
            </span>
            <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Hari Ini
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono tracking-tight tabular-nums text-slate-900">
              {formatNumber(kpis.totalPortionsPacked)}
            </span>
            <span className="text-xs font-sans text-slate-400">
              / {formatNumber(kpis.totalPortionsScheduled)} Pax
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Porsi selesai dipacking & terseal higienis.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1">
            <span>Progress Siap Kirim</span>
            <span className="text-slate-900 font-bold">{percentCompleted}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metric 2: Steam Boilers Online */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Line Boiler Aktif</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {kpis.activeBoilers} / 4
            </span>
            <span className="text-xs font-medium text-slate-400">Unit Uap</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dapur Ciampel (Buffer 850 porsi/siklus).
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Status Operasi:</span>
          <span className="font-mono font-medium text-emerald-700">
            Siap Batching Penuh
          </span>
        </div>
      </div>

      {/* Metric 3: Yield Rate Standard */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Yield Rate Bahan</span>
            <span className="text-[10px] font-mono text-slate-400">Target ≥ 95%</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {kpis.averageYieldRate}%
            </span>
            <span className="text-xs font-medium text-emerald-600">Optimal</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tingkat penyusutan dalam toleransi resep.
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Kepatuhan Resep:</span>
          <span className="font-mono font-medium text-slate-700">ISO 22000 Terpenuhi</span>
        </div>
      </div>

      {/* Metric 4: HACCP Inspection Gate */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Inspeksi Suhu Core</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-emerald-600 tabular-nums">
              {kpis.haccpComplianceRate}%
            </span>
            <span className="text-xs font-medium text-slate-400">Pass Rate</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Uji suhu inti matang &gt; 75°C sebelum packing.
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Keamanan Pangan:</span>
          <span className="font-mono font-semibold text-emerald-700">
            CCP Gate 01 Lolos
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductionKpiCards;
