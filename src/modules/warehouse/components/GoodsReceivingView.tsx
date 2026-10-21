"use client";

import React, { useState } from "react";

// --- TYPES ---
export type ReceivingStatus =
  | "Scheduled"
  | "Receiving"
  | "QC Inspection"
  | "Completed"
  | "Rejected";

export type QCVerdict = "Pass" | "Conditional" | "Reject";

export interface ReceivedItemDetail {
  id: string;
  name: string;
  sku: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  storageLocation: string;
  qcStatus: QCVerdict;
}

export interface QCChecklistItem {
  id: string;
  label: string;
  specification: string;
  measuredValue: string;
  status: QCVerdict;
}

export interface PhotoEvidenceItem {
  id: string;
  label: string;
  category: "Packaging" | "Seal" | "Temperature Probe" | "Delivery Vehicle" | "Damaged Goods";
  caption: string;
  timestamp: string;
  emoji: string;
}

export interface ReceivingRecord {
  id: string;
  receivingNo: string;
  poNumber: string;
  supplier: string;
  supplierPic: string;
  supplierPhone: string;
  arrivalTime: string;
  expectedArrival: string;
  actualArrival: string;
  warehouse: string;
  status: ReceivingStatus;
  assignedInspector: string;
  vehicleNumber: string;
  driverName: string;
  deliveryNote: string;
  items: ReceivedItemDetail[];
  qcChecklist: QCChecklistItem[];
  photos: PhotoEvidenceItem[];
  timelineStep: number; // 1: Arrived, 2: Doc Checked, 3: Unloaded, 4: QC, 5: Put Away, 6: Completed
  inspectorNotes: string;
}

