import type { PurchaseOrderRecord, POLineItem } from "../types/po.types";

export class PurchaseOrderService {
  /**
   * Compute line item totals including VAT (PPN 11%).
   */
  static calculateItemTotals(qty: number, unitPrice: number, taxRate: number = 0.11): Pick<POLineItem, "subtotal" | "taxAmount" | "totalPrice"> {
    const subtotal = qty * unitPrice;
    const taxAmount = Math.round(subtotal * taxRate);
    const totalPrice = subtotal + taxAmount;
    return { subtotal, taxAmount, totalPrice };
  }

  /**
   * Filter PO records by status and search keyword.
   */
  static filterPOs(records: PurchaseOrderRecord[], status: string, search: string): PurchaseOrderRecord[] {
    return records.filter((po) => {
      const matchStatus = status === "ALL" || po.status === status;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        (po.prNumberRef && po.prNumberRef.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }
}
