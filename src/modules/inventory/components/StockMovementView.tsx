"use client";

import React, { useState, useMemo } from "react";

// --- TYPES & INTERFACES ---
export type MovementType =
  | "Receiving"
  | "Production Consumption"
  | "Transfer"
  | "Stock Adjustment"
  | "Stock Opname"
  | "Purchase Return"
  | "Waste"
  | "Expired"
  | "Manual Correction";

export type LedgerStatus = "Posted" | "Pending Audit" | "Flagged" | "Void";

export interface StockTransaction {
  id: string;
  referenceNo: string;
  timestamp: string; // ISO or readable
  timeOnly: string;
  movementType: MovementType;
  item: string;
  sku: string;
  category: string;
  warehouse: string;
  sourceLocation?: string;
  targetLocation?: string;
  batch: string;
  expiryDate: string;
  unit: string;
  qtyIn: number;
  qtyOut: number;
  balanceBefore: number;
  balanceAfter: number;
  performedBy: string;
  operatorRole: string;
  approvedBy: string;
  status: LedgerStatus;
  reason: string;
  notes: string;
  relatedPo?: string;
  relatedProduction?: string; // Work order / SPK
  supplier?: string;
  ipAddress: string;
  device: string;
  revisionHistory: {
    version: number;
    updatedAt: string;
    updatedBy: string;
    changeNote: string;
  }[];
  documents: {
    id: string;
    name: string;
    type: "GRN" | "PO" | "SuratJalan" | "QC_Report" | "SPK";
    size: string;
  }[];
  photos: {
    id: string;
    label: string;
    urlThumb: string;
    emoji: string;
  }[];
}

