/**
 * Sample procurement and warehouse transactions. `day` is relative to today
 * (0 = today, -1 = yesterday, 1 = tomorrow) so the sample never looks stale.
 */

import type { LocationId } from "./catalog";

export interface Line {
  code: string;
  qty: number;
}

export type PrStatus = "menunggu" | "disetujui" | "ditolak" | "selesai";

export interface PurchaseRequest {
  id: string;
  day: number;
  requestedBy: string;
  reason: string;
  neededInDays: number;
  status: PrStatus;
  lines: Line[];
  poId?: string;
}

export const PURCHASE_REQUESTS: PurchaseRequest[] = [
  {
    id: "PR-0012",
    day: 0,
    requestedBy: "Kepala dapur",
    reason: "Stok fillet ayam di bawah minimum untuk menu ayam bakar 2 hari ke depan.",
    neededInDays: 1,
    status: "menunggu",
    lines: [
      { code: "AYM-02", qty: 25 },
      { code: "AYM-01", qty: 40 },
    ],
  },
  {
    id: "PR-0011",
    day: -1,
    requestedBy: "Admin gudang",
    reason: "Belanja sayur dan cabai rutin untuk produksi besok.",
    neededInDays: 1,
    status: "disetujui",
    lines: [
      { code: "BNC-01", qty: 15 },
      { code: "WRT-01", qty: 10 },
      { code: "CBM-01", qty: 5 },
      { code: "CBR-01", qty: 3 },
    ],
    poId: "PO-0022",
  },
  {
    id: "PR-0010",
    day: -4,
    requestedBy: "Admin gudang",
    reason: "Isi ulang beras dan minyak bulanan.",
    neededInDays: 3,
    status: "selesai",
    lines: [
      { code: "BRS-01", qty: 200 },
      { code: "MYK-01", qty: 40 },
    ],
    poId: "PO-0020",
  },
];

export type PoStatus = "draf" | "dikirim" | "diterima-sebagian" | "diterima";

export interface PurchaseOrder {
  id: string;
  day: number;
  supplierId: string;
  /** Expected delivery day, relative to today. */
  deliveryDay: number;
  status: PoStatus;
  lines: (Line & { price: number })[];
  prId?: string;
}

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "PO-0022",
    day: -1,
    supplierId: "SUP-03",
    deliveryDay: 1,
    status: "dikirim",
    prId: "PR-0011",
    lines: [
      { code: "BNC-01", qty: 15, price: 14000 },
      { code: "WRT-01", qty: 10, price: 12000 },
      { code: "CBM-01", qty: 5, price: 45000 },
      { code: "CBR-01", qty: 3, price: 55000 },
    ],
  },
  {
    id: "PO-0021",
    day: -2,
    supplierId: "SUP-02",
    deliveryDay: -1,
    status: "diterima-sebagian",
    lines: [
      { code: "AYM-01", qty: 60, price: 36000 },
      { code: "TLR-01", qty: 30, price: 29000 },
    ],
  },
  {
    id: "PO-0020",
    day: -4,
    supplierId: "SUP-01",
    deliveryDay: -2,
    status: "diterima",
    prId: "PR-0010",
    lines: [
      { code: "BRS-01", qty: 200, price: 14500 },
      { code: "MYK-01", qty: 40, price: 17500 },
    ],
  },
];

export interface ReceiptLine extends Line {
  rejectedQty: number;
  note?: string;
}

export interface GoodsReceipt {
  id: string;
  day: number;
  poId: string;
  receivedBy: string;
  location: LocationId;
  lines: ReceiptLine[];
}

export const GOODS_RECEIPTS: GoodsReceipt[] = [
  {
    id: "GRN-0032",
    day: -1,
    poId: "PO-0021",
    receivedBy: "Admin gudang",
    location: "chiller",
    lines: [
      { code: "AYM-01", qty: 55, rejectedQty: 5, note: "5 kg ditolak, suhu daging 9 °C saat tiba (batas 4 °C)." },
      { code: "TLR-01", qty: 30, rejectedQty: 0 },
    ],
  },
  {
    id: "GRN-0031",
    day: -2,
    poId: "PO-0020",
    receivedBy: "Admin gudang",
    location: "gudang-kering",
    lines: [
      { code: "BRS-01", qty: 200, rejectedQty: 0 },
      { code: "MYK-01", qty: 40, rejectedQty: 0 },
    ],
  },
];

export type TransferStatus = "direncanakan" | "selesai";

export interface StockTransfer {
  id: string;
  day: number;
  from: LocationId;
  to: LocationId;
  reason: string;
  status: TransferStatus;
  lines: Line[];
}

