/**
 * Enterprise Item & Master Catalog Types
 */

export type ItemCategory =
  | "Daging & Unggas"
  | "Beras & Biji-bijian"
  | "Minyak & Lemak"
  | "Bumbu & Rempah"
  | "Sayuran & Buah"
  | "Packaging & Box"
  | "Bahan Tambahan";

export type StockStatus =
  | "OPTIMAL"
  | "LOW_STOCK"
  | "CRITICAL"
  | "OVERSTOCK"
  | "OUT_OF_STOCK";

export interface ItemWarehouseAllocation {
  warehouseId: string;
  warehouseName: string;
  locationCode: string;
  qty: number;
  unit: string;
  minTemp?: string;
  maxTemp?: string;
}

export interface ItemBatch {
  batchNumber: string;
  receivedDate: string;
  expiryDate: string;
  qty: number;
  unit: string;
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "QUARANTINE";
  qcPassed: boolean;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: ItemCategory;
  currentStock: number;
  safetyStock: number;
  parLevel: number;
  reorderPoint: number;
  unit: string;
  unitCost: number;
  totalValuation: number;
  status: StockStatus;
  primarySupplier: string;
  storageTemp: string;
  leadTimeDays: number;
  lastRestocked: string;
  expiryRiskCount?: number;
  allocations?: ItemWarehouseAllocation[];
  batches?: ItemBatch[];
}
