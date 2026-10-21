import { ErpNavSection } from "./types";

/**
 * ZKS Catering ERP Navigation Configuration
 * Strictly follows Sprint 10.5 Module Structure & Role-Based Access Control
 */
export const erpNavSections: ErpNavSection[] = [
  {
    id: "dashboard",
    title: "DASHBOARD",
    defaultExpanded: true,
    items: [
      {
        id: "dash-orders",
        label: "Dashboard Pesanan",
        href: "/admin/dashboard",
        exact: true,
      },
    ],
  },
  {
    id: "inventory",
    title: "INVENTARIS & GUDANG",
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
        id: "inv-movements",
        label: "Ledger Mutasi Stok",
        href: "/admin/inventory/movements",
      },
      {
        id: "inv-transfers",
        label: "Transfer Antar Gudang",
        href: "/admin/inventory/transfers",
      },
      {
        id: "inv-opname",
        label: "Stock Opname Fisik",
        href: "/admin/inventory/opname",
      },
    ],
  },
  {
    id: "procurement",
    title: "PENGADAAN & SRM",
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
        label: "Manajemen Supplier (SRM)",
        href: "/admin/supplier",
      },
    ],
  },
  {
    id: "production",
    title: "PRODUKSI",
    defaultExpanded: false,
    allowedRoles: ["SUPERADMIN", "ADMIN", "KITCHEN", "MANAGEMENT"],
    items: [
      {
        id: "prod-dash",
        label: "Dashboard Produksi",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
      {
        id: "prod-recipe",
        label: "Katalog Resep (Recipe)",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
      {
        id: "prod-bom",
        label: "Bill of Materials (BOM)",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
      {
        id: "prod-planning",
        label: "Perencanaan Produksi",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
    ],
  },
  {
    id: "kitchen",
    title: "DAPUR SENTRAL",
    defaultExpanded: false,
    allowedRoles: ["SUPERADMIN", "ADMIN", "KITCHEN", "MANAGEMENT"],
    items: [
      {
        id: "kitchen-dash",
        label: "Dashboard Dapur",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
    ],
  },
  {
    id: "delivery",
    title: "DISTRIBUSI & ARMADA",
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
    title: "KEUANGAN & FAKTUR",
    defaultExpanded: false,
    allowedRoles: ["SUPERADMIN", "ADMIN", "FINANCE", "MANAGEMENT"],
    items: [
      {
        id: "fin-settle",
        label: "Faktur & Pembayaran Vendor",
        href: "#",
        badge: "Roadmap",
        badgeVariant: "neutral",
      },
    ],
  },
  {
    id: "reports",
    title: "LAPORAN & AUDIT",
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
    id: "administration",
    title: "ADMINISTRASI",
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
    ],
  },
  {
    id: "settings",
    title: "PENGATURAN",
    defaultExpanded: false,
    allowedRoles: ["SUPERADMIN", "ADMIN"],
    items: [
      {
        id: "set-company",
        label: "Konfigurasi Perusahaan & Cabang",
        href: "#",
        badge: "Konfigurasi",
        badgeVariant: "neutral",
      },
    ],
  },
];
