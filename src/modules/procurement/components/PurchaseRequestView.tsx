"use client";

import React, { useState, useMemo } from "react";

// --- TYPES & INTERFACES ---
export type PRStatus =
  | "Draft"
  | "Waiting Approval"
  | "Approved"
  | "Rejected"
  | "Converted to PO"
  | "Completed";

export type PRPriority = "Critical" | "High" | "Medium" | "Low";

export interface RequestedItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  requestedQty: number;
  suggestedQty: number;
  unit: string;
  estimatedPrice: number; // IDR per unit
  supplier: string;
  remarks: string;
}

export interface PRApprovalTier {
  role: "Kitchen Supervisor" | "Warehouse" | "Purchasing" | "Finance" | "Management";
  name: string;
  status: "Approved" | "Pending" | "Waiting" | "Rejected";
  timestamp?: string;
  notes?: string;
}

export interface PRAttachment {
  id: string;
  name: string;
  type: "Quotation" | "Specification" | "Supporting Documents";
  size: string;
}

export interface PurchaseRequestRecord {
  id: string;
  prNumber: string;
  department: string;
  purpose: string;
  requestedBy: string;
  requiredDate: string;
  createdDate: string;
  budgetCode: string;
  costCenter: string;
  priority: PRPriority;
  status: PRStatus;
  timelineStep: number; // 1: Created, 2: Reviewed, 3: Approved, 4: Converted to PO
  convertedPoNumber?: string;
  notes: string;
  items: RequestedItem[];
  approvals: PRApprovalTier[];
  monthlyBudget: number;
  usedBudget: number;
  attachments: PRAttachment[];
}

export interface SmartRecommendation {
  id: string;
  itemName: string;
  sku: string;
  currentStock: number;
  avgDailyUsage: number;
  estimatedRemainingDays: number;
  conditionLabel: string;
  confidenceScore: number;
  priority: PRPriority;
  suggestedQuantity: number;
  unit: string;
  expectedDeliveryDate: string;
  estimatedCost: number;
  supplier: string;
}

// --- MOCK SMART PROCUREMENT RECOMMENDATIONS (ALGORITHMIC / PREDICTIVE) ---
const INITIAL_RECOMMENDATIONS: SmartRecommendation[] = [
  {
    id: "rec-01",
    itemName: "Chicken Breast Fillet Paha (Grade A)",
    sku: "RM-00021",
    currentStock: 125.0,
    avgDailyUsage: 70.0,
    estimatedRemainingDays: 1.8,
    conditionLabel: "Kritis: Stok tersisa untuk 1.8 hari produksi",
    confidenceScore: 98,
    priority: "Critical",
    suggestedQuantity: 500.0,
    unit: "kg",
    expectedDeliveryDate: "23 Okt 2026",
    estimatedCost: 21000000,
    supplier: "PT. Sumber Unggas Makmur",
  },
  {
    id: "rec-02",
    itemName: "Beras Ramos Premium IR-64 (Zak 50kg)",
    sku: "RM-00012",
    currentStock: 350.0,
    avgDailyUsage: 110.0,
    estimatedRemainingDays: 3.1,
    conditionLabel: "Perhatian: Tersisa 3 hari menjelang batas aman buffer",
    confidenceScore: 95,
    priority: "High",
    suggestedQuantity: 2000.0,
    unit: "kg",
    expectedDeliveryDate: "24 Okt 2026",
    estimatedCost: 29000000,
    supplier: "Koperasi Tani Karawang Sejahtera",
  },
  {
    id: "rec-03",
    itemName: "Minyak Goreng Sawit Higienis (Jerigen 20L)",
    sku: "RM-00004",
    currentStock: 12.0,
    avgDailyUsage: 8.0,
    estimatedRemainingDays: 1.5,
    conditionLabel: "Di Bawah Titik Reorder Point (Min 20 Jerigen)",
    confidenceScore: 99,
    priority: "Critical",
    suggestedQuantity: 50.0,
    unit: "Jerigen (1,000 L)",
    expectedDeliveryDate: "23 Okt 2026",
    estimatedCost: 16500000,
    supplier: "PT. Wilmar Cahaya Nabati",
  },
  {
    id: "rec-04",
    itemName: "Telur Ayam Negeri Omega Fresh (Karton 10 Tray)",
    sku: "RM-00019",
    currentStock: 25.0,
    avgDailyUsage: 15.0,
    estimatedRemainingDays: 1.6,
    conditionLabel: "Peringatan Resiko Keterlambatan Pemasok (Lead Time +2 Hari)",
    confidenceScore: 92,
    priority: "High",
    suggestedQuantity: 100.0,
    unit: "Tray",
    expectedDeliveryDate: "24 Okt 2026",
    estimatedCost: 6500000,
    supplier: "CV. Peternakan Unggas Mandiri",
  },
];

