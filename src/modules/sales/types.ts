/** Serializable direct-order data passed from the server page to the client view. */

import type { OrderStatusValue } from "@/modules/dashboard/constants";

export type DirectOrderSource = "PHONE" | "WHATSAPP" | "WALK_IN";

export interface DirectOrderRow {
  id: number;
  orderCode: string;
  source: DirectOrderSource;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  eventDate: string;
  packages: string;
  totalPcs: number;
  subtotal: number;
  notes: string | null;
  status: OrderStatusValue;
  createdAt: string;
  createdBy: string | null;
}
