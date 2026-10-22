"use client";

import React, { useState, useMemo } from "react";

// --- TYPES & INTERFACES ---
export type OpnameStatus = "Scheduled" | "Counting" | "Review" | "Approved" | "Closed";

export interface OpnameCountItem {
  id: string;
  name: string;
  sku: string;
  systemQty: number;
  physicalQty: number;
  unit: string;
  unitPrice: number; // For estimated value calculation in IDR
  batch: string;
  location: string;
  remark: string;
  reason?: string;
  approvalStatus?: "Pending" | "Investigating" | "Approved" | "Recount Requested";
}

export interface OpnameEvidencePhoto {
  id: string;
  type: "Shelf photo" | "Product photo" | "Barcode photo";
  label: string;
  timestamp: string;
  emoji: string;
  notes: string;
}

export interface OpnameApprovalStep {
  role: "Warehouse Supervisor" | "Inventory Controller" | "Finance" | "Management Approval";
  name: string;
  status: "Approved" | "Pending" | "Waiting";
  timestamp?: string;
  notes?: string;
}

export interface OpnameSession {
  id: string;
  sessionNumber: string;
  warehouse: string;
  countDate: string;
  assignedTeam: string;
  leadAuditor: string;
  status: OpnameStatus;
  timelineStep: number; // 1: Created, 2: Counting, 3: Variance Found, 4: Approved, 5: Updated
  items: OpnameCountItem[];
  approvals: OpnameApprovalStep[];
  evidence: OpnameEvidencePhoto[];
  generalNotes: string;
}

