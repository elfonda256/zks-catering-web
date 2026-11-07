import React from "react";
import type { KitchenTicket, KitchenStationId, KitchenTicketStatus } from "../types";
import {
  KITCHEN_STATIONS_CONFIG,
  TICKET_STATUS_CONFIG,
} from "../constants";
import { formatNumber } from "@/shared/utils/formatters";

interface KitchenDisplayBoardProps {
  tickets: KitchenTicket[];
  activeStation: KitchenStationId;
  onSelectStation: (st: KitchenStationId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onUpdateTicketStatus: (id: string, newStatus: KitchenTicketStatus, temp?: number) => void;
}

export function KitchenDisplayBoard({
  tickets,
  activeStation,
  onSelectStation,
  searchQuery,
  onSearchChange,
  onUpdateTicketStatus,
}: KitchenDisplayBoardProps) {
  const stationsList: KitchenStationId[] = [
    "ALL",
    "HOT_WOK",
    "STEAMER",
    "BUTCHER",
    "COLD_PACKING",
    "PASTRY",
  ];

  return (
    <div className="space-y-4">
      {/* Station Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Station Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {stationsList.map((stId) => {
            const isSelected = activeStation === stId;
            const meta = KITCHEN_STATIONS_CONFIG[stId];
            return (
              <button
                key={stId}
                type="button"
                onClick={() => onSelectStation(stId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari KDS / pabrik / menu..."
            className="w-full text-xs py-1.5 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-2.5 top-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid of Kitchen Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            <span className="text-3xl block mb-2">🍽️</span>
            <p className="font-semibold text-slate-700">Tidak ada antrean tiket di stasiun ini</p>
            <p className="text-xs text-slate-400 mt-0.5">Semua batch saat ini telah selesai atau berpindah stasiun.</p>
          </div>
        ) : (
          tickets.map((t) => {
            const statusConfig = TICKET_STATUS_CONFIG[t.status];
            const stationMeta = KITCHEN_STATIONS_CONFIG[t.station];

            return (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between overflow-hidden hover:border-slate-300 transition-all"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {t.ticketCode}
                      </span>
                      {t.isAdhoc && (
                        <span className="text-[9px] font-bold uppercase bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-sans tracking-wide">
                          Ad-Hoc Lembur
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
                      {t.shift}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">Target Dispatch</span>
                    <span className="text-xs font-bold font-mono text-[#D97706]">
                      {t.targetDispatchTime}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3 flex-1 text-xs">
                  {/* Client & Portions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-sans font-bold text-sm text-slate-900 leading-snug tracking-tight">
                        {t.clientName}
                      </h4>
                      <p className="text-slate-600 text-xs mt-0.5 font-medium leading-relaxed">
                        {t.menuItemName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-bold font-mono text-[#1B4332] block tabular-nums">
                        {formatNumber(t.portions)}
                      </span>
                      <span className="text-[10px] text-slate-400">Pax Porsi</span>
                    </div>
                  </div>

                  {/* Dietary Alerts */}
                  {t.dietaryAlerts && t.dietaryAlerts.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {t.dietaryAlerts.map((alertItem, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded"
                        >
                          ⚠ {alertItem}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Station & Status Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span>{stationMeta.icon}</span>
                      <span className="font-medium">{stationMeta.label}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig.badgeBg}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* HACCP Core Probe Temp */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500 font-sans">Suhu Inti Matang:</span>
                    {t.currentTemp !== undefined ? (
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded ${
                          t.currentTemp >= t.targetTemp
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {t.currentTemp}°C (Min {t.targetTemp}°C)
                      </span>
                    ) : (
                      <span className="text-slate-400">Menunggu Uji Probe</span>
                    )}
                  </div>
                </div>

                {/* Card Action Controls (KDS Touch Friendly) */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5">
                  {t.status === "QUEUED" && (
                    <button
                      type="button"
                      onClick={() => onUpdateTicketStatus(t.id, "COOKING")}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      ▶ Mulai Masak (Cooking)
                    </button>
                  )}
                  {t.status === "COOKING" && (
                    <div className="grid grid-cols-2 gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => onUpdateTicketStatus(t.id, "HOLDING_HOT", 68.5)}
                        className="py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        ♨ Ke Bain-Marie
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateTicketStatus(t.id, "READY_PACK", 78.0)}
                        className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        ✓ Siap Packing
                      </button>
                    </div>
                  )}
                  {t.status === "HOLDING_HOT" && (
                    <button
                      type="button"
                      onClick={() => onUpdateTicketStatus(t.id, "READY_PACK", t.currentTemp)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      ✓ Mulai Packing Bento
                    </button>
                  )}
                  {t.status === "READY_PACK" && (
                    <button
                      type="button"
                      onClick={() => onUpdateTicketStatus(t.id, "COMPLETED")}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      🚀 Dispatched ke Armada Thermobox
                    </button>
                  )}
                  {t.status === "COMPLETED" && (
                    <div className="w-full text-center py-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 font-semibold">
                      ✓ Telah Diserahkan ke Armada Ciampel
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default KitchenDisplayBoard;

