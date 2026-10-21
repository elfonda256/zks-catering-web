/**
 * Purchase Request (PR) Types
 */

export type PRUrgency = "NORMAL" | "URGENT" | "EMERGENCY";
export type PRStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CONVERTED_TO_PO";

export interface PRItemLine {
  id: string;
  sku: string;
  itemName: string;
  requestedQty: number;
  approvedQty?: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedSubtotal: number;
  notes?: string;
  currentStock: number;
  reorderPoint: number;
}

export interface PurchaseRequestRecord {
  id: string;
  prNumber: string;
  department: "KITCHEN" | "WAREHOUSE" | "LOGISTICS" | "MAINTENANCE";
  urgency: PRUrgency;
  status: PRStatus;
  requestDate: string;
  requiredDate: string;
  requesterName: string;
  approverName?: string;
  notes?: string;
  totalEstimatedAmount: number;
  items: PRItemLine[];
}