// --- MOCK PURCHASE REQUEST DATASET ---
const INITIAL_PURCHASE_REQUESTS: PurchaseRequestRecord[] = [
  {
    id: "pr-01",
    prNumber: "PR-2026-1021-0012",
    department: "Kitchen Hot Production",
    purpose: "Pengadaan bahan baku segar untuk menu katering prasmanan Bank Mandiri & PT. Astra (3,200 Pax)",
    requestedBy: "Chef Surya Atmaja (Executive Chef)",
    requiredDate: "23 Okt 2026 (H-2 Acara)",
    createdDate: "21 Okt 2026, 09:15 WIB",
    budgetCode: "OPEX-CATERING-2026-Q4",
    costCenter: "CC-102 (Food & Beverage Production)",
    priority: "Critical",
    status: "Waiting Approval",
    timelineStep: 2,
    notes: "Pengiriman wajib menggunakan armada pendingin (Reefer Truck) bersuhu antara -2°C s/d +4°C dengan sertifikat halal aktif.",
    monthlyBudget: 150000000,
    usedBudget: 62400000,
    items: [
      {
        id: "item-pr-1",
        name: "Chicken Breast Fillet Paha (Grade A)",
        sku: "RM-00021",
        currentStock: 125.0,
        minimumStock: 400.0,
        requestedQty: 500.0,
        suggestedQty: 500.0,
        unit: "kg",
        estimatedPrice: 42000,
        supplier: "PT. Sumber Unggas Makmur",
        remarks: "Daging dingin tanpa tulang, bebas memar",
      },
      {
        id: "item-pr-2",
        name: "Sayap Ayam Utuh (Mid-Joint Wing)",
        sku: "RM-00024",
        currentStock: 80.0,
        minimumStock: 200.0,
        requestedQty: 150.0,
        suggestedQty: 150.0,
        unit: "kg",
        estimatedPrice: 38000,
        supplier: "PT. Sumber Unggas Makmur",
        remarks: "Ukuran standar seragam 80-90 gram per potong",
      },
      {
        id: "item-pr-3",
        name: "Minyak Goreng Sawit Higienis (Jerigen 20L)",
        sku: "RM-00004",
        currentStock: 12.0,
        minimumStock: 25.0,
        requestedQty: 25.0,
        suggestedQty: 30.0,
        unit: "Jerigen",
        estimatedPrice: 330000,
        supplier: "PT. Wilmar Cahaya Nabati",
        remarks: "Jerigen tersegel utuh standar pabrik",
      },
    ],
    approvals: [
      {
        role: "Kitchen Supervisor",
        name: "Chef Surya Atmaja",
        status: "Approved",
        timestamp: "21 Okt 09:20 WIB",
        notes: "Perhitungan porsi 3,200 pax terverifikasi dengan SPK",
      },
      {
        role: "Warehouse",
        name: "Agus Pratama",
        status: "Approved",
        timestamp: "21 Okt 09:40 WIB",
        notes: "Kapasitas ruang Cold Chiller Rack A-04 tersedia",
      },
      {
        role: "Purchasing",
        name: "Ibu Dewi Anggraini",
        status: "Approved",
        timestamp: "21 Okt 10:15 WIB",
        notes: "Harga satuan sesuai kontrak vendor kuartal 4",
      },
      {
        role: "Finance",
        name: "Ibu Anita (Cost Accounting)",
        status: "Pending",
        notes: "Menunggu verifikasi ketersediaan plafon budget OPEX",
      },
      {
        role: "Management",
        name: "Pak Handoko (GM Operations)",
        status: "Waiting",
      },
    ],
    attachments: [
      { id: "att-pr-1", name: "Quotation_Vendor_SUM_Q4_2026.pdf", type: "Quotation", size: "340 KB" },
      { id: "att-pr-2", name: "Spesifikasi_Daging_Halal_GradeA.pdf", type: "Specification", size: "210 KB" },
      { id: "att-pr-3", name: "SPK_Katering_Mandiri_Astra_3200Pax.pdf", type: "Supporting Documents", size: "520 KB" },
    ],
  },
  {
    id: "pr-02",
    prNumber: "PR-2026-1021-0013",
    department: "Packaging & Staging",
    purpose: "Pengadaan stok box katering ramah lingkungan dan sendok garpu steril",
    requestedBy: "Supervisor Packaging (Ibu Rina)",
    requiredDate: "24 Okt 2026",
    createdDate: "21 Okt 2026, 10:30 WIB",
    budgetCode: "OPEX-PACKAGING-2026",
    costCenter: "CC-105 (Packaging & Assembly)",
    priority: "High",
    status: "Approved",
    timelineStep: 3,
    notes: "Kemasan food grade bersertifikasi FSC dan BPA-free.",
    monthlyBudget: 60000000,
    usedBudget: 28500000,
    items: [
      {
        id: "item-pr-4",
        name: "Bento Box 5-Compartment Meal Tray (Dus 500 Pcs)",
        sku: "PKG-00002",
        currentStock: 1200.0,
        minimumStock: 3000.0,
        requestedQty: 5000.0,
        suggestedQty: 5000.0,
        unit: "Pcs",
        estimatedPrice: 1200,
        supplier: "PT. Eco Pack Solusindo",
        remarks: "Karton isi 500 pcs (10 karton master)",
      },
    ],
    approvals: [
      { role: "Kitchen Supervisor", name: "Ibu Rina", status: "Approved", timestamp: "21 Okt 10:35 WIB" },
      { role: "Warehouse", name: "Agus Pratama", status: "Approved", timestamp: "21 Okt 10:50 WIB" },
      { role: "Purchasing", name: "Ibu Dewi", status: "Approved", timestamp: "21 Okt 11:15 WIB" },
      { role: "Finance", name: "Ibu Anita", status: "Approved", timestamp: "21 Okt 11:45 WIB" },
      { role: "Management", name: "Pak Handoko", status: "Approved", timestamp: "21 Okt 12:00 WIB" },
    ],
    attachments: [
      { id: "att-pr-4", name: "Penawaran_Eco_Pack_2026.pdf", type: "Quotation", size: "290 KB" },
    ],
  },
  {
    id: "pr-03",
    prNumber: "PR-2026-1020-0009",
    department: "Dry Storage & Grains",
    purpose: "Pembelian beras ramos premium IR-64 4 Ton siklus reguler",
    requestedBy: "Bambang Santoso",
    requiredDate: "22 Okt 2026",
    createdDate: "20 Okt 2026, 14:00 WIB",
    budgetCode: "OPEX-GRAINS-2026",
    costCenter: "CC-101 (Raw Grains)",
    priority: "Medium",
    status: "Converted to PO",
    convertedPoNumber: "PO-ZKS-2026-1085",
    timelineStep: 4,
    notes: "Telah diterbitkan PO resmi ke Koperasi Tani Karawang.",
    monthlyBudget: 120000000,
    usedBudget: 58000000,
    items: [
      {
        id: "item-pr-5",
        name: "Beras Ramos Premium IR-64 (Zak 50kg)",
        sku: "RM-00012",
        currentStock: 800.0,
        minimumStock: 1500.0,
        requestedQty: 4000.0,
        suggestedQty: 4000.0,
        unit: "kg",
        estimatedPrice: 14500,
        supplier: "Koperasi Tani Karawang Sejahtera",
        remarks: "80 zak utuh kemasan goni anyaman",
      },
    ],
    approvals: [
      { role: "Kitchen Supervisor", name: "Bambang Santoso", status: "Approved", timestamp: "20 Okt 14:15 WIB" },
      { role: "Warehouse", name: "Agus Pratama", status: "Approved", timestamp: "20 Okt 14:30 WIB" },
      { role: "Purchasing", name: "Ibu Dewi", status: "Approved", timestamp: "20 Okt 15:00 WIB" },
      { role: "Finance", name: "Ibu Anita", status: "Approved", timestamp: "20 Okt 15:30 WIB" },
      { role: "Management", name: "Pak Handoko", status: "Approved", timestamp: "20 Okt 16:00 WIB" },
    ],
    attachments: [
      { id: "att-pr-5", name: "PO_ZKS_2026_1085_Final.pdf", type: "Supporting Documents", size: "410 KB" },
    ],
  },
];

