/**
 * Sample master data for the admin modules that have no database tables yet.
 * Small and internally consistent: every code used elsewhere in this folder exists here.
 */

export type CategoryId = "karbohidrat" | "daging" | "seafood" | "protein-nabati" | "sayur" | "bumbu" | "kering" | "buah";

export interface IngredientCategory {
  id: CategoryId;
  name: string;
  /** Kinds within the category, in display order. */
  types: string[];
}

export const CATEGORIES: IngredientCategory[] = [
  { id: "karbohidrat", name: "Beras & karbohidrat", types: ["Beras", "Tepung"] },
  { id: "daging", name: "Daging & unggas", types: ["Ayam", "Sapi"] },
  { id: "seafood", name: "Ikan & seafood", types: ["Udang", "Ikan laut"] },
  { id: "protein-nabati", name: "Telur, tahu & tempe", types: ["Telur", "Tahu", "Tempe"] },
  { id: "sayur", name: "Sayur", types: ["Sayur daun", "Sayur polong", "Umbi", "Kecambah"] },
  { id: "bumbu", name: "Bumbu segar", types: ["Bawang", "Cabai"] },
  { id: "kering", name: "Bahan kering & minyak", types: ["Minyak", "Gula", "Saus & kecap"] },
  { id: "buah", name: "Buah", types: ["Jeruk", "Melon & semangka"] },
];

export type LocationId = "gudang-kering" | "chiller" | "freezer" | "dapur";

export const LOCATIONS: Record<LocationId, { name: string; note: string }> = {
  "gudang-kering": { name: "Gudang kering", note: "Suhu ruang, rak palet" },
  chiller: { name: "Chiller", note: "0–4 °C" },
  freezer: { name: "Freezer", note: "−18 °C" },
  dapur: { name: "Dapur produksi", note: "Bahan siap olah hari ini" },
};

export interface Supplier {
  id: string;
  name: string;
  area: string;
  contact: string;
  phone: string;
  categories: CategoryId[];
  paymentTerms: string;
  /** Share of deliveries that arrived on time over the last 3 months, in percent. */
  onTimeRate: number;
}

export const SUPPLIERS: Supplier[] = [
  {
    id: "SUP-01",
    name: "UD Sumber Pangan",
    area: "Karawang Barat",
    contact: "Pak Hendra",
    phone: "0812-3000-1101",
    categories: ["karbohidrat", "kering"],
    paymentTerms: "Tempo 14 hari",
    onTimeRate: 97,
  },
  {
    id: "SUP-02",
    name: "CV Unggas Segar",
    area: "Telukjambe",
    contact: "Bu Wati",
    phone: "0812-3000-1102",
    categories: ["daging", "protein-nabati"],
    paymentTerms: "Tunai saat terima",
    onTimeRate: 92,
  },
  {
    id: "SUP-03",
    name: "Kios Bu Ratna, Pasar Induk Cikampek",
    area: "Cikampek",
    contact: "Bu Ratna",
    phone: "0812-3000-1103",
    categories: ["sayur", "bumbu", "buah", "protein-nabati"],
    paymentTerms: "Tunai saat terima",
    onTimeRate: 88,
  },
  {
    id: "SUP-04",
    name: "Laut Biru Seafood",
    area: "Pantai Pakisjaya",
    contact: "Pak Darto",
    phone: "0812-3000-1104",
    categories: ["seafood"],
    paymentTerms: "Tempo 7 hari",
    onTimeRate: 90,
  },
];

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
  supplierId: string;
  /** Days until the oldest batch in stock expires; omitted for long-life goods. */
  expiresInDays?: number;
}

