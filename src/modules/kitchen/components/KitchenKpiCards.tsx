import React from "react";
import type { KitchenSummaryKpi } from "../types";
import { formatNumber } from "@/shared/utils/formatters";

interface KitchenKpiCardsProps {
  kpis: KitchenSummaryKpi;
}

export function KitchenKpiCards({ kpis }: KitchenKpiCardsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
      {/* Metric 1: Beban Dapur Aktif (Primary) */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Beban Kerja Dapur
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
              {kpis.activeTicketsCount} Batch Aktif
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono tracking-tight tabular-nums text-slate-900">
              {formatNumber(kpis.totalPortionsInKitchen)}
            </span>
            <span className="text-xs font-sans text-slate-400">Porsi</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total porsi dalam antrean & proses masak.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="text-slate-400">Target Dispatch:</span>
          <span className="text-slate-900 font-semibold font-mono">0 Keterlambatan</span>
        </div>
      </div>

      {/* Metric 2: Holding Bain-Marie */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Holding Bain-Marie</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-[#D97706] tabular-nums">
              {kpis.bainMarieAvgTemp}°C
            </span>
            <span className="text-xs font-medium text-slate-400">Min. &gt;65°C</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Holding thermal makanan bebas bakteri.
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Status Termal:</span>
          <span className="font-mono font-medium text-[#D97706]">
            Food Safe Compliant
          </span>
        </div>
      </div>

      {/* Metric 3: Boiler Uap */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Boiler Uap Sentral</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {kpis.activeBoilersOnline} / 4
            </span>
            <span className="text-xs font-medium text-emerald-600">Optimal</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kapasitas steam boiler 850 porsi buffer siaga.
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Dapur Ciampel:</span>
          <span className="font-mono font-medium text-emerald-700">
            Line 01-04 Online
          </span>
        </div>
      </div>

      {/* Metric 4: Kepatuhan HACCP */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Kepatuhan HACCP CCP</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-emerald-600 tabular-nums">
              {kpis.haccpPassRate}%
            </span>
            <span className="text-xs font-medium text-slate-400">Lolos Audit</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Uji probe suhu inti, polar TPM, & chilling.
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Sertifikasi:</span>
          <span className="font-mono font-semibold text-emerald-700">
            ISO 22000 & Halal BPJPH
          </span>
        </div>
      </div>
    </div>
  );
}

export default KitchenKpiCards;
