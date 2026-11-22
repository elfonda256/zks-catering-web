/** Serializable production data passed from server pages to client views. */

export type ProductionStatus = "SCHEDULED" | "PREPARING" | "COOKING" | "PACKING" | "READY" | "CANCELLED";
export type ProductionShift = "MORNING" | "AFTERNOON" | "NIGHT";

export interface RecipeRow {
  /** Package price; packages are identified by price across the site. */
  price: number;
  name: string;
  description: string;
  lines: { ingredientId: number; ingredientName: string; unit: string; quantityPerPortion: number; lastPrice: number }[];
}

export interface MaterialNeed {
  ingredientId: number;
  ingredientName: string;
  unit: string;
  required: number;
  /** Stock at the ingredient's storage location, where cooking takes it from. */
  available: number;
  locationName: string;
}

export interface ProductionRow {
  id: number;
  code: string;
  packageName: string;
  portions: number;
  productionDate: string;
  shift: ProductionShift;
  deliveryTime: string;
  destination: string;
  note: string | null;
  status: ProductionStatus;
  materialsIssuedAt: string | null;
  orderCode: string | null;
  needs: MaterialNeed[];
}

/** A paid customer order line that can be scheduled for production. */
export interface SchedulableOrder {
  orderId: number;
  orderCode: string;
  customerName: string;
  customerAddress: string;
  eventDate: string;
  packagePrice: number;
  packageName: string;
  portions: number;
}

export interface SafetyCheckRow {
  id: number;
  createdAt: string;
  point: string;
  reading: string;
  limit: string;
  ok: boolean;
  checkedBy: string;
  productionCode: string | null;
}