// --- MOCK TRANSACTION LEDGER (REALISTIC INDUSTRIAL CATERING AUDIT TRAIL) ---
const INITIAL_TRANSACTIONS: StockTransaction[] = [
  {
    id: "tx-001",
    referenceNo: "TX-2026-1021-0082",
    timestamp: "21 Okt 2026, 08:18:45 WIB",
    timeOnly: "08:18 WIB",
    movementType: "Receiving",
    item: "Chicken Breast Fillet Paha (Grade A)",
    sku: "RM-00021",
    category: "Raw Material - Protein",
    warehouse: "Cold Storage (Chiller Wing 1)",
    sourceLocation: "Dock 2 • Reefer Truck B 9821 TDF",
    targetLocation: "Chiller Wing 1 • Rack A-04",
    batch: "B-PLT-2026-8821",
    expiryDate: "28 Okt 2026",
    unit: "kg",
    qtyIn: 495.5,
    qtyOut: 0,
    balanceBefore: 1000.0,
    balanceAfter: 1495.5,
    performedBy: "Yusuf Supriatna",
    operatorRole: "Receiving Warehouse Officer",
    approvedBy: "QC Hendra Wibowo",
    status: "Posted",
    reason: "Penerimaan PO-ZKS-2026-1082 dari PT. Sumber Unggas Makmur. Lolos uji suhu +2.4°C.",
    notes: "Alokasi 4.5 kg trim susut dialokasikan ke reject slip terpisah.",
    relatedPo: "PO-ZKS-2026-1082",
    supplier: "PT. Sumber Unggas Makmur",
    ipAddress: "192.168.10.42 (Loading Dock Scanner 02)",
    device: "Honeywell EDA51 Scanner • Android 11",
    revisionHistory: [
      {
        version: 1,
        updatedAt: "21 Okt 2026 08:18 WIB",
        updatedBy: "Yusuf Supriatna",
        changeNote: "Initial GRN tally entry recorded from weighbridge",
      },
      {
        version: 2,
        updatedAt: "21 Okt 2026 08:24 WIB",
        updatedBy: "QC Hendra Wibowo",
        changeNote: "QC Verified, sign-off and balance posted to ledger",
      },
    ],
    documents: [
      { id: "d-1", name: "GRN-2026-1021-01.pdf", type: "GRN", size: "240 KB" },
      { id: "d-2", name: "SuratJalan-SUM-88120.pdf", type: "SuratJalan", size: "1.2 MB" },
      { id: "d-3", name: "QC_Certificate_Halal_SUM.pdf", type: "QC_Report", size: "480 KB" },
    ],
    photos: [
      { id: "p-1", label: "Probe Suhu Daging +2.4°C", urlThumb: "", emoji: "🌡️" },
      { id: "p-2", label: "Segel Reefer Container", urlThumb: "", emoji: "🔒" },
      { id: "p-3", label: "Plastik Vakum Utuh", urlThumb: "", emoji: "📦" },
    ],
  },
  {
    id: "tx-002",
    referenceNo: "TX-2026-1021-0083",
    timestamp: "21 Okt 2026, 09:12:10 WIB",
    timeOnly: "09:12 WIB",
    movementType: "Production Consumption",
    item: "Beras Ramos Premium IR-64 (Zak 50kg)",
    sku: "RM-00012",
    category: "Dry Grains & Spices",
    warehouse: "Main Warehouse (Gudang Utama)",
    sourceLocation: "Main Warehouse • Bay G-01",
    targetLocation: "Kitchen Production • Rice Steamer Unit A",
    batch: "B-GRN-2026-1092",
    expiryDate: "15 Jan 2027",
    unit: "kg",
    qtyIn: 0,
    qtyOut: 350.0,
    balanceBefore: 4000.0,
    balanceAfter: 3650.0,
    performedBy: "Bambang Santoso",
    operatorRole: "Head of Hot Kitchen",
    approvedBy: "Rahmat Hidayat (SPV Produksi)",
    status: "Posted",
    reason: "Pengambilan beras untuk persiapan Menu Makan Siang Shift 1 (2,200 Pax PT. Astra Otoparts).",
    notes: "7 zak utuh @ 50kg langsung dituang ke bin pencucian beras.",
    relatedProduction: "SPK-PRD-2026-1021-01",
    supplier: "Koperasi Tani Karawang Sejahtera",
    ipAddress: "192.168.10.118 (Kitchen Terminal 01)",
    device: "Advantech Touch Panel PC • Win 11 IoT",
    revisionHistory: [
      {
        version: 1,
        updatedAt: "21 Okt 2026 09:12 WIB",
        updatedBy: "Bambang Santoso",
        changeNote: "Material issue voucher posted for SPK-01",
      },
    ],
    documents: [
      { id: "d-4", name: "SPK-PRD-2026-1021-01.pdf", type: "SPK", size: "310 KB" },
      { id: "d-5", name: "Material_Requisition_Voucher.pdf", type: "GRN", size: "185 KB" },
    ],
    photos: [{ id: "p-4", label: "Penimbangan Zak Beras", urlThumb: "", emoji: "⚖️" }],
  },
  {
    id: "tx-003",
    referenceNo: "TX-2026-1021-0084",
    timestamp: "21 Okt 2026, 10:05:30 WIB",
    timeOnly: "10:05 WIB",
    movementType: "Production Consumption",
    item: "Chicken Breast Fillet Paha (Grade A)",
    sku: "RM-00021",
    category: "Raw Material - Protein",
    warehouse: "Cold Storage (Chiller Wing 1)",
    sourceLocation: "Chiller Wing 1 • Rack A-04",
    targetLocation: "Kitchen Butchery Station",
    batch: "B-PLT-2026-8821",
    expiryDate: "28 Okt 2026",
    unit: "kg",
    qtyIn: 0,
    qtyOut: 180.0,
    balanceBefore: 1495.5,
    balanceAfter: 1315.5,
    performedBy: "Dedi Supardi",
    operatorRole: "Butchery Supervisor",
    approvedBy: "Chef Surya Atmaja",
    status: "Posted",
    reason: "Porsi Ayam Bakar Bumbu Rujak untuk Paket Prasmanan PT. Epson Indonesia.",
    notes: "Suhu daging saat keluar chiller +3.1°C. Siap marinasi.",
    relatedProduction: "SPK-PRD-2026-1021-02",
    supplier: "PT. Sumber Unggas Makmur",
    ipAddress: "192.168.10.120 (Butchery Scale Scanner)",
    device: "Datalogic Memor 10 • Android 10",
    revisionHistory: [
      {
        version: 1,
        updatedAt: "21 Okt 2026 10:05 WIB",
        updatedBy: "Dedi Supardi",
        changeNote: "Meat issue scan confirmed with RFID butchery bin",
      },
    ],
    documents: [
      { id: "d-6", name: "SPK-PRD-2026-1021-02.pdf", type: "SPK", size: "290 KB" },
    ],
    photos: [{ id: "p-5", label: "Timbangan Daging Ayam 180kg", urlThumb: "", emoji: "🍗" }],
  },
  {
    id: "tx-004",
    referenceNo: "TX-2026-1021-0085",
    timestamp: "21 Okt 2026, 11:20:15 WIB",
    timeOnly: "11:20 WIB",
    movementType: "Transfer",
    item: "Minyak Goreng Sawit Higienis (Jerigen 20L)",
    sku: "RM-00004",
    category: "Dairy & Oil",
    warehouse: "Main Warehouse (Gudang Utama)",
    sourceLocation: "Main Warehouse • Bay M-02",
    targetLocation: "Kitchen Transit • Deep Fryer Bay",
    batch: "B-OIL-2026-449",
    expiryDate: "12 Des 2027",
    unit: "Liter",
    qtyIn: 200.0,
    qtyOut: 200.0,
    balanceBefore: 1200.0,
    balanceAfter: 1200.0,
    performedBy: "Kurnia Sandi",
    operatorRole: "Forklift Operator",
    approvedBy: "Agus Pratama (Warehouse SPV)",
    status: "Posted",
    reason: "Relokasi internal 10 jerigen @ 20L dari Gudang Utama ke Transit Station Dapur Penggorengan.",
    notes: "Pallet nomor P-092 telah diterima oleh Cook Assistant Asep.",
    ipAddress: "192.168.10.88 (Forklift Mounted Terminal)",
    device: "Zebra VC8300 Rugged Terminal",
    revisionHistory: [
      {
        version: 1,
        updatedAt: "21 Okt 2026 11:20 WIB",
        updatedBy: "Kurnia Sandi",
        changeNote: "Inter-bay barcode transfer confirmed",
      },
    ],
    documents: [
      { id: "d-7", name: "Internal_Transfer_Order_TR-041.pdf", type: "GRN", size: "140 KB" },
    ],
    photos: [{ id: "p-6", label: "Pallet Minyak Goreng 10 Jerigen", urlThumb: "", emoji: "🛢️" }],
  },
  {
    id: "tx-005",
    referenceNo: "TX-2026-1021-0086",
    timestamp: "21 Okt 2026, 13:45:00 WIB",
    timeOnly: "13:45 WIB",
    movementType: "Stock Adjustment",
    item: "Bawang Merah Brebes Super",
    sku: "RM-00044",
    category: "Raw Material - Produce",
    warehouse: "Dry Storage",
    sourceLocation: "Dry Storage • Rak D-02",
    targetLocation: "Adjustment Loss Bin",
    batch: "B-SPB-2026-331",
    expiryDate: "28 Okt 2026",
    unit: "kg",
    qtyIn: 0,
    qtyOut: 2.3,
    balanceBefore: 98.0,
    balanceAfter: 95.7,
    performedBy: "Tatang Sutisna",
    operatorRole: "Inventory Control Staff",
    approvedBy: "QC Hendra Wibowo",
    status: "Posted",
    reason: "Penyusutan kelembaban alami dan pembersihan kulit kering bawang merah (Shrinkage loss 2.3%).",
    notes: "Toleransi susut normal untuk komoditas sayur segar basah.",
    ipAddress: "192.168.10.55 (Dry Storage Tablet)",
    device: "Samsung Galaxy Tab Active 3",
    revisionHistory: [
      {
        version: 1,
        updatedAt: "21 Okt 2026 13:45 WIB",
        updatedBy: "Tatang Sutisna",
        changeNote: "Weight reconciliation post-sorting entered",
      },
    ],
    documents: [
      { id: "d-8", name: "Adjustment_Voucher_ADJ-881.pdf", type: "GRN", size: "115 KB" },
    ],
    photos: [{ id: "p-7", label: "Kupas Kulit Bawang Kering", urlThumb: "", emoji: "🧅" }],
  },
];