// --- MOCK INDUSTRIAL OPNAME SESSIONS DATA ---
const INITIAL_SESSIONS: OpnameSession[] = [
  {
    id: "so-01",
    sessionNumber: "SO-2026-1021-01",
    warehouse: "Cold Storage (Chiller Wing 1)",
    countDate: "21 Okt 2026",
    assignedTeam: "Tim QC Daging & Inventory Control",
    leadAuditor: "QC Hendra Wibowo",
    status: "Review",
    timelineStep: 3,
    generalNotes:
      "Stock opname rutin siklus 2 mingguan komoditas protein beku dan chilled. Ditemukan selisih susut minor pada ayam fillet paha akibat drip loss thawing.",
    items: [
      {
        id: "item-op-1",
        name: "Chicken Breast Fillet Paha (Grade A)",
        sku: "RM-00021",
        systemQty: 1315.5,
        physicalQty: 1311.0,
        unit: "kg",
        unitPrice: 42000,
        batch: "B-PLT-2026-8821",
        location: "Chiller Wing 1 • Rack A-04",
        remark: "Susut drip loss 4.5 kg setelah marinasi",
        reason: "Susut kelembaban alami (Drip loss defrost 0.34%)",
        approvalStatus: "Approved",
      },
      {
        id: "item-op-2",
        name: "Sayap Ayam Utuh (Mid-Joint Wing)",
        sku: "RM-00024",
        systemQty: 450.0,
        physicalQty: 450.0,
        unit: "kg",
        unitPrice: 38000,
        batch: "B-PLT-2026-8822",
        location: "Chiller Wing 1 • Rack A-06",
        remark: "Fisik klop 100% dengan timbangan pallet",
        reason: "",
        approvalStatus: "Approved",
      },
      {
        id: "item-op-3",
        name: "Daging Sapi Gandik Rendang (Topside Block)",
        sku: "RM-00030",
        systemQty: 320.0,
        physicalQty: 318.5,
        unit: "kg",
        unitPrice: 118000,
        batch: "B-BEEF-2026-09",
        location: "Freezer Wing 2 • Rack F-01",
        remark: "Selisih 1.5 kg pembersihan lapisan lemak luar",
        reason: "Trimming lemak sebelum porsi masak catering VIP",
        approvalStatus: "Pending",
      },
      {
        id: "item-op-4",
        name: "Ikan Dory Fillet Glazing 20%",
        sku: "RM-00035",
        systemQty: 600.0,
        physicalQty: 600.0,
        unit: "kg",
        unitPrice: 35000,
        batch: "B-DRY-2026-44",
        location: "Freezer Wing 2 • Rack F-03",
        remark: "Kondisi master karton utuh 60 box @ 10kg",
        reason: "",
        approvalStatus: "Approved",
      },
    ],
    approvals: [
      {
        role: "Warehouse Supervisor",
        name: "Agus Pratama",
        status: "Approved",
        timestamp: "21 Okt 2026, 14:30 WIB",
        notes: "Timbang fisik disaksikan bersama QC Lead. Selisih dalam batas toleransi.",
      },
      {
        role: "Inventory Controller",
        name: "Tatang Sutisna",
        status: "Approved",
        timestamp: "21 Okt 2026, 15:10 WIB",
        notes: "Kesesuaian kartu stok fisik dan modul EWM terverifikasi.",
      },
      {
        role: "Finance",
        name: "Ibu Anita (Cost Accounting)",
        status: "Approved",
        timestamp: "21 Okt 2026, 16:00 WIB",
        notes: "Selisih nilai Rp 366.000 dialokasikan ke COGS Shrinkage Account.",
      },
      {
        role: "Management Approval",
        name: "Pak Handoko (GM Operations)",
        status: "Pending",
        notes: "Menunggu tanda tangan digital akhir untuk posting mutasi buku besar.",
      },
    ],
    evidence: [
      {
        id: "ev-1",
        type: "Shelf photo",
        label: "Rak Chiller A-04",
        timestamp: "21 Okt 13:45 WIB",
        emoji: "🧊",
        notes: "Tata letak pallet ayam fillet berlabel batch",
      },
      {
        id: "ev-2",
        type: "Product photo",
        label: "Sampel Timbang Daging",
        timestamp: "21 Okt 14:02 WIB",
        emoji: "⚖️",
        notes: "Penimbangan digital Toledo kalibrasi 0.05kg",
      },
      {
        id: "ev-3",
        type: "Barcode photo",
        label: "Scan Barcode EAN Karton",
        timestamp: "21 Okt 14:15 WIB",
        emoji: "🏷️",
        notes: "Barcode batch B-PLT-2026-8821 lolos verifikasi RFID",
      },
    ],
  },
  {
    id: "so-02",
    sessionNumber: "SO-2026-1021-02",
    warehouse: "Packaging Warehouse (Gudang Kemasan)",
    countDate: "21 Okt 2026",
    assignedTeam: "Tim Gudang Kemasan",
    leadAuditor: "Rian Hidayat",
    status: "Counting",
    timelineStep: 2,
    generalNotes:
      "Perhitungan fisik material kemasan catering (lunch box, bento box, sendok garpu higienis).",
    items: [
      {
        id: "item-op-5",
        name: "Bento Box 5-Compartment Meal Tray (Dus 500 Pcs)",
        sku: "PKG-00002",
        systemQty: 4950.0,
        physicalQty: 5000.0,
        unit: "Pcs",
        unitPrice: 1200,
        batch: "B-BOX-2026-04",
        location: "Packaging • Baris B-01",
        remark: "Ditemukan 1 pack isi 50 pcs belum terinput",
        reason: "Kelebihan fisik +50 pcs dari packing shift malam",
        approvalStatus: "Approved",
      },
      {
        id: "item-op-6",
        name: "Sendok & Garpu Plastik Steril Pack",
        sku: "PKG-00015",
        systemQty: 12000.0,
        physicalQty: 12000.0,
        unit: "Set",
        unitPrice: 350,
        batch: "B-CUT-2026-11",
        location: "Packaging • Baris B-04",
        remark: "Stok klop 24 karton @ 500 set",
        reason: "",
        approvalStatus: "Approved",
      },
    ],
    approvals: [
      { role: "Warehouse Supervisor", name: "Agus Pratama", status: "Approved", timestamp: "21 Okt 16:00 WIB" },
      { role: "Inventory Controller", name: "Tatang Sutisna", status: "Pending" },
      { role: "Finance", name: "Ibu Anita", status: "Waiting" },
      { role: "Management Approval", name: "Pak Handoko", status: "Waiting" },
    ],
    evidence: [
      {
        id: "ev-4",
        type: "Shelf photo",
        label: "Pallet Bento Box",
        timestamp: "21 Okt 15:20 WIB",
        emoji: "🍱",
        notes: "Susunan karton kemasan bento 10 tier",
      },
    ],
  },
  {
    id: "so-03",
    sessionNumber: "SO-2026-1020-09",
    warehouse: "Main Warehouse (Gudang Utama)",
    countDate: "20 Okt 2026",
    assignedTeam: "Tim Audit Internal & Warehouse SPV",
    leadAuditor: "Handoko & Agus",
    status: "Approved",
    timelineStep: 4,
    generalNotes: "Selesai dihitung dan disetujui penuh oleh manajemen. Menunggu posting jurnal otomatis.",
    items: [
      {
        id: "item-op-7",
        name: "Beras Ramos Premium IR-64 (Zak 50kg)",
        sku: "RM-00012",
        systemQty: 4000.0,
        physicalQty: 4000.0,
        unit: "kg",
        unitPrice: 14500,
        batch: "B-GRN-2026-1092",
        location: "Main Warehouse • Bay G-01",
        remark: "80 zak utuh pada 4 pallet",
        reason: "",
        approvalStatus: "Approved",
      },
    ],
    approvals: [
      { role: "Warehouse Supervisor", name: "Agus Pratama", status: "Approved", timestamp: "20 Okt 16:30 WIB" },
      { role: "Inventory Controller", name: "Tatang Sutisna", status: "Approved", timestamp: "20 Okt 17:00 WIB" },
      { role: "Finance", name: "Ibu Anita", status: "Approved", timestamp: "20 Okt 17:30 WIB" },
      { role: "Management Approval", name: "Pak Handoko", status: "Approved", timestamp: "20 Okt 18:00 WIB" },
    ],
    evidence: [],
  },
  {
    id: "so-04",
    sessionNumber: "SO-2026-1022-01",
    warehouse: "Dry Storage (Gudang Bumbu & Kering)",
    countDate: "22 Okt 2026",
    assignedTeam: "Tim Bumbu Kering & SPV Yusuf",
    leadAuditor: "Yusuf Supriatna",
    status: "Scheduled",
    timelineStep: 1,
    generalNotes: "Jadwal opname komoditas rempah, saus, bumbu kering, dan minyak goreng besok pagi.",
    items: [
      {
        id: "item-op-8",
        name: "Minyak Goreng Sawit Jerigen 20L",
        sku: "RM-00004",
        systemQty: 1200.0,
        physicalQty: 1200.0,
        unit: "Liter",
        unitPrice: 16500,
        batch: "B-OIL-2026-449",
        location: "Main Warehouse • Bay M-02",
        remark: "Target verifikasi 60 jerigen",
      },
    ],
    approvals: [
      { role: "Warehouse Supervisor", name: "Agus Pratama", status: "Waiting" },
      { role: "Inventory Controller", name: "Tatang Sutisna", status: "Waiting" },
      { role: "Finance", name: "Ibu Anita", status: "Waiting" },
      { role: "Management Approval", name: "Pak Handoko", status: "Waiting" },
    ],
    evidence: [],
  },
];

