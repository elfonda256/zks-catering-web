/**
 * Purchase Order (PO) Types
 */

export type POStatus =
  | "DRAFT"
  | "WAITING_APPROVAL"
  | "APPROVED"
  | "SENT_TO_SUPPLIER"
  | "IN_DELIVERY"
  | "PARTIALLY_RECEIVED"
  | "COMPLETED"
  | "CANCELLED";

export interface POLineItem {
  id: string;
  sku: string;
  itemName: string;
  qty: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  taxRate: number; // e.g. 0.11 for PPN 11%
  taxAmount: number;
  totalPrice: number;
  receivedQty?: number;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  prNumberRef?: string;
  supplierId: string;
  supplierName: string;
  supplierPIC: string;
  supplierContact: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: POStatus;
  paymentTerms: "COD" | "NET_7" | "NET_14" | "NET_30" | "CBD";
  currency: string;
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  notes?: string;
  issuedByName: string;
  approvedByName?: string;
  items: POLineItem[];
}
