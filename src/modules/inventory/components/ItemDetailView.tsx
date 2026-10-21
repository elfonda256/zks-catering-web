"use client";

import React, { useState } from "react";
import Link from "next/link";

// --- TYPES ---
export type ConsumptionPeriod = "30D" | "60D" | "90D";

export interface BatchItem {
  batchNumber: string;
  productionDate: string;
  expiryDate: string;
  currentQuantity: string;
  status: "Fresh" | "Expiring Soon" | "In Inspection" | "Reserved";
  isFirstExpired: boolean;
  facility: string;
}

export interface MovementItem {
  id: string;
  time: string;
  date: string;
  type: "Receiving" | "Production" | "Transfer" | "Adjustment";
  delta: string;
  isPositive: boolean;
  party: string;
  operator: string;
  refCode: string;
}

export interface PurchaseRecord {
  id: string;
  supplier: string;
  poNumber: string;
  qty: string;
  price: string;
  totalAmount: string;
  date: string;
  status: "Completed" | "In Delivery" | "Verified";
}

export interface DocumentItem {
  id: string;
  name: string;
  type: "HALAL" | "LAB_TEST" | "SPEC_SHEET" | "SUPPLIER_DOC";
  issuer: string;
  validUntil: string;
  fileSize: string;
  fileFormat: string;
}

// --- MOCK BATCHES (SECTION 04) ---
const BATCH_DATA: BatchItem[] = [
  {
    batchNumber: "B-PLT-2026-8819",
    productionDate: "14 Okt 2026",
    expiryDate: "23 Okt 2026",
    currentQuantity: "220 kg",
    status: "Expiring Soon",
    isFirstExpired: true, // FEFO Priority 1
    facility: "Cold Storage • Rack A-02",
  },
  {
    batchNumber: "B-PLT-2026-8821",
    productionDate: "18 Okt 2026",
    expiryDate: "28 Okt 2026",
    currentQuantity: "480 kg",
    status: "Fresh",
    isFirstExpired: false,
    facility: "Cold Storage • Rack A-04",
  },
  {
    batchNumber: "B-PLT-2026-8824",
    productionDate: "20 Okt 2026",
    expiryDate: "30 Okt 2026",
    currentQuantity: "500 kg",
    status: "Fresh",
    isFirstExpired: false,
    facility: "Cold Storage • Rack B-01",
  },
  {
    batchNumber: "B-PLT-2026-8830",
    productionDate: "21 Okt 2026",
    expiryDate: "02 Nov 2026",
    currentQuantity: "250 kg",
    status: "In Inspection",
    isFirstExpired: false,
    facility: "Inbound Holding Bay",
  },
];

// --- MOCK TIMELINE (SECTION 05) ---
const MOVEMENT_TIMELINE: MovementItem[] = [
  {
    id: "m-1",
    time: "08:15",
    date: "Hari ini, 21 Okt",
    type: "Receiving",
    delta: "+250 kg",
    isPositive: true,
    party: "Supplier PT. Sumber Unggas Makmur",
    operator: "SPV Andi (Gudang)",
    refCode: "PO #PO-ZKS-2026-1082",
  },
  {
    id: "m-2",
    time: "09:20",
    date: "Hari ini, 21 Okt",
    type: "Production",
    delta: "−120 kg",
    isPositive: false,
    party: "Central Kitchen Deck A (Menu Ayam Panggang)",
    operator: "Chef Budi (Line 1)",
    refCode: "BATCH-COOK-881",
  },
  {
    id: "m-3",
    time: "12:40",
    date: "Hari ini, 21 Okt",
    type: "Transfer",
    delta: "80 kg",
    isPositive: true,
    party: "Cold Storage Freezer → Kitchen Buffer Prep",
    operator: "Logistik Yusuf",
    refCode: "TR #TR-ZKS-094",
  },
  {
    id: "m-4",
    time: "15:10",
    date: "Hari ini, 21 Okt",
    type: "Adjustment",
    delta: "−4.5 kg",
    isPositive: false,
    party: "Thawing Drip Loss & Trim Correction",
    operator: "QC Hendra",
    refCode: "ADJ-QC-102",
  },
  {
    id: "m-5",
    time: "16:45",
    date: "Kemarin, 20 Okt",
    type: "Production",
    delta: "−140 kg",
    isPositive: false,
    party: "Shift Malam Industri 3,200 Porsi",
    operator: "Chef Dewi (Line 2)",
    refCode: "BATCH-COOK-879",
  },
];

