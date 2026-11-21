import type { BadgeVariant } from "@/shared/components/ui/Badge";

export type OrderStatusValue =
  | "WAITING_ADMIN_CONFIRMATION"
  | "CONFIRMED_AWAITING_PAYMENT"
  | "DP_PAID"
  | "FULLY_PAID"
  | "IN_PREPARATION"
  | "IN_DELIVERY"
  | "COMPLETED"
  | "EXPIRED_UNCONFIRMED_BY_ADMIN"
  | "EXPIRED_PAYMENT_TIMEOUT"
  | "REJECTED_BY_ADMIN"
  | "CANCELLED_BY_ADMIN_REFUND_REQ"
  | "CANCELLED_BY_CUSTOMER"
  | "CANCELLED_DP_FORFEITED"
  | "CANCELLED_FULL_REFUND_PENDING"
  | "REFUNDED";

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, { label: string; variant: BadgeVariant }> = {
  WAITING_ADMIN_CONFIRMATION: { label: "Perlu ongkir", variant: "warning" },
  CONFIRMED_AWAITING_PAYMENT: { label: "Menunggu pembayaran", variant: "info" },
  DP_PAID: { label: "DP diterima", variant: "approved" },
  FULLY_PAID: { label: "Lunas", variant: "completed" },
  IN_PREPARATION: { label: "Dimasak", variant: "processing" },
  IN_DELIVERY: { label: "Dikirim", variant: "processing" },
  COMPLETED: { label: "Selesai", variant: "completed" },
  EXPIRED_UNCONFIRMED_BY_ADMIN: { label: "Kedaluwarsa", variant: "expired" },
  EXPIRED_PAYMENT_TIMEOUT: { label: "Tidak dibayar", variant: "expired" },
  REJECTED_BY_ADMIN: { label: "Ditolak", variant: "rejected" },
  CANCELLED_BY_ADMIN_REFUND_REQ: { label: "Dibatalkan admin", variant: "cancelled" },
  CANCELLED_BY_CUSTOMER: { label: "Dibatalkan pelanggan", variant: "cancelled" },
  CANCELLED_DP_FORFEITED: { label: "Batal, DP hangus", variant: "cancelled" },
  CANCELLED_FULL_REFUND_PENDING: { label: "Batal, refund diproses", variant: "cancelled" },
  REFUNDED: { label: "Dana dikembalikan", variant: "cancelled" },
};

/**
 * The only manual status moves an admin may make. Payment statuses (DP_PAID, FULLY_PAID)
 * are set by payment verification, never by hand. A DP-paid order may go to the kitchen;
 * the remaining balance is settled later.
 */
export const NEXT_OPERATIONAL_STATUS: Partial<Record<OrderStatusValue, OrderStatusValue>> = {
  DP_PAID: "IN_PREPARATION",
  FULLY_PAID: "IN_PREPARATION",
  IN_PREPARATION: "IN_DELIVERY",
  IN_DELIVERY: "COMPLETED",
};

export const NEXT_STATUS_ACTION_LABELS: Partial<Record<OrderStatusValue, string>> = {
  IN_PREPARATION: "Mulai masak",
  IN_DELIVERY: "Kirim pesanan",
  COMPLETED: "Tandai selesai",
};

/** Statuses that payment verification must not overwrite once the kitchen has started. */
export const OPERATIONAL_STATUSES: readonly OrderStatusValue[] = [
  "IN_PREPARATION",
  "IN_DELIVERY",
  "COMPLETED",
];

const ACTIVE_STATUSES: readonly OrderStatusValue[] = ["DP_PAID", "FULLY_PAID", "IN_PREPARATION", "IN_DELIVERY"];

const ARCHIVED_STATUSES: readonly OrderStatusValue[] = [
  "COMPLETED",
  "EXPIRED_UNCONFIRMED_BY_ADMIN",
  "EXPIRED_PAYMENT_TIMEOUT",
  "REJECTED_BY_ADMIN",
  "CANCELLED_BY_ADMIN_REFUND_REQ",
  "CANCELLED_BY_CUSTOMER",
  "CANCELLED_DP_FORFEITED",
  "CANCELLED_FULL_REFUND_PENDING",
  "REFUNDED",
];

export type OrderTab = "proof" | "shipping" | "payment" | "active" | "archived" | "all";

export const ORDER_TABS: { id: OrderTab; label: string }[] = [
  { id: "proof", label: "Bukti bayar" },
  { id: "shipping", label: "Perlu ongkir" },
  { id: "payment", label: "Menunggu bayar" },
  { id: "active", label: "Berjalan" },
  { id: "archived", label: "Arsip" },
  { id: "all", label: "Semua" },
];

export const ORDER_TAB_STATUSES: Record<Exclude<OrderTab, "proof" | "all">, readonly OrderStatusValue[]> = {
  shipping: ["WAITING_ADMIN_CONFIRMATION"],
  payment: ["CONFIRMED_AWAITING_PAYMENT"],
  active: ACTIVE_STATUSES,
  archived: ARCHIVED_STATUSES,
};

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  DP: "DP 20%",
  SETTLEMENT: "Pelunasan",
  FULL: "Bayar penuh",
};
