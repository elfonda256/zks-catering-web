"use client";

import React, { useState, useMemo } from "react";

// --- TYPES & INTERFACES ---
export type TransferStatus =
  | "Draft"
  | "Waiting Approval"
  | "Picking"
  | "In Transit"
  | "Received"
  | "Completed"
  | "Rejected";

export interface TransferItem {
  id: string;
  sku: string;
  name: string;
  imageEmoji: string;
  availableStock: number;
  transferQty: number;
  unit: string;
  batch: string;
  expiry: string;
  destinationLocation: string;
}

export interface ApprovalStep {
  role: "Warehouse Staff" | "Warehouse Supervisor" | "Inventory Controller" | "Destination Confirmation";
  name: string;
  status: "Approved" | "Pending" | "Waiting" | "Rejected";
  timestamp?: string;
  notes?: string;
}

export interface ReceivingConfirmation {
  receivedQty: number;
  condition: "Good / Intact" | "Minor Packaging Defect" | "Damaged Goods";
  missingQty: number;
  damagedQty: number;
  photos: { id: string; label: string; emoji: string; timestamp: string }[];
  remarks: string;
  confirmedBy: string;
  confirmedAt?: string;
}

export interface TransferAttachment {
  id: string;
  name: string;
  type: "Transfer Form" | "Delivery Note" | "Photo" | "Supporting Document";
  size: string;
}

export interface TransferRecord {
  id: string;
  transferNumber: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  transferReason: string;
  requestedDate: string;
  requestedBy: string;
  approvedBy: string;
  transferDate: string;
  status: TransferStatus;
  timelineStep: number; // 1: Created, 2: Approved, 3: Picking, 4: Loaded, 5: In Transit, 6: Received, 7: Completed
  notes: string;
  items: TransferItem[];
  approvals: ApprovalStep[];
  receivingConfirmation: ReceivingConfirmation;
  attachments: TransferAttachment[];
}

