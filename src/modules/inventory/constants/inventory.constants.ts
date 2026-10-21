import type { ItemCategory } from "../types/item.types";

export const ITEM_CATEGORIES: ItemCategory[] = [
  "Daging & Unggas",
  "Beras & Biji-bijian",
  "Minyak & Lemak",
  "Bumbu & Rempah",
  "Sayuran & Buah",
  "Packaging & Box",
  "Bahan Tambahan",
];

export const INVENTORY_WAREHOUSES = [
  { id: "WH-COLD-01", name: "Cold Storage Utama (Walk-in Freezer)", tempSpec: "-18°C ~ -22°C" },
  { id: "WH-CHILL-01", name: "Chiller Sentral Dapur", tempSpec: "0°C ~ +4°C" },
  { id: "WH-DRY-01", name: "Gudang Kering & Bahan Baku Pokok", tempSpec: "Ambient (24°C)" },
  { id: "WH-PACK-01", name: "Gudang Logistik & Kemasan", tempSpec: "Ambient" },
] as const;
