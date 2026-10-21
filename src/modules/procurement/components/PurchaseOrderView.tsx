"use client";

import React, { useState, useMemo } from "react";

// --- TYPES & INTERFACES ---
export type POStatus =
  | "Draft"
  | "Waiting Approval"
  | "Approved"
  | "Sent"
  | "Partially Delivered"
  | "Completed"
  | "Cancelled";

export interface SupplierInfo {
  company: string;
  pic: string;
  contact: string;
  address: string;
  taxNumber: string; // NPWP
  bankAccount: string;
}

export interface PurchasedItem {
  id: string;
  sku: string;
  name: string;
  imageEmoji: string;
  qty: number;
  unit: string;
  unitPrice: number;
  discountPct: number; // e.g. 0 or 5%
  taxRatePct: number; // e.g. 11% or 0%
  supplierNotes: string;
}

export interface SupplierPerformance {
  onTimeDeliveryPct: number;
  avgLeadTimeDays: number;
  qualityRating: number; // out of 5.0
  previousOrdersCount: number;
  priceTrend: string;
}

export interface POApproval {
  role: "Purchasing Officer" | "Purchasing Manager" | "Finance" | "Director";
  name: string;
  status: "Approved" | "Pending" | "Waiting" | "Rejected";
  timestamp?: string;
  notes?: string;
}

export interface PODocument {
  id: string;
  name: string;
  type: "Quotation" | "Supplier Contract" | "Invoice" | "Packing List" | "Delivery Order";
  size: string;
  uploadedAt: string;
}

export interface ActivityLogItem {
  id: string;
  who: string;
  when: string;
  action: string;
  changes: string;
  approval: string;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  linkedPrNumber?: string;
  supplier: SupplierInfo;
  warehouse: string;
  deliveryAddress: string;
  paymentTerms: string;
  incoterms: string;
  currency: string;
  expectedDelivery: string;
  buyer: string;
  status: POStatus;
  timelineStep: number; // 1: Created, 2: Approved, 3: Sent, 4: Supplier Confirmed, 5: Shipping, 6: Receiving, 7: Completed
  items: PurchasedItem[];
  shippingCost: number;
  supplierPerformance: SupplierPerformance;
  approvals: POApproval[];
  documents: PODocument[];
  activityLog: ActivityLogItem[];
}