export const INGREDIENTS: Ingredient[] = [
  { code: "BRS-01", name: "Beras putih medium", category: "karbohidrat", type: "Beras", unit: "kg", location: "gudang-kering", stock: 420, minStock: 200, price: 14500, supplierId: "SUP-01" },
  { code: "TPG-01", name: "Tepung terigu", category: "karbohidrat", type: "Tepung", unit: "kg", location: "gudang-kering", stock: 25, minStock: 10, price: 11000, supplierId: "SUP-01" },
  { code: "AYM-01", name: "Ayam potong", category: "daging", type: "Ayam", unit: "kg", location: "chiller", stock: 48, minStock: 40, price: 36000, supplierId: "SUP-02", expiresInDays: 2 },
  { code: "AYM-02", name: "Fillet dada ayam", category: "daging", type: "Ayam", unit: "kg", location: "chiller", stock: 6, minStock: 15, price: 52000, supplierId: "SUP-02", expiresInDays: 2 },
  { code: "SPI-01", name: "Daging sapi has dalam", category: "daging", type: "Sapi", unit: "kg", location: "freezer", stock: 14, minStock: 8, price: 135000, supplierId: "SUP-02", expiresInDays: 60 },
  { code: "UDG-01", name: "Udang kupas", category: "seafood", type: "Udang", unit: "kg", location: "freezer", stock: 9, minStock: 5, price: 95000, supplierId: "SUP-04", expiresInDays: 45 },
  { code: "IKN-01", name: "Ikan tongkol", category: "seafood", type: "Ikan laut", unit: "kg", location: "freezer", stock: 12, minStock: 8, price: 38000, supplierId: "SUP-04", expiresInDays: 30 },
  { code: "TLR-01", name: "Telur ayam", category: "protein-nabati", type: "Telur", unit: "kg", location: "chiller", stock: 42, minStock: 15, price: 29000, supplierId: "SUP-02", expiresInDays: 10 },
  { code: "THU-01", name: "Tahu putih", category: "protein-nabati", type: "Tahu", unit: "pcs", location: "chiller", stock: 180, minStock: 100, price: 1500, supplierId: "SUP-03", expiresInDays: 2 },
  { code: "TMP-01", name: "Tempe papan", category: "protein-nabati", type: "Tempe", unit: "papan", location: "chiller", stock: 22, minStock: 15, price: 12000, supplierId: "SUP-03", expiresInDays: 2 },
  { code: "KKG-01", name: "Kangkung", category: "sayur", type: "Sayur daun", unit: "ikat", location: "chiller", stock: 40, minStock: 30, price: 4000, supplierId: "SUP-03", expiresInDays: 1 },
  { code: "BNC-01", name: "Buncis", category: "sayur", type: "Sayur polong", unit: "kg", location: "chiller", stock: 8, minStock: 10, price: 14000, supplierId: "SUP-03", expiresInDays: 3 },
  { code: "WRT-01", name: "Wortel", category: "sayur", type: "Umbi", unit: "kg", location: "chiller", stock: 15, minStock: 10, price: 12000, supplierId: "SUP-03", expiresInDays: 7 },
  { code: "TGE-01", name: "Tauge", category: "sayur", type: "Kecambah", unit: "kg", location: "chiller", stock: 5, minStock: 5, price: 9000, supplierId: "SUP-03", expiresInDays: 1 },
  { code: "BWM-01", name: "Bawang merah", category: "bumbu", type: "Bawang", unit: "kg", location: "gudang-kering", stock: 18, minStock: 10, price: 38000, supplierId: "SUP-03" },
  { code: "BWP-01", name: "Bawang putih", category: "bumbu", type: "Bawang", unit: "kg", location: "gudang-kering", stock: 12, minStock: 8, price: 34000, supplierId: "SUP-03" },
  { code: "CBM-01", name: "Cabai merah keriting", category: "bumbu", type: "Cabai", unit: "kg", location: "chiller", stock: 4, minStock: 5, price: 45000, supplierId: "SUP-03", expiresInDays: 4 },
  { code: "CBR-01", name: "Cabai rawit", category: "bumbu", type: "Cabai", unit: "kg", location: "chiller", stock: 1.5, minStock: 3, price: 55000, supplierId: "SUP-03", expiresInDays: 4 },
  { code: "MYK-01", name: "Minyak goreng", category: "kering", type: "Minyak", unit: "liter", location: "gudang-kering", stock: 60, minStock: 30, price: 17500, supplierId: "SUP-01" },
  { code: "GLA-01", name: "Gula pasir", category: "kering", type: "Gula", unit: "kg", location: "gudang-kering", stock: 20, minStock: 10, price: 17000, supplierId: "SUP-01" },
  { code: "KCP-01", name: "Kecap manis", category: "kering", type: "Saus & kecap", unit: "liter", location: "gudang-kering", stock: 9, minStock: 6, price: 28000, supplierId: "SUP-01" },
  { code: "JRK-01", name: "Jeruk manis", category: "buah", type: "Jeruk", unit: "kg", location: "chiller", stock: 25, minStock: 15, price: 22000, supplierId: "SUP-03", expiresInDays: 6 },
  { code: "SMK-01", name: "Semangka", category: "buah", type: "Melon & semangka", unit: "kg", location: "gudang-kering", stock: 40, minStock: 30, price: 9000, supplierId: "SUP-03", expiresInDays: 5 },
];

const BY_CODE = new Map(INGREDIENTS.map((item) => [item.code, item]));
const SUPPLIER_BY_ID = new Map(SUPPLIERS.map((s) => [s.id, s]));
const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getIngredient(code: string): Ingredient {
  const item = BY_CODE.get(code);
  if (!item) throw new Error(`Unknown sample ingredient ${code}`);
  return item;
}

export function getSupplier(id: string): Supplier {
  const supplier = SUPPLIER_BY_ID.get(id);
  if (!supplier) throw new Error(`Unknown sample supplier ${id}`);
  return supplier;
}

export function getCategory(id: CategoryId): IngredientCategory {
  return CATEGORY_BY_ID.get(id)!;
}

export type StockLevel = "habis" | "kurang" | "aman";

export function stockLevel(item: Pick<Ingredient, "stock" | "minStock">): StockLevel {
  if (item.stock <= 0) return "habis";
  return item.stock < item.minStock ? "kurang" : "aman";
}
