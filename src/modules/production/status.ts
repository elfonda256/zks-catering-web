import type { BadgeVariant } from "@/shared/components/ui/Badge";
import type { ProductionStatus } from "./types";

export const PRODUCTION_STATUS: Record<ProductionStatus, { label: string; variant: BadgeVariant; action?: string }> = {
  SCHEDULED: { label: "Dijadwalkan", variant: "draft", action: "Mulai persiapan" },
  PREPARING: { label: "Persiapan", variant: "pending", action: "Mulai masak (ambil bahan)" },
  COOKING: { label: "Dimasak", variant: "processing", action: "Mulai packing" },
  PACKING: { label: "Packing", variant: "reserved", action: "Siap kirim" },
  READY: { label: "Siap kirim", variant: "completed" },
  CANCELLED: { label: "Dibatalkan", variant: "cancelled" },
};

/** Columns of the kitchen board, in order. */
export const KITCHEN_COLUMNS: ProductionStatus[] = ["SCHEDULED", "PREPARING", "COOKING", "PACKING", "READY"];
