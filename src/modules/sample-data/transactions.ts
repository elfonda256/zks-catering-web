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