// --- MOCK REALISTIC INDUSTRIAL WAREHOUSE TRANSFER DATA ---
const INITIAL_TRANSFERS: TransferRecord[] = [
  {
    id: "tr-01",
    transferNumber: "TR-2026-1021-0041",
    sourceWarehouse: "Cold Storage (Chiller Wing 1)",
    destinationWarehouse: "Kitchen Production (Butchery & Prep)",
    transferReason: "Alokasi bahan baku ayam fillet paha untuk Menu Catering Siang PT. Astra (1,800 Pax)",
    requestedDate: "21 Okt 2026, 07:30 WIB",
    requestedBy: "Chef Bambang Santoso",
    approvedBy: "Agus Pratama (Warehouse SPV)",
    transferDate: "21 Okt 2026, 08:30 WIB",
    status: "In Transit",
    timelineStep: 5,
    notes: "Pengangkutan menggunakan troli insulasi dingin roda steril. Suhu daging dijaga +3.0°C.",
    items: [
      {
        id: "item-tr-1",
        sku: "RM-00021",
        name: "Chicken Breast Fillet Paha (Grade A)",
        imageEmoji: "🍗",
        availableStock: 1311.0,
        transferQty: 250.0,
        unit: "kg",
        batch: "B-PLT-2026-8821",
        expiry: "28 Okt 2026",
        destinationLocation: "Kitchen Butchery • Cold Bin K-02",
      },
      {
        id: "item-tr-2",
        sku: "RM-00024",
        name: "Sayap Ayam Utuh (Mid-Joint Wing)",
        imageEmoji: "🍗",
        availableStock: 450.0,
        transferQty: 100.0,
        unit: "kg",
        batch: "B-PLT-2026-8822",
        expiry: "29 Okt 2026",
        destinationLocation: "Kitchen Butchery • Cold Bin K-04",
      },
    ],
    approvals: [
      {
        role: "Warehouse Staff",
        name: "Yusuf Supriatna",
        status: "Approved",
        timestamp: "21 Okt 07:45 WIB",
        notes: "Barang telah dipicking dari Chiller Rack A-04 & A-06.",
      },
      {
        role: "Warehouse Supervisor",
        name: "Agus Pratama",
        status: "Approved",
        timestamp: "21 Okt 08:00 WIB",
        notes: "Verifikasi otorisasi SPK produksi terbit & sesuai stok.",
      },
      {
        role: "Inventory Controller",
        name: "Tatang Sutisna",
        status: "Approved",
        timestamp: "21 Okt 08:15 WIB",
        notes: "Buku besar persediaan dialokasikan ke status In Transit.",
      },
      {
        role: "Destination Confirmation",
        name: "Dedi Supardi (Butchery Lead)",
        status: "Pending",
        notes: "Menunggu penerimaan fisik di loading pintu dapur.",
      },
    ],
    receivingConfirmation: {
      receivedQty: 350.0,
      condition: "Good / Intact",
      missingQty: 0,
      damagedQty: 0,
      remarks: "Suhu wadah transit terverifikasi +2.8°C saat serah terima troli.",
      confirmedBy: "Dedi Supardi",
      confirmedAt: "Pending",
      photos: [
        { id: "ph-tr-1", label: "Troli Insulasi Segel", emoji: "🧊", timestamp: "08:25 WIB" },
        { id: "ph-tr-2", label: "Timbangan Cold Bin", emoji: "⚖️", timestamp: "08:32 WIB" },
      ],
    },
    attachments: [
      { id: "att-1", name: "Internal_Transfer_Order_TR041.pdf", type: "Transfer Form", size: "185 KB" },
      { id: "att-2", name: "Surat_Jalan_Internal_SJI041.pdf", type: "Delivery Note", size: "220 KB" },
      { id: "att-3", name: "Bukti_Suhu_Probe_Transit.pdf", type: "Supporting Document", size: "310 KB" },
    ],
  },
  {
    id: "tr-02",
    transferNumber: "TR-2026-1021-0042",
    sourceWarehouse: "Main Warehouse (Gudang Utama)",
    destinationWarehouse: "Kitchen Production (Rice Steamer Unit)",
    transferReason: "Penyaluran beras harian untuk shift pagi dan siang",
    requestedDate: "21 Okt 2026, 06:30 WIB",
    requestedBy: "Bambang Santoso",
    approvedBy: "Agus Pratama",
    transferDate: "21 Okt 2026, 07:15 WIB",
    status: "Completed",
    timelineStep: 7,
    notes: "Pengangkutan via electric pallet mover nomor PM-02.",
    items: [
      {
        id: "item-tr-3",
        sku: "RM-00012",
        name: "Beras Ramos Premium IR-64 (Zak 50kg)",
        imageEmoji: "🌾",
        availableStock: 3650.0,
        transferQty: 350.0,
        unit: "kg",
        batch: "B-GRN-2026-1092",
        expiry: "15 Jan 2027",
        destinationLocation: "Rice Steamer Bay • Silo 1",
      },
    ],
    approvals: [
      { role: "Warehouse Staff", name: "Kurnia Sandi", status: "Approved", timestamp: "21 Okt 06:40 WIB" },
      { role: "Warehouse Supervisor", name: "Agus Pratama", status: "Approved", timestamp: "21 Okt 06:50 WIB" },
      { role: "Inventory Controller", name: "Tatang Sutisna", status: "Approved", timestamp: "21 Okt 07:00 WIB" },
      { role: "Destination Confirmation", name: "Cook Asep", status: "Approved", timestamp: "21 Okt 07:15 WIB" },
    ],
    receivingConfirmation: {
      receivedQty: 350.0,
      condition: "Good / Intact",
      missingQty: 0,
      damagedQty: 0,
      remarks: "7 zak utuh diterima dalam kondisi kering tanpa sobekan.",
      confirmedBy: "Cook Asep",
      confirmedAt: "21 Okt 07:15 WIB",
      photos: [{ id: "ph-tr-3", label: "Pallet Beras Diturunkan", emoji: "📦", timestamp: "07:12 WIB" }],
    },
    attachments: [
      { id: "att-4", name: "Transfer_Slip_Beras_TR042.pdf", type: "Transfer Form", size: "140 KB" },
    ],
  },
  {
    id: "tr-03",
    transferNumber: "TR-2026-1021-0043",
    sourceWarehouse: "Packaging Warehouse",
    destinationWarehouse: "Packing Line 1 (Bento Assembly)",
    transferReason: "Suplai kemasan meal tray bento box pesanan lembur PT. Epson",
    requestedDate: "21 Okt 2026, 09:00 WIB",
    requestedBy: "Supervisor Packing (Ibu Rina)",
    approvedBy: "Agus Pratama",
    transferDate: "21 Okt 2026, 09:45 WIB",
    status: "Picking",
    timelineStep: 3,
    notes: "Pengambilan 2 karton master dus bento box.",
    items: [
      {
        id: "item-tr-4",
        sku: "PKG-00002",
        name: "Bento Box 5-Compartment Meal Tray (Dus 500 Pcs)",
        imageEmoji: "🍱",
        availableStock: 5000.0,
        transferQty: 1000.0,
        unit: "Pcs",
        batch: "B-BOX-2026-04",
        expiry: "Non-Perishable",
        destinationLocation: "Packing Line 1 • Staging Rack P-01",
      },
    ],
    approvals: [
      { role: "Warehouse Staff", name: "Rian Hidayat", status: "Approved", timestamp: "21 Okt 09:10 WIB" },
      { role: "Warehouse Supervisor", name: "Agus Pratama", status: "Approved", timestamp: "21 Okt 09:20 WIB" },
      { role: "Inventory Controller", name: "Tatang Sutisna", status: "Approved", timestamp: "21 Okt 09:30 WIB" },
      { role: "Destination Confirmation", name: "Ibu Rina", status: "Pending" },
    ],
    receivingConfirmation: {
      receivedQty: 0,
      condition: "Good / Intact",
      missingQty: 0,
      damagedQty: 0,
      remarks: "Sedang dalam proses pemindahan fisik dari rak packaging.",
      confirmedBy: "Ibu Rina",
      photos: [],
    },
    attachments: [
      { id: "att-5", name: "Internal_Transfer_PKG_TR043.pdf", type: "Transfer Form", size: "160 KB" },
    ],
  },
  {
    id: "tr-04",
    transferNumber: "TR-2026-1021-0044",
    sourceWarehouse: "Main Warehouse (Gudang Utama)",
    destinationWarehouse: "Deep Fryer Bay (Dapur Penggorengan)",
    transferReason: "Minyak goreng sawit untuk penggorengan ayam bumbu",
    requestedDate: "21 Okt 2026, 10:15 WIB",
    requestedBy: "Cook Assistant Dadan",
    approvedBy: "Agus Pratama",
    transferDate: "21 Okt 2026, 11:00 WIB",
    status: "Waiting Approval",
    timelineStep: 2,
    notes: "Relokasi 10 jerigen @ 20 Liter.",
    items: [
      {
        id: "item-tr-5",
        sku: "RM-00004",
        name: "Minyak Goreng Sawit Jerigen 20L",
        imageEmoji: "🛢️",
        availableStock: 1200.0,
        transferQty: 200.0,
        unit: "Liter",
        batch: "B-OIL-2026-449",
        expiry: "12 Des 2027",
        destinationLocation: "Fryer Bay • Buffer Stand F-01",
      },
    ],
    approvals: [
      { role: "Warehouse Staff", name: "Kurnia Sandi", status: "Approved", timestamp: "21 Okt 10:20 WIB" },
      { role: "Warehouse Supervisor", name: "Agus Pratama", status: "Pending" },
      { role: "Inventory Controller", name: "Tatang Sutisna", status: "Waiting" },
      { role: "Destination Confirmation", name: "Cook Assistant Dadan", status: "Waiting" },
    ],
    receivingConfirmation: {
      receivedQty: 0,
      condition: "Good / Intact",
      missingQty: 0,
      damagedQty: 0,
      remarks: "Menunggu verifikasi supervisor gudang.",
      confirmedBy: "Cook Dadan",
      photos: [],
    },
    attachments: [],
  },
  {
    id: "tr-05",
    transferNumber: "TR-2026-1020-0038",
    sourceWarehouse: "Dry Storage",
    destinationWarehouse: "Sauce & Seasoning Prep Station",
    transferReason: "Bawang merah dan cabai giling untuk bumbu rendang",
    requestedDate: "20 Okt 2026, 13:00 WIB",
    requestedBy: "Chef Surya Atmaja",
    approvedBy: "Agus Pratama",
    transferDate: "20 Okt 2026, 13:45 WIB",
    status: "Completed",
    timelineStep: 7,
    notes: "Transfer selesai dengan kondisi baik 100%.",
    items: [
      {
        id: "item-tr-6",
        sku: "RM-00044",
        name: "Bawang Merah Brebes Super",
        imageEmoji: "🧅",
        availableStock: 95.7,
        transferQty: 25.0,
        unit: "kg",
        batch: "B-SPB-2026-331",
        expiry: "28 Okt 2026",
        destinationLocation: "Seasoning Bay • Rack S-02",
      },
    ],
    approvals: [
      { role: "Warehouse Staff", name: "Tatang Sutisna", status: "Approved", timestamp: "20 Okt 13:05 WIB" },
      { role: "Warehouse Supervisor", name: "Agus Pratama", status: "Approved", timestamp: "20 Okt 13:15 WIB" },
      { role: "Inventory Controller", name: "Tatang Sutisna", status: "Approved", timestamp: "20 Okt 13:25 WIB" },
      { role: "Destination Confirmation", name: "Chef Surya", status: "Approved", timestamp: "20 Okt 13:45 WIB" },
    ],
    receivingConfirmation: {
      receivedQty: 25.0,
      condition: "Good / Intact",
      missingQty: 0,
      damagedQty: 0,
      remarks: "Bawang merah kering bersih diterima langsung masuk chiller bumbu.",
      confirmedBy: "Chef Surya",
      confirmedAt: "20 Okt 13:45 WIB",
      photos: [],
    },
    attachments: [
      { id: "att-6", name: "Transfer_Slip_Seasoning_TR038.pdf", type: "Transfer Form", size: "110 KB" },
    ],
  },
];

