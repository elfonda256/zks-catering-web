export const DASHBOARD_CONSTANTS = {
  TITLE: "Konsol Operasional Dapur & Logistik",
  SUBTITLE: "Pusat verifikasi pesanan, penetapan ongkos kirim, dan inspeksi pembayaran katering.",
  ITEMS_PER_PAGE: 15,
} as const;

export const ORDER_STATUS_LABELS: Record<string, { label: string; variant: "success" | "warning" | "danger" | "neutral" | "info" }> = {
  SUBMITTED: { label: "Menunggu Review", variant: "warning" },
  AWAITING_PAYMENT: { label: "Menunggu DP", variant: "info" },
  PAID_DP: { label: "DP Terverifikasi", variant: "success" },
  PAID_FULL: { label: "Lunas", variant: "success" },
  PROCESSING: { label: "Diproses Dapur", variant: "info" },
  DELIVERED: { label: "Terkirim", variant: "neutral" },
  CANCELLED: { label: "Dibatalkan", variant: "danger" },
  REJECTED: { label: "Ditolak", variant: "danger" },
};