// --- MOCK PURCHASE HISTORY (SECTION 06) ---
const PURCHASE_HISTORY: PurchaseRecord[] = [
  {
    id: "po-1",
    supplier: "PT. Sumber Unggas Makmur",
    poNumber: "PO-ZKS-2026-1082",
    qty: "250 kg",
    price: "Rp 38.500",
    totalAmount: "Rp 9.625.000",
    date: "21 Okt 2026",
    status: "Verified",
  },
  {
    id: "po-2",
    supplier: "PT. Sumber Unggas Makmur",
    poNumber: "PO-ZKS-2026-1074",
    qty: "500 kg",
    price: "Rp 38.000",
    totalAmount: "Rp 19.000.000",
    date: "17 Okt 2026",
    status: "Completed",
  },
  {
    id: "po-3",
    supplier: "CV. Berkah Unggas Karawang",
    poNumber: "PO-ZKS-2026-1055",
    qty: "400 kg",
    price: "Rp 39.000",
    totalAmount: "Rp 15.600.000",
    date: "10 Okt 2026",
    status: "Completed",
  },
  {
    id: "po-4",
    supplier: "PT. Sumber Unggas Makmur",
    poNumber: "PO-ZKS-2026-1038",
    qty: "600 kg",
    price: "Rp 38.500",
    totalAmount: "Rp 23.100.000",
    date: "03 Okt 2026",
    status: "Completed",
  },
];

// --- MOCK CONSUMPTION CHART (SECTION 07) ---
const CONSUMPTION_SERIES: Record<
  ConsumptionPeriod,
  { label: string; date: string; usage: number; forecast: number }[]
> = {
  "30D": [
    { label: "W1", date: "Minggu 1 (Sep)", usage: 780, forecast: 750 },
    { label: "W2", date: "Minggu 2 (Okt)", usage: 840, forecast: 820 },
    { label: "W3", date: "Minggu 3 (Okt)", usage: 910, forecast: 890 },
    { label: "W4", date: "Minggu 4 (Okt)", usage: 829, forecast: 830 },
  ],
  "60D": [
    { label: "Agt-1", date: "Agt Paruh 1", usage: 1650, forecast: 1600 },
    { label: "Agt-2", date: "Agt Paruh 2", usage: 1720, forecast: 1700 },
    { label: "Sep-1", date: "Sep Paruh 1", usage: 1810, forecast: 1780 },
    { label: "Sep-2", date: "Sep Paruh 2", usage: 1790, forecast: 1800 },
  ],
  "90D": [
    { label: "Juli", date: "Bulan Juli 2026", usage: 3450, forecast: 3400 },
    { label: "Agustus", date: "Bulan Agustus 2026", usage: 3620, forecast: 3550 },
    { label: "September", date: "Bulan September 2026", usage: 3810, forecast: 3750 },
  ],
};

// --- MOCK DOCUMENTS (SECTION 08) ---
const DOCUMENTS_DATA: DocumentItem[] = [
  {
    id: "doc-halal",
    name: "Sertifikat Halal Resmi RPU (Rumah Potong Unggas)",
    type: "HALAL",
    issuer: "BPJPH & LPPOM MUI",
    validUntil: "14 Nov 2028",
    fileSize: "1.4 MB",
    fileFormat: "PDF",
  },
  {
    id: "doc-lab",
    name: "Laporan Uji Mutu Mikrobiologi (Salmonella & E.coli Negative)",
    type: "LAB_TEST",
    issuer: "Laboratorium Pangan Terakreditasi KAN",
    validUntil: "18 Nov 2026",
    fileSize: "840 KB",
    fileFormat: "PDF",
  },
  {
    id: "doc-spec",
    name: "Spesifikasi Teknis Potongan Ayam Boneless Tanpa Lemak",
    type: "SPEC_SHEET",
    issuer: "ZKS Quality Assurance Standard v3.1",
    validUntil: "Permanent",
    fileSize: "620 KB",
    fileFormat: "PDF",
  },
  {
    id: "doc-sla",
    name: "Perjanjian Pasokan Dingin & SLA Higienitas Supplier",
    type: "SUPPLIER_DOC",
    issuer: "Legal & Procurement PT. Zahdan Kamal Sentosa",
    validUntil: "31 Des 2027",
    fileSize: "2.1 MB",
    fileFormat: "PDF",
  },
];

