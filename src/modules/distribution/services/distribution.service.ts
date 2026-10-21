import type { DeliveryRun } from "../types";

export class DistributionService {
  static filterRuns(runs: DeliveryRun[], status: string): DeliveryRun[] {
    if (status === "ALL") return runs;
    return runs.filter((r) => r.status === status);
  }
}
