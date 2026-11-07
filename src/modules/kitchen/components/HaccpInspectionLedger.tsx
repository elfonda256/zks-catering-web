import React from "react";
import type { HaccpLogEntry } from "../types";

interface HaccpInspectionLedgerProps {
  logs: HaccpLogEntry[];
  onOpenNewInspectionModal: () => void;
}

export function HaccpInspectionLedger({
  logs,
  onOpenNewInspectionModal,
}: HaccpInspectionLedgerProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              ISO 22000:2009 & Halal BPJPH
            </span>
          </div>
          <h3 className="text-base font-sans font-bold tracking-tight text-slate-900 mt-1">
            Buku Log Titik Kontrol Kritis (HACCP CCP Ledger)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan digital audit sterilisasi termal, uji degradasi minyak goreng (TPM), dan rantai dingin.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewInspectionModal}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>+</span>
          <span>Catat Uji CCP Baru</span>
        </button>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Titik Kontrol (CCP)</th>
              <th className="py-3 px-4">Parameter & Unit Diuji</th>
              <th className="py-3 px-4 text-right">Nilai Terukur</th>
              <th className="py-3 px-4">Ambang Batas Standar</th>
              <th className="py-3 px-4 text-center">Status Mutu</th>
              <th className="py-3 px-4">Petugas QC & Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Column 1: CCP Code */}
                <td className="py-3 px-4 align-top">
                  <span className="font-bold text-slate-900 block">{log.ccpCode}</span>
                  <span className="text-[10px] font-sans text-slate-500 block mt-0.5">
                    {log.checkpointName}
                  </span>
                </td>

                {/* Column 2: Item Tested */}
                <td className="py-3 px-4 align-top font-sans">
                  <span className="font-medium text-slate-900 block">{log.itemTested}</span>
                  <span className="text-[10px] text-slate-400">Dapur Sentral Ciampel</span>
                </td>

                {/* Column 3: Measured Value */}
                <td className="py-3 px-4 align-top text-right">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    {log.recordedValue}
                  </span>{" "}
                  <span className="text-slate-500 text-[11px]">{log.unit}</span>
                </td>

                {/* Column 4: Standard Threshold */}
                <td className="py-3 px-4 align-top text-slate-600 font-sans">
                  <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                    {log.standardThreshold}
                  </span>
                </td>

                {/* Column 5: Status */}
                <td className="py-3 px-4 align-top text-center font-sans">
                  {log.status === "PASS" ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ PASS
                    </span>
                  ) : log.status === "WARNING" ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      ⚠ PERINGATAN
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      ✕ REJECT
                    </span>
                  )}
                </td>

                {/* Column 6: Inspector & Time */}
                <td className="py-3 px-4 align-top font-sans text-slate-600">
                  <span className="font-medium text-slate-900 block text-xs">{log.inspectorName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.recordedTime}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span>Menampilkan {logs.length} catatan pengujian kritis</span>
        <span className="font-mono">Terverifikasi Tim QA/QC PT ZKS</span>
      </div>
    </div>
  );
}

export default HaccpInspectionLedger;

