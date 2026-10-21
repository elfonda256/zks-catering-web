import type { WarehouseTransferRecord } from "../types/transfer.types";

export class TransferService {
  /**
   * Filter transfer records by status and search query.
   */
  static filterTransfers(
    records: WarehouseTransferRecord[],
    status: string,
    search: string
  ): WarehouseTransferRecord[] {
    return records.filter((rec) => {
      const matchStatus = status === "ALL" || rec.status === status;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        rec.transferCode.toLowerCase().includes(q) ||
        rec.fromWarehouse.toLowerCase().includes(q) ||
        rec.toWarehouse.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }
}