export default function WarehouseTransferClient() {
  // --- STATE ---
  const [transfers, setTransfers] = useState<TransferRecord[]>(INITIAL_TRANSFERS);
  const [selectedTransferId, setSelectedTransferId] = useState<string>("tr-01");

  // Modals & Feedback
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<TransferAttachment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected Transfer
  const currentTransfer =
    transfers.find((t) => t.id === selectedTransferId) || transfers[0];

  // Editable Transfer Qty Handler with Instant Stock Validation
  const handleTransferQtyChange = (itemId: string, newQty: number) => {
    setTransfers((prev) =>
      prev.map((tr) => {
        if (tr.id !== currentTransfer.id) return tr;
        return {
          ...tr,
          items: tr.items.map((it) => {
            if (it.id !== itemId) return it;
            return {
              ...it,
              transferQty: isNaN(newQty) ? 0 : newQty,
            };
          }),
        };
      })
    );
  };

  // Transfer Overview KPI Metrics
  const summaryKPIs = useMemo(() => {
    let pending = 0;
    let inTransit = 0;
    let completed = 0;
    let rejected = 0;
    const todayCount = transfers.length;

    transfers.forEach((t) => {
      if (t.status === "Draft" || t.status === "Waiting Approval" || t.status === "Picking") {
        pending += 1;
      } else if (t.status === "In Transit" || t.status === "Received") {
        inTransit += 1;
      } else if (t.status === "Completed") {
        completed += 1;
      } else if (t.status === "Rejected") {
        rejected += 1;
      }
    });

    return { pending, inTransit, completed, rejected, todayCount };
  }, [transfers]);

  // Status Badge Renderer
  const renderStatusBadge = (status: TransferStatus) => {
    switch (status) {
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
            Draft
          </span>
        );
      case "Waiting Approval":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Waiting Approval
          </span>
        );
      case "Picking":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Picking
          </span>
        );
      case "In Transit":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
            In Transit
          </span>
        );
      case "Received":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-300">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Received
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Completed
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16 font-mono text-xs text-[#141413]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141413] text-[#FAF9F5] px-4 py-3 rounded-xs border border-neutral-700 shadow-xl flex items-center gap-3 font-mono text-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==============================================================
          PAGE HEADER
          Warehouse Transfer
          Subtitle: Transfer inventory safely between warehouses and production locations.
          Top Right: New Transfer, Scan Barcode, Export
          ============================================================== */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#141413]/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
              PT. ZAHDAN KAMAL SENTOSA
            </span>
            <span className="text-[#8E8B81] text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#141413] font-semibold block">
              INTERNAL LOGISTICS &amp; CATERING SUPPLY DISPATCH
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              RFID &amp; Barcode Tracked
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Warehouse Transfer
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Transfer inventory safely between warehouses and production locations.
          </p>
        </div>

        {/* Top Right Action Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* New Transfer */}
          <button
            type="button"
            onClick={() => setIsNewTransferModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Transfer</span>
          </button>

          {/* Scan Barcode */}
          <button
            type="button"
            onClick={() => setIsScanModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#141413]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Scan Barcode</span>
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#141413]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* ==============================================================
          SECTION 01: TRANSFER OVERVIEW (5 Cards)
          - Pending Transfer
          - In Transit
          - Completed
          - Rejected
          - Today's Transfers
          ============================================================== */}
      <section aria-labelledby="transfer-overview-heading">
        <h2 id="transfer-overview-heading" className="sr-only">
          Transfer Overview
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Pending Transfer */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Pending Transfer
            </span>
            <p className="font-display font-extrabold text-2xl text-amber-700">
              {summaryKPIs.pending}{" "}
              <span className="text-xs font-normal text-[#626058]">Order</span>
            </p>
            <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
              Menunggu persetujuan &amp; picking
            </span>
          </div>

          {/* 2. In Transit */}
          <div className="p-4 bg-white border border-purple-200/80 space-y-1 shadow-2xs ring-1 ring-purple-500/10">
            <span className="text-[10px] uppercase text-purple-700 font-bold block">
              In Transit
            </span>
            <p className="font-display font-extrabold text-2xl text-purple-700">
              {summaryKPIs.inTransit}{" "}
              <span className="text-xs font-normal text-[#626058]">Pengiriman</span>
            </p>
            <span className="text-[10px] text-purple-800 block pt-1 border-t border-purple-100">
              Dalam perjalanan antar-bay
            </span>
          </div>

          {/* 3. Completed */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Completed
            </span>
            <p className="font-display font-extrabold text-2xl text-emerald-700">
              {summaryKPIs.completed}{" "}
              <span className="text-xs font-normal text-[#626058]">Transfer</span>
            </p>
            <span className="text-[10px] text-emerald-800 block pt-1 border-t border-black/5">
              Diterima penuh &amp; diverifikasi dapur
            </span>
          </div>

          {/* 4. Rejected */}
          <div className="p-4 bg-white border border-rose-200/80 space-y-1 shadow-2xs ring-1 ring-rose-500/10">
            <span className="text-[10px] uppercase text-rose-700 font-bold block">
              Rejected
            </span>
            <p className="font-display font-extrabold text-2xl text-rose-600">
              {summaryKPIs.rejected}{" "}
              <span className="text-xs font-normal text-[#626058]">Insiden</span>
            </p>
            <span className="text-[10px] text-rose-700 block pt-1 border-t border-rose-100">
              Permintaan ditolak / dibatalkan
            </span>
          </div>

          {/* 5. Today's Transfers */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Today&apos;s Transfers
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              {summaryKPIs.todayCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Total</span>
            </p>
            <span className="text-[10px] text-emerald-700 block pt-1 border-t border-black/5">
              100% terlacak barcode
            </span>
          </div>
        </div>
      </section>

      {/* ==============================================================
          RESPONSIVE SPLIT WORKBENCH
          Desktop: Split layout (Left: Section 02, 03, 04, 06; Right: Section 05, 07, 08, 09)
          Tablet: Single Column
          Mobile: Cards Layout
          ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================
            LEFT WORKBENCH (lg:col-span-8 or 7)
            ============================================================ */}
        <div className="lg:col-span-8 space-y-8">
          {/* ==========================================================
              SECTION 02: TRANSFER LIST (Modern Enterprise Table)
              Columns: Transfer Number, Source Warehouse, Destination,
                       Requested By, Approved By, Transfer Date, Status, Actions
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  INTERNAL DISPATCH MANIFEST
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Transfer List
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">
                Pilih tiket transfer untuk memeriksa rincian, alokasi stok, dan approval
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-[#141413]/10 text-[10px] font-mono uppercase tracking-wider text-[#626058]">
                    <th className="py-2.5 px-3">Transfer No</th>
                    <th className="py-2.5 px-3 font-semibold">Source Warehouse</th>
                    <th className="py-2.5 px-3 font-semibold">Destination</th>
                    <th className="py-2.5 px-3">Requested By</th>
                    <th className="py-2.5 px-3">Approved By</th>
                    <th className="py-2.5 px-3">Transfer Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5 text-xs font-mono">
                  {transfers.map((tr) => {
                    const isSelected = selectedTransferId === tr.id;

                    return (
                      <tr
                        key={tr.id}
                        onClick={() => setSelectedTransferId(tr.id)}
                        className={`transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/70 ring-1 ring-[#C85A17]/30"
                            : "hover:bg-[#FAF9F5]"
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-[#141413] whitespace-nowrap">
                          {tr.transferNumber}
                        </td>
                        <td className="py-3 px-3 text-[#141413] whitespace-nowrap font-medium">
                          {tr.sourceWarehouse}
                        </td>
                        <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                          {tr.destinationWarehouse}
                        </td>
                        <td className="py-3 px-3 text-[#141413] whitespace-nowrap">
                          {tr.requestedBy}
                        </td>
                        <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                          {tr.approvedBy}
                        </td>
                        <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                          {tr.transferDate}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {renderStatusBadge(tr.status)}
                        </td>
                        <td
                          className="py-3 px-3 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedTransferId(tr.id)}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                          >
                            {isSelected ? "Active" : "Inspect →"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================================================
              SECTION 03: TRANSFER DETAIL
              General Information:
              - Source Warehouse, Destination Warehouse, Transfer Reason,
                Requested Date, Requested By, Approval, Notes
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  TRANSFER CREDENTIALS &amp; ROUTING
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Transfer Detail — {currentTransfer.transferNumber}
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">Internal Logistics Passport</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Origin &amp; Destination Warehouses
                </span>
                <p className="font-bold text-sm text-[#141413]">
                  {currentTransfer.sourceWarehouse}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#C85A17] font-bold">
                  <span>↓ Transfer Route Ke:</span>
                </div>
                <p className="font-bold text-sm text-blue-800">
                  {currentTransfer.destinationWarehouse}
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Requisition &amp; Justification
                </span>
                <p className="font-bold text-xs text-[#141413] leading-relaxed">
                  {currentTransfer.transferReason}
                </p>
                <div className="text-[11px] text-[#626058] pt-1 border-t border-black/5 space-y-0.5">
                  <p>Tanggal Permintaan: {currentTransfer.requestedDate}</p>
                  <p>Pemohon: <strong>{currentTransfer.requestedBy}</strong></p>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Authority &amp; Dispatch Execution
                </span>
                <p className="font-bold text-xs text-[#141413]">
                  Disahkan Oleh: {currentTransfer.approvedBy}
                </p>
                <p className="text-[11px] text-[#626058]">
                  Waktu Eksekusi: {currentTransfer.transferDate}
                </p>
                <span className="inline-block mt-1 text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs font-mono">
                  ✓ Dispatch Authorization Active
                </span>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Operational Handling Notes
                </span>
                <p className="text-[11px] text-[#626058] leading-relaxed">
                  {currentTransfer.notes}
                </p>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 04: TRANSFER ITEMS (Modern Editable Table)
              Columns: Image, SKU, Item, Available Stock, Transfer Qty,
                       Unit, Batch, Expiry, Destination Location
              Automatically validate:
              - Requested Qty
              - Available Qty
              - Negative Stock Warning
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  MATERIAL ALLOCATION REGISTER
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Transfer Items ({currentTransfer.items.length} Item Dialokasikan)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-xs">
                Validasi stok waktu-nyata mencegah stok minus
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[10px] text-[#8E8B81] uppercase tracking-wider bg-neutral-50/70">
                    <th className="py-2.5 px-3">Item / Material</th>
                    <th className="py-2.5 px-2 text-right">Available Stock</th>
                    <th className="py-2.5 px-3 text-right">Transfer Qty</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-3">Batch &amp; Expiry</th>
                    <th className="py-2.5 px-3">Destination Location</th>
                    <th className="py-2.5 px-2 text-center">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5">
                  {currentTransfer.items.map((item) => {
                    const isExceeding = item.transferQty > item.availableStock;
                    const isInvalid = item.transferQty <= 0;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isExceeding
                            ? "bg-rose-50/70"
                            : "hover:bg-neutral-50/60"
                        }`}
                      >
                        {/* Image / SKU / Name */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl p-1.5 bg-neutral-100 rounded-xs border border-neutral-200">
                              {item.imageEmoji}
                            </span>
                            <div>
                              <strong className="font-sans font-bold text-[#141413] block">
                                {item.name}
                              </strong>
                              <span className="text-[10px] text-[#8E8B81]">SKU: {item.sku}</span>
                            </div>
                          </div>
                        </td>

                        {/* Available Stock */}
                        <td className="py-3 px-2 text-right font-bold text-[#141413]">
                          {item.availableStock.toLocaleString("id-ID")}
                        </td>

                        {/* Editable Transfer Qty */}
                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={item.transferQty}
                            onChange={(e) =>
                              handleTransferQtyChange(item.id, parseFloat(e.target.value))
                            }
                            className={`w-24 p-1.5 text-right bg-white border font-bold rounded-xs outline-hidden shadow-2xs font-mono ${
                              isExceeding
                                ? "border-rose-500 text-rose-700 ring-2 ring-rose-200"
                                : isInvalid
                                ? "border-amber-500 text-amber-700"
                                : "border-neutral-300 text-purple-800 focus:border-[#141413]"
                            }`}
                          />
                        </td>

                        {/* Unit */}
                        <td className="py-3 px-2 text-center text-[#626058]">{item.unit}</td>

                        {/* Batch & Expiry */}
                        <td className="py-3 px-3 text-[11px]">
                          <span className="font-bold text-[#141413] block">{item.batch}</span>
                          <span className="text-[#8E8B81]">Exp: {item.expiry}</span>
                        </td>

                        {/* Destination Location */}
                        <td className="py-3 px-3 text-[11px] text-[#626058]">
                          {item.destinationLocation}
                        </td>

                        {/* Validation Status */}
                        <td className="py-3 px-2 text-center">
                          {isExceeding ? (
                            <span className="inline-flex px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300 rounded-xs animate-pulse">
                              Stok Tidak Cukup!
                            </span>
                          ) : isInvalid ? (
                            <span className="inline-flex px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded-xs">
                              Qty Invalid
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs">
                              ✓ Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================================================
              SECTION 06: RECEIVING CONFIRMATION
              Destination warehouse confirms:
              - Quantity, Condition, Missing Qty, Damaged Qty, Photos, Remarks
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-teal-800 font-semibold block">
                  DESTINATION RECEIPT &amp; HANDOVER VERIFICATION
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Receiving Confirmation
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">
                Dikonfirmasi oleh: {currentTransfer.receivingConfirmation.confirmedBy}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                <span className="text-[9px] uppercase text-[#8E8B81] block">Received Qty</span>
                <strong className="text-base text-emerald-700 block mt-0.5 font-extrabold">
                  {currentTransfer.receivingConfirmation.receivedQty} Unit
                </strong>
                <span className="text-[9px] text-emerald-800">Sesuai Surat Jalan</span>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                <span className="text-[9px] uppercase text-[#8E8B81] block">Condition</span>
                <strong className="text-xs text-[#141413] block mt-1 font-bold">
                  {currentTransfer.receivingConfirmation.condition}
                </strong>
                <span className="text-[9px] text-[#626058]">Higienis &amp; Utuh</span>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                <span className="text-[9px] uppercase text-[#8E8B81] block">Missing Qty</span>
                <strong className="text-base text-[#141413] block mt-0.5 font-extrabold">
                  {currentTransfer.receivingConfirmation.missingQty}
                </strong>
                <span className="text-[9px] text-[#8E8B81]">Nihil / Selisih 0</span>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                <span className="text-[9px] uppercase text-[#8E8B81] block">Damaged Qty</span>
                <strong className="text-base text-[#141413] block mt-0.5 font-extrabold">
                  {currentTransfer.receivingConfirmation.damagedQty}
                </strong>
                <span className="text-[9px] text-[#8E8B81]">Bebas Kerusakan</span>
              </div>
            </div>

            {/* Receiving Photos & Remarks */}
            <div className="space-y-3 pt-2 border-t border-[#141413]/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8E8B81]">
                  Foto Serah Terima Fisik:
                </span>
                <button
                  type="button"
                  onClick={() => showToast("Kamera ponsel / scanner aktif untuk mengambil foto bukti.")}
                  className="text-xs text-[#C85A17] hover:underline font-bold cursor-pointer"
                >
                  + Tambah Foto 📸
                </button>
              </div>

              {currentTransfer.receivingConfirmation.photos.length === 0 ? (
                <p className="text-xs text-[#8E8B81] italic">Belum ada foto serah terima dilampirkan.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentTransfer.receivingConfirmation.photos.map((ph) => (
                    <div
                      key={ph.id}
                      className="px-3 py-1.5 bg-[#FAF9F5] border border-[#141413]/15 rounded-xs flex items-center gap-2 text-xs"
                    >
                      <span className="text-lg">{ph.emoji}</span>
                      <strong className="text-[#141413]">{ph.label}</strong>
                      <span className="text-[10px] text-[#8E8B81]">({ph.timestamp})</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#8E8B81] block">
                  Remarks Penerima:
                </label>
                <p className="p-2.5 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs text-xs text-[#141413] leading-relaxed">
                  {currentTransfer.receivingConfirmation.remarks}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ============================================================
            RIGHT WORKBENCH (lg:col-span-4)
            Section 05: Approval Workflow
            Section 07: Transfer Timeline
            Section 08: Attachments
            Section 09: Actions
            ============================================================ */}
        <div className="lg:col-span-4 space-y-8">
          {/* ==========================================================
              SECTION 05: APPROVAL WORKFLOW
              Warehouse Staff → Warehouse Supervisor →
              Inventory Controller → Destination Confirmation
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                CHAIN OF CUSTODY SIGN-OFF
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Approval Workflow
              </h3>
            </div>

            <div className="space-y-3">
              {currentTransfer.approvals.map((app, idx) => (
                <div
                  key={app.role}
                  className={`p-3.5 border rounded-xs transition-all ${
                    app.status === "Approved"
                      ? "bg-emerald-50/50 border-emerald-200"
                      : app.status === "Pending"
                      ? "bg-amber-50/50 border-amber-300 ring-1 ring-amber-400/20"
                      : "bg-[#FAF9F5] border-[#141413]/10 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block">
                        Tier {idx + 1}: {app.role}
                      </span>
                      <strong className="text-xs text-[#141413] block font-sans font-bold">
                        {app.name}
                      </strong>
                    </div>

                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                        app.status === "Approved"
                          ? "bg-emerald-700 text-white"
                          : app.status === "Pending"
                          ? "bg-amber-600 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {app.timestamp && (
                    <span className="text-[10px] text-[#8E8B81] block mt-1">
                      Otorisasi: {app.timestamp}
                    </span>
                  )}
                  {app.notes && (
                    <p className="text-[10px] text-[#626058] mt-1 pt-1 border-t border-black/5 leading-relaxed">
                      Catatan: {app.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ==========================================================
              SECTION 07: TRANSFER TIMELINE (7 Steps)
              Transfer Created → Approved → Picking → Loaded →
              In Transit → Received → Completed
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                GATE-TO-LINE AUDIT FLOW
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Transfer Timeline
              </h3>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#141413]/15">
              {[
                { step: 1, title: "Transfer Created", desc: "Permintaan transfer diterbitkan oleh dapur" },
                { step: 2, title: "Approved", desc: "Otorisasi supervisor & kartu stok dialokasikan" },
                { step: 3, title: "Picking", desc: "Pengambilan material dari rak penyimpanan" },
                { step: 4, title: "Loaded", desc: "Dimuat ke troli steril / armada transit" },
                { step: 5, title: "In Transit", desc: "Perjalanan antargudang menuju lokasi tujuan" },
                { step: 6, title: "Received", desc: "Pemeriksaan fisik timbangan & suhu serah terima" },
                { step: 7, title: "Completed", desc: "Saldo buku persediaan terposting final" },
              ].map((st) => {
                const isPassed = currentTransfer.timelineStep >= st.step;
                const isCurrent = currentTransfer.timelineStep === st.step;

                return (
                  <div key={st.step} className="relative group">
                    <div
                      className={`absolute -left-[20px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        isPassed
                          ? isCurrent
                            ? "bg-purple-600 ring-2 ring-purple-300 animate-pulse"
                            : "bg-emerald-600"
                          : "bg-neutral-300"
                      }`}
                    ></div>
                    <div className="space-y-0.5">
                      <strong
                        className={`text-xs block ${
                          isCurrent
                            ? "text-[#C85A17] font-bold"
                            : isPassed
                            ? "text-[#141413]"
                            : "text-[#8E8B81]"
                        }`}
                      >
                        {st.title}
                      </strong>
                      <p className="text-[11px] text-[#626058]">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==========================================================
              SECTION 08: ATTACHMENTS
              Transfer Form, Delivery Note, Photo, Supporting Document
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  VERIFIABLE EVIDENCE
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Attachments
                </h3>
              </div>
              <button
                type="button"
                onClick={() => showToast("Dialog unggah lampiran dokumen terbuka.")}
                className="text-xs text-[#C85A17] hover:underline font-bold cursor-pointer"
              >
                + Lampirkan File
              </button>
            </div>

            {currentTransfer.attachments.length === 0 ? (
              <p className="text-xs text-[#8E8B81] italic py-2 text-center">
                Belum ada berkas lampiran pendukung.
              </p>
            ) : (
              <div className="space-y-2">
                {currentTransfer.attachments.map((att) => (
                  <button
                    key={att.id}
                    type="button"
                    onClick={() => setSelectedAttachment(att)}
                    className="w-full p-2.5 bg-[#FAF9F5] hover:bg-neutral-100 border border-[#141413]/10 rounded-xs flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📄</span>
                      <div>
                        <strong className="text-xs text-[#141413] block group-hover:underline">
                          {att.name}
                        </strong>
                        <span className="text-[10px] text-[#8E8B81]">
                          {att.type} • {att.size}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#8E8B81] group-hover:text-black">↗</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ==========================================================
              SECTION 09: ACTIONS
              Approve, Reject, Print Transfer, Generate QR, Track Status
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-3.5 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                EXECUTION COMMANDS
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Transfer Actions
              </h3>
            </div>

            <div className="space-y-2">
              {/* Approve */}
              <button
                type="button"
                onClick={() => {
                  setTransfers((prev) =>
                    prev.map((t) =>
                      t.id === currentTransfer.id
                        ? { ...t, status: "Completed", timelineStep: 7 }
                        : t
                    )
                  );
                  showToast(
                    `Transfer ${currentTransfer.transferNumber} DISETUJUI & saldo stok dipindahkan secara permanen.`
                  );
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
              >
                ✓ Approve Transfer (Lepas Barang)
              </button>

              {/* Reject */}
              <button
                type="button"
                onClick={() => {
                  setTransfers((prev) =>
                    prev.map((t) =>
                      t.id === currentTransfer.id ? { ...t, status: "Rejected" } : t
                    )
                  );
                  showToast(`Transfer ${currentTransfer.transferNumber} DITOLAK.`);
                }}
                className="w-full py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
              >
                ✕ Reject (Batalkan Transfer)
              </button>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Print Transfer */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Print Form 🖨️
                </button>

                {/* Generate QR */}
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  QR Code 📱
                </button>

                {/* Track Status */}
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Armada troli transit ${currentTransfer.transferNumber} terpantau di Jalur Koridor Bersih Dapur.`
                    )
                  }
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Track GPS 📍
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ==============================================================
          MODALS: NEW TRANSFER, SCAN BARCODE, QR CODE, EXPORT, ATTACHMENT
          ============================================================== */}

      {/* 1. New Transfer Modal */}
      {isNewTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  New Internal Requisition
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Create Warehouse Transfer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTransferModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Tiket permohonan transfer internal baru berhasil diterbitkan.");
                setIsNewTransferModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#141413] font-bold mb-1">Gudang Asal (Source):</label>
                <select className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden">
                  <option>Cold Storage (Chiller Wing 1)</option>
                  <option>Main Warehouse (Gudang Utama)</option>
                  <option>Dry Storage (Bumbu &amp; Rempah)</option>
                  <option>Packaging Warehouse</option>
                </select>
              </div>

              <div>
                <label className="block text-[#141413] font-bold mb-1">Lokasi Tujuan (Destination):</label>
                <select className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden">
                  <option>Kitchen Production (Butchery &amp; Prep)</option>
                  <option>Kitchen Production (Rice Steamer Unit)</option>
                  <option>Packing Line 1 (Bento Assembly)</option>
                  <option>Deep Fryer Bay (Dapur Penggorengan)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#141413] font-bold mb-1">Alasan Transfer / Nomor SPK:</label>
                <input
                  type="text"
                  placeholder="Contoh: Suplai bahan SPK-PRD-2026-1022 Katering Bank Mandiri"
                  className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button
                  type="button"
                  onClick={() => setIsNewTransferModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
                >
                  Terbitkan Permohonan Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Scan Barcode Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Hardware Scanner Link
                </span>
                <strong className="font-display font-extrabold text-lg text-[#141413]">
                  Scan Transfer Barcode
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setIsScanModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#626058] leading-relaxed">
              Arahkan scanner handheld Honeywell EDA51 / Zebra TC21 ke barcode pada dokumen surat jalan
              internal atau tag RFID wadah transit.
            </p>

            <div className="h-44 bg-neutral-900 border-2 border-[#C85A17] rounded-xs flex flex-col items-center justify-center text-white relative overflow-hidden">
              <span className="text-4xl block mb-2">⚡</span>
              <span className="text-xs font-mono text-emerald-400 animate-pulse">
                SCANNER READY: AWAITING BEAM...
              </span>
              <div className="absolute inset-x-0 h-0.5 bg-rose-500 animate-ping"></div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsScanModalOpen(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast("Barcode TR-2026-1021-0041 terverifikasi secara instan.");
                  setIsScanModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
              >
                Simulasi Scan Sukses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. QR Code Dispatch Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in font-mono text-xs text-center">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <strong className="text-sm text-[#141413] font-display">
                Dispatch QR Code — {currentTransfer.transferNumber}
              </strong>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* QR Pattern Representation */}
            <div className="w-48 h-48 mx-auto bg-neutral-100 border-2 border-[#141413] p-4 flex flex-col items-center justify-center text-xs space-y-2">
              <span className="text-6xl">▦</span>
              <span className="text-[10px] text-[#8E8B81]">SECURE DIGITAL DISPATCH PASS</span>
            </div>

            <p className="text-[11px] text-[#626058] leading-relaxed">
              Tunjukkan kode QR ini kepada tim penerima di dapur produksi untuk konfirmasi serah
              terima digital instan.
            </p>

            <div className="flex justify-end pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-2 bg-[#141413] text-white font-bold rounded-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Logistics Dossier
                </span>
                <strong className="font-display font-extrabold text-lg text-[#141413]">
                  Export Transfer Manifest
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#626058] leading-relaxed">
              Ekspor rekapan manifest pemindahan barang antar-gudang untuk arsip pengiriman internal:
            </p>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Total Transfer:</span>
                <strong className="text-[#141413]">{transfers.length} Rekaman</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Format:</span>
                <strong className="text-[#141413]">PDF Manifest &amp; Excel (.xlsx)</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast("Manifest transfer internal berhasil diunduh.");
                  setIsExportModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
              >
                Unduh Manifest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Attachment Viewer Modal */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <strong className="text-sm text-[#141413]">{selectedAttachment.name}</strong>
              <button
                type="button"
                onClick={() => setSelectedAttachment(null)}
                className="text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-40 bg-neutral-100 border border-neutral-300 rounded-xs flex flex-col items-center justify-center text-5xl">
              <span>📄</span>
              <span className="text-xs text-[#8E8B81] mt-2">{selectedAttachment.type}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#626058]">
              <span>Ukuran Dokumen: {selectedAttachment.size}</span>
              <span className="text-emerald-700 font-bold">✓ Tervalidasi Sistem EWM</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setSelectedAttachment(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Mengunduh file ${selectedAttachment.name}`);
                  setSelectedAttachment(null);
                }}
                className="px-4 py-2 bg-[#141413] text-white font-bold rounded-xs cursor-pointer"
              >
                Unduh File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
