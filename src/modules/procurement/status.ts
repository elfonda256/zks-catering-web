import type { BadgeVariant } from "@/shared/components/ui/Badge";
import type { PoStatus, PrStatus } from "@/modules/sample-data";

export const PR_STATUS: Record<PrStatus, { label: string; variant: BadgeVariant }> = {
  menunggu: { label: "Menunggu persetujuan", variant: "pending" },
  disetujui: { label: "Disetujui", variant: "approved" },
  ditolak: { label: "Ditolak", variant: "rejected" },
  selesai: { label: "Selesai", variant: "completed" },
};

export const PO_STATUS: Record<PoStatus, { label: string; variant: BadgeVariant }> = {
  draf: { label: "Draf", variant: "draft" },
  dikirim: { label: "Menunggu barang", variant: "processing" },
  "diterima-sebagian": { label: "Diterima sebagian", variant: "low_stock" },
  diterima: { label: "Diterima", variant: "completed" },
};
