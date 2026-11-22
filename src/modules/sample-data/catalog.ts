/**
 * Sample master data for the admin modules that have no database tables yet.
 * Small and internally consistent: every code used elsewhere in this folder exists here.
 */

import { CATEGORIES, type CategoryId, type IngredientCategory, type LocationId } from "@/modules/inventory/master-data";

export { CATEGORIES, LOCATIONS, type CategoryId, type IngredientCategory, type LocationId } from "@/modules/inventory/master-data";

export interface Ingredient {
  code: string;
  name: string;
  category: CategoryId;
  type: string;
  unit: string;
  location: LocationId;
  stock: number;
  minStock: number;
  /** Last purchase price per unit, in rupiah. */
  price: number;
  /** Days until the oldest batch in stock expires; omitted for long-life goods. */
  expiresInDays?: number;
}

export const INGREDIENTS: Ingredient[] = [
  { code: "BRS-01", name: "Beras putih medium", category: "karbohidrat", type: "Beras", unit: "kg", location: "gudang-kering", stock: 420, minStock: 200, price: 14500 },
  { code: "TPG-01", name: "Tepung terigu", category: "karbohidrat", type: "Tepung", unit: "kg", location: "gudang-kering", stock: 25, minStock: 10, price: 11000 },
  { code: "AYM-01", name: "Ayam potong", category: "daging", type: "Ayam", unit: "kg", location: "chiller", stock: 48, minStock: 40, price: 36000, expiresInDays: 2 },
  { code: "AYM-02", name: "Fillet dada ayam", category: "daging", type: "Ayam", unit: "kg", location: "chiller", stock: 6, minStock: 15, price: 52000, expiresInDays: 2 },
  { code: "SPI-01", name: "Daging sapi has dalam", category: "daging", type: "Sapi", unit: "kg", location: "freezer", stock: 14, minStock: 8, price: 135000, expiresInDays: 60 },
  { code: "UDG-01", name: "Udang kupas", category: "seafood", type: "Udang", unit: "kg", location: "freezer", stock: 9, minStock: 5, price: 95000, expiresInDays: 45 },
  { code: "IKN-01", name: "Ikan tongkol", category: "seafood", type: "Ikan laut", unit: "kg", location: "freezer", stock: 12, minStock: 8, price: 38000, expiresInDays: 30 },
  { code: "TLR-01", name: "Telur ayam", category: "protein-nabati", type: "Telur", unit: "kg", location: "chiller", stock: 42, minStock: 15, price: 29000, expiresInDays: 10 },
  { code: "THU-01", name: "Tahu putih", category: "protein-nabati", type: "Tahu", unit: "pcs", location: "chiller", stock: 180, minStock: 100, price: 1500, expiresInDays: 2 },
  { code: "TMP-01", name: "Tempe papan", category: "protein-nabati", type: "Tempe", unit: "papan", location: "chiller", stock: 22, minStock: 15, price: 12000, expiresInDays: 2 },
  { code: "KKG-01", name: "Kangkung", category: "sayur", type: "Sayur daun", unit: "ikat", location: "chiller", stock: 40, minStock: 30, price: 4000, expiresInDays: 1 },
  { code: "BNC-01", name: "Buncis", category: "sayur", type: "Sayur polong", unit: "kg", location: "chiller", stock: 8, minStock: 10, price: 14000, expiresInDays: 3 },
  { code: "WRT-01", name: "Wortel", category: "sayur", type: "Umbi", unit: "kg", location: "chiller", stock: 15, minStock: 10, price: 12000, expiresInDays: 7 },
  { code: "TGE-01", name: "Tauge", category: "sayur", type: "Kecambah", unit: "kg", location: "chiller", stock: 5, minStock: 5, price: 9000, expiresInDays: 1 },
  { code: "BWM-01", name: "Bawang merah", category: "bumbu", type: "Bawang", unit: "kg", location: "gudang-kering", stock: 18, minStock: 10, price: 38000 },
  { code: "BWP-01", name: "Bawang putih", category: "bumbu", type: "Bawang", unit: "kg", location: "gudang-kering", stock: 12, minStock: 8, price: 34000 },
  { code: "CBM-01", name: "Cabai merah keriting", category: "bumbu", type: "Cabai", unit: "kg", location: "chiller", stock: 4, minStock: 5, price: 45000, expiresInDays: 4 },
  { code: "CBR-01", name: "Cabai rawit", category: "bumbu", type: "Cabai", unit: "kg", location: "chiller", stock: 1.5, minStock: 3, price: 55000, expiresInDays: 4 },
  { code: "MYK-01", name: "Minyak goreng", category: "kering", type: "Minyak", unit: "liter", location: "gudang-kering", stock: 60, minStock: 30, price: 17500 },
  { code: "GLA-01", name: "Gula pasir", category: "kering", type: "Gula", unit: "kg", location: "gudang-kering", stock: 20, minStock: 10, price: 17000 },
  { code: "KCP-01", name: "Kecap manis", category: "kering", type: "Saus & kecap", unit: "liter", location: "gudang-kering", stock: 9, minStock: 6, price: 28000 },
  { code: "JRK-01", name: "Jeruk manis", category: "buah", type: "Jeruk", unit: "kg", location: "chiller", stock: 25, minStock: 15, price: 22000, expiresInDays: 6 },
  { code: "SMK-01", name: "Semangka", category: "buah", type: "Melon & semangka", unit: "kg", location: "gudang-kering", stock: 40, minStock: 30, price: 9000, expiresInDays: 5 },
];

const BY_CODE = new Map(INGREDIENTS.map((item) => [item.code, item]));
const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getIngredient(code: string): Ingredient {
  const item = BY_CODE.get(code);
  if (!item) throw new Error(`Unknown sample ingredient ${code}`);
  return item;
}

export function getCategory(id: CategoryId): IngredientCategory {
  return CATEGORY_BY_ID.get(id)!;
}

export type StockLevel = "habis" | "kurang" | "aman";

export function stockLevel(item: Pick<Ingredient, "stock" | "minStock">): StockLevel {
  if (item.stock <= 0) return "habis";
  return item.stock < item.minStock ? "kurang" : "aman";
}
