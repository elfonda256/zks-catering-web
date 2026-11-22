/**
 * Sample recipes and walk-in orders.
 * Recipes match the three public menu packages (see src/data/catering-data.ts).
 */

/** An ingredient code and quantity. */
export interface Line {
  code: string;
  qty: number;
}

export interface Recipe {
  id: string;
  packagePrice: number;
  name: string;
  /** Menu served in this sample week. */
  menu: string;
  /** Ingredient quantity per portion, in the ingredient's unit. */
  perPortion: Line[];
}

export const RECIPES: Recipe[] = [
  {
    id: "RSP-HEMAT",
    packagePrice: 17000,
    name: "Paket Hemat Industri",
    menu: "Nasi putih, ayam goreng, tempe orek, tumis buncis, sambal, semangka",
    perPortion: [
      { code: "BRS-01", qty: 0.12 },
      { code: "AYM-01", qty: 0.1 },
      { code: "TMP-01", qty: 0.05 },
      { code: "BNC-01", qty: 0.03 },
      { code: "CBM-01", qty: 0.005 },
      { code: "MYK-01", qty: 0.015 },
      { code: "SMK-01", qty: 0.08 },
    ],
  },
  {
    id: "RSP-FAVORIT",
    packagePrice: 20000,
    name: "Paket Favorit Korporat",
    menu: "Nasi putih, rendang, ayam bakar kecap, buncis, sambal, jeruk",
    perPortion: [
      { code: "BRS-01", qty: 0.12 },
      { code: "SPI-01", qty: 0.02 },
      { code: "AYM-02", qty: 0.05 },
      { code: "KCP-01", qty: 0.01 },
      { code: "BNC-01", qty: 0.04 },
      { code: "BWM-01", qty: 0.01 },
      { code: "CBM-01", qty: 0.008 },
      { code: "JRK-01", qty: 0.05 },
    ],
  },
  {
    id: "RSP-EKSEKUTIF",
    packagePrice: 25000,
    name: "Paket Eksekutif & Event",
    menu: "Nasi kuning, udang balado, sapi lada hitam, telur, sambal matah, semangka",
    perPortion: [
      { code: "BRS-01", qty: 0.13 },
      { code: "UDG-01", qty: 0.035 },
      { code: "SPI-01", qty: 0.03 },
      { code: "TLR-01", qty: 0.03 },
      { code: "CBR-01", qty: 0.005 },
      { code: "BWM-01", qty: 0.01 },
      { code: "MYK-01", qty: 0.02 },
      { code: "SMK-01", qty: 0.1 },
    ],
  },
];

export type DirectOrderStatus = "baru" | "dikonfirmasi" | "selesai";

export interface DirectOrder {
  id: string;
  /** Event day relative to today. */
  day: number;
  customer: string;
  contact: string;
  channel: "Telepon" | "WhatsApp" | "Datang langsung";
  recipeId: string;
  portions: number;
  deliveryTime: string;
  note: string;
  status: DirectOrderStatus;
}

export const DIRECT_ORDERS: DirectOrder[] = [
  {
    id: "DO-0031",
    day: 0,
    customer: "Lembur malam, Kawasan KIIC",
    contact: "Pak Yusuf (HRD)",
    channel: "WhatsApp",
    recipeId: "RSP-HEMAT",
    portions: 80,
    deliveryTime: "19.00",
    note: "Tambahan lembur mendadak, diantar ke pos satpam gerbang 2.",
    status: "dikonfirmasi",
  },
  {
    id: "DO-0032",
    day: 1,
    customer: "Rapat direksi, Karawang Barat",
    contact: "Bu Sari (sekretaris)",
    channel: "Telepon",
    recipeId: "RSP-EKSEKUTIF",
    portions: 60,
    deliveryTime: "12.00",
    note: "Prasmanan, perlu 2 wadah saji panas.",
    status: "dikonfirmasi",
  },
  {
    id: "DO-0033",
    day: 2,
    customer: "Syukuran gudang baru, Cikampek",
    contact: "Pak Anton",
    channel: "Datang langsung",
    recipeId: "RSP-FAVORIT",
    portions: 150,
    deliveryTime: "11.00",
    note: "Menunggu konfirmasi jumlah akhir H-1.",
    status: "baru",
  },
];
