import type { BadgeVariant } from "@/shared/components/ui/Badge";
import type { MovementType } from "./types";

export const MOVEMENT_TYPE_LABELS: Record<MovementType, { label: string; hint: string; variant: BadgeVariant }> = {
  IN: { label: "Masuk", hint: "Barang datang dari supplier", variant: "completed" },
  OUT: { label: "Keluar", hint: "Dipakai produksi atau dibuang", variant: "processing" },
  TRANSFER: { label: "Transfer", hint: "Pindah antar lokasi", variant: "reserved" },
  ADJUSTMENT: { label: "Penyesuaian", hint: "Koreksi hasil hitung fisik", variant: "low_stock" },
};
