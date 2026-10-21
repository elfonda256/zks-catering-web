/**
 * Stock Movement & Audit Trail Types
 */

export type MovementType =
  | "RECEIVING"
  | "PRODUCTION_OUT"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "ADJUSTMENT_PLUS"
  | "ADJUSTMENT_MINUS"
  | "WASTE_DISPOSAL"
  | "RETURN_TO_SUPPLIER";

export interface StockMovementRecord {
  id: string;
  timestamp: string;
  movementType: MovementType;
  sku: string;
  itemName: string;
  batchNumber?: string;
  qtyChange: number;
  qtyBefore: number;
  qtyAfter: number;
  unit: string;
  warehouseName: string;
  referenceNo: string;
  operatorName: string;
  notes?: string;
}
