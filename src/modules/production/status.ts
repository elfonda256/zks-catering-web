import type { BadgeVariant } from "@/shared/components/ui/Badge";
import type { WorkOrderStatus } from "@/modules/sample-data";

export const WORK_ORDER_STATUS: Record<WorkOrderStatus, { label: string; variant: BadgeVariant }> = {
  dijadwalkan: { label: "Dijadwalkan", variant: "draft" },
  persiapan: { label: "Persiapan", variant: "pending" },
  dimasak: { label: "Dimasak", variant: "processing" },
  packing: { label: "Packing", variant: "reserved" },
  "siap-kirim": { label: "Siap kirim", variant: "completed" },
};
