"use client";

import React from "react";
import { useProduction } from "../hooks/useProduction";
import { ProductionKpiCards } from "./ProductionKpiCards";
import { WorkOrdersTable } from "./WorkOrdersTable";
import { RecipeBomScalingCalculator } from "./RecipeBomScalingCalculator";
import { WorkOrderDetailModal } from "./WorkOrderDetailModal";
import { STATION_LABELS } from "../constants";
import type { ProductionStation } from "../types";

interface ProductionManagementViewProps {
  initialTab?: "WORK_ORDERS" | "BOM_CALCULATOR" | "STATIONS";
}

export function ProductionManagementView({ initialTab = "WORK_ORDERS" }: ProductionManagementViewProps) {
  const {
    filteredWorkOrders,
    activeTab,
    setActiveTab,
    selectedStation,
    setSelectedStation,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    setSelectedRecipeCode,
    scalingPax,
    setScalingPax,
    currentRecipe,
    scaledRequirements,
    kpis,
    inspectingWorkOrder,
    setInspectingWorkOrder,
    handleUpdateStatus,
  } = useProduction(initialTab);

  const navTabs = [
    { id: "WORK_ORDERS", label: "Jadwal Masak Harian" },
    { id: "BOM_CALCULATOR", label: "Kalkulator BOM & Resep" },
    { id: "STATIONS", label: "Stasiun & Kapasitas Dapur" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer border-b-2 -mb-px ${
                isActive
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Jadwal Masak Harian */}
      {activeTab === "WORK_ORDERS" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Executive KPI Cards */}
          <ProductionKpiCards kpis={kpis} />

          {/* Table */}
          <WorkOrdersTable
            orders={filteredWorkOrders}
            selectedStation={selectedStation}
            onSelectStation={setSelectedStation}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onInspectOrder={(wo) => setInspectingWorkOrder(wo)}
          />
        </div>
      )}

      {/* Tab 2: Kalkulator BOM & Resep */}
      {activeTab === "BOM_CALCULATOR" && (
        <div className="animate-in fade-in duration-150">
          <RecipeBomScalingCalculator
            recipes={[
              {
                id: "rcp-001",
                recipeCode: "RCP-AYM-LKG",
                name: "Ayam Goreng Lengkuas Tradisional Karawang",
                category: "PROTEIN",
                baseYieldPortions: 100,
                prepTimeMinutes: 45,
                cookTimeMinutes: 60,
                lossFactorPercent: 8,
                standardCoreTemp: 75,
                ingredients: [],
              },
              {
                id: "rcp-002",
                recipeCode: "RCP-NAS-PLN",
                name: "Nasi Putih Pulen Wangi (Beras Ramos Karawang)",
                category: "KARBOHIDRAT",
                baseYieldPortions: 100,
                prepTimeMinutes: 20,
                cookTimeMinutes: 50,
                lossFactorPercent: 0,
                standardCoreTemp: 85,
                ingredients: [],
              },
              {
                id: "rcp-003",
                recipeCode: "RCP-DNG-LDH",
                name: "Daging Sapi Lada Hitam Heavy Duty",
                category: "PROTEIN",
                baseYieldPortions: 100,
                prepTimeMinutes: 60,
                cookTimeMinutes: 75,
                lossFactorPercent: 12,
                standardCoreTemp: 80,
                ingredients: [],
              },
              {
                id: "rcp-004",
                recipeCode: "RCP-SYR-CPY",
                name: "Capcay Sayur Segar Kombinasi Bakso Sapi",
                category: "SAYURAN",
                baseYieldPortions: 100,
                prepTimeMinutes: 30,
                cookTimeMinutes: 30,
                lossFactorPercent: 5,
                standardCoreTemp: 75,
                ingredients: [],
              },
            ]}
            selectedRecipe={currentRecipe}
            onSelectRecipe={setSelectedRecipeCode}
            scalingPax={scalingPax}
            onPaxChange={setScalingPax}
            scaledIngredients={scaledRequirements}
          />
        </div>
      )}

      {/* Tab 3: Stasiun & Kapasitas Dapur */}
      {activeTab === "STATIONS" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-base font-semibold text-slate-900">
              Peta Stasiun Kerja Dapur Sentral Ciampel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar alur satu arah (one-way flow) kepatuhan higienis HACCP & Sertifikasi ISO 22000.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {(
                [
                  "BUTCHER",
                  "STEAMER",
                  "HOT_KITCHEN",
                  "COLD_PREP",
                  "BAKERY",
                ] as ProductionStation[]
              ).map((station) => {
                const info = STATION_LABELS[station];
                return (
                  <div
                    key={station}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">
                        {info.name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Aktif
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {info.desc}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                      <span>Protokol:</span>
                      <span className="text-slate-900 font-semibold">Sanitasi Terjadwal</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail / Inspeksi HACCP */}
      <WorkOrderDetailModal
        order={inspectingWorkOrder}
        onClose={() => setInspectingWorkOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export default ProductionManagementView;
