/**
 * Ingredient categories, their kinds (jenis) and storage locations.
 * Single source for the database seed (scripts/seed-inventory.ts) and the sample data.
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