export default function PurchaseRequestClient() {
  // --- STATE ---
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequestRecord[]>(
    INITIAL_PURCHASE_REQUESTS
  );
  const [selectedPrId, setSelectedPrId] = useState<string>("pr-01");
  const [recommendations] = useState<SmartRecommendation[]>(
    INITIAL_RECOMMENDATIONS
  );

  // Modals & Feedback
  const [isNewPrModalOpen, setIsNewPrModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<PRAttachment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected PR Record
  const currentPr = purchaseRequests.find((p) => p.id === selectedPrId) || purchaseRequests[0];

  // Calculated Estimated Total Cost of Selected PR
  const currentPrTotalCost = useMemo(() => {
    return currentPr.items.reduce(
      (sum, item) => sum + item.requestedQty * item.estimatedPrice,
      0
    );
  }, [currentPr.items]);

  // Section 02 KPI Summary Metrics
  const summaryKPIs = useMemo(() => {
    let openCount = 0;
    let approvedCount = 0;
    let waitingCount = 0;
    let rejectedCount = 0;
    let urgentCount = 0;

    purchaseRequests.forEach((p) => {
      if (p.status === "Draft" || p.status === "Waiting Approval") openCount += 1;
      if (p.status === "Approved" || p.status === "Converted to PO" || p.status === "Completed")
        approvedCount += 1;
      if (p.status === "Waiting Approval") waitingCount += 1;
      if (p.status === "Rejected") rejectedCount += 1;
      if (p.priority === "Critical") urgentCount += 1;
    });

    return { openCount, approvedCount, waitingCount, rejectedCount, urgentCount };
  }, [purchaseRequests]);

  // Handle Inline Item Requested Qty Change
  const handleItemQtyChange = (itemId: string, newQty: number) => {
    setPurchaseRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== currentPr.id) return pr;
        return {
          ...pr,
          items: pr.items.map((it) => {
            if (it.id !== itemId) return it;
            return { ...it, requestedQty: isNaN(newQty) ? 0 : newQty };
          }),
        };
      })
    );
  };

  // Convert AI Recommendation into a new PR
  const handleCreateFromRecommendation = (rec: SmartRecommendation) => {
    const newPrId = `pr-gen-${Date.now()}`;
    const newPrNumber = `PR-2026-1021-00${purchaseRequests.length + 10}`;

    const newRecord: PurchaseRequestRecord = {
      id: newPrId,
      prNumber: newPrNumber,
      department: "Kitchen Hot Production",
      purpose: `Pencegahan kehabisan bahan: ${rec.conditionLabel}`,
      requestedBy: "Auto-Procurement Engine",
      requiredDate: rec.expectedDeliveryDate,
      createdDate: "21 Okt 2026, 21:30 WIB",
      budgetCode: "OPEX-CATERING-2026-Q4",
      costCenter: "CC-102 (Food & Beverage)",
      priority: rec.priority,
      status: "Waiting Approval",
      timelineStep: 1,
      notes: `Rekomendasi otomatis berbasis analisa stok tersisa ${rec.estimatedRemainingDays} hari (Confidence: ${rec.confidenceScore}%).`,
      monthlyBudget: 150000000,
      usedBudget: 75000000,
      items: [
        {
          id: `item-gen-${Date.now()}`,
          name: rec.itemName,
          sku: rec.sku,
          currentStock: rec.currentStock,
          minimumStock: rec.avgDailyUsage * 3,
          requestedQty: rec.suggestedQuantity,
          suggestedQty: rec.suggestedQuantity,
          unit: rec.unit,
          estimatedPrice: Math.round(rec.estimatedCost / rec.suggestedQuantity),
          supplier: rec.supplier,
          remarks: "Disarankan oleh modul prediktif stok katering",
        },
      ],
      approvals: [
        { role: "Kitchen Supervisor", name: "Chef Surya", status: "Approved", timestamp: "21 Okt 21:30 WIB" },
        { role: "Warehouse", name: "Agus Pratama", status: "Pending" },
        { role: "Purchasing", name: "Ibu Dewi", status: "Waiting" },
        { role: "Finance", name: "Ibu Anita", status: "Waiting" },
        { role: "Management", name: "Pak Handoko", status: "Waiting" },
      ],
      attachments: [],
    };

    setPurchaseRequests([newRecord, ...purchaseRequests]);
    setSelectedPrId(newPrId);
    showToast(`Draft Purchase Request ${newPrNumber} berhasil dibuat dari saran AI.`);
  };

  // Priority Badge Renderer
  const renderPriorityBadge = (priority: PRPriority) => {
    switch (priority) {
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300 rounded-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Critical
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            High
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 rounded-xs">
            Medium
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-xs">
            Low
          </span>
        );
    }
  };

  // Status Badge Renderer
  const renderStatusBadge = (status: PRStatus) => {
    switch (status) {
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-xs">
            Draft
          </span>
        );
      case "Waiting Approval":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 rounded-xs">
            ⏳ Waiting Approval
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs">
            ✓ Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300 rounded-xs">
            ✕ Rejected
          </span>
        );
      case "Converted to PO":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-300 rounded-xs">
            📑 Converted to PO
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 rounded-xs">
            Completed
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
          Purchase Request
          Subtitle: Create and manage procurement requests across all operational departments.
          Top Right: New Purchase Request, Generate from Low Stock, Import Excel
          ============================================================== */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#141413]/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
              PT. ZAHDAN KAMAL SENTOSA
            </span>
            <span className="text-[#8E8B81] text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#141413] font-semibold block">
              ENTERPRISE PROCUREMENT WORKSPACE
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Procurement Engine v4.2 Active
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Purchase Request
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Create and manage procurement requests across all operational departments.
          </p>
        </div>

        {/* Top Right Action Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* New Purchase Request */}
          <button
            type="button"
            onClick={() => setIsNewPrModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Purchase Request</span>
          </button>

          {/* Generate from Low Stock */}
          <button
            type="button"
            onClick={() => {
              handleCreateFromRecommendation(recommendations[0]);
              showToast("PR terisi otomatis dari barang di bawah batas minimum stok.");
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#C85A17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Generate from Low Stock</span>
          </button>

          {/* Import Excel */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import Excel</span>
          </button>
        </div>
      </header>

      {/* ==============================================================
          SECTION 01: SMART PROCUREMENT RECOMMENDATIONS
          Large recommendation cards based on stock depletion rate & SPK
          ============================================================== */}
      <section aria-labelledby="smart-rec-heading" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C85A17] animate-ping"></span>
            <h2 id="smart-rec-heading" className="font-display font-bold text-base text-[#141413]">
              Smart Procurement Recommendations
            </h2>
          </div>
          <span className="text-[11px] text-[#8E8B81]">
            Dihitung otomatis dari laju konsumsi harian dapur &amp; buffer lead time pemasok
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-white border border-[#141413]/15 rounded-xs space-y-3 shadow-2xs hover:border-[#141413]/35 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  {renderPriorityBadge(rec.priority)}
                  <span className="text-[10px] font-mono font-bold text-[#8E8B81]">
                    Confidence {rec.confidenceScore}%
                  </span>
                </div>

                <div>
                  <strong className="font-sans font-bold text-sm text-[#141413] block">
                    {rec.itemName}
                  </strong>
                  <span className="text-[10px] text-[#8E8B81]">SKU: {rec.sku}</span>
                </div>

                {/* Stock Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 p-2 bg-[#FAF9F5] border border-[#141413]/5 rounded-xs text-center font-mono">
                  <div>
                    <span className="text-[9px] text-[#8E8B81] block">Current</span>
                    <strong className="text-xs text-[#141413]">
                      {rec.currentStock} {rec.unit.split(" ")[0]}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#8E8B81] block">Usage/Day</span>
                    <strong className="text-xs text-[#141413]">
                      {rec.avgDailyUsage} {rec.unit.split(" ")[0]}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#8E8B81] block">Remaining</span>
                    <strong className="text-xs text-rose-700">
                      {rec.estimatedRemainingDays} Hari
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-[#626058] leading-tight">
                  {rec.conditionLabel}
                </p>

                <div className="text-[11px] space-y-0.5 pt-1 border-t border-black/5 text-[#8E8B81]">
                  <p>Saran Qty: <strong className="text-[#141413] font-bold">{rec.suggestedQuantity} {rec.unit}</strong></p>
                  <p>Target Tiba: <strong className="text-[#141413] font-bold">{rec.expectedDeliveryDate}</strong></p>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleCreateFromRecommendation(rec)}
                className="w-full py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer text-center text-xs shadow-2xs mt-2"
              >
                + Create PR from Suggestion
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ==============================================================
          SECTION 02: PURCHASE REQUEST SUMMARY CARDS (5 Cards)
          - Open Requests
          - Approved
          - Waiting Approval
          - Rejected
          - Urgent
          ============================================================== */}
      <section aria-labelledby="pr-summary-heading">
        <h2 id="pr-summary-heading" className="sr-only">
          Purchase Request Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Open Requests */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Open Requests
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              {summaryKPIs.openCount}{" "}
              <span className="text-xs font-normal text-[#626058]">PR</span>
            </p>
            <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
              Dalam pipeline pengadaan
            </span>
          </div>

          {/* 2. Approved */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Approved
            </span>
            <p className="font-display font-extrabold text-2xl text-emerald-700">
              {summaryKPIs.approvedCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Lolos</span>
            </p>
            <span className="text-[10px] text-emerald-800 block pt-1 border-t border-black/5">
              Siap / telah menjadi PO
            </span>
          </div>

          {/* 3. Waiting Approval */}
          <div className="p-4 bg-white border border-amber-200/80 space-y-1 shadow-2xs ring-1 ring-amber-500/10">
            <span className="text-[10px] uppercase text-amber-700 font-bold block">
              Waiting Approval
            </span>
            <p className="font-display font-extrabold text-2xl text-amber-700">
              {summaryKPIs.waitingCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Menunggu</span>
            </p>
            <span className="text-[10px] text-amber-800 block pt-1 border-t border-amber-100">
              Otorisasi supervisor &amp; finance
            </span>
          </div>

          {/* 4. Rejected */}
          <div className="p-4 bg-white border border-rose-200/80 space-y-1 shadow-2xs ring-1 ring-rose-500/10">
            <span className="text-[10px] uppercase text-rose-700 font-bold block">
              Rejected
            </span>
            <p className="font-display font-extrabold text-2xl text-rose-600">
              {summaryKPIs.rejectedCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Ditolak</span>
            </p>
            <span className="text-[10px] text-rose-700 block pt-1 border-t border-rose-100">
              Kelebihan kuota budget
            </span>
          </div>

          {/* 5. Urgent */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-rose-700 font-bold block">
              Urgent (Critical)
            </span>
            <p className="font-display font-extrabold text-2xl text-rose-700">
              {summaryKPIs.urgentCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Item Kritis</span>
            </p>
            <span className="text-[10px] text-rose-800 block pt-1 border-t border-black/5">
              Kebutuhan &lt; 48 jam
            </span>
          </div>
        </div>
      </section>

      {/* ==============================================================
          RESPONSIVE SPLIT WORKBENCH
          Desktop: Split layout (Left: Section 03, 04, 05; Right: Section 06, 07, 08, 09, 10)
          Tablet: Single Column
          Mobile: Card layout
          ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================
            LEFT WORKBENCH (lg:col-span-8 or 7)
            ============================================================ */}
        <div className="lg:col-span-8 space-y-8">
          {/* ==========================================================
              SECTION 03: PURCHASE REQUEST LIST (Modern Enterprise Table)
              Columns: PR Number, Department, Requested By, Priority,
                       Items, Estimated Cost, Status, Approval, Created Date, Actions
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  REQUISITION MASTER REGISTER
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Purchase Request List
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">
                Pilih baris untuk membuka rincian spesifikasi barang, alokasi budget, &amp; approval
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-[#141413]/10 text-[10px] font-mono uppercase tracking-wider text-[#626058]">
                    <th className="py-2.5 px-3">PR Number</th>
                    <th className="py-2.5 px-3 font-semibold">Department</th>
                    <th className="py-2.5 px-3">Requested By</th>
                    <th className="py-2.5 px-2 text-center">Priority</th>
                    <th className="py-2.5 px-2 text-center">Items</th>
                    <th className="py-2.5 px-3 text-right">Est. Cost</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Approval Stage</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5 text-xs font-mono">
                  {purchaseRequests.map((pr) => {
                    const isSelected = selectedPrId === pr.id;
                    const totalCost = pr.items.reduce(
                      (sum, it) => sum + it.requestedQty * it.estimatedPrice,
                      0
                    );
                    const currentPendingTier =
                      pr.approvals.find((a) => a.status === "Pending") || pr.approvals[pr.approvals.length - 1];

                    return (
                      <tr
                        key={pr.id}
                        onClick={() => setSelectedPrId(pr.id)}
                        className={`transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/70 ring-1 ring-[#C85A17]/30"
                            : "hover:bg-[#FAF9F5]"
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-[#141413] whitespace-nowrap">
                          {pr.prNumber}
                        </td>
                        <td className="py-3 px-3 text-[#141413] whitespace-nowrap font-medium">
                          {pr.department}
                        </td>
                        <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                          {pr.requestedBy.split(" ")[0]} {pr.requestedBy.split(" ")[1] || ""}
                        </td>
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          {renderPriorityBadge(pr.priority)}
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-[#141413] whitespace-nowrap">
                          {pr.items.length} Item
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-[#141413] whitespace-nowrap">
                          Rp {totalCost.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {renderStatusBadge(pr.status)}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-[11px] text-[#626058]">
                          {currentPendingTier.role} ({currentPendingTier.status})
                        </td>
                        <td
                          className="py-3 px-3 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedPrId(pr.id)}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                          >
                            {isSelected ? "Active" : "Review →"}
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
              SECTION 04: PURCHASE REQUEST DETAIL
              General Information:
              - Department, Purpose, Required Date, Budget Code, Cost Center, Notes
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  REQUISITION DOSSIER
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  PR Detail — {currentPr.prNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {renderPriorityBadge(currentPr.priority)}
                {renderStatusBadge(currentPr.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Operational Requisitioner
                </span>
                <p className="font-bold text-sm text-[#141413]">{currentPr.department}</p>
                <div className="text-[11px] text-[#626058] space-y-0.5">
                  <p>Diajukan Oleh: <strong>{currentPr.requestedBy}</strong></p>
                  <p>Tanggal Dibuat: {currentPr.createdDate}</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Budget &amp; Accounting Code
                </span>
                <p className="font-bold text-sm text-[#141413]">{currentPr.budgetCode}</p>
                <div className="text-[11px] text-[#626058] space-y-0.5">
                  <p>Cost Center: {currentPr.costCenter}</p>
                  <p>Target Tiba: <strong className="text-[#C85A17]">{currentPr.requiredDate}</strong></p>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5 sm:col-span-2">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Procurement Justification &amp; Purpose
                </span>
                <p className="font-bold text-xs text-[#141413] leading-relaxed">
                  {currentPr.purpose}
                </p>
                <p className="text-[11px] text-[#626058] pt-1 border-t border-black/5 leading-relaxed">
                  Catatan Tambahan: {currentPr.notes}
                </p>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 05: REQUESTED ITEMS (Modern Editable Table)
              Columns: Item, Current Stock, Minimum Stock, Requested Qty,
                       Suggested Qty, Unit, Estimated Price, Supplier, Remarks
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  LINE ITEM BILL OF PROCUREMENT
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Requested Items ({currentPr.items.length} Item Terdaftar)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-xs">
                Kuantitas dapat diedit langsung oleh tim Purchasing / Dapur
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[10px] text-[#8E8B81] uppercase tracking-wider bg-neutral-50/70">
                    <th className="py-2.5 px-3">Item / SKU</th>
                    <th className="py-2.5 px-2 text-right">Current Stock</th>
                    <th className="py-2.5 px-2 text-right">Min Stock</th>
                    <th className="py-2.5 px-3 text-right">Requested Qty</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-3 text-right">Est. Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                    <th className="py-2.5 px-3">Preferred Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5">
                  {currentPr.items.map((it) => {
                    const subtotal = it.requestedQty * it.estimatedPrice;

                    return (
                      <tr key={it.id} className="hover:bg-neutral-50/60">
                        {/* Item / SKU */}
                        <td className="py-3 px-3">
                          <strong className="font-sans font-bold text-[#141413] block">
                            {it.name}
                          </strong>
                          <span className="text-[10px] text-[#8E8B81]">
                            SKU: {it.sku} • {it.remarks}
                          </span>
                        </td>

                        {/* Current Stock */}
                        <td className="py-3 px-2 text-right text-[#626058]">
                          {it.currentStock.toLocaleString("id-ID")}
                        </td>

                        {/* Minimum Stock */}
                        <td className="py-3 px-2 text-right text-[#8E8B81]">
                          {it.minimumStock.toLocaleString("id-ID")}
                        </td>

                        {/* Editable Requested Qty */}
                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            step="1"
                            value={it.requestedQty}
                            onChange={(e) =>
                              handleItemQtyChange(it.id, parseFloat(e.target.value))
                            }
                            className="w-24 p-1.5 text-right bg-white border border-neutral-300 font-bold text-[#141413] rounded-xs focus:border-[#141413] outline-hidden shadow-2xs font-mono"
                          />
                        </td>

                        {/* Unit */}
                        <td className="py-3 px-2 text-center text-[#626058]">{it.unit}</td>

                        {/* Est. Price */}
                        <td className="py-3 px-3 text-right text-[#626058]">
                          Rp {it.estimatedPrice.toLocaleString("id-ID")}
                        </td>

                        {/* Subtotal */}
                        <td className="py-3 px-3 text-right font-extrabold text-[#141413]">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </td>

                        {/* Supplier */}
                        <td className="py-3 px-3 text-[11px] text-[#141413] font-medium">
                          {it.supplier}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#141413]/10 font-mono">
              <span className="text-xs text-[#8E8B81]">
                Total Estimasi Nilai Pengadaan PR:
              </span>
              <strong className="font-display font-extrabold text-xl text-[#141413]">
                Rp {currentPrTotalCost.toLocaleString("id-ID")}
              </strong>
            </div>
          </section>
        </div>

        {/* ============================================================
            RIGHT WORKBENCH (lg:col-span-4)
            Section 06: Approval Workflow
            Section 07: Budget Overview
            Section 08: Attachments
            Section 09: Activity Timeline
            Section 10: Actions
            ============================================================ */}
        <div className="lg:col-span-4 space-y-8">
          {/* ==========================================================
              SECTION 06: APPROVAL WORKFLOW (5 Tiers)
              Kitchen Supervisor → Warehouse → Purchasing →
              Finance → Management
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                CHAIN OF PROCUREMENT AUTHORITY
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Approval Workflow
              </h3>
            </div>

            <div className="space-y-3">
              {currentPr.approvals.map((app, idx) => (
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
                      Waktu Verifikasi: {app.timestamp}
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
              SECTION 07: BUDGET OVERVIEW
              Estimated Budget, Approved Budget, Variance, Monthly Budget
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                DEPARTMENTAL FISCAL CONTROL
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Budget Overview
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                  <span className="text-[9px] text-[#8E8B81] uppercase block">Estimated PR Cost</span>
                  <strong className="text-sm text-[#141413] block mt-0.5">
                    Rp {currentPrTotalCost.toLocaleString("id-ID")}
                  </strong>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                  <span className="text-[9px] text-[#8E8B81] uppercase block">Approved Ceiling</span>
                  <strong className="text-sm text-emerald-800 block mt-0.5">
                    Rp {currentPrTotalCost.toLocaleString("id-ID")}
                  </strong>
                </div>
              </div>

              {/* Progress bar tracking monthly budget */}
              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#8E8B81]">Alokasi Bulanan ({currentPr.budgetCode}):</span>
                  <strong className="text-[#141413]">
                    Rp {currentPr.monthlyBudget.toLocaleString("id-ID")}
                  </strong>
                </div>

                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-200 ease-out"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((currentPr.usedBudget + currentPrTotalCost) / currentPr.monthlyBudget) * 100)
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] text-[#626058]">
                  <span>
                    Terpakai: Rp {(currentPr.usedBudget + currentPrTotalCost).toLocaleString("id-ID")} (
                    {Math.round(((currentPr.usedBudget + currentPrTotalCost) / currentPr.monthlyBudget) * 100)}%)
                  </span>
                  <span className="text-emerald-700 font-bold">✓ Sisa Kuota Aman</span>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 08: ATTACHMENTS
              Quotation, Specification, Supporting Documents
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  AUDIT EVIDENCE &amp; QUOTATIONS
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Attachments
                </h3>
              </div>
              <button
                type="button"
                onClick={() => showToast("Unggah lampiran baru (PDF / Penawaran).")}
                className="text-xs text-[#C85A17] hover:underline font-bold cursor-pointer"
              >
                + Lampirkan File
              </button>
            </div>

            {currentPr.attachments.length === 0 ? (
              <p className="text-xs text-[#8E8B81] italic py-2 text-center">
                Belum ada berkas lampiran pendukung.
              </p>
            ) : (
              <div className="space-y-2">
                {currentPr.attachments.map((att) => (
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
              SECTION 09: ACTIVITY TIMELINE (4 Steps)
              Request Created → Reviewed → Approved → Converted to Purchase Order
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                PROCUREMENT LIFECYCLE
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Activity Timeline
              </h3>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#141413]/15">
              {[
                { step: 1, title: "Request Created", desc: "Permintaan pengadaan diterbitkan oleh departemen" },
                { step: 2, title: "Reviewed & Verified", desc: "Verifikasi kuota anggaran & stok fisik gudang" },
                { step: 3, title: "Approved", desc: "Otorisasi pengesahan oleh Finance & Manajemen" },
                {
                  step: 4,
                  title: "Converted to Purchase Order",
                  desc: currentPr.convertedPoNumber
                    ? `Diterbitkan PO resmi: ${currentPr.convertedPoNumber}`
                    : "Siap diterbitkan Purchase Order resmi",
                },
              ].map((st) => {
                const isPassed = currentPr.timelineStep >= st.step;
                const isCurrent = currentPr.timelineStep === st.step;

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
              SECTION 10: ACTIONS
              Approve, Reject, Convert to PO, Print, Export
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-3.5 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                EXECUTION COMMANDS
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                PR Actions
              </h3>
            </div>

            <div className="space-y-2">
              {/* Approve */}
              <button
                type="button"
                onClick={() => {
                  setPurchaseRequests((prev) =>
                    prev.map((p) =>
                      p.id === currentPr.id
                        ? {
                            ...p,
                            status: "Approved",
                            timelineStep: 3,
                            approvals: p.approvals.map((a) => ({
                              ...a,
                              status: "Approved",
                              timestamp: a.timestamp || "21 Okt 21:30 WIB",
                            })),
                          }
                        : p
                    )
                  );
                  showToast(`Purchase Request ${currentPr.prNumber} DISETUJUI penuh oleh manajemen.`);
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
              >
                ✓ Approve Requisition (Setujui Pengadaan)
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Reject */}
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseRequests((prev) =>
                      prev.map((p) =>
                        p.id === currentPr.id ? { ...p, status: "Rejected" } : p
                      )
                    );
                    showToast(`Purchase Request ${currentPr.prNumber} DITOLAK.`);
                  }}
                  className="py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-center rounded-xs cursor-pointer shadow-xs"
                >
                  ✕ Reject
                </button>

                {/* Convert to PO */}
                <button
                  type="button"
                  onClick={() => {
                    const generatedPo = `PO-ZKS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                    setPurchaseRequests((prev) =>
                      prev.map((p) =>
                        p.id === currentPr.id
                          ? {
                              ...p,
                              status: "Converted to PO",
                              timelineStep: 4,
                              convertedPoNumber: generatedPo,
                            }
                          : p
                      )
                    );
                    showToast(
                      `Purchase Order ${generatedPo} berhasil diterbitkan dan dikirim ke modul Purchasing.`
                    );
                  }}
                  className="py-2.5 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold text-center rounded-xs cursor-pointer shadow-xs"
                >
                  📑 Convert to PO
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {/* Print */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Print PR Slip 🖨️
                </button>

                {/* Export */}
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Export PDF / Excel 📊
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ==============================================================
          MODALS: NEW PR, IMPORT EXCEL, EXPORT, ATTACHMENT VIEWER
          ============================================================== */}

      {/* 1. New Purchase Request Modal */}
      {isNewPrModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  New Requisition Form
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Create Purchase Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPrModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Tiket Purchase Request baru berhasil diterbitkan.");
                setIsNewPrModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#141413] font-bold mb-1">Departemen Pemohon:</label>
                <select className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden">
                  <option>Kitchen Hot Production</option>
                  <option>Cold Chain Storage</option>
                  <option>Packaging &amp; Staging</option>
                  <option>Dry Storage &amp; Grains</option>
                </select>
              </div>

              <div>
                <label className="block text-[#141413] font-bold mb-1">Tujuan / Keperluan Pengadaan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengadaan bahan prasmanan 2,500 pax PT. Komatsu"
                  className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#141413] font-bold mb-1">Target Tanggal Tiba:</label>
                  <input
                    type="date"
                    defaultValue="2026-10-23"
                    className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#141413] font-bold mb-1">Prioritas:</label>
                  <select className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden">
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button
                  type="button"
                  onClick={() => setIsNewPrModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
                >
                  Terbitkan Purchase Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Import Excel Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Procurement Batch Importer
                </span>
                <strong className="font-display font-extrabold text-lg text-[#141413]">
                  Import Excel PR Sheet
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
              Unggah format daftar item pengadaan dari file Excel (.xlsx / .csv) sesuai template
              pengadaan PT. Zahdan Kamal Sentosa.
            </p>

            <div className="p-6 border-2 border-dashed border-neutral-300 rounded-xs text-center space-y-2 bg-neutral-50/50">
              <span className="text-3xl block">📥</span>
              <span className="text-xs text-[#141413] font-bold block">
                Tarik file Excel ke sini atau klik untuk memilih
              </span>
              <span className="text-[10px] text-[#8E8B81] block">
                Format didukung: .xlsx, .csv (Maksimal 15MB)
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
                  showToast("Daftar item pengadaan dari Excel berhasil diimpor.");
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
              >
                Impor Data PR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Procurement Dossier Export
                </span>
                <strong className="font-display font-extrabold text-lg text-[#141413]">
                  Export Purchase Request
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
              Unduh berkas dokumen Purchase Request resmi lengkap beserta tabel item dan tanda tangan
              otorisasi:
            </p>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Nomor Dokumen:</span>
                <strong className="text-[#141413]">{currentPr.prNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Departemen:</span>
                <span className="text-[#141413]">{currentPr.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Total Nilai:</span>
                <strong className="text-emerald-800">
                  Rp {currentPrTotalCost.toLocaleString("id-ID")}
                </strong>
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
                  showToast(`Dokumen PR ${currentPr.prNumber} berhasil diunduh dalam format PDF.`);
                  setIsExportModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
              >
                Unduh PDF Resmi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Attachment Viewer Modal */}
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
              <span>📑</span>
              <span className="text-xs text-[#8E8B81] mt-2">{selectedAttachment.type}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#626058]">
              <span>Ukuran Dokumen: {selectedAttachment.size}</span>
              <span className="text-emerald-700 font-bold">✓ Terverifikasi Purchasing</span>
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
                Unduh Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
