"use client";

import React, { useState, useMemo } from "react";

// --- TYPES ---
export type TimePeriod = "7D" | "30D" | "90D" | "365D";

export type AlertType = "ALL" | "LOW_STOCK" | "EXPIRING" | "NEGATIVE_STOCK" | "PENDING_APPROVAL";

export interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  capacity: string;
  currentLoad: string;
  utilizationPct: number;
  stockCount: string;
  status: "Optimal" | "High Load" | "Near Full" | "Fast Turnover";
  tempSpec: string;
  location: string;
}

export interface ActivityItem {
  id: string;
  time: string;
  date: string;
  item: string;
  sku: string;
  type: "Stock In" | "Production Consumption" | "Transfer" | "Adjustment";
  party: string;
  delta: string;
  isPositive: boolean;
  operator: string;
}

export interface AlertItem {
  id: string;
  category: "LOW_STOCK" | "EXPIRING" | "NEGATIVE_STOCK" | "PENDING_APPROVAL";
  title: string;
  sku: string;
  location: string;
  description: string;
  severity: "critical" | "warning" | "action";
  value: string;
  actionLabel: string;
}

// --- MOCK ENTERPRISE DATASET ---
const INITIAL_WAREHOUSES: WarehouseItem[] = [
  {
    id: "wh-main",
    name: "Main Warehouse (Gudang Bahan Baku Utama)",
    category: "Dry & Ambient Raw Materials",
    capacity: "120 Ton",
    currentLoad: "100.8 Ton",
    utilizationPct: 84,
    stockCount: "4,820 SKUs",
    status: "Optimal",
    tempSpec: "Ambient 22°C – 25°C",
    location: "Kawasan Industri KIIC Blok A-4",
  },
  {
    id: "wh-cold",
    name: "Cold Storage (Chiller & Blast Freezer)",
    category: "Proteins, Poultry, Seafood & Dairy",
    capacity: "45 Ton",
    currentLoad: "40.95 Ton",
    utilizationPct: 91,
    stockCount: "890 SKUs",
    status: "High Load",
    tempSpec: "-18°C Cryogenic / +2°C Chilled",
    location: "Cold Chain Wing 1",
  },
  {
    id: "wh-dry",
    name: "Dry Storage (Gudang Kering & Bumbu)",
    category: "Grains, Seasonings & Cooking Oils",
    capacity: "80 Ton",
    currentLoad: "54.4 Ton",
    utilizationPct: 68,
    stockCount: "3,450 SKUs",
    status: "Optimal",
    tempSpec: "RH < 60% Humidity Controlled",
    location: "Kawasan Industri KIIC Blok B-2",
  },
  {
    id: "wh-pack",
    name: "Packaging & Disposables",
    category: "Eco-Kraft Bento, Food Seals & Sanitaries",
    capacity: "30 Ton",
    currentLoad: "15.6 Ton",
    utilizationPct: 52,
    stockCount: "1,180 SKUs",
    status: "Optimal",
    tempSpec: "Clean Non-Food Storage Zone",
    location: "Packaging Depot Annex",
  },
  {
    id: "wh-buffer",
    name: "Kitchen Buffer (Penyangga Dapur Sentral)",
    category: "Daily Mise-en-place & Immediate Line Stocks",
    capacity: "25 Ton",
    currentLoad: "19.5 Ton",
    utilizationPct: 78,
    stockCount: "2,244 SKUs",
    status: "Fast Turnover",
    tempSpec: "Rapid Turnover Prep Facility",
    location: "Central Kitchen Deck Karawang",
  },
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    time: "08:12",
    date: "Hari ini",
    item: "Chicken Breast Fillet (Grade A)",
    sku: "SKU-PLT-091",
    type: "Stock In",
    party: "Supplier PT. Sumber Unggas Makmur",
    delta: "+250 kg",
    isPositive: true,
    operator: "SPV-W1 (Andi)",
  },
  {
    id: "act-2",
    time: "09:30",
    date: "Hari ini",
    item: "Beras Ramos Premium IR-64",
    sku: "SKU-GRN-012",
    type: "Production Consumption",
    party: "Central Kitchen Shift 1 — 3,500 Porsi",
    delta: "−120 kg",
    isPositive: false,
    operator: "CHEF-LINE1 (Budi)",
  },
  {
    id: "act-3",
    time: "11:05",
    date: "Hari ini",
    item: "Minyak Goreng Sawit Higienis",
    sku: "SKU-OIL-004",
    type: "Transfer",
    party: "Main Warehouse → Kitchen Buffer Line A",
    delta: "80 L",
    isPositive: true,
    operator: "LOG-FLT (Yusuf)",
  },
  {
    id: "act-4",
    time: "12:40",
    date: "Hari ini",
    item: "Bawang Merah Brebes Super",
    sku: "SKU-SPB-044",
    type: "Production Consumption",
    party: "Bumbu Marinasi Shift 2",
    delta: "−35 kg",
    isPositive: false,
    operator: "PREP-CK (Dewi)",
  },
  {
    id: "act-5",
    time: "14:15",
    date: "Hari ini",
    item: "Bento Box 4-Grid Eco-Kraft",
    sku: "SKU-PCK-109",
    type: "Stock In",
    party: "Supplier CV. Kemasan Lestari Abadi",
    delta: "+1,200 pcs",
    isPositive: true,
    operator: "INSP-QA (Fajar)",
  },
  {
    id: "act-6",
    time: "15:50",
    date: "Hari ini",
    item: "Daging Sapi Sandung Lamur (Brisket)",
    sku: "SKU-BEEF-023",
    type: "Transfer",
    party: "Cold Storage Freezer 2 → Thawing Chiller",
    delta: "150 kg",
    isPositive: true,
    operator: "COLD-SPV (Hendra)",
  },
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "alt-1",
    category: "LOW_STOCK",
    title: "Bawang Merah Brebes Super",
    sku: "SKU-SPB-044",
    location: "Dry Storage • Rak D-02",
    description: "Sisa fisik 18 kg berada di bawah batas minimum safety stock (50 kg). Siklus masak H+1 membutuhkan 75 kg.",
    severity: "critical",
    value: "18 / 50 kg",
    actionLabel: "Buat PO Darurat",
  },
  {
    id: "alt-2",
    category: "LOW_STOCK",
    title: "Garam Halus Beryodium 500g",
    sku: "SKU-SPB-011",
    location: "Dry Storage • Rak S-01",
    description: "Sisa 24 pack (Min: 60 pack). Perlu penambahan sebelum produksi akhir pekan.",
    severity: "warning",
    value: "24 / 60 pack",
    actionLabel: "Order Ulang",
  },
  {
    id: "alt-3",
    category: "EXPIRING",
    title: "Daging Sapi Brisket Batch #B-8832",
    sku: "SKU-BEEF-023",
    location: "Cold Storage • Pallet F-09",
    description: "Masa kesegaran berakhir dalam < 48 jam (23 Okt 2026). Prioritas FIFO untuk menu Rendang Daging hari esok.",
    severity: "warning",
    value: "140 kg (H-2 Exp)",
    actionLabel: "Prioritaskan FIFO",
  },
  {
    id: "alt-4",
    category: "EXPIRING",
    title: "Sayur Selada Hidroponik Segar",
    sku: "SKU-VEG-088",
    location: "Chiller Chamber 1",
    description: "Panen lokal 20 Okt, daya tahan optimal s/d 22 Okt pukul 18:00 WIB.",
    severity: "critical",
    value: "35 kg (H-1 Exp)",
    actionLabel: "Alokasikan Dapur",
  },
  {
    id: "alt-5",
    category: "NEGATIVE_STOCK",
    title: "Bumbu Racik Rawon Siap Olah",
    sku: "SKU-MSC-077",
    location: "Kitchen Buffer Line C",
    description: "Selisih pencatatan sistem (-2 kg) dibanding fisik. Terjadi penggunaan darurat shift malam tanpa input barcode.",
    severity: "critical",
    value: "-2.0 kg",
    actionLabel: "Sesuaikan Stok",
  },
  {
    id: "alt-6",
    category: "PENDING_APPROVAL",
    title: "PO #ZKS-PO-2026-1049 (Beras Ramos 5 Ton)",
    sku: "PO-REQ-1049",
    location: "Purchasing Dept",
    description: "Pengajuan pembelian bahan pokok senilai Rp 74.500.000 menunggu otorisasi digital Purchasing Manager.",
    severity: "action",
    value: "Rp 74.5 M",
    actionLabel: "Review & Setujui",
  },
  {
    id: "alt-7",
    category: "PENDING_APPROVAL",
    title: "Transfer Request #TR-088 (Minyak Goreng 200L)",
    sku: "TR-REQ-088",
    location: "Warehouse A → Buffer",
    description: "Permintaan transfer tambahan untuk pesanan katering lembur PT. Aisin Karawang.",
    severity: "action",
    value: "200 Liter",
    actionLabel: "Otorisasi Mutasi",
  },
];

