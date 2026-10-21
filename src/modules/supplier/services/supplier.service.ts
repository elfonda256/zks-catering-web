import type {
  Supplier,
  SupplierDirectoryFilter,
  SupplierScorecard,
  SupplierTier,
  SupplierRisk,
} from "../types";

export interface SupplierExecutiveMetrics {
  totalSuppliers: number;
  activeSuppliers: number;
  preferredSuppliers: number;
  reviewRequiredCount: number;
  averageRating: number;
  monthlyProcurementTotal: number;
}

export class SupplierService {
  /**
   * Filter supplier directory by search term, category, status, and tier.
   */
  static filterSuppliers(
    suppliers: Supplier[],
    filter: SupplierDirectoryFilter
  ): Supplier[] {
    return suppliers.filter((s) => {
      // Category filter
      const matchCategory =
        !filter.category || filter.category === "ALL" || s.category === filter.category;

      // Status filter
      const matchStatus =
        !filter.status || filter.status === "ALL" || s.status === filter.status;

      // Tier filter
      const matchTier =
        !filter.tier || filter.tier === "ALL" || s.scorecard.tier === filter.tier;

      // Multi-field search
      const q = filter.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.npwp.toLowerCase().includes(q) ||
        s.picName.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);

      return matchCategory && matchStatus && matchTier && matchSearch;
    });
  }

  /**
   * Calculate executive summary statistics from supplier list.
   */
  static calculateExecutiveSummary(suppliers: Supplier[]): SupplierExecutiveMetrics {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(
      (s) => s.status === "ACTIVE" || s.status === "PREFERRED"
    ).length;
    const preferredSuppliers = suppliers.filter((s) => s.status === "PREFERRED").length;
    const reviewRequiredCount = suppliers.filter(
      (s) => s.status === "REVIEW" || s.risk.riskLevel === "HIGH" || s.risk.expiredDocuments
    ).length;

    const totalScores = suppliers.reduce((acc, curr) => acc + curr.scorecard.overallScore, 0);
    const averageRating = totalSuppliers > 0 ? Math.round((totalScores / totalSuppliers) * 10) / 10 : 0;

    // Sum monthly procurement values from purchase history
    let monthlyProcurementTotal = 0;
    suppliers.forEach((s) => {
      s.purchaseHistory.forEach((po) => {
        monthlyProcurementTotal += po.totalValue;
      });
    });

    return {
      totalSuppliers,
      activeSuppliers,
      preferredSuppliers,
      reviewRequiredCount,
      averageRating,
      monthlyProcurementTotal,
    };
  }

  /**
   * Calculate weighted supplier scorecard and determine tier.
   */
  static calculateWeightedScorecard(
    scores: Omit<SupplierScorecard, "overallScore" | "tier">
  ): SupplierScorecard {
    const qualityWeighted = scores.qualityScore * 0.3;
    const deliveryWeighted = scores.deliveryScore * 0.25;
    const priceWeighted = scores.priceScore * 0.2;
    const serviceWeighted = scores.serviceScore * 0.15;
    const complianceWeighted = scores.complianceScore * 0.1;

    const overallScore =
      Math.round(
        (qualityWeighted + deliveryWeighted + priceWeighted + serviceWeighted + complianceWeighted) * 10
      ) / 10;

    let tier: SupplierTier = "BRONZE";
    if (overallScore >= 92) tier = "GOLD";
    else if (overallScore >= 80) tier = "SILVER";

    return {
      ...scores,
      overallScore,
      tier,
    };
  }

  /**
   * Assess operational risk level from risk factors.
   */
  static assessRisk(risk: Omit<SupplierRisk, "riskLevel">): "LOW" | "MEDIUM" | "HIGH" {
    if (risk.expiredDocuments || risk.highComplaintRate) return "HIGH";
    if (risk.lateDeliveries || risk.singleSourceRisk || risk.priceIncreaseRisk) return "MEDIUM";
    return "LOW";
  }
}
