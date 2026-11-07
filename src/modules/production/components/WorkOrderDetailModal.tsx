import React, { useState } from "react";
import type { WorkOrder, WorkOrderStatus, ProductionStation } from "../types";
import {
  WORK_ORDER_STATUS_CONFIG,
  STATION_LABELS,
  SHIFT_LABELS,
} from "../constants";
import { validateHaccpCoreTemp } from "../schemas";
import { formatNumber } from "@/shared/utils/formatters";

interface WorkOrderDetailModalProps {
  order: WorkOrder | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: WorkOrderStatus, recordedTemp?: number) => void;
}

export function WorkOrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: WorkOrderDetailModalProps) {
  const [tempInput, setTempInput] = useState<string>(
    order?.currentCoreTemp ? order.currentCoreTemp.toString() : "76.5"
  );
  const [selectedNextStatus, setSelectedNextStatus] = useState<WorkOrderStatus>(
    order?.status || "PLANNED"
  );
  const [actionSuccess, setActionSuccess] = useState<boolean>(false);

  if (!order) return null;

  const currentStatusMeta = WORK_ORDER_STATUS_CONFIG[order.status];
  const stationMeta = STATION_LABELS[order.station as ProductionStation];
  const shiftMeta = SHIFT_LABELS[order.shift];

  const parsedTemp = parseFloat(tempInput);
  const tempValidation = !isNaN(parsedTemp)
    ? validateHaccpCoreTemp(order.station, parsedTemp)
    : null;

  const handleSaveInspection = () => {
    onUpdateStatus(order.id, selectedNextStatus, !isNaN(parsedTemp) ? parsedTemp : undefined);
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      onClose();
    }, 1200);
  };

  const statusTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
    PLANNED: ["IN_PREPARATION", "CANCELLED"],
    IN_PREPARATION: ["COOKING", "CANCELLED"],
    COOKING: ["COOLING", "PACKED"],
    COOLING: ["PACKED"],
    PACKED: ["DISPATCHED"],
    DISPATCHED: [],
    CANCELLED: [],
  };

  const availableNextStatuses = statusTransitions[order.status] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-900">
                {order.workOrderCode}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentStatusMeta.badgeClass}`}>
                {currentStatusMeta.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {order.clientName} • {shiftMeta.label}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {actionSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-xs font-medium">
              ✓ Status Work Order & Pemeriksaan HACCP berhasil diperbarui!
            </div>
          )}

          {/* Key Parameters Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Menu Produksi</span>
              <p className="font-semibold text-slate-900 mt-0.5">{order.menuItemName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Porsi</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">{formatNumber(order.targetPortions)} Porsi</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Stasiun Dapur</span>
              <p className="text-slate-800 mt-0.5">{stationMeta.name}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Target Packing Selesai</span>
              <p className="font-mono text-slate-800 mt-0.5">{order.targetPackingTime}</p>
            </div>
          </div>

          {/* Notes / Dietary */}
          {order.notes && (
            <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg text-amber-900 text-[11px]">
              <span className="font-semibold block">Catatan Khusus Pabrik:</span>
              <p className="mt-0.5">{order.notes}</p>
            </div>
          )}

          {/* HACCP Core Temp Checkpoint (CCP Gate 01) */}
          <div className="border border-slate-200 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Inspeksi Suhu Inti Pangan (HACCP CCP)
                </span>
                <span className="text-[11px] text-slate-500">
                  Wajib mencapai minimum {order.coreTempTarget}°C untuk sterilisasi mikroba.
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Probe Thermometer
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-36">
                <input
                  type="number"
                  step="0.1"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  className="w-full text-lg font-bold font-mono py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
                <span className="absolute right-3 top-2 text-xs font-mono text-slate-400">°C</span>
              </div>

              {tempValidation && (
                <div
                  className={`flex-1 text-[11px] p-2 rounded-lg border leading-tight ${
                    tempValidation.isSafe
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  {tempValidation.feedback}
                </div>
              )}
            </div>
          </div>

          {/* Status Progression FSM */}
          {availableNextStatuses.length > 0 && (
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Perbarui Status Tahapan Dapur
              </label>
              <div className="flex flex-wrap gap-2">
                {availableNextStatuses.map((nextSt) => {
                  const meta = WORK_ORDER_STATUS_CONFIG[nextSt];
                  const isSelected = selectedNextStatus === nextSt;
                  return (
                    <button
                      key={nextSt}
                      type="button"
                      onClick={() => setSelectedNextStatus(nextSt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Pindah ke: {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSaveInspection}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            Simpan Log Inspeksi & Status
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkOrderDetailModal;

