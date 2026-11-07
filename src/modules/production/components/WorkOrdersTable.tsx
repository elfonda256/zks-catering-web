import React from "react";
import type { WorkOrder, ProductionStation } from "../types";
import {
  STATION_LABELS,
  WORK_ORDER_STATUS_CONFIG,
  SHIFT_LABELS,
} from "../constants";
import { formatNumber } from "@/shared/utils/formatters";

interface WorkOrdersTableProps {
  orders: WorkOrder[];
  selectedStation: string;
  onSelectStation: (station: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onInspectOrder: (order: WorkOrder) => void;
}

export function WorkOrdersTable({
  orders,
  selectedStation,
  onSelectStation,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  onInspectOrder,
}: WorkOrdersTableProps) {
  const stationTabs: Array<{ id: string; label: string }> = [
    { id: "ALL", label: "Semua Stasiun" },
    { id: "HOT_KITCHEN", label: "Hot Wok" },
    { id: "STEAMER", label: "Rice Boiler" },
    { id: "BUTCHER", label: "Butcher" },
    { id: "COLD_PREP", label: "Assembly" },
    { id: "BAKERY", label: "Pastry/Buah" },
  ];

  const statusOptions = [
    { id: "ALL", label: "Semua Status" },
    { id: "PLANNED", label: "Terjadwal" },
    { id: "IN_PREPARATION", label: "Persiapan" },
    { id: "COOKING", label: "Dimasak" },
    { id: "COOLING", label: "Chilling" },
    { id: "PACKED", label: "Selesai Packing" },
    { id: "DISPATCHED", label: "Keluar Armada" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-4 md:p-5 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Antrean Perintah Kerja Produksi (Work Orders)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Jadwal batching harian Dapur Sentral Ciampel berstandar ISO 22000 & Halal BPJPH.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari kode WO, pabrik, atau menu..."
              className="w-full text-xs py-2 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Station Navigation Tabs & Status Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Station Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {stationTabs.map((tab) => {
              const isActive = selectedStation === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectStation(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500">Filter Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onSelectStatus(e.target.value)}
              aria-label="Filter Status Produksi"
              className="text-xs bg-white border border-slate-200 rounded-md py-1 px-2.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              {statusOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Kode WO & Shift</th>
              <th className="py-3 px-4">Klien Pabrik & Menu</th>
              <th className="py-3 px-4">Stasiun Kerja</th>
              <th className="py-3 px-4 text-right">Porsi Target</th>
              <th className="py-3 px-4 text-center">Suhu Core HACCP</th>
              <th className="py-3 px-4">Status Siklus</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-2">📋</span>
                    <p className="font-semibold text-slate-700">Tidak ada Work Order yang sesuai</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ubah filter stasiun atau kata kunci pencarian Anda.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((wo) => {
                const statusMeta = WORK_ORDER_STATUS_CONFIG[wo.status];
                const shiftMeta = SHIFT_LABELS[wo.shift];
                const stationMeta = STATION_LABELS[wo.station as ProductionStation];

                return (
                  <tr
                    key={wo.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onInspectOrder(wo)}
                  >
                    {/* Column 1: WO Code & Shift */}
                    <td className="py-3 px-4 align-top">
                      <span className="font-mono font-semibold text-slate-900 block">
                        {wo.workOrderCode}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {shiftMeta.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Pack by: {wo.targetPackingTime}
                      </span>
                    </td>

                    {/* Column 2: Client & Menu */}
                    <td className="py-3 px-4 align-top max-w-[240px]">
                      <span className="font-semibold text-slate-900 block truncate">
                        {wo.clientName}
                      </span>
                      <span className="text-[11px] text-slate-600 block line-clamp-1 mt-0.5">
                        {wo.menuItemName}
                      </span>
                      <span className="text-[10px] font-mono text-[#B38400] bg-amber-50 px-1.5 py-0.2 rounded inline-block mt-1">
                        Tier {wo.tier}
                      </span>
                    </td>

                    {/* Column 3: Station */}
                    <td className="py-3 px-4 align-top">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded text-[11px]">
                        <span>{stationMeta.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        PIC: {wo.headChefName}
                      </span>
                    </td>

                    {/* Column 4: Portions */}
                    <td className="py-3 px-4 align-top text-right font-mono">
                      <span className="font-bold text-slate-900 block text-sm tabular-nums">
                        {formatNumber(wo.targetPortions)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {wo.status === "PACKED" || wo.status === "DISPATCHED"
                          ? `${formatNumber(wo.actualProduced)} Packed`
                          : "Dalam Proses"}
                      </span>
                    </td>

                    {/* Column 5: Core Temperature Checkpoint */}
                    <td className="py-3 px-4 align-top text-center">
                      {wo.currentCoreTemp !== undefined ? (
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              wo.haccpPassed
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {wo.currentCoreTemp}°C
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">
                            Min. {wo.coreTempTarget}°C
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Belum Uji
                        </span>
                      )}
                    </td>

                    {/* Column 6: Status */}
                    <td className="py-3 px-4 align-top">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusMeta.badgeClass}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>

                    {/* Column 7: Actions */}
                    <td className="py-3 px-4 align-top text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectOrder(wo);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                      >
                        Inspeksi →
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Audit Count */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span>Menampilkan {orders.length} Perintah Kerja aktif</span>
        <span className="font-mono">Standar HACCP & ISO 22000 Dapur Ciampel</span>
      </div>
    </div>
  );
}

export default WorkOrdersTable;