// --- MOCK DATASET: REALISTIC INDUSTRIAL CATERING INBOUND ---
const INITIAL_RECEIVING_DATA: ReceivingRecord[] = [
  {
    id: "rec-1",
    receivingNo: "GRN-2026-1021-01",
    poNumber: "PO-ZKS-2026-1082",
    supplier: "PT. Sumber Unggas Makmur",
    supplierPic: "H. Hendri Kurniawan",
    supplierPhone: "0812-8877-6655",
    arrivalTime: "08:15 WIB",
    expectedArrival: "08:00 WIB",
    actualArrival: "08:15 WIB (On Time)",
    warehouse: "Cold Storage (Chiller Wing 1)",
    status: "QC Inspection",
    assignedInspector: "QC Hendra Wibowo",
    vehicleNumber: "B 9821 TDF (Reefer Box)",
    driverName: "Ujang Suryana (SIM BII)",
    deliveryNote: "SJ-SUM-88120/X/2026",
    timelineStep: 4,
    inspectorNotes: "Suhu ruang muat truk terverifikasi +2.8°C. Segel utuh, aroma segar normal. Sampel uji drip loss 4.5 kg dialokasikan sebagai potongan susut.",
    items: [
      {
        id: "item-r1",
        name: "Chicken Breast Fillet Paha (Grade A)",
        sku: "RM-00021",
        orderedQty: 500,
        receivedQty: 500,
        acceptedQty: 495.5,
        rejectedQty: 4.5,
        unit: "kg",
        batchNumber: "B-PLT-2026-8821",
        expiryDate: "28 Okt 2026",
        storageLocation: "Cold Storage • Rack A-04",
        qcStatus: "Conditional",
      },
      {
        id: "item-r2",
        name: "Sayap Ayam Utuh (Mid-Joint Wing)",
        sku: "RM-00024",
        orderedQty: 200,
        receivedQty: 200,
        acceptedQty: 200,
        rejectedQty: 0,
        unit: "kg",
        batchNumber: "B-PLT-2026-8822",
        expiryDate: "29 Okt 2026",
        storageLocation: "Cold Storage • Rack A-06",
        qcStatus: "Pass",
      },
    ],
    qcChecklist: [
      {
        id: "qc-1",
        label: "Temperature Check",
        specification: "Suhu daging wajib antara −2°C s/d +4°C",
        measuredValue: "+2.4°C (Probe Sensor Terkalibrasi)",
        status: "Pass",
      },
      {
        id: "qc-2",
        label: "Packaging Condition",
        specification: "Kemasan kedap vakum, tidak ada sobekan / rembesan",
        measuredValue: "Vakum rapat, plastik food-grade 80 mikron utuh",
        status: "Pass",
      },
      {
        id: "qc-3",
        label: "Label Verification",
        specification: "Barcode EAN-13, no. izin edar RPU & kode batch jelas",
        measuredValue: "Label tercetak jelas di tiap karton",
        status: "Pass",
      },
      {
        id: "qc-4",
        label: "Expiry Validation",
        specification: "Minimal sisa shelf-life > 7 hari kerja saat tiba",
        measuredValue: "Masa kedaluwarsa 7 hari (Hingga 28 Okt)",
        status: "Pass",
      },
      {
        id: "qc-5",
        label: "Visual Inspection",
        specification: "Warna merah muda alami, tekstur kenyal, bebas memar",
        measuredValue: "Ditemukan 4.5 kg trim memar darah minor",
        status: "Conditional",
      },
      {
        id: "qc-6",
        label: "Weight Verification",
        specification: "Toleransi timbang jembatan timbang ± 0.5%",
        measuredValue: "Netto: 700.0 kg (Sesuai Surat Jalan)",
        status: "Pass",
      },
      {
        id: "qc-7",
        label: "Halal Verification (Mandatory)",
        specification: "Logo Halal BPJPH & nomor sertifikat RPU aktif",
        measuredValue: "ID3211000188219 (Tercatat di Master Supplier)",
        status: "Pass",
      },
    ],
    photos: [
      {
        id: "ph-1",
        label: "Suhu Muat Truk",
        category: "Temperature Probe",
        caption: "Probe Thermo King kabin tercatat +2.8°C",
        timestamp: "08:18 WIB",
        emoji: "🌡️",
      },
      {
        id: "ph-2",
        label: "Segel Pengaman",
        category: "Seal",
        caption: "Segel kontainer pendingin #SL-9941 utuh tanpa cacat",
        timestamp: "08:16 WIB",
        emoji: "🔒",
      },
      {
        id: "ph-3",
        label: "Kondisi Kemasan",
        category: "Packaging",
        caption: "Plastik vakum dan box karton berlabel halal",
        timestamp: "08:25 WIB",
        emoji: "📦",
      },
      {
        id: "ph-4",
        label: "Armada Truk Dingin",
        category: "Delivery Vehicle",
        caption: "Reefer truck B 9821 TDF tiba di Loading Dock 2",
        timestamp: "08:14 WIB",
        emoji: "🚚",
      },
      {
        id: "ph-5",
        label: "Trim Daging Memar",
        category: "Damaged Goods",
        caption: "4.5 kg trim daging reject dipisahkan ke wadah terisolasi",
        timestamp: "08:35 WIB",
        emoji: "⚠️",
      },
    ],
  },
  {
    id: "rec-2",
    receivingNo: "GRN-2026-1021-02",
    poNumber: "PO-ZKS-2026-1085",
    supplier: "Koperasi Tani Karawang Sejahtera",
    supplierPic: "Pak Dedi Mulyadi",
    supplierPhone: "0857-1122-3344",
    arrivalTime: "09:30 WIB",
    expectedArrival: "09:00 WIB",
    actualArrival: "09:30 WIB (Delayed 30m)",
    warehouse: "Main Warehouse (Gudang Utama)",
    status: "Receiving",
    assignedInspector: "Inspector Andi Maulana",
    vehicleNumber: "T 8820 DB (Truk Bak Terpal)",
    driverName: "Ahmad Sobari",
    deliveryNote: "SJ-KTK-109/X/2026",
    timelineStep: 3,
    inspectorNotes: "Proses bongkar beras 4 Ton sedang berlangsung di pallet conveyor. Karung kering dan bersih.",
    items: [
      {
        id: "item-r3",
        name: "Beras Ramos Premium IR-64 (Zak 50kg)",
        sku: "RM-00012",
        orderedQty: 4000,
        receivedQty: 4000,
        acceptedQty: 4000,
        rejectedQty: 0,
        unit: "kg",
        batchNumber: "B-GRN-2026-1092",
        expiryDate: "15 Jan 2027",
        storageLocation: "Main Warehouse • Bay G-01",
        qcStatus: "Pass",
      },
    ],
    qcChecklist: [
      { id: "qc-r2-1", label: "Temperature Check", specification: "Dry Ambient 24°C - 30°C", measuredValue: "Ambient 26°C", status: "Pass" },
      { id: "qc-r2-2", label: "Packaging Condition", specification: "Karung goni/anyaman tanpa sobekan", measuredValue: "80 karung utuh", status: "Pass" },
      { id: "qc-r2-3", label: "Visual Inspection", specification: "Kadar air < 14%, tanpa kutu / batu", measuredValue: "Kadar air 12.8% (Moisture Meter OK)", status: "Pass" },
    ],
    photos: [
      { id: "ph-r2-1", label: "Truk Beras", category: "Delivery Vehicle", caption: "Bongkar muat di Bay 1", timestamp: "09:32 WIB", emoji: "🚚" },
      { id: "ph-r2-2", label: "Uji Kadar Air", category: "Temperature Probe", caption: "Moisture meter 12.8%", timestamp: "09:40 WIB", emoji: "📊" },
    ],
  },
  {
    id: "rec-3",
    receivingNo: "GRN-2026-1021-03",
    poNumber: "PO-ZKS-2026-1088",
    supplier: "PT. Wilmar Cahaya Nabati",
    supplierPic: "Ibu Rina S.",
    supplierPhone: "0811-9900-1122",
    arrivalTime: "11:00 WIB",
    expectedArrival: "11:00 WIB",
    actualArrival: "10:55 WIB (Early)",
    warehouse: "Main Warehouse",
    status: "Scheduled",
    assignedInspector: "Inspector Yusuf",
    vehicleNumber: "B 9112 UY (Truk Box)",
    driverName: "Darmawan",
    deliveryNote: "SJ-WCN-8812",
    timelineStep: 1,
    inspectorNotes: "Truk dijadwalkan merapat ke Loading Dock 3.",
    items: [
      {
        id: "item-r4",
        name: "Minyak Goreng Sawit Higienis (Jerigen 20L)",
        sku: "RM-00004",
        orderedQty: 1000,
        receivedQty: 0,
        acceptedQty: 0,
        rejectedQty: 0,
        unit: "Liter",
        batchNumber: "B-OIL-2026-449",
        expiryDate: "12 Des 2027",
        storageLocation: "Main Warehouse • Bay M-02",
        qcStatus: "Pass",
      },
    ],
    qcChecklist: [],
    photos: [],
  },
  {
    id: "rec-4",
    receivingNo: "GRN-2026-1020-09",
    poNumber: "PO-ZKS-2026-1070",
    supplier: "CV. Agro Sayur Mandiri",
    supplierPic: "Pak Tatang",
    supplierPhone: "0813-2233-4455",
    arrivalTime: "14:00 WIB",
    expectedArrival: "14:00 WIB",
    actualArrival: "14:10 WIB",
    warehouse: "Dry Storage",
    status: "Completed",
    assignedInspector: "QC Hendra Wibowo",
    vehicleNumber: "T 8122 GA (Pick Up Box)",
    driverName: "Kurnia",
    deliveryNote: "SJ-ASM-994",
    timelineStep: 6,
    inspectorNotes: "Barang telah diterima penuh, masuk ke rak penyimpanan D-02.",
    items: [
      {
        id: "item-r5",
        name: "Bawang Merah Brebes Super",
        sku: "RM-00044",
        orderedQty: 100,
        receivedQty: 100,
        acceptedQty: 100,
        rejectedQty: 0,
        unit: "kg",
        batchNumber: "B-SPB-2026-331",
        expiryDate: "28 Okt 2026",
        storageLocation: "Dry Storage • Rak D-02",
        qcStatus: "Pass",
      },
    ],
    qcChecklist: [],
    photos: [],
  },
];

