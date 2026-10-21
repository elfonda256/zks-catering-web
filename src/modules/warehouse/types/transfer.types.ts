/**
 * Warehouse Internal Transfer Types
 */

export type TransferStatus = "DRAFT" | "PENDING_DISPATCH" | "IN_TRANSIT" | "RECEIVED" | "REJECTED";

export interface TransferLineItem {
  id: string;
  sku: string;
  itemName: string;
  qty: number;
  unit: string;
  batchNumber: string;
}

export interface WarehouseTransferRecord {
  id: string;
  transferCode: string;
  fromWarehouse: string;
  toWarehouse: string;
  transferDate: string;
  status: TransferStatus;
  driverName?: string;
  vehiclePlate?: string;
  coolBoxId?: string;
  requestedBy: string;
  approvedBy?: string;
  items: TransferLineItem[];
}
