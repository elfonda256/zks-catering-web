"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";

export interface SearchResultItem {
  id: string;
  category:
    | "Item"
    | "Supplier"
    | "PO"
    | "PR"
    | "Recipe"
    | "Customer"
    | "Vehicle"
    | "Employee"
    | "Navigation";
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

// Search index containing active ERP entities and modules
const SEARCHABLE_DATABASE: SearchResultItem[] = [
  // Navigation
  {
    id: "nav-dash",
    category: "Navigation",
    title: "Dashboard Pesanan",
    subtitle: "Pusat verifikasi kapasitas dapur dan pesanan katering",
    href: "/admin/dashboard",
  },
  {
    id: "nav-inv",
    category: "Navigation",
    title: "Command Center Stok & Gudang",
    subtitle: "Inventaris bahan baku dan occupancy pendingin",
    href: "/admin/inventory",
  },
  {
    id: "nav-items",
    category: "Navigation",
    title: "Katalog Master Items",
    subtitle: "Daftar SKU bahan baku, safety stock, dan satuan konversi",
    href: "/admin/inventory/items",
  },
  {
    id: "nav-recv",
    category: "Navigation",
    title: "Penerimaan & QC (Receiving)",
    subtitle: "Inspeksi kualitas bahan basah dan kering dari supplier",
    href: "/admin/inventory/receiving",
  },
  {
    id: "nav-move",
    category: "Navigation",
    title: "Ledger Mutasi Stok",
    subtitle: "Log keluar-masuk stok bahan baku dapur sentral",
    href: "/admin/inventory/movements",
  },
  {
    id: "nav-trans",
    category: "Navigation",
    title: "Transfer Antar Gudang",
    subtitle: "Perpindahan stok Dry Storage ke Cold Storage / Satelit",
    href: "/admin/inventory/transfers",
  },
  {
    id: "nav-opname",
    category: "Navigation",
    title: "Stock Opname Fisik",
    subtitle: "Verifikasi fisik stok berkala dan rekonsiliasi selisih",
    href: "/admin/inventory/opname",
  },
  {
    id: "nav-pr",
    category: "Navigation",
    title: "Purchase Request (PR)",
    subtitle: "Daftar permintaan pengadaan bahan dari kepala dapur",
    href: "/admin/purchase-requests",
  },
  {
    id: "nav-po",
    category: "Navigation",
    title: "Purchase Order (PO)",
    subtitle: "Surat pesanan resmi pengadaan bahan baku ke rekanan",
    href: "/admin/purchase-orders",
  },
  {
    id: "nav-supp",
    category: "Navigation",
    title: "Manajemen Supplier (SRM)",
    subtitle: "Direktori rekanan pemasok berbadan hukum dan rating audit",
    href: "/admin/supplier",
  },

  // Master Items
  {
    id: "item-1",
    category: "Item",
    title: "Beras Rojolele Super 50kg",
    subtitle: "SKU: RM-RIC-001 · Stok: 120 Sak · Lokasi: Dry Storage A1",
    href: "/admin/inventory/items",
    badge: "Bahan Pokok",
  },
  {
    id: "item-2",
    category: "Item",
    title: "Minyak Goreng Sawit 18L",
    subtitle: "SKU: RM-OIL-002 · Stok: 4 Jerigen (Low Stock) · Dry Storage A2",
    href: "/admin/inventory/items",
    badge: "Low Stock",
  },
  {
    id: "item-3",
    category: "Item",
    title: "Daging Sapi Gandik Segar",
    subtitle: "SKU: RM-BEEF-001 · Stok: 45 kg · Lokasi: Cold Storage 01",
    href: "/admin/inventory/items",
    badge: "Perishable",
  },
  {
    id: "item-4",
    category: "Item",
    title: "Ayam Broiler Karkas 1.2kg",
    subtitle: "SKU: RM-CHK-001 · Stok: 250 Ekor · Lokasi: Cold Storage 02",
    href: "/admin/inventory/items",
    badge: "Perishable",
  },
  {
    id: "item-5",
    category: "Item",
    title: "Telur Ayam Negeri Grade A",
    subtitle: "SKU: RM-EGG-001 · Stok: 60 Tray · Lokasi: Chiller Room",
    href: "/admin/inventory/items",
  },

  // Suppliers
  {
    id: "sup-1",
    category: "Supplier",
    title: "PT. Suri Nusantara Jaya",
    subtitle: "Daging sapi & unggas beku · Status: Preferred · Rating: 4.8",
    href: "/admin/supplier",
    badge: "Tier 1",
  },
  {
    id: "sup-2",
    category: "Supplier",
    title: "CV. Berkah Pangan Karawang",
    subtitle: "Sayuran segar & bumbu basah lokal · Status: Active · Rating: 4.5",
    href: "/admin/supplier",
    badge: "Lokal",
  },
  {
    id: "sup-3",
    category: "Supplier",
    title: "PT. Salim Ivomas Pratama Tbk",
    subtitle: "Minyak goreng & mentega industri · Status: Preferred",
    href: "/admin/supplier",
    badge: "Principal",
  },

  // Purchase Orders
  {
    id: "po-1",
    category: "PO",
    title: "PO-2026-001 · Beras & Minyak Industri",
    subtitle: "Vendor: PT. Salim Ivomas Pratama · Nilai: Rp 45.200.000",
    href: "/admin/purchase-orders",
    badge: "In Delivery",
  },
  {
    id: "po-2",
    category: "PO",
    title: "PO-2026-002 · Daging Sapi & Unggas",
    subtitle: "Vendor: PT. Suri Nusantara Jaya · Nilai: Rp 78.500.000",
    href: "/admin/purchase-orders",
    badge: "Approved",
  },

  // Purchase Requests
  {
    id: "pr-1",
    category: "PR",
    title: "PR-2026-001 · Kebutuhan Beras & Minyak Goreng",
    subtitle: "Pemohon: Dapur Sentral Karawang · Status: Approved",
    href: "/admin/purchase-requests",
  },
  {
    id: "pr-2",
    category: "PR",
    title: "PR-2026-002 · Pengadaan Daging Sapi Gandik 150kg",
    subtitle: "Pemohon: Chef Operasional · Status: Pending Approval",
    href: "/admin/purchase-requests",
  },

  // Customer / Orders
  {
    id: "cust-1",
    category: "Customer",
    title: "PT. Astra Honda Motor Karawang",
    subtitle: "Paket Prasmanan Shift 1 (1,200 Pcs) · Acara: 28 Oktober 2026",
    href: "/admin/dashboard",
    badge: "Confirmed",
  },
  {
    id: "cust-2",
    category: "Customer",
    title: "PT. Toyota Motor Manufacturing Indonesia",
    subtitle: "Nasi Box Premium Event Gathering (800 Pcs)",
    href: "/admin/dashboard",
    badge: "Pending DP",
  },
];

interface ErpGlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ErpGlobalSearch({ isOpen, onClose }: ErpGlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
      setActiveIndex(0);
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    onClose();
  }, [onClose]);

  // Filtered results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEARCHABLE_DATABASE.filter((item) => {
      const matchCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      if (!matchCategory) return false;

      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }).slice(0, 8); // Max 8 results for optimal scanability
  }, [query, selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredResults[activeIndex];
        if (selected) {
          router.push(selected.href);
          handleClose();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, activeIndex, router, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-[12px] border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-white">
          <svg className="w-5 h-5 text-slate-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Cari Master Item, Supplier, PO, PR, Pelanggan, atau Modul (⌘K)..."
            className="w-full text-[14px] bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded-[4px]"
            >
              Hapus
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded-[4px]">
            ESC
          </kbd>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto text-[11px]">
          {["All", "Item", "Supplier", "PO", "PR", "Customer", "Navigation"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setActiveIndex(0);
              }}
              className={cn(
                "px-2.5 py-1 rounded-[6px] font-medium transition-colors shrink-0 cursor-pointer",
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80"
              )}
            >
              {cat === "All" ? "Semua Objek" : cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-[13px]">
              Tidak ditemukan data untuk &quot;{query}&quot;
            </div>
          ) : (
            filteredResults.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-[8px] cursor-pointer transition-colors",
                  activeIndex === idx
                    ? "bg-blue-50 text-slate-900 border border-blue-100"
                    : "hover:bg-slate-50 text-slate-800 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-[4px] uppercase shrink-0",
                      item.category === "Item" && "bg-amber-100 text-amber-800",
                      item.category === "Supplier" && "bg-emerald-100 text-emerald-800",
                      item.category === "PO" && "bg-blue-100 text-blue-800",
                      item.category === "PR" && "bg-indigo-100 text-indigo-800",
                      item.category === "Customer" && "bg-purple-100 text-purple-800",
                      item.category === "Navigation" && "bg-slate-100 text-slate-600"
                    )}
                  >
                    {item.category}
                  </span>
                  <div className="truncate">
                    <div className="text-[13px] font-medium text-slate-900 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-slate-100 text-slate-600 font-medium">
                      {item.badge}
                    </span>
                  )}
                  {activeIndex === idx && (
                    <span className="text-[11px] text-blue-600 font-semibold hidden sm:inline">
                      Buka ↵
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer Keyboard Legend */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigasi baris</span>
            <span>↵ Buka halaman</span>
            <span>ESC Keluar</span>
          </div>
          <span className="font-mono text-[10px]">PT. ZKS ERP Search Engine</span>
        </div>
      </div>
    </div>
  );
}
