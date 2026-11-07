import React from "react";
import type { RecipeBOM, ScaledIngredientRequirement } from "../types";
import { formatNumber } from "@/shared/utils/formatters";

interface RecipeBomScalingCalculatorProps {
  recipes: RecipeBOM[];
  selectedRecipe: RecipeBOM | undefined;
  onSelectRecipe: (code: string) => void;
  scalingPax: number;
  onPaxChange: (pax: number) => void;
  scaledIngredients: ScaledIngredientRequirement[];
}

const PAX_PRESETS = [100, 250, 350, 500, 850, 1200];

export function RecipeBomScalingCalculator({
  recipes,
  selectedRecipe,
  onSelectRecipe,
  scalingPax,
  onPaxChange,
  scaledIngredients,
}: RecipeBomScalingCalculatorProps) {
  if (!selectedRecipe) return null;

  const totalKgRequired = scaledIngredients
    .filter((ing) => ing.unit === "kg")
    .reduce((sum, curr) => sum + curr.totalRequired, 0);

  const hasShortage = scaledIngredients.some((ing) => !ing.isSufficient);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-6 p-5 md:p-6">
      {/* Title & Recipe Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
            Bill of Materials (BOM) Calculator
          </span>
          <h3 className="text-lg font-sans font-bold tracking-tight text-slate-900 mt-0.5">
            Kalkulator Scaling Gramatur Bahan Baku Dapur
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Simulasi otomatis kebutuhan bahan baku katering massal berdasarkan target porsi & susut masak.
          </p>
        </div>

        {/* Master Recipe Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="master-recipe-select" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Resep Master:
          </label>
          <select
            id="master-recipe-select"
            value={selectedRecipe.recipeCode}
            onChange={(e) => onSelectRecipe(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-slate-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
          >
            {recipes.map((r) => (
              <option key={r.recipeCode} value={r.recipeCode}>
                {r.name} ({r.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Pax Stepper & Presets */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label htmlFor="scaling-pax-input" className="text-xs font-semibold text-slate-800 uppercase tracking-wide block">
              Simulasi Target Porsi Produksi
            </label>
            <span className="text-[11px] text-slate-500">
              Basis resep standar: {selectedRecipe.baseYieldPortions} porsi | Susut masak: {selectedRecipe.lossFactorPercent}%
            </span>
          </div>

          {/* Stepper Input */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPaxChange(Math.max(10, scalingPax - 50))}
              className="w-8 h-8 rounded-md bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
            >
              −
            </button>
            <div className="relative">
              <input
                id="scaling-pax-input"
                type="number"
                min="1"
                max="10000"
                value={scalingPax}
                onChange={(e) => onPaxChange(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-28 text-center text-sm font-bold font-mono py-1.5 px-2 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-400 absolute right-2 top-2 pointer-events-none">
                Pax
              </span>
            </div>
            <button
              type="button"
              onClick={() => onPaxChange(scalingPax + 50)}
              className="w-8 h-8 rounded-md bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/60">
          <span className="text-[11px] text-slate-500 mr-1">Preset cepat:</span>
          {PAX_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onPaxChange(preset)}
              className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                scalingPax === preset
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {preset} pax
            </button>
          ))}
        </div>
      </div>

      {/* Exploded BOM Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-100/70 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="font-semibold text-slate-800">
            Daftar Ledakan Kebutuhan Bahan (BOM Explosion) — {formatNumber(scalingPax)} Porsi
          </div>
          <div className="font-mono text-[11px] text-slate-600">
            Total Bahan Padat: <strong className="text-slate-900">{formatNumber(Math.round(totalKgRequired))} kg</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-4">SKU & Nama Bahan Baku</th>
                <th className="py-2.5 px-4 text-center">Gramatur Standar</th>
                <th className="py-2.5 px-4 text-right">Kebutuhan Netto</th>
                <th className="py-2.5 px-4 text-right">Stok Gudang</th>
                <th className="py-2.5 px-4 text-center">Kecukupan Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {scaledIngredients.map((ing) => (
                <tr key={ing.sku} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-sans">
                    <span className="font-medium text-slate-900 block">{ing.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ing.sku}</span>
                  </td>
                  <td className="py-2.5 px-4 text-center text-slate-600 tabular-nums">
                    {ing.totalRequired > 0
                      ? `${(ing.totalRequired / scalingPax * 1000).toFixed(0)} g/pax`
                      : "-"}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatNumber(ing.totalRequired)} {ing.unit}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-600 tabular-nums">
                    {formatNumber(ing.stockAvailable)} {ing.unit}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {ing.isSufficient ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold font-sans bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Stok Aman
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold font-sans bg-rose-50 text-rose-700 border border-rose-200">
                        ⚠ Kurang {formatNumber(ing.shortageAmount)} {ing.unit}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action / Warning Bar */}
      {hasShortage ? (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <span className="text-base">⚠️</span>
            <div>
              <span className="font-bold block">Peringatan Ketersediaan Bahan Baku Dapur</span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Ada bahan baku yang stoknya di bawah kebutuhan {formatNumber(scalingPax)} porsi. Ajukan Purchase Request (PR) ke Purchasing.
              </p>
            </div>
          </div>
          <a
            href="/admin/purchase-requests"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs whitespace-nowrap transition-colors text-center shadow-2xs"
          >
            Buat PR Bahan Kurang →
          </a>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-900">
          <span className="text-base">✅</span>
          <span className="font-medium">
            Kapasitas Bahan Baku Mencukupi! Gudang siap mengeluarkan bahan untuk batching {formatNumber(scalingPax)} porsi.
          </span>
        </div>
      )}
    </div>
  );
}

export default RecipeBomScalingCalculator;