export const STOCK_TRANSFERS: StockTransfer[] = [
  {
    id: "TRF-0009",
    day: 0,
    from: "freezer",
    to: "chiller",
    reason: "Thawing udang untuk Paket Eksekutif besok.",
    status: "direncanakan",
    lines: [{ code: "UDG-01", qty: 4 }],
  },
  {
    id: "TRF-0008",
    day: 0,
    from: "gudang-kering",
    to: "dapur",
    reason: "Bahan produksi pagi (Paket Hemat 350 porsi).",
    status: "selesai",
    lines: [
      { code: "BRS-01", qty: 42 },
      { code: "MYK-01", qty: 6 },
    ],
  },
  {
    id: "TRF-0007",
    day: -1,
    from: "freezer",
    to: "chiller",
    reason: "Thawing daging sapi untuk rendang.",
    status: "selesai",
    lines: [{ code: "SPI-01", qty: 6 }],
  },
];

export type MovementType = "masuk" | "keluar" | "transfer" | "penyesuaian";

export interface StockMovement {
  id: string;
  day: number;
  time: string;
  code: string;
  type: MovementType;
  /** Positive adds stock, negative removes it. Transfers move stock without changing the total. */
  qty: number;
  reference: string;
  note: string;
}

export const STOCK_MOVEMENTS: StockMovement[] = [
  { id: "MV-0148", day: 0, time: "05.40", code: "BRS-01", type: "transfer", qty: 42, reference: "TRF-0008", note: "Gudang kering → Dapur produksi" },
  { id: "MV-0147", day: 0, time: "05.40", code: "MYK-01", type: "transfer", qty: 6, reference: "TRF-0008", note: "Gudang kering → Dapur produksi" },
  { id: "MV-0146", day: 0, time: "05.30", code: "AYM-01", type: "keluar", qty: -35, reference: "WO-0101", note: "Produksi Paket Hemat 350 porsi" },
  { id: "MV-0145", day: -1, time: "14.10", code: "AYM-01", type: "masuk", qty: 55, reference: "GRN-0032", note: "Dari PO-0021, 5 kg ditolak QC" },
  { id: "MV-0144", day: -1, time: "14.10", code: "TLR-01", type: "masuk", qty: 30, reference: "GRN-0032", note: "Dari PO-0021" },
  { id: "MV-0143", day: -1, time: "09.00", code: "SPI-01", type: "transfer", qty: 6, reference: "TRF-0007", note: "Freezer → Chiller" },
  { id: "MV-0142", day: -2, time: "10.20", code: "BRS-01", type: "masuk", qty: 200, reference: "GRN-0031", note: "Dari PO-0020" },
  { id: "MV-0141", day: -2, time: "10.20", code: "MYK-01", type: "masuk", qty: 40, reference: "GRN-0031", note: "Dari PO-0020" },
  { id: "MV-0140", day: -3, time: "16.00", code: "AYM-01", type: "penyesuaian", qty: -1.2, reference: "OPN-0004", note: "Selisih stock opname chiller" },
  { id: "MV-0139", day: -3, time: "16.00", code: "THU-01", type: "penyesuaian", qty: -6, reference: "OPN-0004", note: "Tahu hancur, dibuang" },
];

export type OpnameStatus = "dijadwalkan" | "selesai";

export interface StockOpname {
  id: string;
  day: number;
  location: LocationId;
  countedBy: string;
  status: OpnameStatus;
  lines: { code: string; systemQty: number; countedQty: number | null; note?: string }[];
}

export const STOCK_OPNAMES: StockOpname[] = [
  {
    id: "OPN-0005",
    day: 0,
    location: "gudang-kering",
    countedBy: "Admin gudang",
    status: "dijadwalkan",
    lines: [
      { code: "BRS-01", systemQty: 420, countedQty: null },
      { code: "MYK-01", systemQty: 60, countedQty: null },
      { code: "GLA-01", systemQty: 20, countedQty: null },
      { code: "BWM-01", systemQty: 18, countedQty: null },
    ],
  },
  {
    id: "OPN-0004",
    day: -3,
    location: "chiller",
    countedBy: "Admin gudang",
    status: "selesai",
    lines: [
      { code: "AYM-01", systemQty: 29.2, countedQty: 28, note: "Susut air setelah 2 hari simpan." },
      { code: "THU-01", systemQty: 186, countedQty: 180, note: "6 pcs hancur, dibuang." },
      { code: "TLR-01", systemQty: 12, countedQty: 12 },
      { code: "JRK-01", systemQty: 25, countedQty: 25 },
    ],
  },
];
