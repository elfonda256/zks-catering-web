/**
 * General Warehouse Facility Types
 */

export interface WarehouseLocation {
  id: string;
  name: string;
  code: string;
  zoneType: "COLD_FREEZER" | "CHILLER" | "DRY_STORAGE" | "PACKAGING";
  capacityCbm: number;
  currentUtilizationPct: number;
}