export default function StockOpnameClient() {
  // --- STATE ---
  const [sessions, setSessions] = useState<OpnameSession[]>(INITIAL_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("so-01");

  // Modals & Feedback
  const [isNewCountModalOpen, setIsNewCountModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<OpnameEvidencePhoto | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected Active Session
  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  // Inline Physical Qty Handler with Instant Difference & Variance Calculation
  const handlePhysicalQtyChange = (itemId: string, newQty: number) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSession.id) return s;
        return {
          ...s,
          items: s.items.map((it) => {
            if (it.id !== itemId) return it;
            return {
              ...it,
              physicalQty: isNaN(newQty) ? 0 : newQty,
            };
          }),
        };
      })
    );
  };

  // Inline Remark Handler
  const handleRemarkChange = (itemId: string, newRemark: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSession.id) return s;
        return {
          ...s,
          items: s.items.map((it) => {
            if (it.id !== itemId) return it;
            return { ...it, remark: newRemark };
          }),
        };
      })
    );
  };

  // Calculate Difference and Variance %
  const getItemMetrics = (item: OpnameCountItem) => {
    const diff = item.physicalQty - item.systemQty;
    const variancePct = item.systemQty !== 0 ? (diff / item.systemQty) * 100 : 0;
    const absVariancePct = Math.abs(variancePct);
    const estimatedValue = diff * item.unitPrice;

    let highlightCategory: "green" | "yellow" | "red" = "green";
    if (diff === 0) {
      highlightCategory = "green"; // No Difference
    } else if (absVariancePct <= 2.0) {
      highlightCategory = "yellow"; // Minor Difference
    } else {
      highlightCategory = "red"; // Major Difference
    }

    return { diff, variancePct, absVariancePct, estimatedValue, highlightCategory };
  };

  // Filter items with variance for Section 04 (Variance Review)
  const varianceItems = useMemo(() => {
    return currentSession.items
      .map((it) => ({ item: it, metrics: getItemMetrics(it) }))
      .filter((res) => res.metrics.diff !== 0);
  }, [currentSession.items]);

  // Opname Summary KPIs
  const summaryKPIs = useMemo(() => {
    let scheduled = 0;
    let inProgress = 0;
    let completed = 0;
    let totalItems = 0;
    let matchedItems = 0;
    let varianceCount = 0;

    sessions.forEach((s) => {
      if (s.status === "Scheduled") scheduled += 1;
      if (s.status === "Counting" || s.status === "Review") inProgress += 1;
      if (s.status === "Approved" || s.status === "Closed") completed += 1;

      s.items.forEach((it) => {
        totalItems += 1;
        if (it.physicalQty === it.systemQty) {
          matchedItems += 1;
        } else {
          varianceCount += 1;
        }
      });
    });

    const accuracy = totalItems > 0 ? ((matchedItems / totalItems) * 100).toFixed(1) : "100.0";

    return {
      scheduled,
      inProgress,
      completed,
      varianceCount,
      accuracy,
    };
  }, [sessions]);

  // Status Badge Renderer
  const renderStatusBadge = (status: OpnameStatus) => {
    switch (status) {
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
            Scheduled
          </span>
        );
      case "Counting":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Counting
          </span>
        );
      case "Review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Review
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Approved
          </span>
        );
      case "Closed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 border border-neutral-300">
            Closed
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
          Stock Opname
          Subtitle: Perform physical inventory verification and reconcile stock differences.
          Top Right: New Stock Count, Import Count Sheet, Export Report
          ============================================================== */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#141413]/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
              PT. ZAHDAN KAMAL SENTOSA
            </span>
            <span className="text-[#8E8B81] text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#141413] font-semibold block">
              PHYSICAL INVENTORY AUDIT &amp; RECONCILIATION
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              ISO 22000 &amp; HACCP Audit Ready
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Stock Opname
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Perform physical inventory verification and reconcile stock differences.
          </p>
        </div>

        {/* Top Right Action Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* New Stock Count */}
          <button
            type="button"
            onClick={() => setIsNewCountModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Stock Count</span>
          </button>

          {/* Import Count Sheet */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#141413]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import Count Sheet</span>
          </button>

          {/* Export Report */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#141413]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </header>

      {/* ==============================================================
          SECTION 01: OPNAME SUMMARY CARDS (5 Cards)
          - Scheduled Counts
          - In Progress
          - Completed
          - Variance Items
          - Inventory Accuracy
          ============================================================== */}
      <section aria-labelledby="opname-kpi-heading">
        <h2 id="opname-kpi-heading" className="sr-only">
          Opname Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Scheduled Counts */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Scheduled Counts
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              {summaryKPIs.scheduled}{" "}
              <span className="text-xs font-normal text-[#626058]">Sesi</span>
            </p>
            <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
              Jadwal verifikasi fisik aktif
            </span>
          </div>

          {/* 2. In Progress */}
          <div className="p-4 bg-white border border-blue-200/80 space-y-1 shadow-2xs ring-1 ring-blue-500/10">
            <span className="text-[10px] uppercase text-blue-700 font-bold block">
              In Progress
            </span>
            <p className="font-display font-extrabold text-2xl text-blue-700">
              {summaryKPIs.inProgress}{" "}
              <span className="text-xs font-normal text-[#626058]">Sesi Audit</span>
            </p>
            <span className="text-[10px] text-blue-800 block pt-1 border-t border-blue-100">
              Proses hitung &amp; review timbang
            </span>
          </div>

          {/* 3. Completed */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Completed
            </span>
            <p className="font-display font-extrabold text-2xl text-emerald-700">
              {summaryKPIs.completed}{" "}
              <span className="text-xs font-normal text-[#626058]">Siklus</span>
            </p>
            <span className="text-[10px] text-emerald-800 block pt-1 border-t border-black/5">
              BAPO disahkan manajemen
            </span>
          </div>

          {/* 4. Variance Items */}
          <div className="p-4 bg-white border border-amber-200/80 space-y-1 shadow-2xs ring-1 ring-amber-500/10">
            <span className="text-[10px] uppercase text-amber-700 font-bold block">
              Variance Items
            </span>
            <p className="font-display font-extrabold text-2xl text-amber-700">
              {summaryKPIs.varianceCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Item Selisih</span>
            </p>
            <span className="text-[10px] text-amber-800 block pt-1 border-t border-amber-100">
              Perlu justifikasi audit &amp; approval
            </span>
          </div>

          {/* 5. Inventory Accuracy */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Inventory Accuracy
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              {summaryKPIs.accuracy}%
            </p>
            <span className="text-[10px] text-emerald-700 block pt-1 border-t border-black/5">
              Target akurasi &gt; 98.5% tercapai
            </span>
          </div>
        </div>
      </section>

      {/* ==============================================================
          RESPONSIVE SPLIT WORKBENCH
          Desktop: Split layout (Left: Sessions, Worksheet, Variance Review;
                                 Right: Approval Workflow, Evidence, History, Actions)
          Tablet: Single Column
          Mobile: Card layout
          ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================
            LEFT WORKBENCH (lg:col-span-8 or 7)
            ============================================================ */}
        <div className="lg:col-span-8 space-y-8">
          {/* ==========================================================
              SECTION 02: OPNAME SESSIONS (Modern Table)
              Columns: Session Number, Warehouse, Count Date, Assigned Team,
                       Items Counted, Variance, Status, Actions
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  PHYSICAL CYCLE COUNT AUDIT SESSIONS
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Opname Sessions
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">
                Pilih sesi untuk membuka lembar kerja opname &amp; lembar selisih
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-[#141413]/10 text-[10px] font-mono uppercase tracking-wider text-[#626058]">
                    <th className="py-2.5 px-3">Session Number</th>
                    <th className="py-2.5 px-3 font-semibold">Warehouse</th>
                    <th className="py-2.5 px-3">Count Date</th>
                    <th className="py-2.5 px-3">Assigned Team</th>
                    <th className="py-2.5 px-3 text-center">Items Counted</th>
                    <th className="py-2.5 px-3">Variance</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5 text-xs font-mono">
                  {sessions.map((sess) => {
                    const isSelected = selectedSessionId === sess.id;
                    const varianceCount = sess.items.filter(
                      (it) => it.physicalQty !== it.systemQty
                    ).length;

                    return (
                      <tr
                        key={sess.id}
                        onClick={() => setSelectedSessionId(sess.id)}
                        className={`transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/70 ring-1 ring-[#C85A17]/30"
                            : "hover:bg-[#FAF9F5]"
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-[#141413] whitespace-nowrap">
                          {sess.sessionNumber}
                        </td>
                        <td className="py-3 px-3 text-[#141413] whitespace-nowrap font-medium">
                          {sess.warehouse}
                        </td>
                        <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                          {sess.countDate}
                        </td>
                        <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                          <span className="text-[#141413] font-medium block">
                            {sess.assignedTeam}
                          </span>
                          <span className="text-[10px] text-[#8E8B81]">
                            Lead: {sess.leadAuditor}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-[#141413] whitespace-nowrap">
                          {sess.items.length} Item
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {varianceCount === 0 ? (
                            <span className="text-emerald-700 font-bold">Klop (0)</span>
                          ) : (
                            <span className="text-amber-700 font-bold">
                              {varianceCount} Item Selisih
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {renderStatusBadge(sess.status)}
                        </td>
                        <td
                          className="py-3 px-3 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedSessionId(sess.id)}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                          >
                            {isSelected ? "Active" : "Buka Sesi →"}
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
              SECTION 03: COUNT WORKSHEET (Modern Editable Table)
              Columns: Item, SKU, System Qty, Physical Qty, Difference,
                       Variance %, Unit, Batch, Location, Remark
              Automatically Calculate Difference & Variance %
              Highlight: Green (No Diff), Yellow (Minor), Red (Major)
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  PHYSICAL INVENTORY TALLY SHEET — {currentSession.sessionNumber}
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Count Worksheet
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Klop (0%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Minor (≤ 2%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Major (&gt; 2%)</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[10px] text-[#8E8B81] uppercase tracking-wider bg-neutral-50/70">
                    <th className="py-2.5 px-3">Item / SKU</th>
                    <th className="py-2.5 px-2 text-right">System Qty</th>
                    <th className="py-2.5 px-3 text-right">Physical Qty</th>
                    <th className="py-2.5 px-2 text-right">Difference</th>
                    <th className="py-2.5 px-2 text-center">Variance %</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-3">Batch &amp; Location</th>
                    <th className="py-2.5 px-3">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5">
                  {currentSession.items.map((item) => {
                    const metrics = getItemMetrics(item);

                    // Row highlight background
                    const rowBgClass =
                      metrics.highlightCategory === "green"
                        ? "bg-white hover:bg-neutral-50/70"
                        : metrics.highlightCategory === "yellow"
                        ? "bg-amber-50/40 hover:bg-amber-50/60"
                        : "bg-rose-50/40 hover:bg-rose-50/60";

                    return (
                      <tr key={item.id} className={`transition-colors ${rowBgClass}`}>
                        {/* Item & SKU */}
                        <td className="py-3 px-3">
                          <strong className="font-sans font-bold text-[#141413] block">
                            {item.name}
                          </strong>
                          <span className="text-[10px] text-[#8E8B81]">SKU: {item.sku}</span>
                        </td>

                        {/* System Qty */}
                        <td className="py-3 px-2 text-right font-bold text-[#141413]">
                          {item.systemQty.toLocaleString("id-ID")}
                        </td>

                        {/* Editable Physical Qty */}
                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            step="0.5"
                            value={item.physicalQty}
                            onChange={(e) =>
                              handlePhysicalQtyChange(item.id, parseFloat(e.target.value))
                            }
                            className="w-24 p-1.5 text-right bg-white border border-neutral-300 font-bold text-[#141413] rounded-xs focus:border-[#141413] outline-hidden shadow-2xs font-mono"
                          />
                        </td>

                        {/* Difference */}
                        <td className="py-3 px-2 text-right font-bold whitespace-nowrap">
                          {metrics.diff === 0 ? (
                            <span className="text-emerald-700">0</span>
                          ) : metrics.diff > 0 ? (
                            <span className="text-blue-700">+{metrics.diff.toFixed(1)}</span>
                          ) : (
                            <span className="text-rose-700">{metrics.diff.toFixed(1)}</span>
                          )}
                        </td>

                        {/* Variance % Highlight Badge */}
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              metrics.highlightCategory === "green"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : metrics.highlightCategory === "yellow"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-rose-100 text-rose-900 border border-rose-300 animate-pulse"
                            }`}
                          >
                            {metrics.variancePct === 0
                              ? "0.0%"
                              : `${metrics.variancePct > 0 ? "+" : ""}${metrics.variancePct.toFixed(
                                  2
                                )}%`}
                          </span>
                        </td>

                        {/* Unit */}
                        <td className="py-3 px-2 text-center text-[#626058]">{item.unit}</td>

                        {/* Batch & Location */}
                        <td className="py-3 px-3 text-[11px]">
                          <span className="font-bold text-[#141413] block">{item.batch}</span>
                          <span className="text-[#8E8B81]">{item.location}</span>
                        </td>

                        {/* Remark */}
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={item.remark}
                            onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                            placeholder="Catatan fisik..."
                            className="w-full p-1 bg-white border border-neutral-300 rounded-xs text-[11px] text-[#141413] focus:border-[#141413] outline-hidden font-mono"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================================================
              SECTION 04: VARIANCE REVIEW (Items with Differences Only)
              List only items with differences.
              Show: Expected Qty, Actual Qty, Difference, Estimated Value,
                    Reason, Approval Status
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-rose-700 font-semibold block">
                  VARIANCE INVESTIGATION REGISTER
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Variance Review ({varianceItems.length} Item Memerlukan Rekonsiliasi)
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">
                Hanya menampilkan item dengan selisih fisik vs saldo buku
              </span>
            </div>

            {varianceItems.length === 0 ? (
              <div className="py-12 text-center space-y-2 bg-[#FAF9F5] border border-dashed border-[#141413]/15 rounded-xs">
                <span className="text-3xl block">✓</span>
                <strong className="text-sm text-emerald-800 block">
                  Tidak Ada Selisih Persediaan
                </strong>
                <p className="text-xs text-[#626058] max-w-md mx-auto">
                  Seluruh kuantitas fisik pada sesi ini cocok 100% dengan saldo buku besar persediaan
                  sistem (0 Variance).
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-rose-50/60 border-b border-rose-200 text-[10px] uppercase tracking-wider text-rose-900">
                      <th className="py-2.5 px-3">Item &amp; SKU</th>
                      <th className="py-2.5 px-2 text-right">Expected (System)</th>
                      <th className="py-2.5 px-2 text-right">Actual (Physical)</th>
                      <th className="py-2.5 px-2 text-right">Difference</th>
                      <th className="py-2.5 px-3 text-right">Estimated Value</th>
                      <th className="py-2.5 px-3">Root Cause Reason</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141413]/5">
                    {varianceItems.map(({ item, metrics }) => (
                      <tr key={item.id} className="hover:bg-neutral-50/70">
                        {/* Item */}
                        <td className="py-3 px-3">
                          <strong className="font-sans font-bold text-[#141413] block">
                            {item.name}
                          </strong>
                          <span className="text-[10px] text-[#8E8B81]">
                            SKU: {item.sku} | Batch: {item.batch}
                          </span>
                        </td>

                        {/* Expected */}
                        <td className="py-3 px-2 text-right font-medium text-[#141413]">
                          {item.systemQty.toLocaleString("id-ID")} {item.unit}
                        </td>

                        {/* Actual */}
                        <td className="py-3 px-2 text-right font-bold text-[#141413]">
                          {item.physicalQty.toLocaleString("id-ID")} {item.unit}
                        </td>

                        {/* Difference */}
                        <td className="py-3 px-2 text-right font-extrabold">
                          {metrics.diff > 0 ? (
                            <span className="text-blue-700">+{metrics.diff.toFixed(1)}</span>
                          ) : (
                            <span className="text-rose-700">{metrics.diff.toFixed(1)}</span>
                          )}{" "}
                          {item.unit}
                        </td>

                        {/* Estimated Value */}
                        <td className="py-3 px-3 text-right font-bold">
                          {metrics.estimatedValue > 0 ? (
                            <span className="text-emerald-700">
                              +Rp {metrics.estimatedValue.toLocaleString("id-ID")}
                            </span>
                          ) : (
                            <span className="text-rose-700">
                              -Rp {Math.abs(metrics.estimatedValue).toLocaleString("id-ID")}
                            </span>
                          )}
                        </td>

                        {/* Reason */}
                        <td className="py-3 px-3 text-[11px] text-[#626058] max-w-xs">
                          {item.reason || item.remark || "Dalam tahap investigasi fisik"}
                        </td>

                        {/* Approval Status */}
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-xs ${
                              item.approvalStatus === "Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.approvalStatus === "Investigating"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-neutral-100 text-neutral-800"
                            }`}
                          >
                            {item.approvalStatus || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* ============================================================
            RIGHT WORKBENCH (lg:col-span-4)
            Section 05: Approval Workflow
            Section 06: Evidence
            Section 07: History Timeline
            Section 08: Actions
            ============================================================ */}
        <div className="lg:col-span-4 space-y-8">
          {/* ==========================================================
              SECTION 05: APPROVAL WORKFLOW
              Warehouse Supervisor → Inventory Controller →
              Finance (optional) → Management Approval
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                GOVERNANCE &amp; INTERNAL AUDIT
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Approval Workflow
              </h3>
            </div>

            <div className="space-y-3">
              {currentSession.approvals.map((app, idx) => (
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
                      Waktu Pengesahan: {app.timestamp}
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
              SECTION 06: EVIDENCE
              Shelf photo, Product photo, Barcode photo, Notes
              Photo upload / preview gallery
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  DIGITAL AUDIT TRAIL
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Physical Evidence
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  showToast("Kamera scanner PDA Honeywell / ponsel diaktifkan untuk unggah foto.")
                }
                className="text-[#C85A17] hover:underline text-xs font-bold cursor-pointer"
              >
                + Lampirkan Foto 📸
              </button>
            </div>

            {currentSession.evidence.length === 0 ? (
              <p className="text-xs text-[#8E8B81] italic py-4 text-center">
                Belum ada foto bukti fisik yang dilampirkan pada sesi ini.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {currentSession.evidence.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setIsEvidenceModalOpen(ev)}
                    className="p-3 bg-[#FAF9F5] border border-[#141413]/10 hover:border-[#141413]/30 rounded-xs text-left space-y-1.5 transition-all group cursor-pointer"
                  >
                    <div className="w-full h-16 bg-slate-100 rounded-[6px] flex flex-col items-center justify-center gap-1 group-hover:bg-slate-200/80 transition-colors border border-slate-200">
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Foto Bukti Fisik</span>
                    </div>
                    <strong className="text-xs text-[#141413] block truncate">{ev.label}</strong>
                    <div className="flex justify-between text-[10px] text-[#8E8B81]">
                      <span>{ev.type}</span>
                      <span>{ev.timestamp}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 bg-[#FAF9F5] border border-[#141413]/5 rounded-xs space-y-1 text-xs">
              <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                Auditor Field Observations:
              </span>
              <p className="text-[11px] text-[#626058] leading-relaxed">
                {currentSession.generalNotes}
              </p>
            </div>
          </section>

          {/* ==========================================================
              SECTION 07: HISTORY TIMELINE
              Session Created → Counting Started → Variance Found →
              Approved → Inventory Updated
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                AUDIT AUDITABILITY LIFECYCLE
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Audit History Timeline
              </h3>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#141413]/15">
              {[
                { step: 1, title: "Session Created", desc: "Sesi opname diterbitkan & tim dialokasikan" },
                { step: 2, title: "Counting Started", desc: "Pemindaian barcode & penimbangan fisik" },
                { step: 3, title: "Variance Found", desc: "Rekonsiliasi kartu stok & identifikasi selisih" },
                { step: 4, title: "Approved", desc: "Pengesahan bertingkat SPV, QC, dan Keuangan" },
                { step: 5, title: "Inventory Updated", desc: "Penyesuaian saldo buku besar persediaan ERP" },
              ].map((st) => {
                const isPassed = currentSession.timelineStep >= st.step;
                const isCurrent = currentSession.timelineStep === st.step;

                return (
                  <div key={st.step} className="relative group">
                    <div
                      className={`absolute -left-[20px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        isPassed
                          ? isCurrent
                            ? "bg-amber-600 ring-2 ring-amber-300 animate-pulse"
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
              SECTION 08: ACTIONS
              Approve, Reject, Recount, Generate Adjustment, Print Report
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-3.5 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                AUDIT DISPOSITION COMMANDS
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Audit Actions
              </h3>
            </div>

            <div className="space-y-2">
              {/* Approve */}
              <button
                type="button"
                onClick={() => {
                  setSessions((prev) =>
                    prev.map((s) =>
                      s.id === currentSession.id
                        ? { ...s, status: "Approved", timelineStep: 4 }
                        : s
                    )
                  );
                  showToast(`Sesi Opname ${currentSession.sessionNumber} DISETUJUI oleh Manajemen.`);
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
              >
                ✓ Approve (Sahkan Rekonsiliasi)
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Reject */}
                <button
                  type="button"
                  onClick={() => {
                    setSessions((prev) =>
                      prev.map((s) =>
                        s.id === currentSession.id ? { ...s, status: "Review" } : s
                      )
                    );
                    showToast(`Sesi Opname ${currentSession.sessionNumber} DITOLAK. Investigasi lanjutan dibuka.`);
                  }}
                  className="py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-center rounded-xs cursor-pointer shadow-xs"
                >
                  ✕ Reject
                </button>

                {/* Recount */}
                <button
                  type="button"
                  onClick={() => {
                    setSessions((prev) =>
                      prev.map((s) =>
                        s.id === currentSession.id ? { ...s, status: "Counting" } : s
                      )
                    );
                    showToast(
                      `Perhitungan ulang (Blind Recount) diterbitkan untuk tim sekunder.`
                    );
                  }}
                  className="py-2.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 font-bold text-center rounded-xs cursor-pointer shadow-xs"
                >
                  ↺ Recount (Hitung Ulang)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Generate Adjustment */}
                <button
                  type="button"
                  onClick={() => {
                    setSessions((prev) =>
                      prev.map((s) =>
                        s.id === currentSession.id
                          ? { ...s, status: "Closed", timelineStep: 5 }
                          : s
                      )
                    );
                    showToast(
                      "Jurnal penyesuaian persediaan otomatis diposting ke Buku Besar ERP (Inventory Updated)."
                    );
                  }}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Generate Adjustment 📊
                </button>

                {/* Print Report */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Print Report 🖨️
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ==============================================================
          MODALS: NEW COUNT, IMPORT COUNT SHEET, EXPORT REPORT, EVIDENCE VIEWER
          ============================================================== */}

      {/* 1. New Count Modal */}
      {isNewCountModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  New Audit Cycle
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Schedule Stock Count
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewCountModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Sesi stock opname baru berhasil dijadwalkan.");
                setIsNewCountModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#141413] font-bold mb-1">Pilih Gudang Target:</label>
                <select className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden">
                  <option>Cold Storage (Chiller Wing 1)</option>
                  <option>Main Warehouse (Gudang Utama)</option>
                  <option>Dry Storage (Bumbu &amp; Rempah)</option>
                  <option>Packaging Warehouse</option>
                </select>
              </div>

              <div>
                <label className="block text-[#141413] font-bold mb-1">Tanggal Pelaksanaan Opname:</label>
                <input
                  type="date"
                  defaultValue="2026-10-22"
                  className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#141413] font-bold mb-1">Tim Audit Bertugas:</label>
                <input
                  type="text"
                  placeholder="Contoh: Tim QC Protein &amp; SPV Rian"
                  className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button
                  type="button"
                  onClick={() => setIsNewCountModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
                >
                  Buat Jadwal Opname
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Import Count Sheet Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Data Integration
                </span>
                <strong className="font-display font-extrabold text-lg text-[#141413]">
                  Import Count Sheet
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#626058] leading-relaxed">
              Unggah lembar hasil perhitungan fisik dari PDA Barcode Scanner Honeywell/Zebra
              berformat .CSV atau Excel template resmi opname ZKS.
            </p>

            <div className="p-6 border-2 border-dashed border-neutral-300 rounded-xs text-center space-y-2 bg-neutral-50/50">
              <span className="text-3xl block">📥</span>
              <span className="text-xs text-[#141413] font-bold block">
                Tarik file ke sini atau klik untuk memilih
              </span>
              <span className="text-[10px] text-[#8E8B81] block">
                Format didukung: .xlsx, .csv (Max 10MB)
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast("Data lembar hitung fisik berhasil diimpor & disinkronkan.");
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
              >
                Impor Data Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Official Audit Dossier
                </span>
                <strong className="font-display font-extrabold text-lg text-[#141413]">
                  Export Opname Report
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
              Ekspor Berita Acara Pemeriksaan Opname (BAPO) resmi beserta rincian selisih dan lembar
              pengesahan:
            </p>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Sesi Terpilih:</span>
                <strong className="text-[#141413]">{currentSession.sessionNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Gudang:</span>
                <span className="text-[#141413]">{currentSession.warehouse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Status BAPO:</span>
                <span className="font-bold text-emerald-800">{currentSession.status}</span>
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
                  showToast(
                    `Dokumen BAPO ${currentSession.sessionNumber} berhasil diunduh dalam format PDF.`
                  );
                  setIsExportModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
              >
                Unduh BAPO PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Evidence Photo Modal Viewer */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in font-mono text-xs text-center">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <strong className="text-sm text-[#141413]">{isEvidenceModalOpen.label}</strong>
              <button
                type="button"
                onClick={() => setIsEvidenceModalOpen(null)}
                className="text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-44 bg-slate-900 text-slate-100 rounded-[8px] flex flex-col items-center justify-center gap-2 border border-slate-800">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-mono text-slate-300">
                Bukti Digital Terverifikasi #{isEvidenceModalOpen.id} ({isEvidenceModalOpen.type})
              </span>
            </div>
            <p className="text-xs text-[#141413] font-bold leading-relaxed">
              {isEvidenceModalOpen.notes}
            </p>
            <span className="text-[10px] text-[#8E8B81] block">
              Tercatat pada: {isEvidenceModalOpen.timestamp} oleh Tim Audit Opname
            </span>
            <div className="flex justify-end pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsEvidenceModalOpen(null)}
                className="px-4 py-2 bg-[#141413] text-white font-bold rounded-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
