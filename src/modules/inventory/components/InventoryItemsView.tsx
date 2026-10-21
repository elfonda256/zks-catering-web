"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// --- TYPES ---
export type ItemStatus =
  | "In Stock"
  | "Low Stock"
  | "Critical"
  | "Out of Stock"
  | "Expired"
  | "Quarantine";

export interface MasterItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  warehouse: string;
  currentStock: number;
  minimumStock: number;
  availableStock: number;
  reservedStock: number;
  unit: string;
  status: ItemStatus;
  lastUpdated: string;
  averageCost: number;
  supplier: string;
  expiryDate: string;
  batchNumber: string;
  imageEmoji: string;
  latestActivity: string;
}

// --- DATASET MOCK ENTERPRISE ---
export const MASTER_ITEMS_DATA: MasterItem[] = [
  {
    id: "item-1",
    sku: "SKU-PLT-091",
    barcode: "8992100491021",
    name: "Daging Ayam Fillet Paha (Grade A)",
    category: "Poultry & Meat",
    warehouse: "Cold Storage (Chiller)",
    currentStock: 1450,
    minimumStock: 500,
    availableStock: 1150,
    reservedStock: 300,
    unit: "kg",
    status: "In Stock",
    lastUpdated: "12 mins ago",
    averageCost: 38500,
    supplier: "PT. Sumber Unggas Makmur",
    expiryDate: "26 Okt 2026",
    batchNumber: "B-PLT-8821",
    imageEmoji: "🍗",
    latestActivity: "Stock In +250 kg via PO #GRN-8810",
  },
  {
    id: "item-2",
    sku: "SKU-GRN-012",
    barcode: "8993120192834",
    name: "Beras Ramos Premium IR-64",
    category: "Dry Goods & Grains",
    warehouse: "Main Warehouse",
    currentStock: 4800,
    minimumStock: 2000,
    availableStock: 4200,
    reservedStock: 600,
    unit: "kg",
    status: "In Stock",
    lastUpdated: "1 hour ago",
    averageCost: 14800,
    supplier: "Koperasi Tani Karawang Sejahtera",
    expiryDate: "15 Jan 2027",
    batchNumber: "B-GRN-1092",
    imageEmoji: "🌾",
    latestActivity: "Consumed −120 kg by Kitchen Shift 1",
  },
  {
    id: "item-3",
    sku: "SKU-SPB-044",
    barcode: "8991209384721",
    name: "Bawang Merah Brebes Super",
    category: "Fresh Produce & Spices",
    warehouse: "Dry Storage",
    currentStock: 18,
    minimumStock: 50,
    availableStock: 8,
    reservedStock: 10,
    unit: "kg",
    status: "Critical",
    lastUpdated: "25 mins ago",
    averageCost: 32000,
    supplier: "CV. Agro Sayur Mandiri",
    expiryDate: "28 Okt 2026",
    batchNumber: "B-SPB-331",
    imageEmoji: "🧅",
    latestActivity: "Critical Alert: Stock below safety threshold",
  },
  {
    id: "item-4",
    sku: "SKU-BEEF-023",
    barcode: "8998237192831",
    name: "Daging Sapi Sandung Lamur (Brisket)",
    category: "Poultry & Meat",
    warehouse: "Cold Storage (Freezer)",
    currentStock: 340,
    minimumStock: 400,
    availableStock: 220,
    reservedStock: 120,
    unit: "kg",
    status: "Low Stock",
    lastUpdated: "3 hours ago",
    averageCost: 115000,
    supplier: "PT. Berkah Daging Sejati",
    expiryDate: "23 Okt 2026",
    batchNumber: "B-BEEF-8832",
    imageEmoji: "🥩",
    latestActivity: "Transferred 150 kg to Thawing Room",
  },
  {
    id: "item-5",
    sku: "SKU-OIL-004",
    barcode: "8995512938472",
    name: "Minyak Goreng Sawit Higienis",
    category: "Cooking Oils & Fats",
    warehouse: "Main Warehouse",
    currentStock: 1200,
    minimumStock: 500,
    availableStock: 1050,
    reservedStock: 150,
    unit: "Liter",
    status: "In Stock",
    lastUpdated: "4 hours ago",
    averageCost: 16500,
    supplier: "PT. Wilmar Cahaya Nabati",
    expiryDate: "12 Des 2027",
    batchNumber: "B-OIL-449",
    imageEmoji: "🛢️",
    latestActivity: "Dispatched 80 L to Kitchen Buffer Line A",
  },
  {
    id: "item-6",
    sku: "SKU-PCK-109",
    barcode: "8997382910293",
    name: "Bento Box 4-Grid Eco-Kraft",
    category: "Packaging & Disposables",
    warehouse: "Packaging Depot",
    currentStock: 18500,
    minimumStock: 5000,
    availableStock: 14000,
    reservedStock: 4500,
    unit: "pcs",
    status: "In Stock",
    lastUpdated: "Yesterday",
    averageCost: 1450,
    supplier: "CV. Kemasan Lestari Abadi",
    expiryDate: "Permanent",
    batchNumber: "B-PCK-781",
    imageEmoji: "📦",
    latestActivity: "Received +1,200 pcs from supplier delivery",
  },
  {
    id: "item-7",
    sku: "SKU-MSC-077",
    barcode: "8993829102837",
    name: "Bumbu Racik Rawon Siap Olah",
    category: "Prepared Seasoning",
    warehouse: "Kitchen Buffer",
    currentStock: 0,
    minimumStock: 30,
    availableStock: 0,
    reservedStock: 0,
    unit: "kg",
    status: "Out of Stock",
    lastUpdated: "6 hours ago",
    averageCost: 45000,
    supplier: "Dapur Sentral ZKS (In-House)",
    expiryDate: "24 Okt 2026",
    batchNumber: "B-RAW-101",
    imageEmoji: "🥣",
    latestActivity: "Stock depleted: Reorder PO triggered",
  },
  {
    id: "item-8",
    sku: "SKU-EGG-018",
    barcode: "8996619283748",
    name: "Telur Ayam Negeri Segar",
    category: "Fresh Produce & Dairy",
    warehouse: "Cold Storage (Chiller)",
    currentStock: 850,
    minimumStock: 300,
    availableStock: 700,
    reservedStock: 150,
    unit: "kg",
    status: "In Stock",
    lastUpdated: "2 hours ago",
    averageCost: 27500,
    supplier: "Peternakan Ayam Telur Subang",
    expiryDate: "04 Nov 2026",
    batchNumber: "B-EGG-902",
    imageEmoji: "🥚",
    latestActivity: "QC Inbound Passed: Batch #QC-8821",
  },
  {
    id: "item-9",
    sku: "SKU-TOFU-009",
    barcode: "8991192837465",
    name: "Tahu Putih Sutra Non-Formalin",
    category: "Fresh Produce & Perishables",
    warehouse: "Cold Storage (Chiller)",
    currentStock: 40,
    minimumStock: 100,
    availableStock: 15,
    reservedStock: 25,
    unit: "pack",
    status: "Low Stock",
    lastUpdated: "35 mins ago",
    averageCost: 12000,
    supplier: "Sentra Tahu Tradisional Klari",
    expiryDate: "22 Okt 2026",
    batchNumber: "B-TF-204",
    imageEmoji: "🧈",
    latestActivity: "Consumed −25 packs for Tahu Bacem menu",
  },
  {
    id: "item-10",
    sku: "SKU-FSH-041",
    barcode: "8994471928374",
    name: "Ikan Fillet Dori Super Frozen",
    category: "Poultry & Meat",
    warehouse: "Cold Storage (Freezer)",
    currentStock: 120,
    minimumStock: 200,
    availableStock: 0,
    reservedStock: 0,
    unit: "kg",
    status: "Quarantine",
    lastUpdated: "1 day ago",
    averageCost: 42000,
    supplier: "PT. Samudera Lautan Beku",
    expiryDate: "18 Mei 2027",
    batchNumber: "B-DORI-QC",
    imageEmoji: "🐟",
    latestActivity: "Quarantine hold for certificate verification",
  },
  {
    id: "item-11",
    sku: "SKU-SAU-015",
    barcode: "8995581928371",
    name: "Saus Sambal Terasi Industri 5L",
    category: "Sauces & Condiments",
    warehouse: "Main Warehouse",
    currentStock: 240,
    minimumStock: 100,
    availableStock: 200,
    reservedStock: 40,
    unit: "Jerigen",
    status: "In Stock",
    lastUpdated: "5 hours ago",
    averageCost: 85000,
    supplier: "PT. Sedap Wangi Citra",
    expiryDate: "10 Okt 2027",
    batchNumber: "B-SAU-332",
    imageEmoji: "🌶️",
    latestActivity: "Stock Opname Count verified: 240 units",
  },
  {
    id: "item-12",
    sku: "SKU-VEG-088",
    barcode: "8996612983742",
    name: "Sayur Selada Hidroponik Segar",
    category: "Fresh Produce & Perishables",
    warehouse: "Kitchen Buffer",
    currentStock: 35,
    minimumStock: 25,
    availableStock: 10,
    reservedStock: 25,
    unit: "kg",
    status: "Expired",
    lastUpdated: "50 mins ago",
    averageCost: 22000,
    supplier: "Hidroponik Agro Karawang",
    expiryDate: "20 Okt 2026",
    batchNumber: "B-VEG-77",
    imageEmoji: "🥬",
    latestActivity: "Expired: Marked for return or bio-compost",
  },
];

