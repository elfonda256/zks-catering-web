import type { PurchaseRequestRecord } from "../types/pr.types";

export class PurchaseRequestService {
  /**
   * Filter PR records by status, urgency, and search keyword.
   */
  static filterPRs(
    records: PurchaseRequestRecord[],
    status: string,
    urgency: string,
    search: string
  ): PurchaseRequestRecord[] {
    return records.filter((pr) => {
      const matchStatus = status === "ALL" || pr.status === status;
      const matchUrgency = urgency === "ALL" || pr.urgency === urgency;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        pr.prNumber.toLowerCase().includes(q) ||
        pr.requesterName.toLowerCase().includes(q) ||
        pr.department.toLowerCase().includes(q);
      return matchStatus && matchUrgency && matchSearch;
    });
  }
}
