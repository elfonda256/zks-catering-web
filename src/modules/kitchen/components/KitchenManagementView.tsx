"use client";

import React, { useState } from "react";
import { useKitchen } from "../hooks/useKitchen";
import { KitchenKpiCards } from "./KitchenKpiCards";
import { KitchenDisplayBoard } from "./KitchenDisplayBoard";
import { HaccpInspectionLedger } from "./HaccpInspectionLedger";
import { KitchenInspectionModal } from "./KitchenInspectionModal";

export function KitchenManagementView() {
  const [activeMainTab, setActiveMainTab] = useState<"KDS_BOARD" | "HACCP_LOG">("KDS_BOARD");

  const {
    filteredTickets,
    haccpLogs,
    activeStation,
    setActiveStation,
    searchQuery,
    setSearchQuery,
    isInspectionModalOpen,
    setIsInspectionModalOpen,
    kpis,
    handleUpdateStatus,
    handleAddHaccpEntry,
  } = useKitchen();

  const mainTabs = [
    { id: "KDS_BOARD", label: "Display Antrean Masak (KDS)" },
    { id: "HACCP_LOG", label: "Buku Log HACCP & Sanitasi CCP" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {mainTabs.map((tab) => {
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMainTab(tab.id)}
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

      {/* Tab 1: Display Antrean Masak (KDS) */}
      {activeMainTab === "KDS_BOARD" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Executive KPI Cards */}
          <KitchenKpiCards kpis={kpis} />

          {/* KDS Board */}
          <KitchenDisplayBoard
            tickets={filteredTickets}
            activeStation={activeStation}
            onSelectStation={setActiveStation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUpdateTicketStatus={handleUpdateStatus}
          />
        </div>
      )}

      {/* Tab 2: Buku Log HACCP & CCP */}
      {activeMainTab === "HACCP_LOG" && (
        <div className="animate-in fade-in duration-150">
          <HaccpInspectionLedger
            logs={haccpLogs}
            onOpenNewInspectionModal={() => setIsInspectionModalOpen(true)}
          />
        </div>
      )}

      {/* Modal Catat Uji HACCP Baru */}
      <KitchenInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        onSubmit={handleAddHaccpEntry}
      />
    </div>
  );
}

export default KitchenManagementView;

