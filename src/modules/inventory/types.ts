/** Serializable inventory data passed from server pages to client views. */

export type MovementType = "IN" | "OUT" | "TRANSFER" | "ADJUSTMENT";

export interface Option {
  id: number;
  name: string;
}

export interface CatalogCategory {
  slug: string;
  name: string;
  types: Option[];
}

export interface CatalogItem {
  id: number;
  code: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  typeId: number;
  typeName: string;
  unit: string;
  locationId: number;
  locationName: string;
  minStock: number;
  lastPrice: number;
  supplierId: number | null;
  supplierName: string | null;
  isActive: boolean;
  /** Total across all locations: movements in minus movements out. */
  stock: number;
}

export interface InventoryFormOptions {
  categories: CatalogCategory[];
  locations: Option[];
  suppliers: Option[];
}

export interface MovementRow {
  id: number;
  createdAt: string;
  ingredientName: string;
  unit: string;
  type: MovementType;
  quantity: number;
  fromName: string | null;
  toName: string | null;
  reference: string | null;
  note: string | null;
  createdBy: string | null;
}