// Data tren periode
const TREND_DATA_SERIES: Record<
  TimePeriod,
  { label: string; date: string; stockIn: number; stockOut: number; closingStock: number }[]
> = {
  "7D": [
    { label: "15 Okt", date: "Kamis, 15 Okt", stockIn: 1850, stockOut: 1620, closingStock: 2410 },
    { label: "16 Okt", date: "Jumat, 16 Okt", stockIn: 2100, stockOut: 1980, closingStock: 2422 },
    { label: "17 Okt", date: "Sabtu, 17 Okt", stockIn: 2450, stockOut: 2150, closingStock: 2452 },
    { label: "18 Okt", date: "Minggu, 18 Okt", stockIn: 1200, stockOut: 1350, closingStock: 2437 },
    { label: "19 Okt", date: "Senin, 19 Okt", stockIn: 2800, stockOut: 2600, closingStock: 2457 },
    { label: "20 Okt", date: "Selasa, 20 Okt", stockIn: 2300, stockOut: 2420, closingStock: 2445 },
    { label: "21 Okt", date: "Rabu, 21 Okt", stockIn: 2650, stockOut: 2280, closingStock: 2482 },
  ],
  "30D": [
    { label: "W1", date: "Minggu 1 (Sep)", stockIn: 8400, stockOut: 7900, closingStock: 2380 },
    { label: "W2", date: "Minggu 2 (Okt)", stockIn: 9200, stockOut: 8850, closingStock: 2415 },
    { label: "W3", date: "Minggu 3 (Okt)", stockIn: 10500, stockOut: 9900, closingStock: 2475 },
    { label: "W4", date: "Minggu 4 (Okt)", stockIn: 9800, stockOut: 9730, closingStock: 2482 },
  ],
  "90D": [
    { label: "Agt", date: "Agustus 2026", stockIn: 38500, stockOut: 36200, closingStock: 2320 },
    { label: "Sep", date: "September 2026", stockIn: 41200, stockOut: 39800, closingStock: 2390 },
    { label: "Okt", date: "Oktober 2026 (MTD)", stockIn: 34500, stockOut: 31200, closingStock: 2482 },
  ],
  "365D": [
    { label: "Q1", date: "Kuartal 1 2026", stockIn: 112000, stockOut: 108000, closingStock: 2180 },
    { label: "Q2", date: "Kuartal 2 2026", stockIn: 125000, stockOut: 121000, closingStock: 2290 },
    { label: "Q3", date: "Kuartal 3 2026", stockIn: 132000, stockOut: 128500, closingStock: 2390 },
    { label: "Q4", date: "Kuartal 4 (YTD)", stockIn: 42000, stockOut: 38200, closingStock: 2482 },
  ],
};