// --- MOCK REALISTIC INDUSTRIAL PURCHASE ORDERS DATA ---
const INITIAL_PURCHASE_ORDERS: PurchaseOrderRecord[] = [
  {
    id: "po-01",
    poNumber: "PO-ZKS-2026-1082",
    linkedPrNumber: "PR-2026-1021-0012",
    supplier: {
      company: "PT. Sumber Unggas Makmur",
      pic: "H. Hendri Kurniawan",
      contact: "0812-8877-6655 • sales@sumberunggas.co.id",
      address: "Kawasan Industri RPH Unggas Terpadu Blok C-12, Karawang Barat, Jawa Barat 41361",
      taxNumber: "01.882.341.5-408.000 (PKP Terdaftar)",
      bankAccount: "Bank Mandiri • 131-00-881928-1 a/n PT Sumber Unggas Makmur",
    },
    warehouse: "Cold Storage (Chiller Wing 1 - Loading Dock 2)",
    deliveryAddress: "PT. Zahdan Kamal Sentosa Central Commissary Hub, Jl. Raya Industri No. 48, Cikarang, Bekasi",
    paymentTerms: "Net 30 Days (Transfer Bank)",
    incoterms: "DDP (Delivered Duty Paid with Cold Truck)",
    currency: "IDR",
    expectedDelivery: "23 Okt 2026, 08:00 WIB",
    buyer: "Ibu Dewi Anggraini (Senior Buyer)",
    status: "Sent",
    timelineStep: 3,
    shippingCost: 350000,
    items: [
      {
        id: "item-po-1",
        sku: "RM-00021",
        name: "Chicken Breast Fillet Paha (Grade A)",
        imageEmoji: "🍗",
        qty: 500.0,
        unit: "kg",
        unitPrice: 42000,
        discountPct: 0,
        taxRatePct: 0, // PPN DTP Pangan Segar Bebas PPN
        supplierNotes: "Daging dingin tanpa tulang, suhu kabin reefer wajib antara -2°C s/d +4°C",
      },
      {
        id: "item-po-2",
        sku: "RM-00024",
        name: "Sayap Ayam Utuh (Mid-Joint Wing)",
        imageEmoji: "🍗",
        qty: 200.0,
        unit: "kg",
        unitPrice: 38000,
        discountPct: 2.5,
        taxRatePct: 0,
        supplierNotes: "Ukuran seragam 85g/potong, kemasan master karton 10kg isi 5 plastik vakum",
      },
    ],
    supplierPerformance: {
      onTimeDeliveryPct: 98.4,
      avgLeadTimeDays: 1.8,
      qualityRating: 4.9,
      previousOrdersCount: 42,
      priceTrend: "Stabil (-1.5% di bawah benchmark pasar)",
    },
    approvals: [
      {
        role: "Purchasing Officer",
        name: "Ibu Dewi Anggraini",
        status: "Approved",
        timestamp: "21 Okt 10:15 WIB",
        notes: "Sesuai kontrak harga kuartal 4 & alokasi budget PR-0012",
      },
      {
        role: "Purchasing Manager",
        name: "Bapak Tri Wicaksono",
        status: "Approved",
        timestamp: "21 Okt 10:45 WIB",
        notes: "Otorisasi vendor prioritas lolos audit sertifikasi halal",
      },
      {
        role: "Finance",
        name: "Ibu Anita (Finance Controller)",
        status: "Approved",
        timestamp: "21 Okt 11:20 WIB",
        notes: "Plafon kredit vendor tersedia, terms Net 30 disetujui",
      },
      {
        role: "Director",
        name: "Pak Handoko (Direktur Operasional)",
        status: "Approved",
        timestamp: "21 Okt 11:50 WIB",
        notes: "Disahkan untuk pengadaan katering Bank Mandiri 3,200 Pax",
      },
    ],
    documents: [
      { id: "doc-1", name: "Surat_Penawaran_Vendor_SUM_Q4.pdf", type: "Quotation", size: "340 KB", uploadedAt: "21 Okt 09:00" },
      { id: "doc-2", name: "Perjanjian_Kontrak_Payung_2026.pdf", type: "Supplier Contract", size: "1.4 MB", uploadedAt: "15 Jan 2026" },
      { id: "doc-3", name: "Proforma_Invoice_SUM_1082.pdf", type: "Invoice", size: "260 KB", uploadedAt: "21 Okt 11:55" },
    ],
    activityLog: [
      {
        id: "log-1",
        who: "Ibu Dewi Anggraini (Purchasing)",
        when: "21 Okt 2026, 10:15 WIB",
        action: "PO Generated from PR",
        changes: "Draft dibuat berdasarkan Purchase Request PR-2026-1021-0012",
        approval: "Draft Tier 1 Initiated",
      },
      {
        id: "log-2",
        who: "Bapak Tri Wicaksono (Purchasing Mgr)",
        when: "21 Okt 2026, 10:45 WIB",
        action: "Manager Sign-off",
        changes: "Diskon volume 2.5% untuk sayap ayam disahkan",
        approval: "Approved Tier 2",
      },
      {
        id: "log-3",
        who: "Pak Handoko (Director)",
        when: "21 Okt 2026, 11:50 WIB",
        action: "Final Executive Authorization",
        changes: "Status PO dinaikkan ke Approved & diterbitkan dokumen resmi",
        approval: "Final Approved",
      },
      {
        id: "log-4",
        who: "System EDI Dispatch",
        when: "21 Okt 2026, 12:00 WIB",
        action: "PO Sent to Vendor",
        changes: "Dokumen dikirim via WhatsApp Business API & Email ke sales@sumberunggas.co.id",
        approval: "Dispatched",
      },
    ],
  },
  {
    id: "po-02",
    poNumber: "PO-ZKS-2026-1085",
    linkedPrNumber: "PR-2026-1020-0009",
    supplier: {
      company: "Koperasi Tani Karawang Sejahtera",
      pic: "Pak Dedi Mulyadi",
      contact: "0857-1122-3344 • dedikoperasitani@gmail.com",
      address: "Sentra Penggilingan Padi Terpadu Km 14, Rengasdengklok, Karawang, Jawa Barat",
      taxNumber: "02.441.982.1-409.000",
      bankAccount: "Bank BRI • 0012-01-002931-50-2 a/n Koperasi Tani Karawang",
    },
    warehouse: "Main Warehouse (Gudang Utama - Bay G-01)",
    deliveryAddress: "PT. Zahdan Kamal Sentosa Central Commissary Hub, Cikarang",
    paymentTerms: "Net 14 Days",
    incoterms: "FOB Destination (Truk Penggilingan)",
    currency: "IDR",
    expectedDelivery: "22 Okt 2026, 09:00 WIB",
    buyer: "Yusuf Supriatna",
    status: "Partially Delivered",
    timelineStep: 6,
    shippingCost: 500000,
    items: [
      {
        id: "item-po-3",
        sku: "RM-00012",
        name: "Beras Ramos Premium IR-64 (Zak 50kg)",
        imageEmoji: "🌾",
        qty: 4000.0,
        unit: "kg",
        unitPrice: 14500,
        discountPct: 0,
        taxRatePct: 0,
        supplierNotes: "Kadar air di bawah 14%, tanpa poles pemutih kimia",
      },
    ],
    supplierPerformance: {
      onTimeDeliveryPct: 96.5,
      avgLeadTimeDays: 2.1,
      qualityRating: 4.8,
      previousOrdersCount: 28,
      priceTrend: "Kompetitif langsung dari petani mitra",
    },
    approvals: [
      { role: "Purchasing Officer", name: "Yusuf Supriatna", status: "Approved", timestamp: "20 Okt 14:30 WIB" },
      { role: "Purchasing Manager", name: "Tri Wicaksono", status: "Approved", timestamp: "20 Okt 15:00 WIB" },
      { role: "Finance", name: "Ibu Anita", status: "Approved", timestamp: "20 Okt 15:30 WIB" },
      { role: "Director", name: "Pak Handoko", status: "Approved", timestamp: "20 Okt 16:00 WIB" },
    ],
    documents: [
      { id: "doc-4", name: "DO_Koperasi_Karawang_1085.pdf", type: "Delivery Order", size: "190 KB", uploadedAt: "21 Okt 08:30" },
      { id: "doc-5", name: "Packing_List_Beras_80Zak.pdf", type: "Packing List", size: "140 KB", uploadedAt: "21 Okt 08:35" },
    ],
    activityLog: [
      {
        id: "log-5",
        who: "Yusuf Supriatna",
        when: "20 Okt 2026, 14:30 WIB",
        action: "PO Created",
        changes: "Pengadaan 4 Ton beras IR-64 disetujui",
        approval: "Completed",
      },
    ],
  },
  {
    id: "po-03",
    poNumber: "PO-ZKS-2026-1088",
    supplier: {
      company: "PT. Wilmar Cahaya Nabati",
      pic: "Ibu Rina Sukmawati",
      contact: "0811-9900-1122 • rina.sukmawati@wilmar.co.id",
      address: "Multivision Tower Lt. 12, Jl. Kuningan Mulia Kav. 9B, Jakarta Selatan",
      taxNumber: "01.002.665.4-064.000",
      bankAccount: "Bank BCA • 008-882-9911 a/n PT Wilmar Cahaya Nabati",
    },
    warehouse: "Main Warehouse (Bay M-02)",
    deliveryAddress: "PT. Zahdan Kamal Sentosa Central Commissary Hub, Cikarang",
    paymentTerms: "Net 30 Days",
    incoterms: "DDP (Armada Box Wilmar)",
    currency: "IDR",
    expectedDelivery: "24 Okt 2026, 11:00 WIB",
    buyer: "Ibu Dewi Anggraini",
    status: "Waiting Approval",
    timelineStep: 2,
    shippingCost: 0,
    items: [
      {
        id: "item-po-4",
        sku: "RM-00004",
        name: "Minyak Goreng Sawit Higienis (Jerigen 20L)",
        imageEmoji: "🛢️",
        qty: 50.0,
        unit: "Jerigen",
        unitPrice: 330000,
        discountPct: 0,
        taxRatePct: 11,
        supplierNotes: "Kemasan jerigen baru tersegel segel pabrik",
      },
    ],
    supplierPerformance: {
      onTimeDeliveryPct: 99.2,
      avgLeadTimeDays: 1.5,
      qualityRating: 5.0,
      previousOrdersCount: 64,
      priceTrend: "Kontrak korporat diskon khusus kuartal 4",
    },
    approvals: [
      { role: "Purchasing Officer", name: "Ibu Dewi", status: "Approved", timestamp: "21 Okt 13:00 WIB" },
      { role: "Purchasing Manager", name: "Tri Wicaksono", status: "Approved", timestamp: "21 Okt 13:30 WIB" },
      { role: "Finance", name: "Ibu Anita", status: "Pending", notes: "Verifikasi faktur pajak PPN 11%" },
      { role: "Director", name: "Pak Handoko", status: "Waiting" },
    ],
    documents: [],
    activityLog: [
      {
        id: "log-6",
        who: "Ibu Dewi Anggraini",
        when: "21 Okt 2026, 13:00 WIB",
        action: "PO Created",
        changes: "Pemesanan 50 Jerigen Minyak Goreng 20L",
        approval: "Pending Finance",
      },
    ],
  },
];

