/** Serializable procurement data passed from server pages to client views. */

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ORDERED";
export type OrderStatus = "SENT" | "PARTIALLY_RECEIVED" | "RECEIVED" | "CANCELLED";

export interface Option {
  id: number;
  name: string;
}

export interface ProcurementItem {
  id: number;
  code: string;
  name: string;
  unit: string;
  categoryName: string;
  lastPrice: number;
  supplierId: number | null;
}

export interface ProcurementOptions {
  items: ProcurementItem[];
  suppliers: Option[];
  locations: Option[];
}

export interface DocumentLine {
  ingredientId: number;
  ingredientName: string;
  unit: string;
  quantity: number;
  /** Agreed price on a PO; the last purchase price as an estimate on a PR. */
  unitPrice: number;
}

export interface RequestRow {
  id: number;
  code: string;
  requestedBy: string;
  reason: string;
  neededBy: string;
  status: RequestStatus;
  decisionNote: string | null;
  createdAt: string;
  createdBy: string | null;
  orderCode: string | null;
  lines: DocumentLine[];
}

export interface OrderLineRow extends DocumentLine {
  lineId: number;
  /** Accepted so far; rejected goods do not count. */
  receivedQuantity: number;
}

export interface OrderRow {
  id: number;
  code: string;
  supplierName: string;
  supplierTerms: string | null;
  requestCode: string | null;
  status: OrderStatus;
  expectedDate: string | null;
  note: string | null;
  createdAt: string;
  createdBy: string | null;
  receiptCount: number;
  lines: OrderLineRow[];
}

export interface ReceiptRow {
  id: number;
  code: string;
  orderCode: string;
  supplierName: string;
  locationName: string;
  note: string | null;
  createdAt: string;
  receivedBy: string | null;
  lines: { ingredientName: string; unit: string; accepted: number; rejected: number; note: string | null }[];
}
