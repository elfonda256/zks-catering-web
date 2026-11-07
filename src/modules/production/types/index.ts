export type WorkOrderStatus =
  | "PLANNED"
  | "IN_PREPARATION"
  | "COOKING"
  | "COOLING"
  | "PACKED"
  | "DISPATCHED"
  | "CANCELLED";

export type ProductionStation =
  | "BUTCHER"
  | "STEAMER"
  | "HOT_KITCHEN"
  | "COLD_PREP"
  | "BAKERY";

export type ProductionShift =
  | "SHIFT_1_LUNCH"
  | "SHIFT_2_DINNER"
  | "SHIFT_3_MIDNIGHT";

export interface WorkOrder {
  id: string;
  workOrderCode: string;
  scheduledDate: string;
  shift: ProductionShift;
  clientName: string;
  menuItemName: string;
  tier: "17k" | "20k" | "25k";
  targetPortions: number;
  actualProduced: number;
  status: WorkOrderStatus;
  station: ProductionStation;
  headChefName: string;
  targetPackingTime: string;
  coreTempTarget: number;
  currentCoreTemp?: number;
  haccpPassed: boolean;
  notes?: string;
}

export interface BOMIngredient {
  sku: string;
  name: string;
  category: "DAGING" | "SAYUR" | "BERAS_POKOK" | "BUMBU" | "KEMASAN";
  grammagePerPortion: number; // in grams or ml
  unit: string;
  stockAvailable: number; // in unit
}

export interface RecipeBOM {
  id: string;
  recipeCode: string;
  name: string;
  category: "PROTEIN" | "SAYURAN" | "KARBOHIDRAT" | "PELENGKAP";
  baseYieldPortions: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  lossFactorPercent: number; // susut masak
  standardCoreTemp: number; // standar suhu CCP
  ingredients: BOMIngredient[];
}

export interface ScaledIngredientRequirement {
  sku: string;
  name: string;
  category: string;
  totalRequired: number;
  unit: string;
  stockAvailable: number;
  isSufficient: boolean;
  shortageAmount: number;
}

export interface ProductionKpiSummary {
  totalWorkOrdersToday: number;
  totalPortionsScheduled: number;
  totalPortionsPacked: number;
  averageYieldRate: number;
  haccpComplianceRate: number;
  activeBoilers: number;
}