export default function InventoryItemsClient() {
  // --- STATE ---
  const [items] = useState<MasterItem[]>(MASTER_ITEMS_DATA);
  const [selectedItemId, setSelectedItemId] = useState<string>("item-1");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("ALL");
  const [selectedStockLevel, setSelectedStockLevel] = useState<string>("ALL");

  // Modals & Drawers
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [activeItemForAction, setActiveItemForAction] = useState<{
    item: MasterItem;
    action: "edit" | "adjust" | "transfer" | "history" | "qr";
  } | null>(null);

  // Inspector Panel visibility on tablet/desktop
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedWarehouse("ALL");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSelectedSupplier("ALL");
    setSelectedStockLevel("ALL");
    showToast("Semua filter inventaris telah di-reset.");
  };

  // Filtered Items Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search matches
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.barcode.toLowerCase().includes(q) ||
          item.supplier.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.batchNumber.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Warehouse filter
      if (selectedWarehouse !== "ALL" && !item.warehouse.includes(selectedWarehouse)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) {
        return false;
      }

      // Supplier filter
      if (selectedSupplier !== "ALL" && !item.supplier.includes(selectedSupplier)) {
        return false;
      }

      // Stock Level filter
      if (selectedStockLevel === "LOW" && item.currentStock >= item.minimumStock) {
        return false;
      }
      if (selectedStockLevel === "OUT" && item.currentStock > 0) {
        return false;
      }
      if (selectedStockLevel === "OPTIMAL" && item.currentStock <= item.minimumStock) {
        return false;
      }

      return true;
    });
  }, [
    items,
    searchQuery,
    selectedWarehouse,
    selectedCategory,
    selectedStatus,
    selectedSupplier,
    selectedStockLevel,
  ]);

  // Selected item object for Inspector
  const selectedItem = useMemo(() => {
    return items.find((i) => i.id === selectedItemId) || filteredItems[0] || null;
  }, [items, selectedItemId, filteredItems]);

  // Status Badge Helper
  const renderStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case "In Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            In Stock
          </span>
        );
      case "Low Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Low Stock
          </span>
        );
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-rose-50 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Critical
          </span>
        );
      case "Out of Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-neutral-100 text-neutral-700 border border-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
            Out of Stock
          </span>
        );
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-red-100 text-red-900 border border-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Expired
          </span>
        );
      case "Quarantine":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Quarantine
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Feedback */}
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
              MASTER ITEMS INVENTORY
            </span>
            <span className="text-xs font-mono text-[#8E8B81] ml-2">
              (Total {items.length} SKU Aktif)
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Inventory Items
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Manage all inventory items across warehouses.
          </p>
        </div>

        {/* Top Right Action Group */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Import Excel */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-[#141413]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import Excel</span>
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

          {/* + Add Item */}
          <button
            type="button"
            onClick={() => setIsAddItemModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add Item</span>
          </button>
        </div>
      </header>

      {/* ==============================================================
          TOP TOOLBAR & FILTERS
          ============================================================== */}
      <div className="bg-white border border-[#141413]/10 p-4 sm:p-5 space-y-4 shadow-2xs">
        {/* Row 1: Search & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Global Search */}
          <div className="relative flex-1 max-w-xl">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8B81]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Barcode, Item Name, Supplier, Category, Batch..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-[#141413]/15 text-xs font-mono text-[#141413] placeholder-[#8E8B81] outline-hidden focus:border-[#141413] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#8E8B81] hover:text-[#141413]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right: View Toggle & Inspector Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* View Mode Toggle: Grid View / List View */}
            <div className="inline-flex p-1 bg-neutral-100 border border-[#141413]/10 rounded-xs text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 font-semibold rounded-xs transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                    : "text-[#626058] hover:text-[#141413]"
                }`}
                title="List View"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>List View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 font-semibold rounded-xs transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                    : "text-[#626058] hover:text-[#141413]"
                }`}
                title="Grid View"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Grid View</span>
              </button>
            </div>

            {/* Inspector Toggle */}
            <button
              type="button"
              onClick={() => setIsInspectorOpen(!isInspectorOpen)}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border rounded-xs transition-all cursor-pointer ${
                isInspectorOpen
                  ? "bg-neutral-100 border-[#141413]/30 text-[#141413]"
                  : "bg-white border-[#141413]/15 text-[#626058] hover:text-[#141413]"
              }`}
              title="Toggle Right Inspector Panel"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span>{isInspectorOpen ? "Hide Inspector" : "Show Inspector"}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Enterprise Filters (Warehouse, Category, Status, Supplier, Stock Level, Reset) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#141413]/5 text-xs font-mono">
          {/* Warehouse Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8B81]">Warehouse:</span>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="py-1 px-2.5 bg-neutral-50 border border-[#141413]/15 text-[#141413] text-xs font-mono rounded-xs focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="ALL">All Warehouses</option>
              <option value="Main Warehouse">Main Warehouse</option>
              <option value="Cold Storage">Cold Storage</option>
              <option value="Dry Storage">Dry Storage</option>
              <option value="Packaging">Packaging Depot</option>
              <option value="Kitchen Buffer">Kitchen Buffer</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8B81]">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1 px-2.5 bg-neutral-50 border border-[#141413]/15 text-[#141413] text-xs font-mono rounded-xs focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Poultry & Meat">Poultry &amp; Meat</option>
              <option value="Dry Goods & Grains">Dry Goods &amp; Grains</option>
              <option value="Fresh Produce & Spices">Fresh Produce &amp; Spices</option>
              <option value="Fresh Produce & Perishables">Fresh Produce &amp; Perishables</option>
              <option value="Cooking Oils & Fats">Cooking Oils &amp; Fats</option>
              <option value="Packaging & Disposables">Packaging &amp; Disposables</option>
              <option value="Prepared Seasoning">Prepared Seasoning</option>
              <option value="Sauces & Condiments">Sauces &amp; Condiments</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8B81]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1 px-2.5 bg-neutral-50 border border-[#141413]/15 text-[#141413] text-xs font-mono rounded-xs focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Expired">Expired</option>
              <option value="Quarantine">Quarantine</option>
            </select>
          </div>

          {/* Stock Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#8E8B81]">Stock Level:</span>
            <select
              value={selectedStockLevel}
              onChange={(e) => setSelectedStockLevel(e.target.value)}
              className="py-1 px-2.5 bg-neutral-50 border border-[#141413]/15 text-[#141413] text-xs font-mono rounded-xs focus:border-[#141413] outline-hidden cursor-pointer"
            >
              <option value="ALL">All Levels</option>
              <option value="OPTIMAL">Optimal Buffer</option>
              <option value="LOW">Below Minimum</option>
              <option value="OUT">Zero Stock</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery ||
            selectedWarehouse !== "ALL" ||
            selectedCategory !== "ALL" ||
            selectedStatus !== "ALL" ||
            selectedStockLevel !== "ALL") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[#C85A17] hover:underline cursor-pointer"
            >
              <span>Reset Filter</span>
              <span>✕</span>
            </button>
          )}
        </div>
      </div>

      {/* ==============================================================
          MAIN CONTENT AREA: TABLE / GRID + RIGHT INSPECTOR PANEL
          ============================================================== */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Main Table / Grid (Flexible) */}
        <div className={`w-full ${isInspectorOpen && selectedItem ? "lg:w-[70%] xl:w-[72%]" : "lg:w-full"} transition-all space-y-4`}>
          {filteredItems.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white border border-[#141413]/10 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-3xl">
                📋
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  No inventory items found.
                </h3>
                <p className="text-xs font-mono text-[#626058] max-w-sm mx-auto">
                  Tidak ada barang inventaris yang sesuai dengan filter pencarian Anda. Coba reset filter atau buat item baru.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-mono uppercase bg-neutral-100 hover:bg-neutral-200 text-[#141413] cursor-pointer"
                >
                  Reset Filter
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(true)}
                  className="px-4 py-2 text-xs font-mono uppercase bg-[#141413] hover:bg-[#141413]/90 text-white font-semibold cursor-pointer"
                >
                  Create New Item
                </button>
              </div>
            </div>
          ) : viewMode === "list" ? (
            /* ==============================================================
               LIST VIEW: MODERN ENTERPRISE TABLE
               Columns: Image, SKU, Item Name, Category, Warehouse, Current Stock,
                        Minimum Stock, Available, Reserved, Unit, Status, Last Updated, Actions
               Row Interaction: Hover warm, Subtle shadow, Click select & open Inspector
               ============================================================== */
            <div className="bg-white border border-[#141413]/10 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50/90 border-b border-[#141413]/10 text-[11px] font-mono uppercase tracking-wider text-[#626058]">
                      <th className="py-3 px-3.5 w-12 text-center">Img</th>
                      <th className="py-3 px-3 font-semibold">SKU</th>
                      <th className="py-3 px-4 font-semibold">Item Name</th>
                      <th className="py-3 px-3 font-semibold">Category</th>
                      <th className="py-3 px-3 font-semibold">Warehouse</th>
                      <th className="py-3 px-3 text-right font-semibold">Current</th>
                      <th className="py-3 px-3 text-right font-semibold">Min</th>
                      <th className="py-3 px-3 text-right font-semibold">Avail</th>
                      <th className="py-3 px-3 text-right font-semibold">Resv</th>
                      <th className="py-3 px-2 text-center font-semibold">Unit</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold">Updated</th>
                      <th className="py-3 px-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141413]/5 font-mono">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItemId === item.id;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedItemId(item.id)}
                          className={`transition-colors duration-150 cursor-pointer group ${
                            isSelected
                              ? "bg-amber-50/70 ring-1 ring-[#C85A17]/30"
                              : "hover:bg-[#FAF9F5] hover:shadow-2xs"
                          }`}
                        >
                          {/* Image Thumbnail */}
                          <td className="py-3 px-3.5 text-center text-lg select-none">
                            <span className="w-8 h-8 rounded-xs bg-neutral-100 border border-neutral-200 inline-flex items-center justify-center group-hover:scale-105 transition-transform">
                              {item.imageEmoji}
                            </span>
                          </td>

                          {/* SKU */}
                          <td className="py-3 px-3 font-bold text-[#141413] whitespace-nowrap">
                            <Link
                              href={`/admin/inventory/items/${item.id}`}
                              className="hover:text-[#C85A17] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.sku}
                            </Link>
                          </td>

                          {/* Item Name */}
                          <td className="py-3 px-4 font-sans font-bold text-[#141413] max-w-xs truncate">
                            <Link
                              href={`/admin/inventory/items/${item.id}`}
                              className="hover:text-[#C85A17] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.name}
                            </Link>
                            <span className="block text-[10px] font-mono text-[#8E8B81] font-normal truncate">
                              Batch: {item.batchNumber} • {item.supplier}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3 text-[#626058] whitespace-nowrap">
                            {item.category}
                          </td>

                          {/* Warehouse */}
                          <td className="py-3 px-3 text-[#141413] font-medium whitespace-nowrap">
                            {item.warehouse}
                          </td>

                          {/* Current Stock */}
                          <td className="py-3 px-3 text-right font-bold text-[#141413] whitespace-nowrap">
                            {item.currentStock.toLocaleString("id-ID")}
                          </td>

                          {/* Minimum Stock */}
                          <td className="py-3 px-3 text-right text-[#8E8B81] whitespace-nowrap">
                            {item.minimumStock.toLocaleString("id-ID")}
                          </td>

                          {/* Available Stock */}
                          <td className="py-3 px-3 text-right text-emerald-700 font-bold whitespace-nowrap">
                            {item.availableStock.toLocaleString("id-ID")}
                          </td>

                          {/* Reserved Stock */}
                          <td className="py-3 px-3 text-right text-amber-700 whitespace-nowrap">
                            {item.reservedStock.toLocaleString("id-ID")}
                          </td>

                          {/* Unit */}
                          <td className="py-3 px-2 text-center text-[#626058] whitespace-nowrap">
                            {item.unit}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {renderStatusBadge(item.status)}
                          </td>

                          {/* Last Updated */}
                          <td className="py-3 px-3 text-[11px] text-[#8E8B81] whitespace-nowrap">
                            {item.lastUpdated}
                          </td>

                          {/* Quick Actions (Every Row: View, Edit, Adjust, Transfer, History) */}
                          <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="inline-flex items-center gap-1">
                              <Link
                                href={`/admin/inventory/items/${item.id}`}
                                className="p-1 text-[#626058] hover:text-[#141413] hover:bg-neutral-100 rounded"
                                title="View Item Details"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Link>
                              <button
                                type="button"
                                onClick={() => setActiveItemForAction({ item, action: "edit" })}
                                className="p-1 text-[#626058] hover:text-[#141413] hover:bg-neutral-100 rounded cursor-pointer"
                                title="Edit Item"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveItemForAction({ item, action: "adjust" })}
                                className="p-1 text-[#626058] hover:text-[#141413] hover:bg-neutral-100 rounded cursor-pointer"
                                title="Adjust Stock"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveItemForAction({ item, action: "transfer" })}
                                className="p-1 text-[#626058] hover:text-[#141413] hover:bg-neutral-100 rounded cursor-pointer"
                                title="Transfer Stock"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveItemForAction({ item, action: "history" })}
                                className="p-1 text-[#626058] hover:text-[#141414] hover:bg-neutral-100 rounded cursor-pointer"
                                title="View Ledger History"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ==============================================================
               GRID VIEW
               Cards stack naturally
               ============================================================== */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedItemId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`bg-white border p-4.5 space-y-3.5 transition-all duration-180 cursor-pointer ${
                      isSelected
                        ? "border-[#C85A17] ring-1 ring-[#C85A17]/30 shadow-xs"
                        : "border-[#141413]/10 hover:border-[#141413]/30 hover:-translate-y-0.5 hover:shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-10 h-10 rounded-xs bg-neutral-100 border border-neutral-200 inline-flex items-center justify-center text-xl shrink-0">
                          {item.imageEmoji}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono text-[#8E8B81] block">
                            {item.sku}
                          </span>
                          <strong className="font-display font-bold text-sm text-[#141413] block line-clamp-1">
                            {item.name}
                          </strong>
                        </div>
                      </div>
                      {renderStatusBadge(item.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 bg-[#FAF9F5] border border-[#141413]/5">
                      <div>
                        <span className="text-[#8E8B81] text-[10px] block">Current Stock</span>
                        <span className="font-bold text-[#141413]">
                          {item.currentStock.toLocaleString("id-ID")} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8E8B81] text-[10px] block">Available</span>
                        <span className="font-bold text-emerald-700">
                          {item.availableStock.toLocaleString("id-ID")} {item.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#626058]">
                      <span>{item.warehouse}</span>
                      <span className="font-bold text-[#141413]">
                        Rp {item.averageCost.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-[#141413]/5 flex items-center justify-between text-xs font-mono">
                      <Link
                        href={`/admin/inventory/items/${item.id}`}
                        className="text-[#C85A17] hover:underline font-bold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details →
                      </Link>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setActiveItemForAction({ item, action: "adjust" })}
                          className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-[#141413] rounded-xs cursor-pointer"
                        >
                          Adjust
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveItemForAction({ item, action: "transfer" })}
                          className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-[#141413] rounded-xs cursor-pointer"
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ==============================================================
              PAGINATION
              Modern, Not classic numbered pagination.
              Show 100 items. Load smoothly.
              ============================================================== */}
          <div className="bg-white border border-[#141413]/10 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#626058] shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Showing <strong>1–{filteredItems.length}</strong> of <strong>12,584</strong> master SKUs
              </span>
              <span className="text-[#8E8B81] hidden md:inline">• 100 items per batch buffer</span>
              <span className="text-[#8E8B81] hidden md:inline">• Loaded in 14ms</span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                disabled
                className="px-3 py-1 bg-neutral-100 text-neutral-400 border border-neutral-200 rounded-xs cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-2 font-bold text-[#141413]">Page 1 / 126</span>
              <button
                type="button"
                onClick={() => showToast("Memuat 100 item berikutnya...")}
                className="px-3 py-1 bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 rounded-xs cursor-pointer shadow-xs"
              >
                Next 100 →
              </button>
            </div>
          </div>
        </div>

        {/* ==============================================================
            RIGHT INSPECTOR PANEL
            When a row is selected:
            - Large image
            - SKU & Barcode (SVG)
            - Current Stock, Warehouse, Average Cost, Supplier, Expiry, Latest Activity
            - Buttons: View Details, Print Barcode, Generate QR
            ============================================================== */}
        {isInspectorOpen && selectedItem && (
          <aside className="w-full lg:w-[30%] xl:w-[28%] bg-white border border-[#141413]/10 p-5 sm:p-6 space-y-6 shadow-2xs sticky top-8">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                  ITEM INSPECTOR
                </span>
                <h3 className="font-display font-bold text-lg text-[#141413]">
                  Quick Properties
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="text-[#8E8B81] hover:text-[#141413] p-1 cursor-pointer"
                title="Close Inspector"
              >
                ✕
              </button>
            </div>

            {/* Large Image / Representation */}
            <div className="w-full h-36 bg-[#FAF9F5] border border-[#141413]/10 rounded-xs flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
              <span className="text-5xl group-hover:scale-110 transition-transform">
                {selectedItem.imageEmoji}
              </span>
              <span className="text-[10px] font-mono text-[#8E8B81]">
                {selectedItem.category}
              </span>
              <div className="absolute top-2 right-2">
                {renderStatusBadge(selectedItem.status)}
              </div>
            </div>

            {/* SKU & Barcode (Visual SVG Representation) */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-[#8E8B81]">SKU Identifier:</span>
                <strong className="text-[#141413] font-bold text-sm">{selectedItem.sku}</strong>
              </div>

              {/* Barcode Render */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs flex flex-col items-center gap-1.5">
                <svg className="w-full h-10 text-[#141413]" viewBox="0 0 200 40" fill="currentColor">
                  {/* Generated clean barcode bars */}
                  <rect x="10" y="0" width="3" height="35" />
                  <rect x="16" y="0" width="2" height="35" />
                  <rect x="22" y="0" width="4" height="35" />
                  <rect x="28" y="0" width="1" height="35" />
                  <rect x="32" y="0" width="3" height="35" />
                  <rect x="38" y="0" width="2" height="35" />
                  <rect x="44" y="0" width="5" height="35" />
                  <rect x="52" y="0" width="2" height="35" />
                  <rect x="58" y="0" width="3" height="35" />
                  <rect x="64" y="0" width="1" height="35" />
                  <rect x="68" y="0" width="4" height="35" />
                  <rect x="76" y="0" width="2" height="35" />
                  <rect x="82" y="0" width="3" height="35" />
                  <rect x="88" y="0" width="5" height="35" />
                  <rect x="96" y="0" width="2" height="35" />
                  <rect x="102" y="0" width="3" height="35" />
                  <rect x="108" y="0" width="1" height="35" />
                  <rect x="114" y="0" width="4" height="35" />
                  <rect x="122" y="0" width="2" height="35" />
                  <rect x="128" y="0" width="5" height="35" />
                  <rect x="136" y="0" width="3" height="35" />
                  <rect x="142" y="0" width="1" height="35" />
                  <rect x="148" y="0" width="4" height="35" />
                  <rect x="156" y="0" width="2" height="35" />
                  <rect x="162" y="0" width="3" height="35" />
                  <rect x="170" y="0" width="4" height="35" />
                  <rect x="178" y="0" width="2" height="35" />
                  <rect x="184" y="0" width="3" height="35" />
                </svg>
                <span className="font-mono text-[10px] text-[#626058] tracking-widest font-semibold">
                  {selectedItem.barcode}
                </span>
              </div>
            </div>

            {/* Inventory Specifications Grid */}
            <div className="space-y-2.5 text-xs font-mono border-t border-[#141413]/10 pt-3">
              <div className="flex justify-between py-1 border-b border-[#141413]/5">
                <span className="text-[#8E8B81]">Current Stock:</span>
                <strong className="text-[#141413]">{selectedItem.currentStock.toLocaleString("id-ID")} {selectedItem.unit}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141413]/5">
                <span className="text-[#8E8B81]">Warehouse:</span>
                <strong className="text-[#141413] text-right">{selectedItem.warehouse}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141413]/5">
                <span className="text-[#8E8B81]">Average Cost:</span>
                <strong className="text-[#141413]">Rp {selectedItem.averageCost.toLocaleString("id-ID")} / {selectedItem.unit}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141413]/5">
                <span className="text-[#8E8B81]">Supplier:</span>
                <span className="text-[#141413] text-right font-medium">{selectedItem.supplier}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141413]/5">
                <span className="text-[#8E8B81]">Expiry Date:</span>
                <span className="text-[#141413] font-medium">{selectedItem.expiryDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#141413]/5">
                <span className="text-[#8E8B81]">Batch Code:</span>
                <span className="text-[#141413] font-bold">{selectedItem.batchNumber}</span>
              </div>
            </div>

            {/* Latest Activity Snippet */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1 text-xs font-mono">
              <span className="text-[10px] text-[#8E8B81] uppercase block font-semibold">Latest Activity:</span>
              <p className="text-[#141413] leading-relaxed">{selectedItem.latestActivity}</p>
            </div>

            {/* Action Buttons: View Details, Print Barcode, Generate QR */}
            <div className="space-y-2 pt-2 border-t border-[#141413]/10 font-mono text-xs">
              <Link
                href={`/admin/inventory/items/${selectedItem.id}`}
                className="w-full py-2.5 bg-[#141413] hover:bg-[#141413]/90 text-white font-semibold text-center block rounded-xs shadow-xs transition-colors"
              >
                View Full Details ↗
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => showToast(`Label barcode untuk ${selectedItem.sku} dikirim ke antrian printer thermal.`)}
                  className="py-2 bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 rounded-xs font-medium cursor-pointer shadow-xs text-center"
                >
                  Print Barcode 🖨️
                </button>
                <button
                  type="button"
                  onClick={() => setActiveItemForAction({ item: selectedItem, action: "qr" })}
                  className="py-2 bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 rounded-xs font-medium cursor-pointer shadow-xs text-center"
                >
                  Generate QR 📱
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ==============================================================
          MODALS: IMPORT EXCEL, EXPORT, ADD ITEM, AND ROW ACTIONS
          ============================================================== */}

      {/* 1. Import Excel Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Batch Ledger Import
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Import Items Excel / CSV
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-[#626058] leading-relaxed">
              Unggah file template (.xlsx / .csv) berisi daftar SKU master, barcode, kuantitas awal, dan lokasi gudang.
            </p>

            <div className="border-2 border-dashed border-neutral-300 hover:border-[#141413] p-8 text-center rounded-xs space-y-2 cursor-pointer bg-neutral-50">
              <span className="text-3xl block">📄</span>
              <strong className="block text-[#141413]">Klik atau Drag file Excel ke sini</strong>
              <span className="text-[10px] text-[#8E8B81]">Format: .xlsx, .csv (Maks 10 MB)</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#141413]/10">
              <a
                href="#download-template"
                onClick={(e) => {
                  e.preventDefault();
                  showToast("Template master_items_template.xlsx diunduh.");
                }}
                className="text-[#C85A17] hover:underline"
              >
                Unduh Template Excel ↗
              </a>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3 py-1.5 bg-neutral-200 text-[#141413] rounded-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast("120 item berhasil diimpor dari file Excel.");
                    setIsImportModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-[#141413] text-white font-semibold rounded-xs cursor-pointer"
                >
                  Proses Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Export Inventory Dataset
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  Ekspor Master Items
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

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  showToast("File Master_Items_Ledger.xlsx berhasil diunduh.");
                  setIsExportModalOpen(false);
                }}
                className="w-full p-3 border border-neutral-200 hover:border-[#141413] hover:bg-neutral-50 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <strong className="block text-[#141413]">Microsoft Excel (.xlsx)</strong>
                  <span className="text-[#8E8B81] text-[10px]">Lengkap dengan formula &amp; rincian valuasi</span>
                </div>
                <span>⬇</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast("File Master_Items.csv berhasil diunduh.");
                  setIsExportModalOpen(false);
                }}
                className="w-full p-3 border border-neutral-200 hover:border-[#141413] hover:bg-neutral-50 text-left flex items-center justify-between cursor-pointer"
              >
                <div>
                  <strong className="block text-[#141413]">Standard CSV (.csv)</strong>
                  <span className="text-[#8E8B81] text-[10px]">Cocok untuk integrasi sistem ERP eksternal</span>
                </div>
                <span>⬇</span>
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#141413]/10">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-neutral-200 text-[#141413] hover:bg-neutral-300 rounded-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Item Modal */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  New SKU Creation
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  + Add Inventory Item
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Item baru berhasil ditambahkan ke master inventory.");
                setIsAddItemModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">SKU Code</label>
                  <input
                    type="text"
                    defaultValue="SKU-ZKS-2026-101"
                    className="w-full p-2.5 bg-neutral-100 border border-neutral-300 text-[#141413] font-bold"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Barcode EAN-13</label>
                  <input
                    type="text"
                    defaultValue="8997788192830"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#141413] font-bold block">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Daging Sapi Gandik (Topside)"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413] focus:border-[#141413] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Category</label>
                  <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]">
                    <option>Poultry &amp; Meat</option>
                    <option>Dry Goods &amp; Grains</option>
                    <option>Fresh Produce &amp; Spices</option>
                    <option>Cooking Oils &amp; Fats</option>
                    <option>Packaging &amp; Disposables</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Gudang Penyimpanan</label>
                  <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]">
                    <option>Cold Storage (Chiller)</option>
                    <option>Cold Storage (Freezer)</option>
                    <option>Main Warehouse</option>
                    <option>Dry Storage</option>
                    <option>Kitchen Buffer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Initial Stock</label>
                  <input type="number" defaultValue={100} className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Min. Stock</label>
                  <input type="number" defaultValue={50} className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Unit</label>
                  <select className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]">
                    <option>kg</option>
                    <option>Liter</option>
                    <option>pcs</option>
                    <option>pack</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#141413] text-white hover:bg-[#141413]/90 font-semibold cursor-pointer rounded-xs"
                >
                  Simpan SKU
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 text-[#141413] hover:bg-neutral-300 cursor-pointer rounded-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Action Specific Modal (Adjust, Transfer, History, QR) */}
      {activeItemForAction && (
        <div className="fixed inset-0 z-50 bg-[#141413]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  {activeItemForAction.item.sku}
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413] capitalize">
                  {activeItemForAction.action === "edit" && "Edit Master Item"}
                  {activeItemForAction.action === "adjust" && "Stock Adjustment"}
                  {activeItemForAction.action === "transfer" && "Internal Facility Transfer"}
                  {activeItemForAction.action === "history" && "Stock Movement History"}
                  {activeItemForAction.action === "qr" && "Mobile QR Barcode Tag"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveItemForAction(null)}
                className="text-[#626058] hover:text-[#141413] text-xl font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body based on action */}
            {activeItemForAction.action === "qr" ? (
              <div className="p-6 bg-neutral-50 border border-neutral-200 flex flex-col items-center gap-3">
                {/* Clean QR Code Representation */}
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
                <div className="text-center space-y-0.5">
                  <strong className="block text-[#141413]">{activeItemForAction.item.name}</strong>
                  <span className="text-[#8E8B81] text-[10px]">Barcode: {activeItemForAction.item.barcode}</span>
                </div>
              </div>
            ) : activeItemForAction.action === "history" ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
                  <div className="flex justify-between font-bold text-[#141413]">
                    <span>Stock In (Inbound PO)</span>
                    <span className="text-emerald-700">+250 {activeItemForAction.item.unit}</span>
                  </div>
                  <p className="text-[11px] text-[#626058]">21 Okt 2026, 08:12 WIB • Operator: Andi (SPV-W1)</p>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
                  <div className="flex justify-between font-bold text-[#141413]">
                    <span>Production Usage</span>
                    <span className="text-amber-700">−120 {activeItemForAction.item.unit}</span>
                  </div>
                  <p className="text-[11px] text-[#626058]">20 Okt 2026, 14:30 WIB • Kitchen Shift 2</p>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 space-y-1">
                  <div className="flex justify-between font-bold text-[#141413]">
                    <span>Cycle Count Opname</span>
                    <span className="text-blue-700">Reconciled 0 discrepancy</span>
                  </div>
                  <p className="text-[11px] text-[#626058]">18 Okt 2026, 17:00 WIB • Audit Team</p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast(`Tindakan ${activeItemForAction.action} pada ${activeItemForAction.item.sku} tersimpan.`);
                  setActiveItemForAction(null);
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[#141413] font-bold block">Item</label>
                  <p className="font-bold text-[#141413] p-2 bg-neutral-100 border border-neutral-200">
                    {activeItemForAction.item.name} ({activeItemForAction.item.sku})
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#141413] font-bold block">
                      {activeItemForAction.action === "adjust" ? "Penyesuaian (+/−)" : "Kuantitas Transfer"}
                    </label>
                    <input
                      type="number"
                      defaultValue={10}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#141413] font-bold block">
                      {activeItemForAction.action === "adjust" ? "Alasan Selisih" : "Tujuan Gudang"}
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: Kitchen Buffer A"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-[#141413]/10">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#141413] text-white hover:bg-[#141413]/90 font-semibold cursor-pointer rounded-xs"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveItemForAction(null)}
                    className="px-4 py-2 bg-neutral-200 text-[#141413] hover:bg-neutral-300 cursor-pointer rounded-xs"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {activeItemForAction.action === "qr" && (
              <div className="flex justify-end gap-2 pt-2 border-t border-[#141413]/10">
                <button
                  type="button"
                  onClick={() => {
                    showToast("QR code berhasil diunduh.");
                    setActiveItemForAction(null);
                  }}
                  className="px-4 py-2 bg-[#141413] text-white font-semibold cursor-pointer rounded-xs"
                >
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={() => setActiveItemForAction(null)}
                  className="px-4 py-2 bg-neutral-200 text-[#141413] cursor-pointer rounded-xs"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
