/**
 * Goods Receiving & QC Inspection Types
 */

export type ReceivingStatus = "PENDING" | "IN_QC" | "ACCEPTED" | "PARTIAL_REJECT" | "REJECTED";

export interface ReceivingItemLine {
  id: string;
  sku: string;
  itemName: string;
  poQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  unit: string;
  temperatureOnArrival?: string;
  expiryDate: string;
  qcPassed: boolean;
  rejectReason?: string;
}

export interface GoodsReceivingRecord {
  id: string;
  asnNumber: string;
  poNumber: string;
  supplierName: string;
  arrivalDate: string;
  status: ReceivingStatus;
  receiverName: string;
  qcInspectorName: string;
  items: ReceivingItemLine[];
}