export default function InventoryDashboardClient() {
  // --- STATE ---
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("7D");
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{
    label: string;
    date: string;
    stockIn: number;
    stockOut: number;
    closingStock: number;
  } | null>(null);

  const [alertFilter, setAlertFilter] = useState<AlertType>("ALL");
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseItem | null>(null);
  const [activeAlert, setActiveAlert] = useState<AlertItem | null>(null);

  // Quick Action Modals
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState("20:28:40 WIB");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);

  // Quick toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} WIB`;
      setLastRefreshedAt(timeStr);
      setIsRefreshing(false);
      showToast("Data inventaris seluruh gudang berhasil disinkronkan.");
    }, 600);
  };

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    if (alertFilter === "ALL") return INITIAL_ALERTS;
    return INITIAL_ALERTS.filter((a) => a.category === alertFilter);
  }, [alertFilter]);

  // Chart data calculations
  const chartPoints = TREND_DATA_SERIES[selectedPeriod];
  const maxVolume = useMemo(() => {
    return Math.max(
      ...chartPoints.map((p) => Math.max(p.stockIn, p.stockOut)),
      1000
    );
  }, [chartPoints]);

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141413] text-[#FAF9F5] px-4 py-3 rounded border border-neutral-700 shadow-xl flex items-center gap-3 font-mono text-xs animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ==============================================================
          PAGE HEADER
          ============================================================== */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#141413]/10 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
              PT. ZAHDAN KAMAL SENTOSA
            </span>
            <span className="text-[#8E8B81] text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#141413] font-semibold block">
              ENTERPRISE INVENTORY COMMAND CENTER
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Inventory Dashboard
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Real-time inventory overview across all warehouses.
          </p>
        </div>

        {/* Top Right Action Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="text-[11px] font-mono text-[#8E8B81] mr-1 hidden lg:block">
            Synced: <span className="text-[#141413] font-medium">{lastRefreshedAt}</span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
            title="Sinkronisasi data fisik gudang secara live"
          >
            <svg
              className={`w-3.5 h-3.5 text-[#141413] ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
          </button>

          {/* Export Button */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#141413]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Export</span>
          </button>

          {/* New Item Button */}
          <button
            type="button"
            onClick={() => setIsNewItemModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Item</span>
          </button>
        </div>
      </header>

      {/* ==============================================================
          SECTION 01: INVENTORY SUMMARY CARDS (6 Clean Cards)
          "Elegant. No heavy shadows. No gradients. Lift 2px on hover."
          ============================================================== */}
      <section aria-labelledby="summary-cards-heading">
        <h2 id="summary-cards-heading" className="sr-only">
          Inventory Summary Cards
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Current Stock Value */}
          <button
            type="button"
            onClick={() => showToast("Valuasi total persediaan: Rp 2.450.000.000 di 5 fasilitas")}
            className="text-left p-4 sm:p-5 bg-white border border-[#141413]/10 transition-all duration-180 hover:-translate-y-0.5 hover:border-[#141413]/25 hover:shadow-xs cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#626058] font-semibold block">
                01 / Current Stock Value
              </span>
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#141413] tracking-tight">
                Rp 2.45 B
              </p>
            </div>
            <div className="pt-3 border-t border-[#141413]/5 flex items-center justify-between text-[11px] font-mono text-[#626058]">
              <span>5 Fasilitas</span>
              <span className="text-emerald-700 font-semibold">+2.8% MoM</span>
            </div>
          </button>

          {/* 2. Total Items */}
          <button
            type="button"
            onClick={() => showToast("Total katalog: 12.584 SKU aktif dalam master database")}
            className="text-left p-4 sm:p-5 bg-white border border-[#141413]/10 transition-all duration-180 hover:-translate-y-0.5 hover:border-[#141413]/25 hover:shadow-xs cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#626058] font-semibold block">
                02 / Total Items
              </span>
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#141413] tracking-tight">
                12,584
              </p>
            </div>
            <div className="pt-3 border-t border-[#141413]/5 flex items-center justify-between text-[11px] font-mono text-[#626058]">
              <span>SKU Master</span>
              <span className="text-[#141413] font-semibold">34 Kategori</span>
            </div>
          </button>

          {/* 3. Low Stock (Red Accent) */}
          <button
            type="button"
            onClick={() => setAlertFilter("LOW_STOCK")}
            className="text-left p-4 sm:p-5 bg-white border border-rose-200/80 transition-all duration-180 hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-xs cursor-pointer group flex flex-col justify-between ring-1 ring-rose-500/10"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-rose-700 font-semibold block">
                  03 / Low Stock
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </div>
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-rose-600 tracking-tight">
                42
              </p>
            </div>
            <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-[11px] font-mono text-rose-700">
              <span>Di Bawah Buffer</span>
              <span className="font-semibold underline underline-offset-2">Filter →</span>
            </div>
          </button>

          {/* 4. Expiring Soon (Orange Accent) */}
          <button
            type="button"
            onClick={() => setAlertFilter("EXPIRING")}
            className="text-left p-4 sm:p-5 bg-white border border-amber-200/80 transition-all duration-180 hover:-translate-y-0.5 hover:border-[#C85A17] hover:shadow-xs cursor-pointer group flex flex-col justify-between ring-1 ring-[#C85A17]/10"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                  04 / Expiring Soon
                </span>
                <span className="w-2 h-2 rounded-full bg-[#C85A17]"></span>
              </div>
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-[#C85A17] tracking-tight">
                17
              </p>
            </div>
            <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] font-mono text-[#C85A17]">
              <span>&lt; 72 Jam FIFO</span>
              <span className="font-semibold underline underline-offset-2">Filter →</span>
            </div>
          </button>

          {/* 5. Today's Stock Movement (Blue Accent) */}
          <button
            type="button"
            onClick={() => showToast("Total mutasi hari ini: 284 transaksi tercatat di buku besar")}
            className="text-left p-4 sm:p-5 bg-white border border-blue-200/80 transition-all duration-180 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-xs cursor-pointer group flex flex-col justify-between ring-1 ring-blue-500/10"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-700 font-semibold block">
                  05 / Today Movement
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-blue-700 tracking-tight">
                284
              </p>
            </div>
            <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-[11px] font-mono text-blue-700">
              <span>In &amp; Out Ledger</span>
              <span className="font-semibold">Live Flow</span>
            </div>
          </button>

          {/* 6. Inventory Accuracy (Green Accent) */}
          <button
            type="button"
            onClick={() => showToast("Tingkat akurasi audit fisik: 99.6% (Standar ISO 22000 terpenuhi)")}
            className="text-left p-4 sm:p-5 bg-white border border-emerald-200/80 transition-all duration-180 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-xs cursor-pointer group flex flex-col justify-between ring-1 ring-emerald-500/10"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-800 font-semibold block">
                  06 / Accuracy
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-700 tracking-tight">
                99.6%
              </p>
            </div>
            <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] font-mono text-emerald-800">
              <span>Cycle Count</span>
              <span className="font-semibold">HACCP Tier 1</span>
            </div>
          </button>
        </div>
      </section>

      {/* ==============================================================
          RESPONSIVE 2-COLUMN ARCHITECTURAL GRID
          Desktop: 2 Columns (7:5 ratio)
          Tablet: 1 Column
          Mobile: Stack naturally
          ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================
            LEFT COLUMN (lg:col-span-7)
            - Section 02: Inventory Trend (Large interactive Chart)
            - Section 03: Warehouse Overview
            - Section 06: Quick Actions
            ============================================================ */}
        <div className="lg:col-span-7 space-y-10">
          {/* ==========================================================
              SECTION 02: INVENTORY TREND (Large Chart)
              Period: 7 Days | 30 Days | 90 Days | 365 Days
              Show: Stock In, Stock Out, Closing Stock
              Smooth animation
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                  OPERATIONAL VELOCITY
                </span>
                <h3 className="font-display font-bold text-xl text-[#141413] tracking-tight">
                  Inventory Trend &amp; Material Throughput
                </h3>
              </div>

              {/* Selectable Period Switcher */}
              <div className="inline-flex p-1 bg-neutral-100 border border-[#141413]/10 rounded-xs self-start sm:self-auto">
                {(["7D", "30D", "90D", "365D"] as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setSelectedPeriod(period);
                      setHoveredDataPoint(null);
                    }}
                    className={`px-3 py-1 text-xs font-mono font-semibold transition-all cursor-pointer ${
                      selectedPeriod === period
                        ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                        : "text-[#626058] hover:text-[#141413]"
                    }`}
                  >
                    {period === "7D" && "7 Days"}
                    {period === "30D" && "30 Days"}
                    {period === "90D" && "90 Days"}
                    {period === "365D" && "365 Days"}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-600 rounded-xs"></span>
                <span className="text-[#141413] font-medium">Stock In (Inbound kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-600 rounded-xs"></span>
                <span className="text-[#141413] font-medium">Stock Out (Kitchen Usage kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-[#141413]"></span>
                <span className="text-[#141413] font-medium">Closing Stock Value (Index)</span>
              </div>
            </div>

            {/* Interactive SVG Bar & Line Canvas Chart */}
            <div className="relative pt-4">
              <div className="h-64 sm:h-72 w-full flex items-end gap-2 sm:gap-4 px-2 pb-6 border-b border-[#141413]/15">
                {chartPoints.map((pt, idx) => {
                  const inHeightPct = Math.max(12, Math.round((pt.stockIn / maxVolume) * 88));
                  const outHeightPct = Math.max(10, Math.round((pt.stockOut / maxVolume) * 88));

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDataPoint(pt)}
                      className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                    >
                      {/* Bar Pair */}
                      <div className="w-full max-w-[42px] flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                        {/* Stock In Bar */}
                        <div
                          style={{ height: `${inHeightPct}%` }}
                          className="w-1/2 bg-emerald-600/90 group-hover:bg-emerald-700 transition-all duration-300 rounded-t-xs"
                          title={`Stock In: ${pt.stockIn.toLocaleString("id-ID")} kg`}
                        ></div>
                        {/* Stock Out Bar */}
                        <div
                          style={{ height: `${outHeightPct}%` }}
                          className="w-1/2 bg-amber-600/85 group-hover:bg-amber-700 transition-all duration-300 rounded-t-xs"
                          title={`Stock Out: ${pt.stockOut.toLocaleString("id-ID")} kg`}
                        ></div>
                      </div>

                      {/* X-Axis Label */}
                      <span className="absolute -bottom-5 text-[10px] font-mono text-[#626058] group-hover:text-[#141413] font-medium whitespace-nowrap">
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Hover Floating Tooltip */}
              {hoveredDataPoint && (
                <div className="mt-8 p-3.5 bg-neutral-900 text-[#FAF9F5] text-xs font-mono rounded border border-neutral-700 shadow-lg flex flex-wrap items-center justify-between gap-4 transition-all animate-fade-in">
                  <div>
                    <span className="text-[#8E8B81] text-[10px] uppercase block">Periode</span>
                    <strong className="text-white text-sm">{hoveredDataPoint.date}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-400 text-[10px] uppercase block">● Stock In</span>
                    <span className="font-bold">+{hoveredDataPoint.stockIn.toLocaleString("id-ID")} kg</span>
                  </div>
                  <div>
                    <span className="text-amber-400 text-[10px] uppercase block">● Stock Out</span>
                    <span className="font-bold">−{hoveredDataPoint.stockOut.toLocaleString("id-ID")} kg</span>
                  </div>
                  <div>
                    <span className="text-blue-300 text-[10px] uppercase block">● Closing Stock</span>
                    <span className="font-bold">Rp {hoveredDataPoint.closingStock} M</span>
                  </div>
                </div>
              )}
            </div>

            {/* Throughput KPI Ribbon */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#141413]/10 text-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase text-[#8E8B81]">Rata-Rata Masuk</span>
                <p className="font-mono font-bold text-[#141413]">2.41 Ton / Hari</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase text-[#8E8B81]">Rata-Rata Pakai</span>
                <p className="font-mono font-bold text-[#141413]">2.18 Ton / Hari</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] uppercase text-[#8E8B81]">Buffer Runway</span>
                <p className="font-mono font-bold text-emerald-700">14.2 Hari Aman</p>
              </div>
            </div>
          </section>

          {/* ==========================================================
              SECTION 03: WAREHOUSE OVERVIEW
              Display each warehouse:
              - Main Warehouse
              - Cold Storage
              - Dry Storage
              - Packaging
              - Kitchen Buffer
              Each shows: Current Capacity, Utilization %, Stock Count, Status
              ========================================================== */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                  PHYSICAL FACILITY DISTRIBUTION
                </span>
                <h3 className="font-display font-bold text-xl text-[#141413] tracking-tight">
                  Warehouse Overview &amp; Space Capacity
                </h3>
              </div>
              <span className="font-mono text-xs text-[#626058]">5 Fasilitas Terdaftar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INITIAL_WAREHOUSES.map((wh) => {
                const isNearFull = wh.utilizationPct >= 90;
                const isWarning = wh.utilizationPct >= 80 && wh.utilizationPct < 90;

                return (
                  <button
                    key={wh.id}
                    type="button"
                    onClick={() => setSelectedWarehouse(wh)}
                    className="text-left bg-white border border-[#141413]/10 p-5 space-y-4 transition-all duration-180 hover:-translate-y-0.5 hover:border-[#141413]/25 hover:shadow-xs cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8B81] block">
                          {wh.category}
                        </span>
                        <h4 className="font-display font-bold text-base text-[#141413] group-hover:text-[#C85A17] transition-colors leading-snug">
                          {wh.name}
                        </h4>
                      </div>
                      <span
                        className={`inline-flex px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs shrink-0 ${
                          isNearFull
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : isWarning
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {wh.status}
                      </span>
                    </div>

                    {/* Progress Bar of Utilization */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#626058]">Kapasitas Terpakai</span>
                        <strong className="text-[#141413]">{wh.utilizationPct}% ({wh.currentLoad})</strong>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-xs overflow-hidden">
                        <div
                          style={{ width: `${wh.utilizationPct}%` }}
                          className={`h-full transition-all duration-500 ${
                            isNearFull ? "bg-amber-600" : isWarning ? "bg-[#C85A17]" : "bg-emerald-600"
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#141413]/5 text-xs font-mono">
                      <div>
                        <span className="text-[#8E8B81] text-[10px] block">Total Kapasitas</span>
                        <span className="font-bold text-[#141413]">{wh.capacity}</span>
                      </div>
                      <div>
                        <span className="text-[#8E8B81] text-[10px] block">Jumlah Item</span>
                        <span className="font-bold text-[#141413]">{wh.stockCount}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ==========================================================
              SECTION 06: QUICK ACTIONS
              Large clean buttons:
              - Receive Goods
              - Stock Adjustment
              - Transfer Stock
              - Stock Opname
              - Purchase Request
              ========================================================== */}
          <section className="space-y-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                OPERATIONAL COMMANDS
              </span>
              <h3 className="font-display font-bold text-xl text-[#141413] tracking-tight">
                Quick Actions
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {/* 1. Receive Goods */}
              <button
                type="button"
                onClick={() => setActiveActionModal("receive")}
                className="p-4 bg-white border border-[#141413]/10 hover:border-[#141413]/30 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-180 flex flex-col items-center text-center gap-2.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="font-display font-bold text-xs text-[#141413] block">Receive Goods</strong>
                  <span className="text-[10px] font-mono text-[#8E8B81] block">Barang Masuk / PO</span>
                </div>
              </button>

              {/* 2. Stock Adjustment */}
              <button
                type="button"
                onClick={() => setActiveActionModal("adjustment")}
                className="p-4 bg-white border border-[#141413]/10 hover:border-[#141413]/30 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-180 flex flex-col items-center text-center gap-2.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xs bg-amber-50 text-[#C85A17] border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="font-display font-bold text-xs text-[#141413] block">Stock Adjustment</strong>
                  <span className="text-[10px] font-mono text-[#8E8B81] block">Koreksi / Selisih</span>
                </div>
              </button>

              {/* 3. Transfer Stock */}
              <button
                type="button"
                onClick={() => setActiveActionModal("transfer")}
                className="p-4 bg-white border border-[#141413]/10 hover:border-[#141413]/30 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-180 flex flex-col items-center text-center gap-2.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xs bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="font-display font-bold text-xs text-[#141413] block">Transfer Stock</strong>
                  <span className="text-[10px] font-mono text-[#8E8B81] block">Mutasi Antar Depo</span>
                </div>
              </button>

              {/* 4. Stock Opname */}
              <button
                type="button"
                onClick={() => setActiveActionModal("opname")}
                className="p-4 bg-white border border-[#141413]/10 hover:border-[#141413]/30 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-180 flex flex-col items-center text-center gap-2.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xs bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="font-display font-bold text-xs text-[#141413] block">Stock Opname</strong>
                  <span className="text-[10px] font-mono text-[#8E8B81] block">Sensus Fisik Berkala</span>
                </div>
              </button>

              {/* 5. Purchase Request */}
              <button
                type="button"
                onClick={() => setActiveActionModal("purchase")}
                className="p-4 bg-white border border-[#141413]/10 hover:border-[#141413]/30 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-180 flex flex-col items-center text-center gap-2.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xs bg-neutral-100 text-[#141413] border border-neutral-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <strong className="font-display font-bold text-xs text-[#141413] block">Purchase Request</strong>
                  <span className="text-[10px] font-mono text-[#8E8B81] block">Pengadaan Baru</span>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* ============================================================
            RIGHT COLUMN (lg:col-span-5)
            - Section 05: Inventory Alerts (Clickable alert items)
            - Section 04: Recent Stock Activities (Timeline style, NOT table)
            ============================================================ */}
        <div className="lg:col-span-5 space-y-10">
          {/* ==========================================================
              SECTION 05: INVENTORY ALERTS
              Display important alerts:
              - Low Stock
              - Expiring
              - Negative Stock
              - Pending Approval
              Each alert clickable
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-rose-600 font-semibold block">
                  ACTION DISPATCH
                </span>
                <h3 className="font-display font-bold text-xl text-[#141413] tracking-tight">
                  Inventory Alerts
                </h3>
              </div>
              <span className="font-mono text-xs text-[#626058]">
                {filteredAlerts.length} Perlu Tindakan
              </span>
            </div>

            {/* Alert Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 rounded-xs text-[11px] font-mono">
              {[
                { id: "ALL", label: "All" },
                { id: "LOW_STOCK", label: "Low Stock (2)" },
                { id: "EXPIRING", label: "Expiring (2)" },
                { id: "NEGATIVE_STOCK", label: "Negative (1)" },
                { id: "PENDING_APPROVAL", label: "Approval (2)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAlertFilter(tab.id as AlertType)}
                  className={`px-2.5 py-1 font-semibold rounded-xs transition-all cursor-pointer ${
                    alertFilter === tab.id
                      ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                      : "text-[#626058] hover:text-[#141413]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Alert Cards List */}
            <div className="space-y-3">
              {filteredAlerts.map((alt) => {
                const isCritical = alt.severity === "critical";
                const isWarning = alt.severity === "warning";

                return (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => setActiveAlert(alt)}
                    className={`w-full text-left p-3.5 border transition-all duration-180 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer group flex flex-col gap-2 rounded-xs ${
                      isCritical
                        ? "bg-rose-50/40 border-rose-200/90 hover:border-rose-400"
                        : isWarning
                        ? "bg-amber-50/40 border-amber-200/90 hover:border-amber-400"
                        : "bg-blue-50/30 border-blue-200/90 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-[#8E8B81] uppercase block">
                          {alt.location}
                        </span>
                        <h4 className="font-display font-bold text-sm text-[#141413] group-hover:text-[#C85A17] transition-colors leading-tight">
                          {alt.title}
                        </h4>
                      </div>
                      <span
                        className={`inline-flex px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs shrink-0 ${
                          isCritical
                            ? "bg-rose-100 text-rose-800"
                            : isWarning
                            ? "bg-amber-100 text-amber-900"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {alt.value}
                      </span>
                    </div>

                    <p className="text-xs text-[#626058] line-clamp-2 leading-relaxed">
                      {alt.description}
                    </p>

                    <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#8E8B81]">Kode: {alt.sku}</span>
                      <span className="font-semibold text-[#141413] group-hover:text-[#C85A17] underline underline-offset-2">
                        {alt.actionLabel} →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ==========================================================
              SECTION 04: RECENT STOCK ACTIVITIES
              Timeline style. NOT table.
              Example:
              08:12 | Chicken Breast | Stock In | Supplier ABC | 250 kg
              ↓
              09:30 | Rice | Production Consumption | −120 kg
              ↓
              11:05 | Cooking Oil | Transfer | Warehouse A → Kitchen
              ========================================================== */}
          <section className="bg-white border border-[#141413]/10 p-6 space-y-6">
            <div className="flex items-baseline justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                  AUDIT LOG &amp; TRACEABILITY
                </span>
                <h3 className="font-display font-bold text-xl text-[#141413] tracking-tight">
                  Recent Stock Activities
                </h3>
              </div>
              <span className="font-mono text-xs text-[#626058]">Live Ledger</span>
            </div>

            {/* Vertical Timeline Structure */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-px before:bg-[#141413]/15">
              {INITIAL_ACTIVITIES.map((act) => {
                const isInbound = act.type === "Stock In";
                const isOutbound = act.type === "Production Consumption";

                return (
                  <div key={act.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                        isInbound
                          ? "bg-emerald-600"
                          : isOutbound
                          ? "bg-amber-600"
                          : "bg-blue-600"
                      }`}
                    ></div>

                    <div className="bg-[#FAF9F5] border border-[#141413]/10 p-3.5 rounded-xs space-y-2 hover:border-[#141413]/30 transition-all">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#141413]">{act.time}</span>
                          <span className="text-[#8E8B81]">•</span>
                          <span
                            className={`font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-xs ${
                              isInbound
                                ? "bg-emerald-100 text-emerald-800"
                                : isOutbound
                                ? "bg-amber-100 text-amber-900"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {act.type}
                          </span>
                        </div>
                        <span
                          className={`font-mono font-bold text-xs ${
                            act.isPositive ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {act.delta}
                        </span>
                      </div>

                      <div>
                        <strong className="font-display font-bold text-sm text-[#141413] block">
                          {act.item}
                        </strong>
                        <p className="text-xs text-[#626058]">{act.party}</p>
                      </div>

                      <div className="pt-2 border-t border-[#141413]/5 flex items-center justify-between text-[10px] font-mono text-[#8E8B81]">
                        <span>{act.sku}</span>
                        <span>PIC: {act.operator}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* ==============================================================
          INTERACTIVE MODALS & DRAWERS
          ============================================================== */}

      {/* 1. Warehouse Details Modal */}
      {selectedWarehouse && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Detail Fasilitas Gudang
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  {selectedWarehouse.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWarehouse(null)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[#8E8B81] block">Lokasi Fasilitas:</span>
                <p className="font-bold text-[#141413]">{selectedWarehouse.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[#8E8B81] block">Spesifikasi Suhu</span>
                  <strong className="text-[#141413]">{selectedWarehouse.tempSpec}</strong>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[#8E8B81] block">Status Operasi</span>
                  <strong className="text-emerald-700">{selectedWarehouse.status}</strong>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[#8E8B81] block">Utilisasi Kapasitas</span>
                  <strong className="text-[#141413]">
                    {selectedWarehouse.utilizationPct}% ({selectedWarehouse.currentLoad} / {selectedWarehouse.capacity})
                  </strong>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[#8E8B81] block">Katalog Item</span>
                  <strong className="text-[#141413]">{selectedWarehouse.stockCount}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => {
                  setSelectedWarehouse(null);
                  showToast(`Memulai audit stok untuk ${selectedWarehouse.name}`);
                }}
                className="px-4 py-2 text-xs font-mono uppercase bg-[#141413] text-white hover:bg-[#141413]/90 font-semibold cursor-pointer"
              >
                Jadwalkan Cycle Count
              </button>
              <button
                type="button"
                onClick={() => setSelectedWarehouse(null)}
                className="px-4 py-2 text-xs font-mono uppercase bg-neutral-200 text-[#141413] hover:bg-neutral-300 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Alert Resolution Modal */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-rose-600 font-semibold block">
                  Peringatan Operasional Gudang
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  {activeAlert.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveAlert(null)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#626058] leading-relaxed bg-neutral-50 p-3 border border-neutral-200 font-mono">
                {activeAlert.description}
              </p>
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[#8E8B81] text-[10px] block">SKU Code</span>
                  <strong>{activeAlert.sku}</strong>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[#8E8B81] text-[10px] block">Status Nilai</span>
                  <strong className="text-rose-600">{activeAlert.value}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => {
                  showToast(`Aksi "${activeAlert.actionLabel}" berhasil dieksekusi.`);
                  setActiveAlert(null);
                }}
                className="px-4 py-2 text-xs font-mono uppercase bg-[#141413] text-white hover:bg-[#141413]/90 font-semibold cursor-pointer"
              >
                {activeAlert.actionLabel}
              </button>
              <button
                type="button"
                onClick={() => setActiveAlert(null)}
                className="px-4 py-2 text-xs font-mono uppercase bg-neutral-200 text-[#141413] hover:bg-neutral-300 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Export Ledger &amp; Inventory Data
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Ekspor Data Persediaan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  showToast("Laporan Master Stock (CSV) berhasil diunduh.");
                  setIsExportModalOpen(false);
                }}
                className="w-full text-left p-3 border border-neutral-200 hover:border-[#141413] hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <strong className="block text-[#141413]">Master Stock Ledger (CSV)</strong>
                  <span className="text-[#8E8B81] text-[10px]">Seluruh 12.584 SKU dengan valuasi rupiah</span>
                </div>
                <span>⬇</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast("Buku Besar Mutasi Bahan Baku (Excel) berhasil diunduh.");
                  setIsExportModalOpen(false);
                }}
                className="w-full text-left p-3 border border-neutral-200 hover:border-[#141413] hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <strong className="block text-[#141413]">Stock Movement Log (XLSX)</strong>
                  <span className="text-[#8E8B81] text-[10px]">Riwayat transaksi 30 hari terakhir</span>
                </div>
                <span>⬇</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast("Laporan Kepatuhan ISO & HACCP (PDF) berhasil diunduh.");
                  setIsExportModalOpen(false);
                }}
                className="w-full text-left p-3 border border-neutral-200 hover:border-[#141413] hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <strong className="block text-[#141413]">Audit &amp; Accuracy Report (PDF)</strong>
                  <span className="text-[#8E8B81] text-[10px]">Dokumen resmi verifikasi cycle count</span>
                </div>
                <span>⬇</span>
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-xs font-mono uppercase bg-neutral-200 text-[#141413] hover:bg-neutral-300 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Quick Actions Execution Modal */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Formulir Operasional Gudang
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413] capitalize">
                  {activeActionModal === "receive" && "Receive Goods (Penerimaan Barang)"}
                  {activeActionModal === "adjustment" && "Stock Adjustment (Penyesuaian Fisik)"}
                  {activeActionModal === "transfer" && "Transfer Stock (Mutasi Antar Depo)"}
                  {activeActionModal === "opname" && "Stock Opname (Sensus Fisik Berkala)"}
                  {activeActionModal === "purchase" && "Purchase Request (Pengadaan Baru)"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveActionModal(null)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Formulir ${activeActionModal} berhasil disimpan.`);
                setActiveActionModal(null);
              }}
              className="space-y-4 text-xs font-mono"
            >
              <div className="space-y-1">
                <label className="text-[#141413] font-semibold block">Pilih Bahan / SKU</label>
                <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413] focus:border-[#141413] outline-hidden">
                  <option>SKU-PLT-091 — Chicken Breast Fillet (Grade A)</option>
                  <option>SKU-GRN-012 — Beras Ramos Premium IR-64</option>
                  <option>SKU-OIL-004 — Minyak Goreng Sawit Higienis</option>
                  <option>SKU-BEEF-023 — Daging Sapi Sandung Lamur (Brisket)</option>
                  <option>SKU-SPB-044 — Bawang Merah Brebes Super</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#141413] font-semibold block">Kuantitas / Jumlah</label>
                  <input
                    type="number"
                    defaultValue={100}
                    placeholder="Contoh: 100"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413] focus:border-[#141413] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-semibold block">Satuan</label>
                  <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413] focus:border-[#141413] outline-hidden">
                    <option>Kilogram (kg)</option>
                    <option>Liter (L)</option>
                    <option>Pieces (pcs)</option>
                    <option>Pack</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#141413] font-semibold block">Catatan / Referensi Surat Jalan</label>
                <input
                  type="text"
                  placeholder="No. Surat Jalan / Alasan mutasi..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413] focus:border-[#141413] outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono uppercase bg-[#141413] text-white hover:bg-[#141413]/90 font-semibold cursor-pointer"
                >
                  Simpan Transaksi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveActionModal(null)}
                  className="px-4 py-2 text-xs font-mono uppercase bg-neutral-200 text-[#141413] hover:bg-neutral-300 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. New Item Modal */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Master SKU Registration
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Daftarkan Item Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewItemModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Item SKU baru berhasil didaftarkan ke sistem ERP.");
                setIsNewItemModalOpen(false);
              }}
              className="space-y-4 text-xs font-mono"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#141413] font-semibold block">SKU Code (Otomatis)</label>
                  <input
                    type="text"
                    defaultValue="SKU-ZKS-2026-99"
                    className="w-full p-2.5 bg-neutral-100 border border-neutral-300 text-[#141413] font-bold"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-semibold block">Kategori Bahan</label>
                  <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]">
                    <option>Bahan Baku Mentah (Raw Material)</option>
                    <option>Bahan Olahan Dingin (Cold Storage)</option>
                    <option>Bumbu &amp; Rempah (Spices)</option>
                    <option>Kemasan &amp; Disposables</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#141413] font-semibold block">Nama Bahan Baku / Barang</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Daging Ayam Fillet Paha Grade A"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413] focus:border-[#141413] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#141413] font-semibold block">Stok Awal</label>
                  <input
                    type="number"
                    defaultValue={50}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-semibold block">Satuan</label>
                  <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]">
                    <option>kg</option>
                    <option>Liter</option>
                    <option>pcs</option>
                    <option>pack</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-semibold block">Min. Buffer</label>
                  <input
                    type="number"
                    defaultValue={20}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#141413] font-semibold block">Gudang Penyimpanan Default</label>
                <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]">
                  <option>Main Warehouse (Gudang Utama)</option>
                  <option>Cold Storage (Chiller/Freezer)</option>
                  <option>Dry Storage (Gudang Kering)</option>
                  <option>Packaging &amp; Disposables</option>
                  <option>Kitchen Buffer</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono uppercase bg-[#141413] text-white hover:bg-[#141413]/90 font-semibold cursor-pointer"
                >
                  Daftarkan SKU
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono uppercase bg-neutral-200 text-[#141413] hover:bg-neutral-300 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
