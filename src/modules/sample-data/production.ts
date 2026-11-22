/**
 * Sample recipes, production schedule, kitchen checks and walk-in orders.
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

export type WorkOrderStatus = "dijadwalkan" | "persiapan" | "dimasak" | "packing" | "siap-kirim";

/** Orders in these statuses have not taken their ingredients from stock yet. */
export const WORK_ORDER_STATUSES_BEFORE_COOKING: WorkOrderStatus[] = ["dijadwalkan", "persiapan"];

export interface WorkOrder {
  id: string;
  recipeId: string;
  portions: number;
  customer: string;
  /** Production day relative to today. */
  day: number;
  shift: "Pagi" | "Siang" | "Malam";
  deliveryTime: string;
  status: WorkOrderStatus;
}

export const WORK_ORDERS: WorkOrder[] = [
  { id: "WO-0101", recipeId: "RSP-HEMAT", portions: 350, customer: "Pabrik komponen, Kawasan KIIC", day: 0, shift: "Pagi", deliveryTime: "11.30", status: "dimasak" },
  { id: "WO-0102", recipeId: "RSP-FAVORIT", portions: 120, customer: "Kantor administrasi, Suryacipta", day: 0, shift: "Siang", deliveryTime: "12.00", status: "persiapan" },
  { id: "WO-0103", recipeId: "RSP-HEMAT", portions: 80, customer: "Lembur malam, Kawasan KIIC", day: 0, shift: "Malam", deliveryTime: "19.00", status: "dijadwalkan" },
  { id: "WO-0104", recipeId: "RSP-EKSEKUTIF", portions: 60, customer: "Rapat direksi, Karawang Barat", day: 1, shift: "Siang", deliveryTime: "12.00", status: "dijadwalkan" },
];

export interface FoodSafetyCheck {
  id: string;
  time: string;
  point: string;
  reading: string;
  limit: string;
  ok: boolean;
  checkedBy: string;
}

export const FOOD_SAFETY_CHECKS: FoodSafetyCheck[] = [
  { id: "CHK-1", time: "05.00", point: "Suhu chiller", reading: "3 °C", limit: "0–4 °C", ok: true, checkedBy: "Kepala dapur" },
  { id: "CHK-2", time: "05.00", point: "Suhu freezer", reading: "−19 °C", limit: "≤ −18 °C", ok: true, checkedBy: "Kepala dapur" },
  { id: "CHK-3", time: "09.45", point: "Suhu inti ayam goreng (WO-0101)", reading: "78 °C", limit: "≥ 75 °C", ok: true, checkedBy: "Juru masak" },
  { id: "CHK-4", time: "10.30", point: "Suhu nasi saat packing (WO-0101)", reading: "58 °C", limit: "≥ 60 °C", ok: false, checkedBy: "Juru masak" },
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
