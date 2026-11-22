import type { BadgeVariant } from "@/shared/components/ui/Badge";
import type { OrderStatus, RequestStatus } from "./types";

export const PR_STATUS: Record<RequestStatus, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: "Menunggu persetujuan", variant: "pending" },
  APPROVED: { label: "Disetujui", variant: "approved" },
  REJECTED: { label: "Ditolak", variant: "rejected" },
  ORDERED: { label: "Sudah jadi PO", variant: "completed" },
};

export const PO_STATUS: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  SENT: { label: "Menunggu barang", variant: "processing" },
  PARTIALLY_RECEIVED: { label: "Diterima sebagian", variant: "low_stock" },
  RECEIVED: { label: "Diterima", variant: "completed" },
  CANCELLED: { label: "Dibatalkan", variant: "cancelled" },
};

/** POs that can still receive goods. */
export const OPEN_ORDER_STATUSES: OrderStatus[] = ["SENT", "PARTIALLY_RECEIVED"];