export default function StockMovementClient() {
  // --- STATE ---
  const [transactions] = useState<StockTransaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTxId, setSelectedTxId] = useState<string>("tx-001");
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({ "tx-001": true });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("Today");
  const [warehouseFilter, setWarehouseFilter] = useState("All Warehouses");
  const [movementTypeFilter, setMovementTypeFilter] = useState("All Movement Types");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [supplierFilter, setSupplierFilter] = useState("All Suppliers");
  const [userFilter, setUserFilter] = useState("All Users");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Modals & Feedback
  const [isExportModalOpen, setIsExportModalOpen] = useState<"Excel" | "PDF" | "CSV" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle inline row expansion
  const toggleRowExpansion = (txId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [txId]: !prev[txId],
    }));
  };

  // Selected Transaction for Inspector Panel
  const selectedTx = transactions.find((t) => t.id === selectedTxId) || transactions[0];

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Global Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          tx.item.toLowerCase().includes(query) ||
          tx.sku.toLowerCase().includes(query) ||
          tx.batch.toLowerCase().includes(query) ||
          tx.referenceNo.toLowerCase().includes(query) ||
          tx.warehouse.toLowerCase().includes(query) ||
          (tx.supplier && tx.supplier.toLowerCase().includes(query)) ||
          (tx.relatedPo && tx.relatedPo.toLowerCase().includes(query)) ||
          tx.performedBy.toLowerCase().includes(query);

        if (!matches) return false;
      }

      // Warehouse Filter
      if (warehouseFilter !== "All Warehouses") {
        if (!tx.warehouse.includes(warehouseFilter)) return false;
      }

      // Movement Type Filter
      if (movementTypeFilter !== "All Movement Types") {
        if (tx.movementType !== movementTypeFilter) return false;
      }

      // Category Filter
      if (categoryFilter !== "All Categories") {
        if (tx.category !== categoryFilter) return false;
      }

      // Supplier Filter
      if (supplierFilter !== "All Suppliers") {
        if (!tx.supplier || !tx.supplier.includes(supplierFilter)) return false;
      }

      // User Filter
      if (userFilter !== "All Users") {
        if (
          !tx.performedBy.toLowerCase().includes(userFilter.toLowerCase()) &&
          !tx.approvedBy.toLowerCase().includes(userFilter.toLowerCase())
        ) {
          return false;
        }
      }

      // Status Filter
      if (statusFilter !== "All Statuses") {
        if (tx.status !== statusFilter) return false;
      }

      return true;
    });
  }, [
    transactions,
    searchQuery,
    warehouseFilter,
    movementTypeFilter,
    categoryFilter,
    supplierFilter,
    userFilter,
    statusFilter,
  ]);

  // Movement Summary KPI Cards
  const summaryKPIs = useMemo(() => {
    const todayCount = filteredTransactions.length;
    let totalIn = 0;
    let totalOut = 0;
    let transferCount = 0;
    let adjustmentCount = 0;
    let rejectedCount = 0;

    filteredTransactions.forEach((t) => {
      totalIn += t.qtyIn;
      totalOut += t.qtyOut;
      if (t.movementType === "Transfer") transferCount += 1;
      if (t.movementType === "Stock Adjustment" || t.movementType === "Manual Correction")
        adjustmentCount += 1;
      if (t.movementType === "Purchase Return" || t.movementType === "Expired" || t.movementType === "Waste")
        rejectedCount += 1;
    });

    return {
      todayCount,
      totalIn: totalIn.toLocaleString("id-ID", { maximumFractionDigits: 1 }),
      totalOut: totalOut.toLocaleString("id-ID", { maximumFractionDigits: 1 }),
      transferCount,
      adjustmentCount,
      rejectedCount,
    };
  }, [filteredTransactions]);

  // Badge Renderer for Movement Types
  const renderMovementTypeBadge = (type: MovementType) => {
    switch (type) {
      case "Receiving":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Receiving
          </span>
        );
      case "Production Consumption":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Production
          </span>
        );
      case "Transfer":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Transfer
          </span>
        );
      case "Stock Adjustment":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Adjustment
          </span>
        );
      case "Stock Opname":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-300 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Stock Opname
          </span>
        );
      case "Purchase Return":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Purchase Return
          </span>
        );
      case "Waste":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-300 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500"></span>
            Waste
          </span>
        );
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-red-100 text-red-900 border border-red-300 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-red-700"></span>
            Expired
          </span>
        );
      case "Manual Correction":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-orange-50 text-orange-800 border border-orange-300 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            Correction
          </span>
        );
    }
  };

  // Status Badge
  const renderStatusBadge = (status: LedgerStatus) => {
    switch (status) {
      case "Posted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs">
            ✓ Posted
          </span>
        );
      case "Pending Audit":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-xs">
            ⏳ Pending
          </span>
        );
      case "Flagged":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300 rounded-xs">
            ⚠️ Flagged
          </span>
        );
      case "Void":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-200 text-neutral-700 border border-neutral-300 line-through rounded-xs">
            Void
          </span>
        );
    }
  };

  // Handle Export Download Simulation
  const handleExport = (format: "Excel" | "PDF" | "CSV") => {
    setIsExportModalOpen(format);
  };

  const confirmDownloadExport = (format: string) => {
    setIsExportModalOpen(null);
    showToast(`Laporan Buku Besar Mutasi (${format}) berhasil di-generate & diunduh.`);
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
          Stock Movement
          Subtitle: Complete audit history of every inventory transaction.
          Top Right: Export Excel, Export PDF, Print + View Switcher
          ============================================================== */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#141413]/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
              PT. ZAHDAN KAMAL SENTOSA
            </span>
            <span className="text-[#8E8B81] text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#141413] font-semibold block">
              ENTERPRISE INVENTORY AUDIT TRAIL
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ledger Immutable
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Stock Movement
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Complete audit history of every inventory transaction.
          </p>
        </div>

        {/* Top Right Actions & View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Switch View Toggle */}
          <div className="inline-flex p-1 bg-neutral-200/70 border border-[#141413]/15 rounded-xs mr-2">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-xs transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-[#141413] shadow-xs"
                  : "text-[#626058] hover:text-[#141413]"
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-xs transition-all cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-white text-[#141413] shadow-xs"
                  : "text-[#626058] hover:text-[#141413]"
              }`}
            >
              Timeline View
            </button>
          </div>

          {/* Export Excel */}
          <button
            type="button"
            onClick={() => handleExport("Excel")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Excel</span>
          </button>

          {/* Export PDF */}
          <button
            type="button"
            onClick={() => handleExport("PDF")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Export PDF</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={() => handleExport("CSV")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>CSV</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print</span>
          </button>
        </div>
      </header>

      {/* ==============================================================
          MOVEMENT SUMMARY CARDS (6 CARDS)
          - Today's Transactions
          - Incoming Qty
          - Outgoing Qty
          - Transfers
          - Adjustments
          - Rejected
          ============================================================== */}
      <section aria-labelledby="movement-summary-heading">
        <h2 id="movement-summary-heading" className="sr-only">
          Stock Movement Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Today's Transactions */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Today&apos;s Tx
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              {summaryKPIs.todayCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Audit</span>
            </p>
            <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
              100% tervalidasi buku besar
            </span>
          </div>

          {/* 2. Incoming Qty */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Incoming Qty
            </span>
            <p className="font-display font-extrabold text-2xl text-emerald-700">
              +{summaryKPIs.totalIn}{" "}
              <span className="text-xs font-normal text-[#626058]">Unit</span>
            </p>
            <span className="text-[10px] text-emerald-800 block pt-1 border-t border-black/5">
              Masuk via GRN &amp; Opname
            </span>
          </div>

          {/* 3. Outgoing Qty */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Outgoing Qty
            </span>
            <p className="font-display font-extrabold text-2xl text-blue-700">
              -{summaryKPIs.totalOut}{" "}
              <span className="text-xs font-normal text-[#626058]">Unit</span>
            </p>
            <span className="text-[10px] text-blue-800 block pt-1 border-t border-black/5">
              Konsumsi masak &amp; transfer
            </span>
          </div>

          {/* 4. Transfers */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Transfers
            </span>
            <p className="font-display font-extrabold text-2xl text-purple-700">
              {summaryKPIs.transferCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Inter-Bay</span>
            </p>
            <span className="text-[10px] text-purple-800 block pt-1 border-t border-black/5">
              Perpindahan antar lokasi
            </span>
          </div>

          {/* 5. Adjustments */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Adjustments
            </span>
            <p className="font-display font-extrabold text-2xl text-amber-700">
              {summaryKPIs.adjustmentCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Rekonsiliasi</span>
            </p>
            <span className="text-[10px] text-amber-800 block pt-1 border-t border-black/5">
              Susut &amp; koreksi timbang
            </span>
          </div>

          {/* 6. Rejected / Waste */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Rejected / Scrap
            </span>
            <p className="font-display font-extrabold text-2xl text-rose-700">
              {summaryKPIs.rejectedCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Kasus</span>
            </p>
            <span className="text-[10px] text-rose-800 block pt-1 border-t border-black/5">
              Retur vendor &amp; limbah
            </span>
          </div>
        </div>
      </section>

      {/* ==============================================================
          TOP FILTER BAR
          - Global Search (Item Name, SKU, Batch Number, Supplier, PO Number, Warehouse, Reference Number)
          - Filters: Date Range, Warehouse, Movement Type, Category, Supplier, Batch, User, Status
          ============================================================== */}
      <section className="bg-white border border-[#141413]/10 p-5 space-y-4 shadow-2xs">
        {/* Global Instant Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8E8B81]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi berdasarkan Nama Item, SKU, No. Batch, Supplier, No. PO, Gudang, atau No. Referensi..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-[#141413]/15 text-xs text-[#141413] rounded-xs focus:border-[#141413] outline-hidden placeholder:text-[#8E8B81] font-mono transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-[#8E8B81] hover:text-[#141413] cursor-pointer"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Filter Dropdown Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-1">
          {/* Date Range */}
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block mb-1">
              Date Range
            </label>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-[11px] text-[#141413] rounded-xs font-mono focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="Today">Today (21 Okt)</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Month to Date">Month to Date</option>
            </select>
          </div>

          {/* Warehouse */}
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block mb-1">
              Warehouse
            </label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-[11px] text-[#141413] rounded-xs font-mono focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="All Warehouses">All Warehouses</option>
              <option value="Cold Storage">Cold Storage</option>
              <option value="Main Warehouse">Main Warehouse</option>
              <option value="Dry Storage">Dry Storage</option>
              <option value="Packaging Warehouse">Packaging Warehouse</option>
            </select>
          </div>

          {/* Movement Type */}
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block mb-1">
              Movement Type
            </label>
            <select
              value={movementTypeFilter}
              onChange={(e) => setMovementTypeFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-[11px] text-[#141413] rounded-xs font-mono focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="All Movement Types">All Types</option>
              <option value="Receiving">Receiving</option>
              <option value="Production Consumption">Production</option>
              <option value="Transfer">Transfer</option>
              <option value="Stock Adjustment">Stock Adjustment</option>
              <option value="Stock Opname">Stock Opname</option>
              <option value="Purchase Return">Purchase Return</option>
              <option value="Waste">Waste</option>
              <option value="Expired">Expired</option>
              <option value="Manual Correction">Manual Correction</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-[11px] text-[#141413] rounded-xs font-mono focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Raw Material - Protein">Protein</option>
              <option value="Dry Grains & Spices">Grains & Spices</option>
              <option value="Raw Material - Produce">Produce / Sayur</option>
              <option value="Dairy & Oil">Dairy & Oil</option>
              <option value="Packaging">Packaging</option>
            </select>
          </div>

          {/* Supplier */}
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block mb-1">
              Supplier
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-[11px] text-[#141413] rounded-xs font-mono focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="All Suppliers">All Suppliers</option>
              <option value="Sumber Unggas Makmur">PT. Sumber Unggas</option>
              <option value="Koperasi Tani Karawang">Koperasi Karawang</option>
              <option value="Wilmar Cahaya Nabati">PT. Wilmar</option>
              <option value="Sari Segar Nusantara">PT. Sari Segar</option>
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block mb-1">
              Batch Search
            </label>
            <input
              type="text"
              placeholder="e.g. B-PLT"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-[11px] text-[#141413] rounded-xs font-mono focus:border-[#141413] outline-hidden"
            />
          </div>

          {/* User / Inspector */}
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block mb-1">
              User
            </label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-[11px] text-[#141413] rounded-xs font-mono focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="All Users">All Users</option>
              <option value="Yusuf">Yusuf Supriatna</option>
              <option value="Hendra">QC Hendra Wibowo</option>
              <option value="Bambang">Bambang Santoso</option>
              <option value="Agus">Agus Pratama</option>
              <option value="Rian">Rian Hidayat</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[9px] uppercase tracking-wider text-[#8E8B81] font-bold block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-neutral-300 text-[11px] text-[#141413] rounded-xs font-mono focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Posted">Posted</option>
              <option value="Pending Audit">Pending Audit</option>
              <option value="Flagged">Flagged</option>
              <option value="Void">Void</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(searchQuery ||
          warehouseFilter !== "All Warehouses" ||
          movementTypeFilter !== "All Movement Types" ||
          categoryFilter !== "All Categories" ||
          supplierFilter !== "All Suppliers" ||
          userFilter !== "All Users" ||
          statusFilter !== "All Statuses") && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#141413]/10 text-[11px]">
            <span className="text-[#8E8B81]">Filter Aktif:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 bg-neutral-100 text-[#141413] border border-neutral-300 rounded-xs">
                Query: &quot;{searchQuery}&quot;
              </span>
            )}
            {warehouseFilter !== "All Warehouses" && (
              <span className="px-2 py-0.5 bg-neutral-100 text-[#141413] border border-neutral-300 rounded-xs">
                Gudang: {warehouseFilter}
              </span>
            )}
            {movementTypeFilter !== "All Movement Types" && (
              <span className="px-2 py-0.5 bg-neutral-100 text-[#141413] border border-neutral-300 rounded-xs">
                Tipe: {movementTypeFilter}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setWarehouseFilter("All Warehouses");
                setMovementTypeFilter("All Movement Types");
                setCategoryFilter("All Categories");
                setSupplierFilter("All Suppliers");
                setUserFilter("All Users");
                setStatusFilter("All Statuses");
              }}
              className="text-[#C85A17] hover:underline font-bold ml-auto cursor-pointer"
            >
              Reset Semua Filter ↺
            </button>
          </div>
        )}
      </section>

      {/* ==============================================================
          MAIN CONTENT WORKBENCH (DESKTOP SPLIT LAYOUT)
          Left: Table or Timeline View (col-span-8)
          Right: Right Inspector Panel (col-span-4)
          ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================
            LEFT COLUMN (TABLE OR TIMELINE VIEW)
            ============================================================ */}
        <div className="lg:col-span-8 space-y-6">
          {viewMode === "table" ? (
            /* ========================================================
               MAIN LEDGER TABLE
               Sticky header, frozen first columns, expandable rows
               ======================================================== */
            <div className="bg-white border border-[#141413]/10 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#141413]/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                    GENERAL INVENTORY LEDGER
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#141413]">
                    Transaction Register ({filteredTransactions.length} Baris Ditemukan)
                  </h3>
                </div>
                <span className="text-[11px] text-[#8E8B81]">
                  Klik baris untuk inspeksi audit mendalam di panel kanan
                </span>
              </div>

              <div className="overflow-x-auto max-h-[700px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  {/* Sticky Header */}
                  <thead className="sticky top-0 z-20 bg-neutral-100 border-b border-[#141413]/15 shadow-xs">
                    <tr className="text-[10px] uppercase tracking-wider text-[#626058]">
                      <th className="py-3 px-3.5 sticky left-0 z-30 bg-neutral-100 w-8">#</th>
                      <th className="py-3 px-3 sticky left-8 z-30 bg-neutral-100 whitespace-nowrap">
                        Tx Time
                      </th>
                      <th className="py-3 px-3 whitespace-nowrap">Reference No</th>
                      <th className="py-3 px-3 whitespace-nowrap">Movement Type</th>
                      <th className="py-3 px-4 whitespace-nowrap font-semibold">Item &amp; SKU</th>
                      <th className="py-3 px-3 whitespace-nowrap">Warehouse</th>
                      <th className="py-3 px-3 whitespace-nowrap">Batch</th>
                      <th className="py-3 px-3 text-right whitespace-nowrap">Qty In</th>
                      <th className="py-3 px-3 text-right whitespace-nowrap">Qty Out</th>
                      <th className="py-3 px-3 text-right whitespace-nowrap">Balance</th>
                      <th className="py-3 px-3 whitespace-nowrap">Performed By</th>
                      <th className="py-3 px-3 whitespace-nowrap">Status</th>
                      <th className="py-3 px-3 text-right whitespace-nowrap">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#141413]/5 text-xs">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-16 text-center text-[#8E8B81] italic">
                          Tidak ditemukan transaksi mutasi stok yang sesuai dengan kriteria filter.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => {
                        const isSelected = selectedTxId === tx.id;
                        const isExpanded = !!expandedRows[tx.id];

                        return (
                          <React.Fragment key={tx.id}>
                            {/* Main Row */}
                            <tr
                              onClick={() => setSelectedTxId(tx.id)}
                              className={`transition-colors duration-150 cursor-pointer ${
                                isSelected
                                  ? "bg-amber-50/70 ring-1 ring-[#C85A17]/30"
                                  : "hover:bg-[#FAF9F5]"
                              }`}
                            >
                              {/* Expand Toggle Button */}
                              <td
                                className={`py-3 px-3 text-center sticky left-0 z-10 ${
                                  isSelected ? "bg-amber-50/90" : "bg-white"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowExpansion(tx.id);
                                }}
                              >
                                <button
                                  type="button"
                                  className="text-neutral-500 hover:text-black font-bold p-1 cursor-pointer"
                                  title="Expand row details"
                                >
                                  {isExpanded ? "▼" : "▶"}
                                </button>
                              </td>

                              {/* Time */}
                              <td
                                className={`py-3 px-3 whitespace-nowrap font-medium text-[#141413] sticky left-8 z-10 ${
                                  isSelected ? "bg-amber-50/90" : "bg-white"
                                }`}
                              >
                                {tx.timeOnly}
                              </td>

                              {/* Ref No */}
                              <td className="py-3 px-3 font-bold text-[#141413] whitespace-nowrap">
                                {tx.referenceNo}
                              </td>

                              {/* Type */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                {renderMovementTypeBadge(tx.movementType)}
                              </td>

                              {/* Item */}
                              <td className="py-3 px-4 whitespace-nowrap">
                                <strong className="font-sans font-bold text-[#141413] block">
                                  {tx.item}
                                </strong>
                                <span className="text-[10px] text-[#8E8B81]">SKU: {tx.sku}</span>
                              </td>

                              {/* Warehouse */}
                              <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                                {tx.warehouse}
                              </td>

                              {/* Batch */}
                              <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                                <span className="font-bold text-[#141413] block">{tx.batch}</span>
                                <span className="text-[#8E8B81]">Exp: {tx.expiryDate}</span>
                              </td>

                              {/* Qty In */}
                              <td className="py-3 px-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                                {tx.qtyIn > 0 ? `+${tx.qtyIn.toLocaleString("id-ID")}` : "-"}
                              </td>

                              {/* Qty Out */}
                              <td className="py-3 px-3 text-right font-bold text-rose-700 whitespace-nowrap">
                                {tx.qtyOut > 0 ? `-${tx.qtyOut.toLocaleString("id-ID")}` : "-"}
                              </td>

                              {/* Balance */}
                              <td className="py-3 px-3 text-right font-extrabold text-[#141413] whitespace-nowrap">
                                {tx.balanceAfter.toLocaleString("id-ID")} {tx.unit}
                              </td>

                              {/* Performed By */}
                              <td className="py-3 px-3 whitespace-nowrap text-[11px]">
                                <strong className="text-[#141413] block">{tx.performedBy}</strong>
                                <span className="text-[#8E8B81]">{tx.operatorRole}</span>
                              </td>

                              {/* Status */}
                              <td className="py-3 px-3 whitespace-nowrap">
                                {renderStatusBadge(tx.status)}
                              </td>

                              {/* Action */}
                              <td
                                className="py-3 px-3 text-right whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => setSelectedTxId(tx.id)}
                                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                                >
                                  Audit 🔍
                                </button>
                              </td>
                            </tr>

                            {/* Inline Expandable Sub-Row */}
                            {isExpanded && (
                              <tr className="bg-neutral-50/90 border-b border-[#141413]/10">
                                <td colSpan={13} className="py-4 px-6 space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[#141413]/10 pb-4 text-xs">
                                    {/* Reason & Notes */}
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                                        Audit Reason &amp; Justification:
                                      </span>
                                      <p className="font-bold text-[#141413] leading-relaxed">
                                        {tx.reason}
                                      </p>
                                      {tx.notes && (
                                        <p className="text-[11px] text-[#626058] pt-1">
                                          Catatan: {tx.notes}
                                        </p>
                                      )}
                                    </div>

                                    {/* Related Documents & Production */}
                                    <div className="space-y-1.5">
                                      <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                                        Related PO &amp; Work Orders:
                                      </span>
                                      <div className="space-y-1">
                                        {tx.relatedPo && (
                                          <p className="text-[11px] text-[#141413]">
                                            Purchase Order:{" "}
                                            <strong className="underline">{tx.relatedPo}</strong>
                                          </p>
                                        )}
                                        {tx.relatedProduction && (
                                          <p className="text-[11px] text-[#141413]">
                                            Work Order / SPK:{" "}
                                            <strong className="underline text-blue-700">
                                              {tx.relatedProduction}
                                            </strong>
                                          </p>
                                        )}
                                        {tx.supplier && (
                                          <p className="text-[11px] text-[#626058]">
                                            Supplier: {tx.supplier}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Digital Approval Sign-Off */}
                                    <div className="space-y-1">
                                      <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                                        Approval Sign-Off:
                                      </span>
                                      <p className="text-[11px] text-[#141413]">
                                        Otorisator: <strong>{tx.approvedBy}</strong>
                                      </p>
                                      <p className="text-[10px] text-[#8E8B81]">
                                        Terminal: {tx.device} ({tx.ipAddress})
                                      </p>
                                      <span className="inline-block mt-1 text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs font-mono">
                                        Digital Signature Validated
                                      </span>
                                    </div>
                                  </div>

                                  {/* Documents & Photos Attached */}
                                  <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-[#8E8B81] uppercase font-bold">
                                        Dokumen Bukti:
                                      </span>
                                      {tx.documents.length === 0 ? (
                                        <span className="text-[#8E8B81] text-[11px] italic">
                                          Tidak ada dokumen
                                        </span>
                                      ) : (
                                        tx.documents.map((doc) => (
                                          <button
                                            key={doc.id}
                                            type="button"
                                            onClick={() =>
                                              showToast(`Membuka dokumen elektronik ${doc.name}`)
                                            }
                                            className="px-2 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xs text-[10px] font-bold text-[#141413] flex items-center gap-1 cursor-pointer"
                                          >
                                            📄 {doc.name} ({doc.size})
                                          </button>
                                        ))
                                      )}
                                    </div>

                                    {tx.photos.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-[#8E8B81] uppercase font-bold">
                                          Foto Inspeksi:
                                        </span>
                                        {tx.photos.map((ph) => (
                                          <span
                                            key={ph.id}
                                            className="px-2 py-0.5 bg-white border border-slate-200 rounded-[4px] text-[10px] flex items-center gap-1.5 text-slate-700 font-medium"
                                          >
                                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{ph.label}</span>
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ========================================================
               TIMELINE VIEW
               08:10 Receiving +250 kg ↓ 09:30 Production -120 kg ↓ ...
               ======================================================== */
            <div className="bg-white border border-[#141413]/10 p-6 space-y-6 shadow-2xs">
              <div className="border-b border-[#141413]/10 pb-3 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                    CHRONOLOGICAL AUDIT LOG
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#141413]">
                    Sequential Stock Flow Timeline
                  </h3>
                </div>
                <span className="text-xs text-[#8E8B81]">Urutan Mutasi Fisik &amp; Buku Besar</span>
              </div>

              <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#141413]/15">
                {filteredTransactions.map((tx) => {
                  const isSelected = selectedTxId === tx.id;

                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTxId(tx.id)}
                      className={`relative p-4 rounded-xs border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-50/80 border-[#C85A17] shadow-xs"
                          : "bg-[#FAF9F5] border-[#141413]/10 hover:border-[#141413]/30"
                      }`}
                    >
                      {/* Timeline Node Dot */}
                      <div
                        className={`absolute -left-[30px] top-4 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                          tx.qtyIn > 0
                            ? "bg-emerald-600"
                            : tx.movementType === "Transfer"
                            ? "bg-purple-600"
                            : "bg-blue-600"
                        }`}
                      ></div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#141413]/10 pb-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-extrabold text-sm text-[#141413]">
                            {tx.timeOnly}
                          </span>
                          <span className="text-[#8E8B81]">•</span>
                          {renderMovementTypeBadge(tx.movementType)}
                          <span className="text-[11px] font-bold text-[#141413]">
                            {tx.referenceNo}
                          </span>
                        </div>

                        {/* Qty Impact */}
                        <div className="font-mono text-sm font-extrabold">
                          {tx.qtyIn > 0 && (
                            <span className="text-emerald-700">
                              +{tx.qtyIn.toLocaleString("id-ID")} {tx.unit}
                            </span>
                          )}
                          {tx.qtyOut > 0 && (
                            <span className="text-rose-700">
                              -{tx.qtyOut.toLocaleString("id-ID")} {tx.unit}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <strong className="font-sans text-xs text-[#141413] block">
                            {tx.item}
                          </strong>
                          <span className="text-[10px] text-[#8E8B81]">
                            SKU: {tx.sku} | Batch: {tx.batch}
                          </span>
                        </div>

                        <div className="text-right sm:text-right text-[11px]">
                          <span className="text-[#626058] block">
                            Lokasi: {tx.warehouse}
                          </span>
                          <span className="font-bold text-[#141413]">
                            Saldo Akhir: {tx.balanceAfter.toLocaleString("id-ID")} {tx.unit}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#626058] mt-2 pt-2 border-t border-[#141413]/5">
                        {tx.reason} — <span className="text-[#8E8B81]">Oleh: {tx.performedBy} ({tx.operatorRole})</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            RIGHT COLUMN: RIGHT INSPECTOR PANEL (SELECTED TRANSACTION)
            Display: Transaction Detail, Previous Stock, Current Stock,
            Difference, Linked Documents, Linked Batch, Created By,
            Approved By, Timestamp, Audit Features (IP, Device, Revision)
            ============================================================ */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#141413]/10 p-6 space-y-5 shadow-2xs sticky top-8">
            <div className="border-b border-[#141413]/10 pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  AUDITOR INSPECTOR PANEL
                </span>
                <h3 className="font-display font-extrabold text-lg text-[#141413]">
                  {selectedTx.referenceNo}
                </h3>
              </div>
              <div>{renderStatusBadge(selectedTx.status)}</div>
            </div>

            {/* Previous Stock vs Current Stock vs Difference */}
            <div className="p-4 bg-[#FAF9F5] border border-[#141413]/10 space-y-3">
              <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                Stock Reconciliation Impact
              </span>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white border border-neutral-200">
                  <span className="text-[9px] uppercase text-[#8E8B81] block">Previous</span>
                  <strong className="text-xs text-[#141413] block mt-0.5">
                    {selectedTx.balanceBefore.toLocaleString("id-ID")}
                  </strong>
                  <span className="text-[9px] text-[#8E8B81]">{selectedTx.unit}</span>
                </div>

                <div className="p-2 bg-white border border-neutral-200">
                  <span className="text-[9px] uppercase text-[#8E8B81] block">Difference</span>
                  <strong
                    className={`text-xs block mt-0.5 font-extrabold ${
                      selectedTx.qtyIn > 0
                        ? "text-emerald-700"
                        : selectedTx.qtyOut > 0
                        ? "text-rose-700"
                        : "text-[#141413]"
                    }`}
                  >
                    {selectedTx.qtyIn > 0
                      ? `+${selectedTx.qtyIn}`
                      : selectedTx.qtyOut > 0
                      ? `-${selectedTx.qtyOut}`
                      : "0"}
                  </strong>
                  <span className="text-[9px] text-[#8E8B81]">{selectedTx.unit}</span>
                </div>

                <div className="p-2 bg-white border border-neutral-200 ring-1 ring-amber-500/20">
                  <span className="text-[9px] uppercase text-amber-800 font-bold block">Balance</span>
                  <strong className="text-xs text-[#141413] font-extrabold block mt-0.5">
                    {selectedTx.balanceAfter.toLocaleString("id-ID")}
                  </strong>
                  <span className="text-[9px] text-[#8E8B81]">{selectedTx.unit}</span>
                </div>
              </div>
            </div>

            {/* Transaction Detail Attributes */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                Item &amp; Location Passport
              </span>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Item Name:</span>
                  <strong className="text-[#141413] font-sans text-right max-w-[180px] truncate">
                    {selectedTx.item}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">SKU:</span>
                  <span className="font-bold text-[#141413]">{selectedTx.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Category:</span>
                  <span className="text-[#626058]">{selectedTx.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Gudang:</span>
                  <span className="text-[#141413] font-medium">{selectedTx.warehouse}</span>
                </div>
                {selectedTx.sourceLocation && (
                  <div className="flex justify-between">
                    <span className="text-[#8E8B81]">Asal / Sumber:</span>
                    <span className="text-[#626058] text-right truncate max-w-[180px]">
                      {selectedTx.sourceLocation}
                    </span>
                  </div>
                )}
                {selectedTx.targetLocation && (
                  <div className="flex justify-between">
                    <span className="text-[#8E8B81]">Tujuan / Rak:</span>
                    <span className="text-[#626058] text-right truncate max-w-[180px]">
                      {selectedTx.targetLocation}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Linked Batch & Dates */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                Linked Batch Traceability
              </span>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Batch Number:</span>
                  <strong className="text-[#141413]">{selectedTx.batch}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Expiry Date:</span>
                  <span className="font-bold text-amber-800">{selectedTx.expiryDate}</span>
                </div>
                {selectedTx.supplier && (
                  <div className="flex justify-between">
                    <span className="text-[#8E8B81]">Supplier:</span>
                    <span className="text-[#141413] font-medium truncate max-w-[180px]">
                      {selectedTx.supplier}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Signatures & Hardware Telemetry */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                Sign-off &amp; Device Telemetry
              </span>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Created By:</span>
                  <span className="font-bold text-[#141413]">{selectedTx.performedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Approved By:</span>
                  <span className="font-bold text-emerald-800">{selectedTx.approvedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Timestamp:</span>
                  <span className="text-[#141413]">{selectedTx.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">IP Address:</span>
                  <span className="text-[#626058]">{selectedTx.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Terminal/Device:</span>
                  <span className="text-[#626058] truncate max-w-[170px]">{selectedTx.device}</span>
                </div>
              </div>
            </div>

            {/* Revision History Log */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                Immutable Revision History
              </span>

              <div className="space-y-2">
                {selectedTx.revisionHistory.map((rev) => (
                  <div
                    key={rev.version}
                    className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xs space-y-0.5 text-[11px]"
                  >
                    <div className="flex justify-between font-bold text-[#141413]">
                      <span>Revision v{rev.version}</span>
                      <span className="text-[10px] text-[#8E8B81] font-normal">{rev.updatedAt}</span>
                    </div>
                    <p className="text-[10px] text-[#626058]">{rev.changeNote}</p>
                    <span className="text-[9px] text-[#8E8B81] block">Author: {rev.updatedBy}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions for this Transaction */}
            <div className="pt-2 border-t border-[#141413]/10 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  showToast(`Voucher transaksi ${selectedTx.referenceNo} dicetak ulang.`)
                }
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-bold rounded-xs cursor-pointer text-center"
              >
                Cetak Voucher 🖨️
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast(`Log forensik audit ${selectedTx.referenceNo} diexport ke CSV.`)
                }
                className="w-full py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer text-center"
              >
                Ekspor Audit 📊
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          MODAL SIMULATION FOR EXPORT (EXCEL / PDF / CSV)
          ============================================================== */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  AUDIT DATA EXTRACTION
                </span>
                <strong className="font-display font-extrabold text-lg text-[#141413]">
                  Export Stock Ledger ({isExportModalOpen})
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(null)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#626058] leading-relaxed">
              Anda akan mengunduh rekaman buku besar mutasi stok persediaan untuk keperluan audit
              keuangan &amp; logistik:
            </p>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Total Records:</span>
                <strong className="text-[#141413]">{filteredTransactions.length} Transaksi</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Format:</span>
                <strong className="text-[#141413]">
                  {isExportModalOpen === "Excel"
                    ? "Microsoft Excel (.xlsx) / CSV UTF-8"
                    : isExportModalOpen === "PDF"
                    ? "Official Formal Ledger PDF"
                    : "Comma-Separated Values (.csv)"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Date Range:</span>
                <span className="text-[#141413] font-medium">{dateRangeFilter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Hash Checksum:</span>
                <span className="text-[#8E8B81] font-mono text-[9px]">SHA256: 4a8b...19e0</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => confirmDownloadExport(isExportModalOpen)}
                className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer shadow-xs"
              >
                Unduh {isExportModalOpen} File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
