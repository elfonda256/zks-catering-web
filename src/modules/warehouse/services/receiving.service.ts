import type { GoodsReceivingRecord } from "../types/receiving.types";

export class ReceivingService {
  /**
   * Filter receiving records by status and search query.
   */
  static filterReceivingRecords(
    records: GoodsReceivingRecord[],
    status: string,
    search: string
  ): GoodsReceivingRecord[] {
    return records.filter((rec) => {
      const matchStatus = status === "ALL" || rec.status === status;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        rec.asnNumber.toLowerCase().includes(q) ||
        rec.poNumber.toLowerCase().includes(q) ||
        rec.supplierName.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }

  /**
   * Calculate QC acceptance rate percentage.
   */
  static calculateQCAcceptanceRate(records: GoodsReceivingRecord[]): number {
    let totalItems = 0;
    let acceptedItems = 0;
    records.forEach((r) => {
      r.items.forEach((item) => {
        totalItems += item.receivedQty;
        acceptedItems += item.acceptedQty;
      });
    });
    if (totalItems === 0) return 100;
    return Math.round((acceptedItems / totalItems) * 1000) / 10;
  }
}
