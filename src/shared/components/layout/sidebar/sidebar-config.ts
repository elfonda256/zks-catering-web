import { ErpNavSection } from "./types";

/**
 * ZKS Catering ERP Navigation Configuration
 * Strictly follows Sprint 02.1 Enterprise Navigation & Information Architecture:
 * Dashboard -> Sales -> Procurement -> Inventory -> Production -> Kitchen -> Delivery -> Finance -> Reports -> Settings
 */
export const erpNavSections: ErpNavSection[] = [
  {
    id: "dashboard",
    title: "DASHBOARD",
    defaultExpanded: true,
    items: [
      {
        id: "dash-main",
        label: "Dashboard Operasional",
        href: "/admin/dashboard",
        exact: true,
      },
    ],
  },
  {
    id: "sales",
    title: "PENJUALAN (SALES)",
    defaultExpanded: true,
    allowedRoles: ["SUPERADMIN", "ADMIN", "MANAGEMENT"],
    items: [
      {
        id: "sales-adhoc",
        label: "Input Lembur Ad-Hoc",
        href: "/admin/order-adhoc",
        exact: true,
        badge: "B2B",
        badgeVariant: "success",
      },
      {
        id: "sales-orders",
        label: "Pesanan Masuk & Tagihan",
        href: "/admin/dashboard#orders",
        exact: true,
      },
    ],
  },
  {
    id: "procurement",
    title: "PENGADAAN (PROCUREMENT)",
    defaultExpanded: true,
    allowedRoles: ["SUPERADMIN", "ADMIN", "PURCHASING", "FINANCE", "MANAGEMENT"],
    items: [
      {
        id: "proc-pr",
        label: "Purchase Request (PR)",
        href: "/admin/purchase-requests",
      },
      {
        id: "proc-po",
        label: "Purchase Order (PO)",
        href: "/admin/purchase-orders",
      },
      {
        id: "proc-supplier",
        label: "Mitra Supplier (SRM)",
        href: "/admin/supplier",
      },
    ],
  },
  {
    id: "inventory",
    title: "INVENTARIS & GUDANG (INVENTORY)",
    defaultExpanded: true,
    allowedRoles: ["SUPERADMIN", "ADMIN", "WAREHOUSE", "PURCHASING", "MANAGEMENT"],
    items: [
      {
        id: "inv-command",
        label: "Command Center Stok",
        href: "/admin/inventory",
        exact: true,
        badgeVariant: "warning",
      },
      {
        id: "inv-items",
        label: "Katalog Master Item",
        href: "/admin/inventory/items",
      },
      {
        id: "inv-receiving",
        label: "Penerimaan & QC (Receiving)",
        href: "/admin/inventory/receiving",
      },
      {
        id: "inv-transfers",
        label: "Transfer Antar Gudang",
        href: "/admin/inventory/transfers",
      },
      {
        id: "inv-movements",
        label: "Ledger Mutasi Stok",
        href: "/admin/inventory/movements",
      },
      {
        id: "inv-opname",
        label: "Stock Opname Fisik",
        href: "/admin/inventory/opname",
      },
    ],
  },
  {
    id: "production",
    title: "PRODUKSI (PRODUCTION)",
    defaultExpanded: true,
    allowedRoles: ["SUPERADMIN", "ADMIN", "KITCHEN", "MANAGEMENT"],
    items: [
      {
        id: "prod-dash",
        label: "Jadwal Masak Harian",
        href: "/admin/production",
        exact: true,
      },
      {
        id: "prod-recipe",
        label: "Katalog Resep & BOM",
        href: "/admin/production/recipes",
        exact: true,
      },
      {
        id: "prod-planning",
        label: "Perencanaan Batch Produksi",
        href: "/admin/production/planning",
        exact: true,
      },
    ],
  },
  {
    id: "kitchen",
    title: "DAPUR SENTRAL (KITCHEN)",
    defaultExpanded: true,
    allowedRoles: ["SUPERADMIN", "ADMIN", "KITCHEN", "MANAGEMENT"],
    items: [
      {
        id: "kitchen-dash",
        label: "Konsol Display Dapur Sentral",
        href: "/admin/kitchen",
        exact: true,
      },
    ],
  },
  {
    id: "delivery",
    title: "DISTRIBUSI (DELIVERY)",
    defaultExpanded: false,
    allowedRoles: ["SUPERADMIN", "ADMIN", "DELIVERY", "MANAGEMENT"],
    items: [
      {
        id: "deliv-dash",
        label: "Dispatch Logistik Karawang",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
    ],
  },
  {
    id: "finance",
    title: "KEUANGAN (FINANCE)",
    defaultExpanded: false,
    allowedRoles: ["SUPERADMIN", "ADMIN", "FINANCE", "MANAGEMENT"],
    items: [
      {
        id: "fin-settle",
        label: "Faktur & Rekonsiliasi Bank",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
    ],
  },
  {
    id: "reports",
    title: "LAPORAN (REPORTS)",
    defaultExpanded: false,
    allowedRoles: ["SUPERADMIN", "ADMIN", "MANAGEMENT", "AUDITOR"],
    items: [
      {
        id: "rep-exec",
        label: "Laporan Eksekutif Bulanan",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
    ],
  },
  {
    id: "settings",
    title: "PENGATURAN (SETTINGS)",
    defaultExpanded: false,
    allowedRoles: ["SUPERADMIN", "ADMIN"],
    items: [
      {
        id: "admin-users",
        label: "Pengguna & Hak Akses",
        href: "#",
        badge: "Admin",
        badgeVariant: "neutral",
      },
      {
        id: "set-company",
        label: "Konfigurasi Cabang & Unit",
        href: "#",
        badge: "Konfigurasi",
        badgeVariant: "neutral",
      },
    ],
  },
];
