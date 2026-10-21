import type { ExecutiveReportSummary } from "../types";

export class ReportsService {
  static getDummyExecutiveSummary(): ExecutiveReportSummary {
    return {
      period: "Oktober 2026",
      totalRevenue: 2845000000,
      foodCostPercentage: 32.4,
      inventoryAccuracyRate: 99.4,
      averageMealCost: 24500,
    };
  }
}
