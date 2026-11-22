/**
 * Starter ingredient catalog and package recipes, used until the client sends its own warehouse
 * data. Every row can be edited or deactivated in the admin; the seed never overwrites edits.
 *
 * Prices are per unit in rupiah. "SP2KP" = Kemendag retail monitoring for Jawa Barat,
 * 19 Nov 2026 (via Databoks); "TEPAS" = Diskominfo Jawa Barat dashboard, Oct 2026 (via Databoks);
 * "perkiraan" = no public figure found, estimated: confirm with the client.
 */

import type { CategoryId, LocationId } from "./master-data";

export type PriceSource = "SP2KP Jabar 19 Nov 2026" | "TEPAS Jabar Okt 2026" | "perkiraan";

export interface StarterIngredient {
  code: string;
  name: string;
  category: CategoryId;
  /** One of the category's kinds in master-data.ts. */
  type: string;
  unit: string;
  location: LocationId;
  minStock: number;
  lastPrice: number;
  priceSource: PriceSource;
}

export const STARTER_INGREDIENTS: StarterIngredient[] = [
  { code: "BRS-01", name: "Beras medium", category: "karbohidrat", type: "Beras", unit: "kg", location: "gudang-kering", minStock: 200, lastPrice: 13300, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "TPG-01", name: "Tepung terigu", category: "karbohidrat", type: "Tepung", unit: "kg", location: "gudang-kering", minStock: 10, lastPrice: 12000, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "AYM-01", name: "Daging ayam ras (potong)", category: "daging", type: "Ayam", unit: "kg", location: "chiller", minStock: 40, lastPrice: 36400, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "AYM-02", name: "Fillet dada ayam", category: "daging", type: "Ayam", unit: "kg", location: "chiller", minStock: 15, lastPrice: 52000, priceSource: "perkiraan" },
  { code: "SPI-01", name: "Daging sapi paha belakang", category: "daging", type: "Sapi", unit: "kg", location: "freezer", minStock: 8, lastPrice: 144400, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "UDG-01", name: "Udang segar", category: "seafood", type: "Udang", unit: "kg", location: "freezer", minStock: 5, lastPrice: 76300, priceSource: "TEPAS Jabar Okt 2026" },
  { code: "IKN-01", name: "Ikan tongkol", category: "seafood", type: "Ikan laut", unit: "kg", location: "freezer", minStock: 8, lastPrice: 42700, priceSource: "TEPAS Jabar Okt 2026" },
  { code: "TLR-01", name: "Telur ayam ras", category: "protein-nabati", type: "Telur", unit: "kg", location: "chiller", minStock: 15, lastPrice: 24600, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "THU-01", name: "Tahu putih", category: "protein-nabati", type: "Tahu", unit: "pcs", location: "chiller", minStock: 100, lastPrice: 1500, priceSource: "perkiraan" },
  { code: "TMP-01", name: "Tempe papan", category: "protein-nabati", type: "Tempe", unit: "papan", location: "chiller", minStock: 15, lastPrice: 12000, priceSource: "perkiraan" },
  { code: "KKG-01", name: "Kangkung", category: "sayur", type: "Sayur daun", unit: "ikat", location: "chiller", minStock: 30, lastPrice: 4000, priceSource: "perkiraan" },
  { code: "BNC-01", name: "Buncis", category: "sayur", type: "Sayur polong", unit: "kg", location: "chiller", minStock: 10, lastPrice: 14000, priceSource: "perkiraan" },
  { code: "WRT-01", name: "Wortel", category: "sayur", type: "Umbi", unit: "kg", location: "chiller", minStock: 10, lastPrice: 12000, priceSource: "perkiraan" },
  { code: "TGE-01", name: "Tauge", category: "sayur", type: "Kecambah", unit: "kg", location: "chiller", minStock: 5, lastPrice: 9000, priceSource: "perkiraan" },
  { code: "BWM-01", name: "Bawang merah", category: "bumbu", type: "Bawang", unit: "kg", location: "gudang-kering", minStock: 10, lastPrice: 33100, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "BWP-01", name: "Bawang putih honan", category: "bumbu", type: "Bawang", unit: "kg", location: "gudang-kering", minStock: 8, lastPrice: 32800, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "CBM-01", name: "Cabai merah keriting", category: "bumbu", type: "Cabai", unit: "kg", location: "chiller", minStock: 5, lastPrice: 58100, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "CBR-01", name: "Cabai rawit merah", category: "bumbu", type: "Cabai", unit: "kg", location: "chiller", minStock: 3, lastPrice: 69100, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "MYK-01", name: "Minyak goreng sawit curah", category: "kering", type: "Minyak", unit: "liter", location: "gudang-kering", minStock: 30, lastPrice: 19700, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "GLA-01", name: "Gula pasir curah", category: "kering", type: "Gula", unit: "kg", location: "gudang-kering", minStock: 10, lastPrice: 18200, priceSource: "SP2KP Jabar 19 Nov 2026" },
  { code: "KCP-01", name: "Kecap manis", category: "kering", type: "Saus & kecap", unit: "liter", location: "gudang-kering", minStock: 6, lastPrice: 28000, priceSource: "perkiraan" },
  { code: "JRK-01", name: "Jeruk manis", category: "buah", type: "Jeruk", unit: "kg", location: "chiller", minStock: 15, lastPrice: 22800, priceSource: "TEPAS Jabar Okt 2026" },
  { code: "SMK-01", name: "Semangka", category: "buah", type: "Melon & semangka", unit: "kg", location: "gudang-kering", minStock: 30, lastPrice: 9000, priceSource: "perkiraan" },
];

/** Ingredient quantity per portion for each public package (by price), in the ingredient's unit. */
export const STARTER_RECIPES: Record<number, { code: string; quantityPerPortion: number }[]> = {
  17000: [
    { code: "BRS-01", quantityPerPortion: 0.12 },
    { code: "AYM-01", quantityPerPortion: 0.1 },
    { code: "TMP-01", quantityPerPortion: 0.05 },
    { code: "BNC-01", quantityPerPortion: 0.03 },
    { code: "CBM-01", quantityPerPortion: 0.005 },
    { code: "MYK-01", quantityPerPortion: 0.015 },
    { code: "SMK-01", quantityPerPortion: 0.08 },
  ],
  20000: [
    { code: "BRS-01", quantityPerPortion: 0.12 },
    { code: "SPI-01", quantityPerPortion: 0.02 },
    { code: "AYM-02", quantityPerPortion: 0.05 },
    { code: "KCP-01", quantityPerPortion: 0.01 },
    { code: "BNC-01", quantityPerPortion: 0.04 },
    { code: "BWM-01", quantityPerPortion: 0.01 },
    { code: "CBM-01", quantityPerPortion: 0.008 },
    { code: "JRK-01", quantityPerPortion: 0.05 },
  ],
  25000: [
    { code: "BRS-01", quantityPerPortion: 0.13 },
    { code: "UDG-01", quantityPerPortion: 0.035 },
    { code: "SPI-01", quantityPerPortion: 0.03 },
    { code: "TLR-01", quantityPerPortion: 0.03 },
    { code: "CBR-01", quantityPerPortion: 0.005 },
    { code: "BWM-01", quantityPerPortion: 0.01 },
    { code: "MYK-01", quantityPerPortion: 0.02 },
    { code: "SMK-01", quantityPerPortion: 0.1 },
  ],
};
