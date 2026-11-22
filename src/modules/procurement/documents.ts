/** Procurement rules shared by the server actions and the views. Pure functions. */

import type { OrderStatus } from "./types";

/** Display number derived from the database id: PR-0007, PO-0012, GRN-0003. */
export function documentCode(prefix: "PR" | "PO" | "GRN", id: number): string {
  return `${prefix}-${String(id).padStart(4, "0")}`;
}

export function lineTotal(lines: { quantity: number; unitPrice: number }[]): number {
  return Math.round(lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0));
}

const EPSILON = 1e-9;

export function remainingQuantity(line: { quantity: number; receivedQuantity: number }): number {
  return Math.max(0, Math.round((line.quantity - line.receivedQuantity) * 1000) / 1000);
}

/** Status of a PO from what has been accepted on each line. */
export function orderStatusFromLines(lines: { quantity: number; receivedQuantity: number }[]): OrderStatus {
  if (lines.every((line) => line.receivedQuantity + EPSILON >= line.quantity)) return "RECEIVED";
  return lines.some((line) => line.receivedQuantity > 0) ? "PARTIALLY_RECEIVED" : "SENT";
}

/**
 * Checks a receipt against the PO: every line must belong to it, and accepted goods may not
 * exceed what is still outstanding. Returns an error message, or null when it is valid.
 */
export function receiptError(
  orderLines: { id: number; quantity: number; receivedQuantity: number; ingredientName: string }[],
  receipt: { orderLineId: number; accepted: number }[]
): string | null {
  const byId = new Map(orderLines.map((line) => [line.id, line]));
  for (const line of receipt) {
    const orderLine = byId.get(line.orderLineId);
    if (!orderLine) return "Ada baris yang bukan milik PO ini. Muat ulang halaman.";
    if (line.accepted > remainingQuantity(orderLine) + EPSILON) {
      return `${orderLine.ingredientName}: jumlah diterima melebihi sisa PO (${remainingQuantity(orderLine).toLocaleString("id-ID", { maximumFractionDigits: 3 })}).`;
    }
  }
  return null;
}