export default function GoodsReceivingClient() {
  // --- STATE ---
  const [receivingList, setReceivingList] = useState<ReceivingRecord[]>(INITIAL_RECEIVING_DATA);
  const [selectedReceivingId, setSelectedReceivingId] = useState<string>("rec-1");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAsnModalOpen, setIsAsnModalOpen] = useState(false);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState<PhotoEvidenceItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected Record
  const currentRecord =
    receivingList.find((r) => r.id === selectedReceivingId) || receivingList[0];

  // Editable Items Local State Handler
  const handleItemQtyChange = (
    itemId: string,
    field: "acceptedQty" | "rejectedQty",
    value: number
  ) => {
    setReceivingList((prev) =>
      prev.map((rec) => {
        if (rec.id !== currentRecord.id) return rec;
        return {
          ...rec,
          items: rec.items.map((it) => {
            if (it.id !== itemId) return it;
            const updated = { ...it, [field]: value };
            if (field === "acceptedQty") {
              updated.rejectedQty = Math.max(0, it.receivedQty - value);
            } else if (field === "rejectedQty") {
              updated.acceptedQty = Math.max(0, it.receivedQty - value);
            }
            return updated;
          }),
        };
      })
    );
  };

  // QC Checklist Toggle Handler
  const handleQcToggle = (checkId: string, newVerdict: QCVerdict) => {
    setReceivingList((prev) =>
      prev.map((rec) => {
        if (rec.id !== currentRecord.id) return rec;
        return {
          ...rec,
          qcChecklist: rec.qcChecklist.map((c) =>
            c.id === checkId ? { ...c, status: newVerdict } : c
          ),
        };
      })
    );
    showToast(`Pemeriksaan QC diperbarui: ${newVerdict}`);
  };

  // Status Badge Renderer
  const renderStatusBadge = (status: ReceivingStatus) => {
    switch (status) {
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
            Scheduled
          </span>
        );
      case "Receiving":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Receiving
          </span>
        );
      case "QC Inspection":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            QC Inspection
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
    <div className="space-y-8 pb-16 font-mono text-xs">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141413] text-[#FAF9F5] px-4 py-3 rounded border border-neutral-700 shadow-xl flex items-center gap-3 font-mono text-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==============================================================
          PAGE HEADER
          Goods Receiving
          Subtitle: Receive and inspect incoming goods from suppliers.
          Top Right: Create Receiving, Scan Barcode, Import ASN
          ============================================================== */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#141413]/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
              PT. ZAHDAN KAMAL SENTOSA
            </span>
            <span className="text-[#8E8B81] text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#141413] font-semibold block">
              SUPPLY CHAIN &amp; QUALITY INSPECTION
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Dock 1-4 Active
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Goods Receiving
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Receive and inspect incoming goods from suppliers.
          </p>
        </div>

        {/* Top Right Action Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Create Receiving */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Receiving</span>
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

          {/* Import ASN */}
          <button
            type="button"
            onClick={() => setIsAsnModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#141413]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import ASN</span>
          </button>
        </div>
      </header>

      {/* ==============================================================
          SECTION 01: RECEIVING SUMMARY CARDS (5 Cards)
          - Pending Deliveries
          - Received Today
          - Awaiting QC
          - Rejected Items
          - Average Receiving Time
          ============================================================== */}
      <section aria-labelledby="receiving-kpi-heading">
        <h2 id="receiving-kpi-heading" className="sr-only">
          Receiving Summary Cards
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Pending Deliveries */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Pending Deliveries
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              4 <span className="text-xs font-normal text-[#626058]">Truk PO</span>
            </p>
            <span className="text-[10px] text-[#626058] block pt-1 border-t border-black/5">
              Jadwal bongkar hari ini
            </span>
          </div>

          {/* 2. Received Today */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Received Today
            </span>
            <p className="font-display font-extrabold text-2xl text-emerald-700">
              12 <span className="text-xs font-normal text-[#626058]">Inbound</span>
            </p>
            <span className="text-[10px] text-emerald-800 block pt-1 border-t border-black/5">
              5,480 kg bahan baku diterima
            </span>
          </div>

          {/* 3. Awaiting QC */}
          <div className="p-4 bg-white border border-amber-200/80 space-y-1 shadow-2xs ring-1 ring-amber-500/10">
            <span className="text-[10px] uppercase text-amber-700 font-bold block">
              Awaiting QC
            </span>
            <p className="font-display font-extrabold text-2xl text-amber-700">
              3 <span className="text-xs font-normal text-[#626058]">Batch</span>
            </p>
            <span className="text-[10px] text-amber-800 block pt-1 border-t border-amber-100">
              Uji suhu &amp; mikrobiologi
            </span>
          </div>

          {/* 4. Rejected Items */}
          <div className="p-4 bg-white border border-rose-200/80 space-y-1 shadow-2xs ring-1 ring-rose-500/10">
            <span className="text-[10px] uppercase text-rose-700 font-bold block">
              Rejected Items
            </span>
            <p className="font-display font-extrabold text-2xl text-rose-600">
              1 <span className="text-xs font-normal text-[#626058]">Insiden</span>
            </p>
            <span className="text-[10px] text-rose-700 block pt-1 border-t border-rose-100">
              4.5 kg trim susut dipisahkan
            </span>
          </div>

          {/* 5. Average Receiving Time */}
          <div className="p-4 bg-white border border-[#141413]/10 space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase text-[#8E8B81] font-bold block">
              Avg. Receiving Time
            </span>
            <p className="font-display font-extrabold text-2xl text-[#141413]">
              24 <span className="text-xs font-normal text-[#626058]">Menit</span>
            </p>
            <span className="text-[10px] text-emerald-700 block pt-1 border-t border-black/5">
              Target SLA &lt; 35 menit terpenuhi
            </span>
          </div>
        </div>
      </section>

      {/* ==============================================================
          SECTION 02: RECEIVING QUEUE (Modern Table)
          Columns: Receiving No, PO Number, Supplier, Arrival Time, Warehouse,
                   Status, Assigned Inspector, Actions
          ============================================================== */}
      <section className="bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
              INBOUND LOGISTICS WORKBENCH
            </span>
            <h3 className="font-display font-bold text-lg text-[#141413]">
              Receiving Queue
            </h3>
          </div>
          <span className="text-xs text-[#8E8B81]">
            Pilih baris untuk membuka panel inspeksi detail dan QC checklist
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-[#141413]/10 text-[10px] font-mono uppercase tracking-wider text-[#626058]">
                <th className="py-2.5 px-3">Receiving No</th>
                <th className="py-2.5 px-3">PO Number</th>
                <th className="py-2.5 px-4 font-semibold">Supplier</th>
                <th className="py-2.5 px-3">Arrival Time</th>
                <th className="py-2.5 px-3">Warehouse</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Inspector</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141413]/5 text-xs font-mono">
              {receivingList.map((rec) => {
                const isSelected = selectedReceivingId === rec.id;

                return (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedReceivingId(rec.id)}
                    className={`transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-amber-50/70 ring-1 ring-[#C85A17]/30"
                        : "hover:bg-[#FAF9F5]"
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-[#141413] whitespace-nowrap">
                      {rec.receivingNo}
                    </td>
                    <td className="py-3 px-3 text-[#626058] whitespace-nowrap font-medium">
                      {rec.poNumber}
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-[#141413] whitespace-nowrap">
                      {rec.supplier}
                      <span className="block text-[10px] font-mono text-[#8E8B81] font-normal">
                        Srt Jalan: {rec.deliveryNote}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#141413] whitespace-nowrap">
                      {rec.arrivalTime}
                    </td>
                    <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                      {rec.warehouse}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {renderStatusBadge(rec.status)}
                    </td>
                    <td className="py-3 px-3 text-[#141413] whitespace-nowrap font-medium">
                      {rec.assignedInspector}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedReceivingId(rec.id)}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-[#141413] font-semibold rounded-xs cursor-pointer"
                      >
                        {isSelected ? "Inspecting" : "Inspect →"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==============================================================
          SPLIT WORKSTATION LAYOUT (DESKTOP)
          When row is selected:
          - Left: Section 03 (Receiving Detail), Section 04 (Items Received), Section 05 (Quality Inspection)
          - Right: Section 06 (Photo Evidence), Section 07 (Timeline), Section 08 (Actions)
          ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================
            LEFT WORKSTATION (lg:col-span-7 or 8)
            ============================================================ */}
        <div className="lg:col-span-7 space-y-8">
          {/* ==========================================================
              SECTION 03: RECEIVING DETAIL
              Supplier Info, PO Info, Vehicle No, Driver Name,
              Delivery Note, Expected Arrival, Actual Arrival
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  MANIFEST &amp; VENDOR CREDENTIALS
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Receiving Detail — {currentRecord.receivingNo}
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">Dokumen Pengantar Resmi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-2">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Supplier Information
                </span>
                <p className="font-sans font-bold text-sm text-[#141413]">{currentRecord.supplier}</p>
                <div className="text-[11px] text-[#626058] space-y-0.5">
                  <p>PIC: {currentRecord.supplierPic}</p>
                  <p>Kontak: {currentRecord.supplierPhone}</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-2">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  PO &amp; Delivery Note
                </span>
                <p className="font-sans font-bold text-sm text-[#141413]">{currentRecord.poNumber}</p>
                <div className="text-[11px] text-[#626058] space-y-0.5">
                  <p>Surat Jalan: {currentRecord.deliveryNote}</p>
                  <p>Lokasi Bongkar: {currentRecord.warehouse}</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-2">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Logistics &amp; Fleet
                </span>
                <p className="font-bold text-[#141413]">{currentRecord.vehicleNumber}</p>
                <div className="text-[11px] text-[#626058] space-y-0.5">
                  <p>Pengemudi: {currentRecord.driverName}</p>
                  <p>Inspektor: {currentRecord.assignedInspector}</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/5 space-y-2">
                <span className="text-[10px] text-[#8E8B81] uppercase font-bold block">
                  Punctuality &amp; SLA
                </span>
                <p className="font-bold text-[#141413]">{currentRecord.actualArrival}</p>
                <div className="text-[11px] text-[#626058] space-y-0.5">
                  <p>Jadwal Estimasi: {currentRecord.expectedArrival}</p>
                  <p className="text-emerald-700 font-bold">✓ Kepatuhan Waktu: 100% On-Schedule</p>
                </div>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 04: ITEMS RECEIVED (Modern Editable Table)
              Columns: Item, Ordered Qty, Received Qty, Accepted Qty,
                       Rejected Qty, Unit, Batch Number, Expiry Date,
                       Storage Location, QC Status
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  PHYSICAL INVENTORY TALLY
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Items Received
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-xs">
                Kuantitas dapat diedit langsung saat timbang fisik
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#141413]/10 text-[10px] text-[#8E8B81] uppercase tracking-wider bg-neutral-50/70">
                    <th className="py-2.5 px-3">Item / SKU</th>
                    <th className="py-2.5 px-2 text-right">Ordered</th>
                    <th className="py-2.5 px-2 text-right">Received</th>
                    <th className="py-2.5 px-3 text-right">Accepted Qty</th>
                    <th className="py-2.5 px-3 text-right">Rejected</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-3">Batch &amp; Expiry</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-2 text-center">QC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/5">
                  {currentRecord.items.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/60">
                      <td className="py-3 px-3">
                        <strong className="font-sans font-bold text-[#141413] block">
                          {item.name}
                        </strong>
                        <span className="text-[10px] text-[#8E8B81]">SKU: {item.sku}</span>
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-[#141413]">
                        {item.orderedQty}
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-blue-700">
                        {item.receivedQty}
                      </td>

                      {/* Editable Accepted Qty */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          step="0.5"
                          value={item.acceptedQty}
                          onChange={(e) =>
                            handleItemQtyChange(item.id, "acceptedQty", Number(e.target.value))
                          }
                          className="w-20 p-1 text-right bg-white border border-neutral-300 font-bold text-emerald-700 rounded-xs focus:border-[#141413] outline-hidden"
                        />
                      </td>

                      {/* Editable Rejected Qty */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          step="0.5"
                          value={item.rejectedQty}
                          onChange={(e) =>
                            handleItemQtyChange(item.id, "rejectedQty", Number(e.target.value))
                          }
                          className="w-16 p-1 text-right bg-white border border-neutral-300 font-bold text-rose-700 rounded-xs focus:border-[#141413] outline-hidden"
                        />
                      </td>

                      <td className="py-3 px-2 text-center text-[#626058]">{item.unit}</td>
                      <td className="py-3 px-3 text-[11px]">
                        <span className="font-bold text-[#141413] block">{item.batchNumber}</span>
                        <span className="text-[#8E8B81]">Exp: {item.expiryDate}</span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-[#626058]">{item.storageLocation}</td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded-xs ${
                            item.qcStatus === "Pass"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.qcStatus === "Conditional"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {item.qcStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ==========================================================
              SECTION 05: QUALITY INSPECTION (Checklist Style)
              - Temperature Check
              - Packaging Condition
              - Label Verification
              - Expiry Validation
              - Visual Inspection
              - Weight Verification
              - Halal Verification (optional/mandatory)
              - Inspector Notes
              Each item can be: Pass | Conditional | Reject
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  HACCP &amp; FOOD SAFETY PROTOCOL
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Quality Inspection Checklist
                </h3>
              </div>
              <span className="text-xs text-[#8E8B81]">Standard Operasional Prosedur QC</span>
            </div>

            <div className="space-y-3">
              {currentRecord.qcChecklist.map((check) => (
                <div
                  key={check.id}
                  className="p-3.5 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#141413]/25 transition-all"
                >
                  <div className="space-y-0.5 max-w-md">
                    <strong className="text-xs text-[#141413] block">{check.label}</strong>
                    <p className="text-[11px] text-[#626058]">{check.specification}</p>
                    <span className="text-[11px] font-bold text-[#141413] block">
                      Hasil Uji: {check.measuredValue}
                    </span>
                  </div>

                  {/* Verdict Buttons: Pass / Conditional / Reject */}
                  <div className="inline-flex p-1 bg-neutral-200/70 border border-neutral-300 rounded-xs gap-1 shrink-0">
                    {(["Pass", "Conditional", "Reject"] as QCVerdict[]).map((verdict) => {
                      const isActive = check.status === verdict;
                      return (
                        <button
                          key={verdict}
                          type="button"
                          onClick={() => handleQcToggle(check.id, verdict)}
                          className={`px-3 py-1 text-[10px] font-bold uppercase rounded-xs transition-all cursor-pointer ${
                            isActive
                              ? verdict === "Pass"
                                ? "bg-emerald-700 text-white shadow-xs"
                                : verdict === "Conditional"
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-rose-700 text-white shadow-xs"
                              : "text-[#626058] hover:text-[#141413]"
                          }`}
                        >
                          {verdict}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Inspector Notes Area */}
            <div className="space-y-1.5 pt-2 border-t border-[#141413]/10">
              <label className="text-xs font-bold text-[#141413] block">
                Inspector Audit Notes &amp; Disposition Remarks:
              </label>
              <textarea
                rows={3}
                defaultValue={currentRecord.inspectorNotes}
                onChange={(e) => {
                  currentRecord.inspectorNotes = e.target.value;
                }}
                className="w-full p-3 bg-neutral-50 border border-neutral-300 text-xs text-[#141413] rounded-xs focus:border-[#141413] outline-hidden leading-relaxed font-mono"
                placeholder="Catatan inspeksi fisik, hasil uji laboratorium, atau arahan segregasi..."
              />
            </div>
          </section>
        </div>

        {/* ============================================================
            RIGHT WORKSTATION (lg:col-span-5 or 4)
            Section 06: Photo Evidence
            Section 07: Receiving Timeline
            Section 08: Actions
            ============================================================ */}
        <div className="lg:col-span-5 space-y-8">
          {/* ==========================================================
              SECTION 06: PHOTO EVIDENCE
              Packaging, Seal, Temperature Probe, Delivery Vehicle, Damaged Goods
              Photo preview grid with interactive click
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  DIGITAL AUDIT TRAIL
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Photo Evidence
                </h3>
              </div>
              <button
                type="button"
                onClick={() => showToast("Kamera ponsel / barcode scanner diaktifkan.")}
                className="text-[#C85A17] hover:underline text-xs font-bold cursor-pointer"
              >
                + Ambil Foto 📸
              </button>
            </div>

            {currentRecord.photos.length === 0 ? (
              <p className="text-xs text-[#8E8B81] italic py-4 text-center">
                Belum ada foto bukti yang dilampirkan.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {currentRecord.photos.map((ph) => (
                  <button
                    key={ph.id}
                    type="button"
                    onClick={() => setIsPhotoViewerOpen(ph)}
                    className="p-3 bg-[#FAF9F5] border border-[#141413]/10 hover:border-[#141413]/30 rounded-xs text-left space-y-1.5 transition-all group cursor-pointer"
                  >
                    <div className="w-full h-20 bg-neutral-100 rounded-xs flex items-center justify-center text-3xl group-hover:scale-105 transition-transform border border-neutral-200">
                      {ph.emoji}
                    </div>
                    <strong className="text-xs text-[#141413] block truncate">{ph.label}</strong>
                    <div className="flex justify-between text-[10px] text-[#8E8B81]">
                      <span>{ph.category}</span>
                      <span>{ph.timestamp}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ==========================================================
              SECTION 07: RECEIVING TIMELINE
              Truck Arrived → Document Checked → Items Unloaded →
              QC Inspection → Warehouse Put Away → Completed
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-4 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                GATE-TO-STOCK PROTOCOL
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Receiving Timeline
              </h3>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#141413]/15">
              {[
                { step: 1, title: "Truck Arrived at Dock", time: "08:15 WIB", desc: "Truk reefer parkir di Bay 2" },
                { step: 2, title: "Document & PO Checked", time: "08:20 WIB", desc: "Surat jalan & segel diverifikasi" },
                { step: 3, title: "Items Unloaded & Weighed", time: "08:28 WIB", desc: "Timbang netto 700.0 kg" },
                { step: 4, title: "QC Inspection & Probe", time: "08:35 WIB", desc: "Suhu +2.4°C, 4.5kg trim reject" },
                { step: 5, title: "Warehouse Put Away", time: "Pending", desc: "Penempatan ke Chiller Rack A-04" },
                { step: 6, title: "Completed & Stock Posted", time: "Pending", desc: "Buku besar otomatis terbarui" },
              ].map((st) => {
                const isPassed = currentRecord.timelineStep >= st.step;
                const isCurrent = currentRecord.timelineStep === st.step;

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
                      <div className="flex items-center justify-between">
                        <strong
                          className={`text-xs ${
                            isCurrent
                              ? "text-[#C85A17] font-bold"
                              : isPassed
                              ? "text-[#141413]"
                              : "text-[#8E8B81]"
                          }`}
                        >
                          {st.title}
                        </strong>
                        <span className="text-[10px] text-[#8E8B81]">{st.time}</span>
                      </div>
                      <p className="text-[11px] text-[#626058]">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==========================================================
              SECTION 08: ACTIONS (Clean Enterprise Action Buttons)
              - Approve Receiving
              - Reject Items
              - Print GRN
              - Generate Inventory Transaction
              - Notify Purchasing
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-3.5 shadow-2xs">
            <div className="border-b border-[#141413]/10 pb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                EXECUTION COMMANDS
              </span>
              <h3 className="font-display font-bold text-lg text-[#141413]">
                Receiving Actions
              </h3>
            </div>

            <div className="space-y-2">
              {/* Approve Receiving */}
              <button
                type="button"
                onClick={() => {
                  setReceivingList((prev) =>
                    prev.map((r) =>
                      r.id === currentRecord.id
                        ? { ...r, status: "Completed", timelineStep: 6 }
                        : r
                    )
                  );
                  showToast(
                    `Penerimaan ${currentRecord.receivingNo} DISETUJUI. Stok 495.5 kg masuk ke Cold Storage.`
                  );
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
              >
                ✓ Approve Receiving (Loloskan Stok)
              </button>

              {/* Reject Items */}
              <button
                type="button"
                onClick={() => {
                  setReceivingList((prev) =>
                    prev.map((r) =>
                      r.id === currentRecord.id ? { ...r, status: "Rejected" } : r
                    )
                  );
                  showToast(`Berita acara penolakan ${currentRecord.receivingNo} diterbitkan.`);
                }}
                className="w-full py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-center block rounded-xs shadow-xs transition-all cursor-pointer"
              >
                ✕ Reject Items (Tolak Pengiriman)
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {/* Print GRN */}
                <button
                  type="button"
                  onClick={() =>
                    showToast(`Goods Receipt Note ${currentRecord.receivingNo} dicetak via printer thermal.`)
                  }
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Print GRN 🖨️
                </button>

                {/* Generate Inventory Transaction */}
                <button
                  type="button"
                  onClick={() =>
                    showToast("Mutasi stok berhasil di-posting ke Buku Besar Persediaan ERP.")
                  }
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Post Ledger 📊
                </button>

                {/* Notify Purchasing */}
                <button
                  type="button"
                  onClick={() =>
                    showToast("Notifikasi otomatis penerimaan dikirim ke Purchasing via WhatsApp & Email.")
                  }
                  className="py-2 bg-neutral-100 hover:bg-neutral-200 text-[#141413] border border-neutral-300 font-semibold text-center rounded-xs cursor-pointer"
                >
                  Notify PO 📨
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ==============================================================
          MODALS: CREATE RECEIVING, SCAN BARCODE, IMPORT ASN, PHOTO PREVIEW
          ============================================================== */}

      {/* 1. Create Receiving Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  New Inbound Gate-In
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Create Goods Receiving
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Tiket penerimaan barang baru berhasil dibuat.");
                setIsCreateModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Pilih PO Supplier</label>
                  <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]">
                    <option>PO-ZKS-2026-1082 (PT. Sumber Unggas)</option>
                    <option>PO-ZKS-2026-1085 (Koperasi Tani)</option>
                    <option>PO-ZKS-2026-1089 (Beras Ramos 5 Ton)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">No. Polisi Truk</label>
                  <input
                    type="text"
                    defaultValue="B 9214 KY"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Nama Sopir</label>
                  <input
                    type="text"
                    defaultValue="Didi Wahyudi"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">No. Surat Jalan</label>
                  <input
                    type="text"
                    defaultValue="SJ-88912"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#141413] text-white font-semibold cursor-pointer rounded-xs"
                >
                  Buka Tiket Penerimaan
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Scan Barcode Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in text-center font-mono text-xs">
            <h3 className="font-display font-bold text-lg text-[#141413]">Pindai Barcode Surat Jalan</h3>
            <div className="w-full h-44 bg-neutral-900 border-2 border-dashed border-[#C85A17] flex flex-col items-center justify-center gap-2 text-white p-4 relative overflow-hidden rounded-xs">
              <span className="text-3xl animate-bounce">📷</span>
              <p className="text-[11px] text-neutral-300">Arahkan kamera ke barcode EAN/QR pada surat jalan supplier</p>
              <div className="w-full h-0.5 bg-rose-500 absolute top-1/2 left-0 animate-pulse"></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast("Barcode terdeteksi: SJ-SUM-88120/X/2026.");
                  setIsScanModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] text-white font-bold cursor-pointer rounded-xs"
              >
                Simulasi Scan OK
              </button>
              <button
                type="button"
                onClick={() => setIsScanModalOpen(false)}
                className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Import ASN Modal */}
      {isAsnModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  EDI / XML Integration
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Import Advanced Shipping Notice (ASN)
                </h3>
              </div>
              <button type="button" onClick={() => setIsAsnModalOpen(false)} className="text-xl font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>
            <p className="text-[#626058] leading-relaxed">
              Impor berkas EDIFACT / XML ASN dari portal vendor untuk otomatisasi pra-pengisian manifes sebelum truk tiba.
            </p>
            <div className="border-2 border-dashed border-neutral-300 p-8 text-center rounded-xs bg-neutral-50 cursor-pointer">
              <span className="text-3xl block">📋</span>
              <strong className="block text-[#141413] mt-2">Upload File ASN (.xml / .json)</strong>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => {
                  showToast("Berkas ASN berhasil diproses. 2 pengiriman otomatis dijadwalkan.");
                  setIsAsnModalOpen(false);
                }}
                className="px-4 py-2 bg-[#141413] text-white font-bold cursor-pointer rounded-xs"
              >
                Proses ASN
              </button>
              <button type="button" onClick={() => setIsAsnModalOpen(false)} className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Photo Evidence Viewer */}
      {isPhotoViewerOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in font-mono text-xs text-center">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <strong className="text-sm text-[#141413]">{isPhotoViewerOpen.label}</strong>
              <button type="button" onClick={() => setIsPhotoViewerOpen(null)} className="text-xl font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>
            <div className="w-full h-48 bg-neutral-100 border border-neutral-300 rounded-xs flex flex-col items-center justify-center text-6xl">
              <span>{isPhotoViewerOpen.emoji}</span>
              <span className="text-xs text-[#8E8B81] mt-2 font-mono">{isPhotoViewerOpen.category}</span>
            </div>
            <p className="text-xs text-[#141413] font-bold leading-relaxed">{isPhotoViewerOpen.caption}</p>
            <span className="text-[10px] text-[#8E8B81] block">Tercatat: {isPhotoViewerOpen.timestamp} oleh QC Inspector</span>
            <div className="flex justify-end pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsPhotoViewerOpen(null)}
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
