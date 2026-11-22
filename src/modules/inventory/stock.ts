import type { BadgeVariant } from "@/shared/components/ui/Badge";

export type StockLevel = "habis" | "kurang" | "aman";

export function stockLevel(item: { stock: number; minStock: number }): StockLevel {
  if (item.stock <= 0) return "habis";
  return item.stock < item.minStock ? "kurang" : "aman";
}

export const STOCK_LEVEL_BADGE: Record<StockLevel, { label: string; variant: BadgeVariant }> = {
  aman: { label: "Aman", variant: "completed" },
  kurang: { label: "Di bawah minimum", variant: "low_stock" },
  habis: { label: "Habis", variant: "critical" },
};

/** Quantities keep up to 3 decimals, Indonesian style (1,5 kg). */
export function formatQuantity(qty: number, unit: string): string {
  return `${qty.toLocaleString("id-ID", { maximumFractionDigits: 3 })} ${unit}`;
}

/** Batches expiring within this many days are flagged as "segera kedaluwarsa". */
export const EXPIRY_WARNING_DAYS = 2;