export default function ItemDetailClient() {
  // --- STATE ---
  const [consumptionPeriod, setConsumptionPeriod] = useState<ConsumptionPeriod>("30D");
  const [activeModal, setActiveModal] = useState<
    "edit" | "adjust" | "transfer" | "purchase" | "barcode" | "qr" | "more" | "docPreview" | null
  >(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const chartSeries = CONSUMPTION_SERIES[consumptionPeriod];
  const maxConsumption = Math.max(...chartSeries.map((s) => Math.max(s.usage, s.forecast)), 100);

  return (
    <div className="space-y-8 pb-16 font-mono text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141413] text-[#FAF9F5] px-4 py-3 rounded border border-neutral-700 shadow-xl flex items-center gap-3 font-mono text-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==============================================================
          PAGE HEADER (Breadcrumb, Title, Subtitle, SKU, Action Buttons)
          ============================================================== */}
      <header className="border-b border-[#141413]/10 pb-6 space-y-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8E8B81]">
          <Link href="/admin/inventory" className="hover:text-[#141413] transition-colors">
            Inventory
          </Link>
          <span>&gt;</span>
          <Link href="/admin/inventory/items" className="hover:text-[#141413] transition-colors">
            Items
          </Link>
          <span>&gt;</span>
          <span className="text-[#141413] font-bold">Chicken Breast Fillet</span>
        </nav>

        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold">
                Raw Material
              </span>
              <span className="text-[#8E8B81]">•</span>
              <span className="px-2 py-0.5 bg-neutral-200/80 text-[#141413] font-bold text-[11px] rounded-xs">
                SKU: RM-00021
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                In Stock (Optimal Buffer)
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
              Chicken Breast Fillet
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#626058]">
              Daging dada ayam boneless segar grade A untuk produksi katering industri pabrik Karawang.
            </p>
          </div>

          {/* Top Right Action Group */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveModal("edit")}
              className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("barcode")}
              className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Print Barcode 🖨️
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("qr")}
              className="px-3.5 py-2 bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Generate QR 📱
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("more")}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-bold cursor-pointer rounded-xs"
            >
              ••• More
            </button>
          </div>
        </div>
      </header>

      {/* ==============================================================
          12-COLUMN ENTERPRISE ASSET GRID
          Desktop: Left 8 Columns | Right 4 Columns
          Tablet: 1 Column
          Mobile: Stack Vertically
          ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================
            LEFT COLUMN (8 COLUMNS)
            Section 01: Item Identity
            Section 02: Inventory Summary (6 Cards)
            Section 03: Warehouse Distribution
            Section 04: Batch Tracking
            Section 05: Stock Movement Timeline
            Section 06: Purchase History
            Section 07: Consumption Analysis
            Section 08: Documents
            ============================================================ */}
        <div className="lg:col-span-8 space-y-8">
          {/* ==========================================================
              SECTION 01: ITEM IDENTITY
              - Large product image
              - SKU: RM-00021
              - Barcode: 8992100491021
              - Category: Poultry & Raw Proteins
              - Brand: Prima Unggas Nusantara
              - Unit: kg
              - Storage Type: Cold Storage (-18°C / +2°C)
              - Shelf Life: 14 Days Fresh / 180 Days Frozen
              - Status Badge: In Stock
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 sm:p-7 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Product Visual Container */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xs bg-[#FAF9F5] border border-neutral-200 flex flex-col items-center justify-center text-5xl shrink-0 shadow-2xs relative">
                <span>🍗</span>
                <span className="absolute bottom-1 text-[9px] font-mono text-[#8E8B81] uppercase font-bold">
                  Boneless
                </span>
              </div>

              {/* Identity Properties */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#141413]/10 pb-2.5">
                  <div>
                    <span className="text-[10px] text-[#8E8B81] uppercase tracking-wider block">
                      Brand / Principal
                    </span>
                    <strong className="font-display font-bold text-base text-[#141413]">
                      Prima Unggas Nusantara (Grade A)
                    </strong>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    In Stock (Optimal Buffer)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[#8E8B81] text-[10px] block uppercase">SKU Code</span>
                    <strong className="text-[#141413]">RM-00021</strong>
                  </div>
                  <div>
                    <span className="text-[#8E8B81] text-[10px] block uppercase">Barcode EAN-13</span>
                    <strong className="text-[#141413]">8992100491021</strong>
                  </div>
                  <div>
                    <span className="text-[#8E8B81] text-[10px] block uppercase">Category</span>
                    <strong className="text-[#141413]">Poultry &amp; Meat</strong>
                  </div>
                  <div>
                    <span className="text-[#8E8B81] text-[10px] block uppercase">Base Unit</span>
                    <strong className="text-[#141413]">Kilogram (kg)</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-[#141413]/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8E8B81]">Storage Type:</span>
                    <strong className="text-[#141413]">Cold Storage (−18°C Cryo / +2°C Chilled)</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8E8B81]">Shelf Life:</span>
                    <strong className="text-[#141413]">14 Hari Segar / 180 Hari Beku</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 02: INVENTORY SUMMARY (6 CARDS)
              1. Current Stock (1,450 kg)
              2. Reserved (300 kg)
              3. Available (1,150 kg)
              4. Incoming (500 kg)
              5. Outgoing Today (120 kg)
              6. Inventory Value (Rp 55.825.000)
              ========================================================== */}
          <section className="space-y-2">
            <h2 className="sr-only">Inventory Summary Cards</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* 1. Current Stock */}
              <div className="p-4 bg-white border border-[#141413]/10 rounded-xs space-y-1 shadow-2xs">
                <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
                  Current Stock
                </span>
                <p className="font-display font-extrabold text-2xl text-[#141413]">
                  1,450 <span className="text-xs font-normal text-[#626058]">kg</span>
                </p>
                <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
                  Total fisik di seluruh depo
                </span>
              </div>

              {/* 2. Reserved */}
              <div className="p-4 bg-white border border-amber-200/80 rounded-xs space-y-1 shadow-2xs ring-1 ring-amber-500/10">
                <span className="text-[10px] uppercase text-amber-700 font-bold block">
                  Reserved (Teralokasi)
                </span>
                <p className="font-display font-extrabold text-2xl text-amber-700">
                  300 <span className="text-xs font-normal text-[#626058]">kg</span>
                </p>
                <span className="text-[10px] text-amber-800 block pt-1 border-t border-amber-100">
                  Pesanan Shift 1 &amp; 2
                </span>
              </div>

              {/* 3. Available */}
              <div className="p-4 bg-white border border-emerald-200/80 rounded-xs space-y-1 shadow-2xs ring-1 ring-emerald-500/10">
                <span className="text-[10px] uppercase text-emerald-800 font-bold block">
                  Available (Bebas Alokasi)
                </span>
                <p className="font-display font-extrabold text-2xl text-emerald-700">
                  1,150 <span className="text-xs font-normal text-[#626058]">kg</span>
                </p>
                <span className="text-[10px] text-emerald-800 block pt-1 border-t border-emerald-100">
                  Siap dipesan / dimasak
                </span>
              </div>

              {/* 4. Incoming */}
              <div className="p-4 bg-white border border-blue-200/80 rounded-xs space-y-1 shadow-2xs ring-1 ring-blue-500/10">
                <span className="text-[10px] uppercase text-blue-700 font-bold block">
                  Incoming (PO Aktif)
                </span>
                <p className="font-display font-extrabold text-2xl text-blue-700">
                  500 <span className="text-xs font-normal text-[#626058]">kg</span>
                </p>
                <span className="text-[10px] text-blue-800 block pt-1 border-t border-blue-100">
                  PO #1082 (Tiba H+1)
                </span>
              </div>

              {/* 5. Outgoing Today */}
              <div className="p-4 bg-white border border-[#141413]/10 rounded-xs space-y-1 shadow-2xs">
                <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
                  Outgoing Today
                </span>
                <p className="font-display font-extrabold text-2xl text-[#141413]">
                  120 <span className="text-xs font-normal text-[#626058]">kg</span>
                </p>
                <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
                  Konsumsi dapur sentral
                </span>
              </div>

              {/* 6. Inventory Value */}
              <div className="p-4 bg-white border border-[#141413]/10 rounded-xs space-y-1 shadow-2xs">
                <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
                  Inventory Value
                </span>
                <p className="font-display font-extrabold text-2xl text-[#141413]">
                  Rp 55.8 M
                </p>
                <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
                  Valuasi WAC @ Rp 38.500
                </span>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 03: WAREHOUSE DISTRIBUTION
              Display every warehouse row:
              Current Stock, Reserved, Available, Capacity
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Facility Allocation
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Warehouse Distribution
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">3 Lokasi Penyimpanan Aktif</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[10px] text-[#8E8B81] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Warehouse Facility</th>
                    <th className="py-2.5 px-3 text-right">Current Stock</th>
                    <th className="py-2.5 px-3 text-right">Reserved</th>
                    <th className="py-2.5 px-3 text-right">Available</th>
                    <th className="py-2.5 px-3">Storage Capacity / Load</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5 text-xs">
                  <tr className="hover:bg-neutral-50/60">
                    <td className="py-3 px-3 font-bold text-[#141413]">
                      Cold Storage (Chiller Deck 1)
                      <span className="block text-[10px] font-normal text-[#8E8B81]">Suhu +2°C • Rak Daging A</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#141413]">1,150 kg</td>
                    <td className="py-3 px-3 text-right text-amber-700">220 kg</td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">930 kg</td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>76% Terpakai</span>
                          <span className="text-[#8E8B81]">Cap: 1.5 Ton</span>
                        </div>
                        <div className="w-32 h-1.5 bg-neutral-100 rounded-xs overflow-hidden">
                          <div className="w-[76%] h-full bg-emerald-600"></div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/60">
                    <td className="py-3 px-3 font-bold text-[#141413]">
                      Cold Storage (Deep Freezer Wing)
                      <span className="block text-[10px] font-normal text-[#8E8B81]">Suhu −18°C • Cadangan Beku</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#141413]">200 kg</td>
                    <td className="py-3 px-3 text-right text-amber-700">0 kg</td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">200 kg</td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>40% Terpakai</span>
                          <span className="text-[#8E8B81]">Cap: 500 kg</span>
                        </div>
                        <div className="w-32 h-1.5 bg-neutral-100 rounded-xs overflow-hidden">
                          <div className="w-[40%] h-full bg-blue-600"></div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/60">
                    <td className="py-3 px-3 font-bold text-[#141413]">
                      Kitchen Buffer (Penyangga Dapur)
                      <span className="block text-[10px] font-normal text-[#8E8B81]">Thawing Prep Room Line A</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#141413]">100 kg</td>
                    <td className="py-3 px-3 text-right text-amber-700">80 kg</td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">20 kg</td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>85% Terpakai</span>
                          <span className="text-[#8E8B81]">Cap: 120 kg</span>
                        </div>
                        <div className="w-32 h-1.5 bg-neutral-100 rounded-xs overflow-hidden">
                          <div className="w-[85%] h-full bg-amber-600"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================================================
              SECTION 04: BATCH TRACKING (Enterprise Batch Management)
              Columns: Batch Number, Production Date, Expiry Date, Current Qty, Status
              First Expired Highlighted (FEFO)
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Batch Ledger &amp; FEFO Rules
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Batch Tracking
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-xs">
                ✓ Otomatis Urutan FEFO (First Expired First Out)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[10px] text-[#8E8B81] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Batch Number</th>
                    <th className="py-2.5 px-3">Production Date</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3 text-right">Current Qty</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Storage Rack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5 text-xs">
                  {BATCH_DATA.map((batch) => (
                    <tr
                      key={batch.batchNumber}
                      className={`transition-colors ${
                        batch.isFirstExpired
                          ? "bg-amber-50/60 ring-1 ring-[#C85A17]/30"
                          : "hover:bg-neutral-50/60"
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-[#141413]">
                        {batch.batchNumber}
                        {batch.isFirstExpired && (
                          <span className="inline-block ml-2 px-1.5 py-0.2 text-[9px] bg-[#C85A17] text-white font-bold rounded-2xs uppercase">
                            First Expired (Pakai Dulu)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#626058]">{batch.productionDate}</td>
                      <td className="py-3 px-3 font-bold text-[#141413]">{batch.expiryDate}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#141413]">{batch.currentQuantity}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-xs ${
                            batch.status === "Expiring Soon"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : batch.status === "In Inspection"
                              ? "bg-blue-100 text-blue-900 border border-blue-300"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          }`}
                        >
                          {batch.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-[11px] text-[#626058]">{batch.facility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================================================
              SECTION 05: STOCK MOVEMENT TIMELINE
              Timeline, NOT table.
              Example:
              08:15 | Receiving | +250 kg | Supplier
              ↓
              09:20 | Production | -120 kg | Kitchen
              ↓
              12:40 | Transfer | Warehouse
              ↓
              15:10 | Adjustment
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-6 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Traceability Flow
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Stock Movement Timeline
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">Audit Mutasi Fisik</span>
            </div>

            {/* Vertical Flow Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-[#141413]/15">
              {MOVEMENT_TIMELINE.map((mov) => {
                const isReceive = mov.type === "Receiving";
                const isProd = mov.type === "Production";
                const isTrans = mov.type === "Transfer";

                return (
                  <div key={mov.id} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        isReceive
                          ? "bg-emerald-600"
                          : isProd
                          ? "bg-amber-600"
                          : isTrans
                          ? "bg-blue-600"
                          : "bg-neutral-800"
                      }`}
                    ></div>

                    <div className="bg-[#FAF9F5] border border-[#141413]/10 p-3.5 rounded-xs space-y-1.5 hover:border-[#141413]/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="text-[#141413]">{mov.time} WIB</strong>
                          <span className="text-[#8E8B81]">•</span>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-xs ${
                              isReceive
                                ? "bg-emerald-100 text-emerald-800"
                                : isProd
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {mov.type}
                          </span>
                        </div>
                        <span
                          className={`font-bold text-xs ${
                            mov.isPositive ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {mov.delta}
                        </span>
                      </div>

                      <p className="text-xs text-[#141413] font-medium">{mov.party}</p>

                      <div className="flex items-center justify-between text-[10px] text-[#8E8B81] pt-1 border-t border-black/5">
                        <span>Ref: {mov.refCode}</span>
                        <span>Operator: {mov.operator}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==========================================================
              SECTION 06: PURCHASE HISTORY (Modern Table)
              Supplier, PO Number, Qty, Price, Date, Status
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Procurement Ledger
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Purchase History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal("purchase")}
                className="text-[#C85A17] hover:underline text-xs font-bold cursor-pointer"
              >
                + Buat PO Baru →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[10px] text-[#8E8B81] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">PO Number</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price / kg</th>
                    <th className="py-2.5 px-3 text-right">Total Amount</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5 text-xs">
                  {PURCHASE_HISTORY.map((po) => (
                    <tr key={po.id} className="hover:bg-neutral-50/60">
                      <td className="py-3 px-3 font-bold text-[#141413]">{po.supplier}</td>
                      <td className="py-3 px-3 text-[#626058]">{po.poNumber}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#141413]">{po.qty}</td>
                      <td className="py-3 px-3 text-right text-[#626058]">{po.price}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#141413]">{po.totalAmount}</td>
                      <td className="py-3 px-3 text-[#8E8B81]">{po.date}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs">
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================================================
              SECTION 07: CONSUMPTION ANALYSIS
              Chart: 30 Days, 60 Days, 90 Days
              Average Daily Usage, Prediction, Days Remaining
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Predictive Burn Rate
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Consumption Analysis &amp; Run-rate
                </h3>
              </div>

              {/* Period Selector */}
              <div className="inline-flex p-1 bg-neutral-100 border border-[#141413]/10 rounded-xs">
                {(["30D", "60D", "90D"] as ConsumptionPeriod[]).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setConsumptionPeriod(period)}
                    className={`px-3 py-1 text-xs font-semibold rounded-xs transition-all cursor-pointer ${
                      consumptionPeriod === period
                        ? "bg-[#141413] text-white shadow-xs"
                        : "text-[#626058] hover:text-[#141413]"
                    }`}
                  >
                    {period === "30D" && "30 Days"}
                    {period === "60D" && "60 Days"}
                    {period === "90D" && "90 Days"}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual SVG Consumption Chart */}
            <div className="space-y-4">
              <div className="h-44 w-full flex items-end gap-6 sm:gap-12 px-4 pb-4 border-b border-[#141413]/15">
                {chartSeries.map((item, idx) => {
                  const usageHeight = Math.max(15, Math.round((item.usage / maxConsumption) * 85));
                  const forecastHeight = Math.max(15, Math.round((item.forecast / maxConsumption) * 85));

                  return (
                    <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                      <div className="w-full max-w-[50px] flex items-end justify-center gap-1.5 h-full">
                        <div
                          style={{ height: `${usageHeight}%` }}
                          className="w-1/2 bg-neutral-900 group-hover:bg-[#C85A17] transition-all rounded-t-xs"
                          title={`Aktual: ${item.usage} kg`}
                        ></div>
                        <div
                          style={{ height: `${forecastHeight}%` }}
                          className="w-1/2 bg-neutral-300 group-hover:bg-neutral-400 transition-all rounded-t-xs"
                          title={`Proyeksi: ${item.forecast} kg`}
                        ></div>
                      </div>
                      <span className="text-[10px] text-[#626058] mt-2 font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Legend & KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-0.5">
                  <span className="text-[10px] text-[#8E8B81] uppercase block">Average Daily Usage</span>
                  <p className="font-bold text-base text-[#141413]">118.5 kg / Hari</p>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-0.5">
                  <span className="text-[10px] text-[#8E8B81] uppercase block">AI Consumption Forecast</span>
                  <p className="font-bold text-base text-blue-700">+4.2% Peak Shift</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xs space-y-0.5">
                  <span className="text-[10px] text-emerald-800 uppercase block font-semibold">Days Remaining</span>
                  <p className="font-bold text-base text-emerald-800">9.7 Hari Buffer</p>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 08: DOCUMENTS (Certificates, Specs, Halal, Lab)
              Download, Preview
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Quality &amp; Compliance Vault
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Item Documents &amp; Certificates
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">4 Dokumen Resmi Terverifikasi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOCUMENTS_DATA.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs flex flex-col justify-between gap-3 hover:border-[#141413]/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-200 text-[#141413] rounded-2xs">
                        {doc.type}
                      </span>
                      <span className="text-[10px] text-[#8E8B81]">{doc.fileSize}</span>
                    </div>
                    <strong className="block text-xs text-[#141413] leading-snug">{doc.name}</strong>
                    <p className="text-[10px] text-[#626058]">Penerbit: {doc.issuer}</p>
                    <span className="text-[10px] text-[#8E8B81] block">Masa Berlaku: {doc.validUntil}</span>
                  </div>

                  <div className="pt-2 border-t border-black/5 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setActiveModal("docPreview");
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-[#141413] border border-[#141413]/15 rounded-xs cursor-pointer"
                    >
                      Preview 👁️
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(`Dokumen "${doc.name}" berhasil diunduh.`)}
                      className="px-2.5 py-1 bg-[#141413] hover:bg-[#141413]/90 text-white rounded-xs cursor-pointer font-bold"
                    >
                      Download ⬇
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ============================================================
            RIGHT COLUMN (4 COLUMNS): STICKY QUICK INFORMATION
            - Supplier
            - Lead Time
            - Last Purchase
            - Average Cost
            - Minimum Stock
            - Maximum Stock
            - Reorder Point
            - Action Buttons: Adjust Stock, Transfer, Purchase
            ============================================================ */}
        <aside className="lg:col-span-4 bg-white border border-[#141413]/10 p-6 space-y-6 shadow-2xs sticky top-8">
          <div className="border-b border-[#141413]/10 pb-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
              OPERATIONAL TELEMETRY
            </span>
            <h3 className="font-display font-bold text-lg text-[#141413]">
              Quick Information
            </h3>
          </div>

          {/* Key Procurement & Inventory Parameters */}
          <div className="space-y-3">
            <div className="flex justify-between py-1.5 border-b border-[#141413]/5">
              <span className="text-[#8E8B81]">Primary Supplier:</span>
              <strong className="text-[#141413] text-right">PT. Sumber Unggas Makmur</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#141413]/5">
              <span className="text-[#8E8B81]">Lead Time Pengiriman:</span>
              <strong className="text-[#141413]">2 Hari Kerja (H-2)</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#141413]/5">
              <span className="text-[#8E8B81]">Pembelian Terakhir:</span>
              <strong className="text-[#141413]">21 Okt 2026 (@ Rp 38.500)</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#141413]/5">
              <span className="text-[#8E8B81]">Weighted Avg Cost:</span>
              <strong className="text-[#141413]">Rp 38.500 / kg</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#141413]/5">
              <span className="text-[#8E8B81]">Minimum Safety Stock:</span>
              <strong className="text-amber-700">500 kg</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#141413]/5">
              <span className="text-[#8E8B81]">Maximum Storage Cap:</span>
              <strong className="text-[#141413]">3,000 kg</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#141413]/5">
              <span className="text-[#8E8B81]">Reorder Trigger Point:</span>
              <strong className="text-blue-700">750 kg</strong>
            </div>
          </div>

          {/* Buffer Health Visual Meter */}
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#626058]">Kesehatan Buffer:</span>
              <strong className="text-emerald-700">Aman (1,450 / 750 kg ROP)</strong>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-xs overflow-hidden flex">
              <div className="w-[34%] bg-rose-500" title="Zona Bahaya < 500kg"></div>
              <div className="w-[17%] bg-amber-500" title="Zona Reorder 500-750kg"></div>
              <div className="w-[49%] bg-emerald-600" title="Zona Optimal"></div>
            </div>
          </div>

          {/* Action Buttons: Adjust Stock, Transfer, Purchase */}
          <div className="space-y-2 pt-2 border-t border-[#141413]/10">
            <button
              type="button"
              onClick={() => setActiveModal("adjust")}
              className="w-full py-2.5 bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/20 font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
            >
              Adjust Stock ⚖️
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("transfer")}
              className="w-full py-2.5 bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/20 font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
            >
              Transfer Stock ⇄
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("purchase")}
              className="w-full py-2.5 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
            >
              + Purchase Order (PO) 🛒
            </button>
          </div>
        </aside>
      </div>

      {/* ==============================================================
          INTERACTIVE ACTION MODALS
          ============================================================== */}

      {/* 1. Barcode Print Modal */}
      {activeModal === "barcode" && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in text-center">
            <h3 className="font-display font-bold text-lg text-[#141413]">Thermal Barcode Label</h3>
            <div className="p-4 bg-white border border-neutral-300 flex flex-col items-center gap-2">
              <strong className="text-xs text-[#141413]">CHICKEN BREAST FILLET</strong>
              <svg className="w-full h-12 text-[#141413]" viewBox="0 0 200 40" fill="currentColor">
                <rect x="10" y="0" width="3" height="35" /><rect x="16" y="0" width="2" height="35" /><rect x="22" y="0" width="4" height="35" /><rect x="28" y="0" width="1" height="35" /><rect x="32" y="0" width="3" height="35" /><rect x="38" y="0" width="2" height="35" /><rect x="44" y="0" width="5" height="35" /><rect x="52" y="0" width="2" height="35" /><rect x="58" y="0" width="3" height="35" /><rect x="64" y="0" width="1" height="35" /><rect x="68" y="0" width="4" height="35" /><rect x="76" y="0" width="2" height="35" /><rect x="82" y="0" width="3" height="35" /><rect x="88" y="0" width="5" height="35" /><rect x="96" y="0" width="2" height="35" /><rect x="102" y="0" width="3" height="35" /><rect x="108" y="0" width="1" height="35" /><rect x="114" y="0" width="4" height="35" /><rect x="122" y="0" width="2" height="35" /><rect x="128" y="0" width="5" height="35" /><rect x="136" y="0" width="3" height="35" /><rect x="142" y="0" width="1" height="35" /><rect x="148" y="0" width="4" height="35" /><rect x="156" y="0" width="2" height="35" /><rect x="162" y="0" width="3" height="35" /><rect x="170" y="0" width="4" height="35" /><rect x="178" y="0" width="2" height="35" /><rect x="184" y="0" width="3" height="35" />
              </svg>
              <span className="tracking-widest font-bold">8992100491021</span>
              <span className="text-[10px] text-[#8E8B81]">Batch: B-PLT-8821 • Exp: 26 Okt 2026</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast("Perintah cetak 100 label barcode dikirim ke printer.");
                  setActiveModal(null);
                }}
                className="px-4 py-2 bg-[#141413] text-white font-bold cursor-pointer rounded-xs"
              >
                Cetak Label
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. QR Code Modal */}
      {activeModal === "qr" && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in text-center">
            <h3 className="font-display font-bold text-lg text-[#141413]">QR Digital Asset Passport</h3>
            <div className="p-6 bg-neutral-50 border border-neutral-300 flex flex-col items-center gap-3">
              <div className="w-36 h-36 bg-white p-3 border border-neutral-300 shadow-sm flex items-center justify-center">
                <div className="w-full h-full bg-neutral-900 grid grid-cols-6 gap-1 p-2">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-2xs ${
                        (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                          ? "bg-white"
                          : "bg-transparent"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              <span className="font-bold text-[#141413]">RM-00021</span>
              <span className="text-[10px] text-[#8E8B81]">Pindai untuk inspeksi cepat via tablet gudang</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast("File QR Code PNG berhasil diunduh.");
                  setActiveModal(null);
                }}
                className="px-4 py-2 bg-[#141413] text-white font-bold cursor-pointer rounded-xs"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Adjust Stock Modal */}
      {activeModal === "adjust" && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="font-display font-bold text-lg text-[#141413]">Penyesuaian Fisik Stok</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Penyesuaian stok berhasil disimpan.");
                setActiveModal(null);
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-[#8E8B81] block">Kuantitas Penyesuaian (+ / −)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={-5}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#8E8B81] block">Alasan Penyesuaian</label>
                <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]">
                  <option>Drip Loss Susut Thawing</option>
                  <option>Trim Lemak Berlebih Sesuai QC</option>
                  <option>Sampel Uji Laboratorium</option>
                  <option>Koreksi Selisih Cycle Count</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button type="submit" className="px-4 py-2 bg-[#141413] text-white font-bold cursor-pointer rounded-xs">
                  Simpan Penyesuaian
                </button>
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Transfer Stock Modal */}
      {activeModal === "transfer" && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="font-display font-bold text-lg text-[#141413]">Transfer Antar Fasilitas</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Mutasi transfer antar fasilitas berhasil dieksekusi.");
                setActiveModal(null);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#8E8B81] block">Dari Gudang Asal</label>
                  <input type="text" readOnly defaultValue="Cold Storage (Chiller 1)" className="w-full p-2 bg-neutral-100 border border-neutral-300" />
                </div>
                <div className="space-y-1">
                  <label className="text-[#8E8B81] block">Tujuan</label>
                  <select className="w-full p-2 bg-neutral-50 border border-neutral-300">
                    <option>Kitchen Buffer Prep</option>
                    <option>Cold Storage (Deep Freezer)</option>
                    <option>Holding Bay Pengiriman</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[#8E8B81] block">Kuantitas Transfer (kg)</label>
                <input type="number" defaultValue={50} className="w-full p-2 bg-neutral-50 border border-neutral-300" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button type="submit" className="px-4 py-2 bg-[#141413] text-white font-bold cursor-pointer rounded-xs">
                  Eksekusi Mutasi
                </button>
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Purchase Order Modal */}
      {activeModal === "purchase" && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="font-display font-bold text-lg text-[#141413]">Buat Purchase Order Baru</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("PO baru #PO-ZKS-2026-1089 berhasil diajukan ke Purchasing.");
                setActiveModal(null);
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-[#8E8B81] block">Supplier</label>
                <select className="w-full p-2 bg-neutral-50 border border-neutral-300">
                  <option>PT. Sumber Unggas Makmur</option>
                  <option>CV. Berkah Unggas Karawang</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#8E8B81] block">Kuantitas (kg)</label>
                  <input type="number" defaultValue={500} className="w-full p-2 bg-neutral-50 border border-neutral-300" />
                </div>
                <div className="space-y-1">
                  <label className="text-[#8E8B81] block">Estimasi Harga / kg</label>
                  <input type="text" defaultValue="Rp 38.500" className="w-full p-2 bg-neutral-100 border border-neutral-300" readOnly />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button type="submit" className="px-4 py-2 bg-[#141413] text-white font-bold cursor-pointer rounded-xs">
                  Kirim Pengajuan PO
                </button>
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Document Preview Modal */}
      {activeModal === "docPreview" && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Document Preview ({selectedDoc.type})
                </span>
                <h3 className="font-display font-bold text-base text-[#141413]">{selectedDoc.name}</h3>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="text-xl font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>
            <div className="p-8 bg-neutral-50 border border-neutral-300 text-center space-y-2 rounded-xs">
              <span className="text-4xl block">📄</span>
              <strong className="block text-[#141413]">{selectedDoc.name}</strong>
              <p className="text-[11px] text-[#626058]">Penerbit: {selectedDoc.issuer} • Berlaku: {selectedDoc.validUntil}</p>
              <span className="inline-block px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 font-bold rounded-xs">
                ✓ Terverifikasi Secara Digital
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => {
                  showToast(`Mengunduh ${selectedDoc.name}...`);
                  setActiveModal(null);
                }}
                className="px-4 py-2 bg-[#141413] text-white font-bold cursor-pointer rounded-xs"
              >
                Unduh PDF
              </button>
              <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
