import { ErpNavSection } from "./types";

/**
 * Admin navigation. Penjualan, Distribusi, Keuangan, Laporan and Pengaturan run on real data;
 * modules marked on their page as "Data contoh" still use src/modules/sample-data.
 */
export const erpNavSections: ErpNavSection[] = [
  {
    id: "sales",
    title: "PENJUALAN",
    defaultExpanded: true,
    items: [
      { id: "sales-orders", label: "Pesanan", href: "/admin/dashboard", exact: true },
      { id: "sales-adhoc", label: "Pesanan langsung", href: "/admin/order-adhoc", exact: true },
    ],
  },
  {
    id: "delivery",
    title: "DISTRIBUSI",
    defaultExpanded: true,
    items: [{ id: "deliv-dash", label: "Pengiriman", href: "/admin/distribution", exact: true }],
  },
  {
    id: "finance",
    title: "KEUANGAN",
    defaultExpanded: true,
    items: [
      { id: "fin-settle", label: "Pembayaran & piutang", href: "/admin/finance", exact: true },
      { id: "rep-exec", label: "Laporan bulanan", href: "/admin/reports", exact: true },
    ],
  },
  {
    id: "procurement",
    title: "PENGADAAN",
    defaultExpanded: true,
    items: [
      { id: "proc-pr", label: "Permintaan (PR)", href: "/admin/purchase-requests", exact: true },
      { id: "proc-po", label: "Pembelian (PO)", href: "/admin/purchase-orders", exact: true },
      { id: "proc-supplier", label: "Supplier", href: "/admin/supplier", exact: true },
    ],
  },
  {
    id: "inventory",
    title: "GUDANG",
    defaultExpanded: true,
    items: [
      { id: "inv-command", label: "Stok", href: "/admin/inventory", exact: true },
      { id: "inv-items", label: "Katalog bahan", href: "/admin/inventory/items", exact: true },
      { id: "inv-receiving", label: "Penerimaan barang", href: "/admin/inventory/receiving", exact: true },
      { id: "inv-transfers", label: "Transfer", href: "/admin/inventory/transfers", exact: true },
      { id: "inv-movements", label: "Mutasi stok", href: "/admin/inventory/movements", exact: true },
      { id: "inv-opname", label: "Stock opname", href: "/admin/inventory/opname", exact: true },
    ],
  },
  {
    id: "production",
    title: "PRODUKSI",
    defaultExpanded: true,
    items: [
      { id: "prod-dash", label: "Jadwal produksi", href: "/admin/production", exact: true },
      { id: "prod-recipe", label: "Resep & bahan", href: "/admin/production/recipes", exact: true },
      { id: "kitchen-dash", label: "Layar dapur", href: "/admin/kitchen", exact: true },
    ],
  },
  {
    id: "settings",
    title: "PENGATURAN",
    defaultExpanded: true,
    items: [
      { id: "admin-users", label: "Pengguna admin", href: "/admin/users", exact: true },
      { id: "set-company", label: "Pengaturan usaha", href: "/admin/settings", exact: true },
    ],
  },
];
