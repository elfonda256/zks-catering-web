import React, { useState } from "react";
import type { HaccpLogEntry } from "../types";

interface KitchenInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<HaccpLogEntry, "id" | "recordedTime">) => void;
}

const CCP_PRESETS = [
  {
    code: "CCP-01",
    name: "Suhu Inti Daging / Unggas (Core Probe)",
    threshold: "Min. 75.0°C",
    unit: "°C",
    defaultValue: 77.5,
    minPass: 75.0,
    checkFn: (val: number): "PASS" | "FAIL" => (val >= 75.0 ? "PASS" : "FAIL"),
  },
  {
    code: "CCP-02",
    name: "Uji Degradasi Minyak Goreng (TPM)",
    threshold: "Maks. 24.0% TPM",
    unit: "% TPM",
    defaultValue: 16.0,
    minPass: 24.0,
    checkFn: (val: number): "PASS" | "FAIL" => (val <= 24.0 ? "PASS" : "FAIL"),
  },
  {
    code: "CCP-03",
    name: "Holding Cabinet Bain-Marie Termal",
    threshold: "Min. 65.0°C",
    unit: "°C",
    defaultValue: 68.0,
    minPass: 65.0,
    checkFn: (val: number): "PASS" | "FAIL" => (val >= 65.0 ? "PASS" : "FAIL"),
  },
  {
    code: "CCP-04",
    name: "Rapid Chilling Curve (Blast Chiller)",
    threshold: "Maks. 10.0°C dalam 2 Jam",
    unit: "°C",
    defaultValue: 5.5,
    minPass: 10.0,
    checkFn: (val: number): "PASS" | "FAIL" => (val <= 10.0 ? "PASS" : "FAIL"),
  },
];

export function KitchenInspectionModal({
  isOpen,
  onClose,
  onSubmit,
}: KitchenInspectionModalProps) {
  const [selectedCcpIndex, setSelectedCcpIndex] = useState<number>(0);
  const [itemTested, setItemTested] = useState<string>("Batch Ayam Goreng Lengkuas (Line Wok 01)");
  const [valueInput, setValueInput] = useState<string>("77.5");
  const [inspectorName, setInspectorName] = useState<string>("QC Irfan Maulana");

  if (!isOpen) return null;

  const currentPreset = CCP_PRESETS[selectedCcpIndex];
  const parsedValue = parseFloat(valueInput) || 0;
  const statusResult = currentPreset.checkFn(parsedValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ccpCode: currentPreset.code,
      checkpointName: currentPreset.name,
      itemTested,
      recordedValue: parsedValue,
      unit: currentPreset.unit,
      standardThreshold: currentPreset.threshold,
      status: statusResult,
      inspectorName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              HACCP & ISO 22000 Checkpoint
            </span>
            <h3 className="text-base font-sans font-bold tracking-tight text-slate-900 mt-1">
              Catat Uji Mutu Titik Kontrol Kritis (CCP)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Preset Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
              Pilih Titik Kontrol Kritis (CCP)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CCP_PRESETS.map((preset, idx) => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => {
                    setSelectedCcpIndex(idx);
                    setValueInput(preset.defaultValue.toString());
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    selectedCcpIndex === idx
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-mono font-bold block">{preset.code}</span>
                  <span className="text-[10px] block truncate opacity-90 mt-0.5">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Item Description */}
          <div>
            <label htmlFor="item-tested-input" className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
              Objek / Batch Makanan yang Diuji
            </label>
            <input
              id="item-tested-input"
              type="text"
              required
              value={itemTested}
              onChange={(e) => setItemTested(e.target.value)}
              placeholder="Contoh: Batch Ayam Bakar PT FCC Line Wok 02"
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Measured Value Input */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="measured-value-input" className="text-[11px] font-semibold text-slate-700 uppercase">
                Nilai Pengukuran Alat Uji
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Standar: {currentPreset.threshold}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-36">
                <input
                  id="measured-value-input"
                  type="number"
                  step="0.1"
                  required
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className="w-full text-lg font-bold font-mono py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                />
                <span className="absolute right-3 top-2 text-xs font-mono text-slate-400">
                  {currentPreset.unit}
                </span>
              </div>

              {/* Live Status Result */}
              <div
                className={`flex-1 p-2 rounded-lg border text-center font-bold text-xs ${
                  statusResult === "PASS"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                {statusResult === "PASS" ? "✓ LOLOS (PASS HACCP)" : "✕ TIDAK LOLOS (REJECT)"}
              </div>
            </div>
          </div>

          {/* Inspector */}
          <div>
            <label htmlFor="inspector-name-input" className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
              Nama Petugas Penguji (QC / Chef)
            </label>
            <input
              id="inspector-name-input"
              type="text"
              required
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              Simpan ke Buku Log HACCP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default KitchenInspectionModal;