export default function PurchaseOrderClient() {
  // --- STATE ---
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_PURCHASE_ORDERS);
  const [selectedPoId, setSelectedPoId] = useState<string>("po-01");

  // Modals & Feedback
  const [isNewPoModalOpen, setIsNewPoModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PODocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected Record
  const currentPo = purchaseOrders.find((p) => p.id === selectedPoId) || purchaseOrders[0];

  // Automatic Calculation for Purchased Items: Subtotal, Tax, Shipping, Grand Total
  const calculatedTotals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;

    currentPo.items.forEach((it) => {
      const lineBase = it.qty * it.unitPrice;
      const discountAmount = (lineBase * it.discountPct) / 100;
      const taxableAmount = lineBase - discountAmount;
      const taxAmount = (taxableAmount * it.taxRatePct) / 100;

      subtotal += taxableAmount;
      totalTax += taxAmount;
    });

    const grandTotal = subtotal + totalTax + currentPo.shippingCost;

    return {
      subtotal,
      totalTax,
      shippingCost: currentPo.shippingCost,
      grandTotal,
    };
  }, [currentPo.items, currentPo.shippingCost]);

  // Executive Procurement Summary (Section 01 KPIs)
  const executiveKPIs = useMemo(() => {
    let openCount = 0;
    let waitingCount = 0;
    let inDeliveryCount = 0;
    let completedCount = 0;
    let totalValue = 0;

    purchaseOrders.forEach((p) => {
      if (p.status === "Approved" || p.status === "Sent") openCount += 1;
      if (p.status === "Waiting Approval") waitingCount += 1;
      if (p.status === "Sent" || p.status === "Partially Delivered") inDeliveryCount += 1;
      if (p.status === "Completed") completedCount += 1;

      // sum value
      p.items.forEach((it) => {
        const lineBase = it.qty * it.unitPrice;
        const discountAmount = (lineBase * it.discountPct) / 100;
        totalValue += lineBase - discountAmount;
      });
    });

    return {
      openCount,
      waitingCount,
      inDeliveryCount,
      completedCount,
      supplierPerf: "98.2%",
      monthlyValue: totalValue.toLocaleString("id-ID"),
    };
  }, [purchaseOrders]);

  // Inline Item Qty and Price Handler
  const handleItemValueChange = (
    itemId: string,
    field: "qty" | "unitPrice",
    newValue: number
  ) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => {
        if (p.id !== currentPo.id) return p;
        return {
          ...p,
          items: p.items.map((it) => {
            if (it.id !== itemId) return it;
            return {
              ...it,
              [field]: isNaN(newValue) ? 0 : newValue,
            };
          }),
        };
      })
    );
  };

  // Status Badge Renderer
  const renderStatusBadge = (status: POStatus) => {
    switch (status) {
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-300">
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
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            ✓ Approved
          </span>
        );
      case "Sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Sent to Vendor
          </span>
        );
      case "Partially Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-300">
            Partial Delivery
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 rounded-xs">
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300">
            Cancelled
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
          Purchase Orders
          Subtitle: Manage supplier purchase orders with complete lifecycle tracking.
          Top Right: New PO, Generate from PR, Export
          ============================================================== */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#141413]/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
              PT. ZAHDAN KAMAL SENTOSA
            </span>
            <span className="text-[#8E8B81] text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#141413] font-semibold block">
              SUPPLIER PROCUREMENT &amp; CONTRACT DOCK
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Legal Contract Validated
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Purchase Orders
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Manage supplier purchase orders with complete lifecycle tracking.
          </p>
        </div>

        {/* Top Right Action Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* New PO */}
          <button
            type="button"
            onClick={() => setIsNewPoModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New PO</span>
          </button>

          {/* Generate from PR */}
          <button
            type="button"
            onClick={() =>
              showToast("Modul sinkronisasi Purchase Request memuat draft PO otomatis.")
            }
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#C85A17]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Generate from PR</span>
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
          SECTION 01: EXECUTIVE PROCUREMENT SUMMARY (6 Cards)
          - Open Purchase Orders
          - Waiting Approval
          - In Delivery
          - Completed
          - Supplier Performance
          - Monthly Procurement Value
          ============================================================== */}
      <section aria-labelledby="executive-summary-heading">
        <h2 id="executive-summary-heading" className="sr-only">
          Executive Procurement Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Open Purchase Orders */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Open POs
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              {executiveKPIs.openCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Order</span>
            </p>
            <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
              Telah disahkan &amp; dikirim
            </span>
          </div>

          {/* 2. Waiting Approval */}
          <div className="p-4 bg-white border border-amber-200/80 space-y-1 shadow-2xs ring-1 ring-amber-500/10">
            <span className="text-[10px] uppercase text-amber-700 font-bold block">
              Waiting Approval
            </span>
            <p className="font-display font-extrabold text-2xl text-amber-700">
              {executiveKPIs.waitingCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Tiket</span>
            </p>
            <span className="text-[10px] text-amber-800 block pt-1 border-t border-amber-100">
              Menunggu sign-off finance
            </span>
          </div>

          {/* 3. In Delivery */}
          <div className="p-4 bg-white border border-blue-200/80 space-y-1 shadow-2xs ring-1 ring-blue-500/10">
            <span className="text-[10px] uppercase text-blue-700 font-bold block">
              In Delivery
            </span>
            <p className="font-display font-extrabold text-2xl text-blue-700">
              {executiveKPIs.inDeliveryCount}{" "}
              <span className="text-xs font-normal text-[#626058]">Armada</span>
            </p>
            <span className="text-[10px] text-blue-800 block pt-1 border-t border-blue-100">
              Menuju dermaga bongkar
            </span>
          </div>

          {/* 4. Completed */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Completed
            </span>
            <p className="font-display font-extrabold text-2xl text-emerald-700">
              {executiveKPIs.completedCount}{" "}
              <span className="text-xs font-normal text-[#626058]">PO</span>
            </p>
            <span className="text-[10px] text-emerald-800 block pt-1 border-t border-black/5">
              GRN diterbitkan &amp; lunas
            </span>
          </div>

          {/* 5. Supplier Performance */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Supplier OTIF
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              {executiveKPIs.supplierPerf}
            </p>
            <span className="text-[10px] text-emerald-700 block pt-1 border-t border-black/5">
              On-Time In-Full rating
            </span>
          </div>

          {/* 6. Monthly Procurement Value */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Monthly PO Value
            </span>
            <p className="font-display font-extrabold text-lg text-[#141413] truncate">
              Rp {executiveKPIs.monthlyValue}
            </p>
            <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
              Akumulasi belanja Q4
            </span>
          </div>
        </div>
      </section>

      {/* ==============================================================
          RESPONSIVE SPLIT WORKBENCH
          Desktop: Split layout (Left: Section 02, 03, 04, 05; Right: Section 06, 07, 08, 09, 10)
          Tablet: Single Column
          Mobile: Card layout
          ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================
            LEFT WORKBENCH (lg:col-span-8 or 7)
            ============================================================ */}
        <div className="lg:col-span-8 space-y-8">
          {/* ==========================================================
              SECTION 02: PURCHASE ORDER LIST (Modern Enterprise Table)
              Columns: PO Number, Supplier, Items, Grand Total, ETA,
                       Status, Payment Terms, Buyer, Actions
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  LEGAL PURCHASE ORDERS REGISTER
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Purchase Order List
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">
                Pilih baris untuk membuka kontrak detail, profil vendor, dan pelacakan pengiriman
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-[#141413]/10 text-[10px] font-mono uppercase tracking-wider text-[#626058]">
                    <th className="py-2.5 px-3">PO Number</th>
                    <th className="py-2.5 px-3 font-semibold">Supplier</th>
                    <th className="py-2.5 px-2 text-center">Items</th>
                    <th className="py-2.5 px-3 text-right">Grand Total</th>
                    <th className="py-2.5 px-3">ETA</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Payment Terms</th>
                    <th className="py-2.5 px-3">Buyer</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5 text-xs font-mono">
                  {purchaseOrders.map((po) => {
                    const isSelected = selectedPoId === po.id;
                    const itemsTotal = po.items.reduce(
                      (acc, it) => acc + it.qty * it.unitPrice,
                      0
                    );

                    return (
                      <tr
                        key={po.id}
                        onClick={() => setSelectedPoId(po.id)}
                        className={`transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/70 ring-1 ring-[#C85A17]/30"
                            : "hover:bg-[#FAF9F5]"
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-[#141413] whitespace-nowrap">
                          {po.poNumber}
                          {po.linkedPrNumber && (
                            <span className="block text-[9px] text-[#8E8B81] font-normal">
                              Ref: {po.linkedPrNumber}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-sans font-bold text-[#141413] whitespace-nowrap">
                          {po.supplier.company}
                          <span className="block text-[10px] font-mono text-[#8E8B81] font-normal">
                            PIC: {po.supplier.pic}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-[#141413] whitespace-nowrap">
                          {po.items.length} Item
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-[#141413] whitespace-nowrap">
                          Rp {itemsTotal.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-3 text-[#141413] whitespace-nowrap">
                          {po.expectedDelivery.split(",")[0]}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {renderStatusBadge(po.status)}
                        </td>
                        <td className="py-3 px-3 text-[#626058] whitespace-nowrap text-[11px]">
                          {po.paymentTerms}
                        </td>
                        <td className="py-3 px-3 text-[#141413] whitespace-nowrap">
                          {po.buyer.split(" ")[0]} {po.buyer.split(" ")[1] || ""}
                        </td>
                        <td
                          className="py-3 px-3 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedPoId(po.id)}
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
              SECTION 03: PURCHASE ORDER DETAIL
              General Information & Complete Supplier Profile:
              - PO Number, Supplier (Company, PIC, Contact, Address, Tax Number, Bank Account)
              - Warehouse, Delivery Address, Payment Terms, Incoterms, Currency, Expected Delivery
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  LEGAL BINDING PURCHASE AGREEMENT
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Purchase Order Detail — {currentPo.poNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {renderStatusBadge(currentPo.status)}
              </div>
            </div>

            {/* Supplier Profile & Tax/Banking Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Supplier Credentials Card */}
              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-2">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Supplier Corporate Identity
                </span>
                <p className="font-sans font-bold text-sm text-[#141413]">
                  {currentPo.supplier.company}
                </p>
                <div className="text-[11px] text-[#626058] space-y-0.5">
                  <p>PIC Kontak: <strong className="text-[#141413]">{currentPo.supplier.pic}</strong></p>
                  <p>Telepon / Surel: {currentPo.supplier.contact}</p>
                  <p className="pt-1">Alamat Terdaftar: {currentPo.supplier.address}</p>
                </div>
              </div>

              {/* Tax & Banking Credentials */}
              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-2">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Tax Number (NPWP) &amp; Bank Account
                </span>
                <div className="text-[11px] space-y-1">
                  <p>
                    <span className="text-[#8E8B81]">NPWP / Tax ID:</span>{" "}
                    <strong className="text-[#141413] font-bold">{currentPo.supplier.taxNumber}</strong>
                  </p>
                  <p>
                    <span className="text-[#8E8B81]">Rekening Penerima:</span>{" "}
                    <strong className="text-emerald-800 font-bold block mt-0.5">
                      {currentPo.supplier.bankAccount}
                    </strong>
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs font-mono">
                    ✓ Rekening Terverifikasi Rekanan Resmi ZKS
                  </span>
                </div>
              </div>

              {/* Delivery Logistics */}
              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Destination Warehouse &amp; Dock
                </span>
                <p className="font-bold text-xs text-[#141413]">{currentPo.warehouse}</p>
                <p className="text-[11px] text-[#626058] leading-tight">
                  Alamat Kirim: {currentPo.deliveryAddress}
                </p>
              </div>

              {/* Commercial Terms */}
              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-1.5">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Commercial Terms &amp; IncoTerms
                </span>
                <div className="text-[11px] text-[#626058] space-y-0.5">
                  <p>Syarat Pembayaran: <strong className="text-[#141413]">{currentPo.paymentTerms}</strong></p>
                  <p>Incoterms: <strong className="text-[#141413]">{currentPo.incoterms}</strong></p>
                  <p>Mata Uang: {currentPo.currency} (Indonesian Rupiah)</p>
                  <p>Target Tiba (ETA): <strong className="text-[#C85A17]">{currentPo.expectedDelivery}</strong></p>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 04: PURCHASED ITEMS (Modern Editable Table with Auto Calculations)
              Columns: Image, SKU, Item, Qty, Unit, Unit Price, Discount, Tax, Total, Supplier Notes
              Automatically Calculate: Subtotal, Tax, Shipping, Grand Total
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  COMMERCIAL PURCHASE SCHEDULE
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Purchased Items ({currentPo.items.length} Komoditas)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-xs">
                Perhitungan otomatis Subtotal, Diskon, PPN, dan Biaya Kirim
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[10px] text-[#8E8B81] uppercase tracking-wider bg-neutral-50/70">
                    <th className="py-2.5 px-3">Item / SKU</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-2 text-right">Disc %</th>
                    <th className="py-2.5 px-2 text-right">Tax %</th>
                    <th className="py-2.5 px-3 text-right">Total Line</th>
                    <th className="py-2.5 px-3">Supplier Handling Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5">
                  {currentPo.items.map((it) => {
                    const lineBase = it.qty * it.unitPrice;
                    const discountVal = (lineBase * it.discountPct) / 100;
                    const taxable = lineBase - discountVal;
                    const taxVal = (taxable * it.taxRatePct) / 100;
                    const lineTotal = taxable + taxVal;

                    return (
                      <tr key={it.id} className="hover:bg-neutral-50/60">
                        {/* Image / Item / SKU */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl p-1 bg-neutral-100 rounded-xs border border-neutral-200">
                              {it.imageEmoji}
                            </span>
                            <div>
                              <strong className="font-sans font-bold text-[#141413] block">
                                {it.name}
                              </strong>
                              <span className="text-[10px] text-[#8E8B81]">SKU: {it.sku}</span>
                            </div>
                          </div>
                        </td>

                        {/* Editable Qty */}
                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            step="1"
                            value={it.qty}
                            onChange={(e) =>
                              handleItemValueChange(it.id, "qty", parseFloat(e.target.value))
                            }
                            className="w-20 p-1 text-right bg-white border border-neutral-300 font-bold text-[#141413] rounded-xs focus:border-[#141413] outline-hidden shadow-2xs font-mono"
                          />
                        </td>

                        {/* Unit */}
                        <td className="py-3 px-2 text-center text-[#626058]">{it.unit}</td>

                        {/* Editable Unit Price */}
                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            step="500"
                            value={it.unitPrice}
                            onChange={(e) =>
                              handleItemValueChange(it.id, "unitPrice", parseFloat(e.target.value))
                            }
                            className="w-24 p-1 text-right bg-white border border-neutral-300 font-bold text-[#141413] rounded-xs focus:border-[#141413] outline-hidden shadow-2xs font-mono"
                          />
                        </td>

                        {/* Discount */}
                        <td className="py-3 px-2 text-right text-[#626058]">
                          {it.discountPct > 0 ? `${it.discountPct}%` : "-"}
                        </td>

                        {/* Tax Rate */}
                        <td className="py-3 px-2 text-right text-[#626058]">
                          {it.taxRatePct > 0 ? `${it.taxRatePct}%` : "0% (Exempt)"}
                        </td>

                        {/* Line Total */}
                        <td className="py-3 px-3 text-right font-extrabold text-[#141413]">
                          Rp {lineTotal.toLocaleString("id-ID")}
                        </td>

                        {/* Supplier Notes */}
                        <td className="py-3 px-3 text-[11px] text-[#626058] max-w-xs">
                          {it.supplierNotes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown Box */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-3 border-t border-[#141413]/10 font-mono">
              <span className="text-[11px] text-[#8E8B81]">
                Seluruh nilai pengadaan telah mencakup toleransi timbang fisik dan sertifikasi mutu RPU/BPOM.
              </span>

              <div className="w-full sm:w-72 space-y-1.5 p-3.5 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Subtotal Bahan Baku:</span>
                  <strong className="text-[#141413]">
                    Rp {calculatedTotals.subtotal.toLocaleString("id-ID")}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Pajak Pertambahan Nilai (PPN):</span>
                  <strong className="text-[#141413]">
                    Rp {calculatedTotals.totalTax.toLocaleString("id-ID")}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8B81]">Biaya Pengiriman (Cold Truck):</span>
                  <strong className="text-[#141413]">
                    Rp {calculatedTotals.shippingCost.toLocaleString("id-ID")}
                  </strong>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#141413]/15 text-sm font-bold">
                  <span className="text-[#141413]">Grand Total PO:</span>
                  <strong className="text-emerald-800 text-base font-extrabold font-display">
                    Rp {calculatedTotals.grandTotal.toLocaleString("id-ID")}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 05: SUPPLIER PERFORMANCE
              Cards: On-Time Delivery %, Average Lead Time, Quality Rating,
                     Previous Orders, Price Trend
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                VENDOR SCORECARD &amp; HISTORICAL RELIABILITY
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Supplier Performance — {currentPo.supplier.company}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono">
              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                <span className="text-[9px] uppercase text-[#8E8B81] block">On-Time Delivery</span>
                <strong className="text-base text-emerald-700 block mt-0.5 font-extrabold">
                  {currentPo.supplierPerformance.onTimeDeliveryPct}%
                </strong>
                <span className="text-[9px] text-[#626058]">Target &gt; 95%</span>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                <span className="text-[9px] uppercase text-[#8E8B81] block">Avg. Lead Time</span>
                <strong className="text-base text-[#141413] block mt-0.5 font-extrabold">
                  {currentPo.supplierPerformance.avgLeadTimeDays} Hari
                </strong>
                <span className="text-[9px] text-emerald-800">Sangat Responsif</span>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                <span className="text-[9px] uppercase text-[#8E8B81] block">Quality Rating</span>
                <strong className="text-base text-amber-700 block mt-0.5 font-extrabold">
                  ★ {currentPo.supplierPerformance.qualityRating}
                </strong>
                <span className="text-[9px] text-[#626058]">Uji Fisik QC</span>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs">
                <span className="text-[9px] uppercase text-[#8E8B81] block">Previous Orders</span>
                <strong className="text-base text-[#141413] block mt-0.5 font-extrabold">
                  {currentPo.supplierPerformance.previousOrdersCount} PO
                </strong>
                <span className="text-[9px] text-[#626058]">Rekanan Terpercaya</span>
              </div>

              <div className="p-3 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs col-span-2 sm:col-span-1">
                <span className="text-[9px] uppercase text-[#8E8B81] block">Price Trend</span>
                <strong className="text-xs text-blue-800 block mt-1 font-bold truncate">
                  {currentPo.supplierPerformance.priceTrend}
                </strong>
              </div>
            </div>
          </section>
        </div>

        {/* ============================================================
            RIGHT WORKBENCH (lg:col-span-4)
            Section 06: Approval Workflow
            Section 07: Delivery Tracking (Timeline)
            Section 08: Documents
            Section 09: Activity Log
            Section 10: Actions
            ============================================================ */}
        <div className="lg:col-span-4 space-y-8">
          {/* ==========================================================
              SECTION 06: APPROVAL WORKFLOW (4 Tiers)
              Purchasing Officer → Purchasing Manager → Finance → Director
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                CHAIN OF PROCUREMENT APPROVAL
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Approval Workflow
              </h3>
            </div>

            <div className="space-y-3">
              {currentPo.approvals.map((app, idx) => (
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
              SECTION 07: DELIVERY TRACKING (7-Step Timeline)
              PO Created → Approved → Sent → Supplier Confirmed →
              Shipping → Receiving → Completed
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                SUPPLY CHAIN LIFECYCLE
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Delivery Tracking
              </h3>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#141413]/15">
              {[
                { step: 1, title: "PO Created", desc: "Purchase Order diterbitkan dari kebutuhan PR" },
                { step: 2, title: "Approved", desc: "Disahkan secara legal oleh Direktur & Keuangan" },
                { step: 3, title: "Sent", desc: "Terkirim ke vendor via integrasi EDI & WhatsApp" },
                { step: 4, title: "Supplier Confirmed", desc: "Vendor menyetujui jadwal kirim & slot RPH" },
                { step: 5, title: "Shipping", desc: "Armada pendingin bergerak menuju loading dock" },
                { step: 6, title: "Receiving", desc: "Uji timbang fisik, probe suhu & inspeksi QC" },
                { step: 7, title: "Completed", desc: "GRN diterbitkan & stok masuk ke Cold Storage" },
              ].map((st) => {
                const isPassed = currentPo.timelineStep >= st.step;
                const isCurrent = currentPo.timelineStep === st.step;

                return (
                  <div key={st.step} className="relative group">
                    <div
                      className={`absolute -left-[20px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        isPassed
                          ? isCurrent
                            ? "bg-blue-600 ring-2 ring-blue-300 animate-pulse"
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
              SECTION 08: DOCUMENTS
              Quotation, Supplier Contract, Invoice, Packing List, Delivery Order
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  LEGAL &amp; COMMERCIAL DOSSIER
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Documents
                </h3>
              </div>
              <button
                type="button"
                onClick={() => showToast("Dialog unggah dokumen komersial terbuka.")}
                className="text-xs text-[#C85A17] hover:underline font-bold cursor-pointer"
              >
                + Unggah File
              </button>
            </div>

            {currentPo.documents.length === 0 ? (
              <p className="text-xs text-[#8E8B81] italic py-2 text-center">
                Belum ada dokumen komersial terlampir.
              </p>
            ) : (
              <div className="space-y-2">
                {currentPo.documents.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDocument(doc)}
                    className="w-full p-2.5 bg-[#FAF9F5] hover:bg-neutral-100 border border-[#141413]/10 rounded-xs flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📑</span>
                      <div>
                        <strong className="text-xs text-[#141413] block group-hover:underline">
                          {doc.name}
                        </strong>
                        <span className="text-[10px] text-[#8E8B81]">
                          {doc.type} • {doc.size}
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
              SECTION 09: ACTIVITY LOG
              Everything recorded: Who, When, Action, Changes, Approval
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                IMMUTABLE AUDIT TRAIL
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Activity Log
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {currentPo.activityLog.map((log) => (
                <div key={log.id} className="p-3 bg-[#FAF9F5] border border-[#141413]/5 rounded-xs space-y-1">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-xs text-[#141413] font-bold">{log.action}</strong>
                    <span className="text-[10px] text-[#8E8B81]">{log.when}</span>
                  </div>
                  <p className="text-[11px] text-[#626058] leading-tight">{log.changes}</p>
                  <div className="flex justify-between text-[10px] text-[#8E8B81] pt-1 border-t border-black/5">
                    <span>Oleh: {log.who}</span>
                    <span className="font-bold text-emerald-800">{log.approval}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ==========================================================
              SECTION 10: ACTIONS
              Approve, Reject, Duplicate PO, Send to Supplier, Download PDF, Close PO
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-3.5 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                PROCUREMENT COMMANDS
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                PO Actions
              </h3>
            </div>

            <div className="space-y-2">
              {/* Approve */}
              <button
                type="button"
                onClick={() => {
                  setPurchaseOrders((prev) =>
                    prev.map((p) =>
                      p.id === currentPo.id
                        ? {
                            ...p,
                            status: "Approved",
                            timelineStep: 2,
                            approvals: p.approvals.map((a) => ({
                              ...a,
                              status: "Approved",
                              timestamp: a.timestamp || "21 Okt 21:40 WIB",
                            })),
                          }
                        : p
                    )
                  );
                  showToast(`Purchase Order ${currentPo.poNumber} DISETUJUI penuh oleh Direksi.`);
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
              >
                ✓ Approve Purchase Order
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Send to Supplier */}
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseOrders((prev) =>
                      prev.map((p) =>
                        p.id === currentPo.id
                          ? { ...p, status: "Sent", timelineStep: 3 }
                          : p
                      )
                    );
                    showToast(
                      `PO ${currentPo.poNumber} berhasil dikirim ke ${currentPo.supplier.company} via WhatsApp & Email.`
                    );
                  }}
                  className="py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-center rounded-xs cursor-pointer shadow-xs"
                >
                  📤 Send to Supplier
                </button>

                {/* Reject */}
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseOrders((prev) =>
                      prev.map((p) =>
                        p.id === currentPo.id ? { ...p, status: "Cancelled" } : p
                      )
                    );
                    showToast(`Purchase Order ${currentPo.poNumber} DIBATALKAN.`);
                  }}
                  className="py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-center rounded-xs cursor-pointer shadow-xs"
                >
                  ✕ Reject / Cancel
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Download PDF */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Download PDF 🖨️
                </button>

                {/* Duplicate PO */}
                <button
                  type="button"
                  onClick={() => {
                    const clonedId = `po-dup-${Date.now()}`;
                    const clonedPoNumber = `PO-ZKS-2026-${Math.floor(1090 + Math.random() * 8000)}`;
                    const cloned: PurchaseOrderRecord = {
                      ...currentPo,
                      id: clonedId,
                      poNumber: clonedPoNumber,
                      status: "Draft",
                      timelineStep: 1,
                    };
                    setPurchaseOrders([cloned, ...purchaseOrders]);
                    setSelectedPoId(clonedId);
                    showToast(`Draft klon ${clonedPoNumber} berhasil diduplikasi.`);
                  }}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Duplicate PO 📑
                </button>

                {/* Close PO */}
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseOrders((prev) =>
                      prev.map((p) =>
                        p.id === currentPo.id ? { ...p, status: "Completed", timelineStep: 7 } : p
                      )
                    );
                    showToast(`Purchase Order ${currentPo.poNumber} telah ditutup (Closed & Archived).`);
                  }}
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Close PO 🔒
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ==============================================================
          MODALS: NEW PO, EXPORT, DOCUMENT VIEWER
          ============================================================== */}

      {/* 1. New PO Modal */}
      {isNewPoModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  New Supplier Purchase Order
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Create Purchase Order
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPoModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Purchase Order baru berhasil dibuat.");
                setIsNewPoModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#141413] font-bold mb-1">Pilih Rekanan Vendor:</label>
                <select className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden">
                  <option>PT. Sumber Unggas Makmur</option>
                  <option>Koperasi Tani Karawang Sejahtera</option>
                  <option>PT. Wilmar Cahaya Nabati</option>
                  <option>CV. Agro Sayur Mandiri</option>
                </select>
              </div>

              <div>
                <label className="block text-[#141413] font-bold mb-1">Gudang Penerimaan:</label>
                <select className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden">
                  <option>Cold Storage (Chiller Wing 1)</option>
                  <option>Main Warehouse (Gudang Utama)</option>
                  <option>Dry Storage (Bumbu &amp; Rempah)</option>
                  <option>Packaging Warehouse</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#141413] font-bold mb-1">Target Tanggal Tiba (ETA):</label>
                  <input
                    type="date"
                    defaultValue="2026-10-24"
                    className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#141413] font-bold mb-1">Payment Terms:</label>
                  <select className="w-full p-2 bg-white border border-neutral-300 rounded-xs focus:border-[#141413] outline-hidden">
                    <option>Net 30 Days</option>
                    <option>Net 14 Days</option>
                    <option>CBD (Cash Before Delivery)</option>
                    <option>COD (Cash on Delivery)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button
                  type="button"
                  onClick={() => setIsNewPoModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
                >
                  Terbitkan Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Procurement Register Export
                </span>
                <strong className="font-display font-extrabold text-lg text-[#141413]">
                  Export Purchase Orders
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
              Unduh rekapan kontrak Purchase Order resmi untuk rekonsiliasi faktur pajak &amp; utang usaha
              (Account Payable):
            </p>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Total PO:</span>
                <strong className="text-[#141413]">{purchaseOrders.length} Dokumen PO</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B81]">Format:</span>
                <strong className="text-[#141413]">Official PO PDF &amp; Excel (.xlsx)</strong>
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
                  showToast("Daftar Purchase Orders berhasil diunduh.");
                  setIsExportModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] hover:bg-[#141413]/90 text-white font-bold rounded-xs cursor-pointer"
              >
                Unduh Rekapan PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <strong className="text-sm text-[#141413]">{selectedDocument.name}</strong>
              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
                className="text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-40 bg-neutral-100 border border-neutral-300 rounded-xs flex flex-col items-center justify-center text-5xl">
              <span>📄</span>
              <span className="text-xs text-[#8E8B81] mt-2">{selectedDocument.type}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#626058]">
              <span>Ukuran Dokumen: {selectedDocument.size}</span>
              <span className="text-emerald-700 font-bold">✓ Terdaftar di e-Procurement</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Mengunduh berkas ${selectedDocument.name}`);
                  setSelectedDocument(null);
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
