/**
 * Stock Opname & Physical Inventory Reconciliation Types
 */

export type OpnameStatus = "DRAFT" | "IN_PROGRESS" | "PENDING_APPROVAL" | "RECONCILED" | "CANCELLED";

export interface OpnameItemRecord {
  id: string;
  sku: string;
  itemName: string;
  systemQty: number;
  physicalQty: number | null;
  varianceQty: number;
  varianceValue: number;
  unit: string;
  unitCost: number;
  reason?: string;
  countedBy?: string;
}

export interface OpnameSession {
  id: string;
  sessionCode: string;
  warehouseId: string;
  warehouseName: string;
  scheduledDate: string;
  status: OpnameStatus;
  totalItemsCounted: number;
  totalVarianceValue: number;
  auditorName: string;
  items: OpnameItemRecord[];
}
