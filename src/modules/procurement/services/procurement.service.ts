export class ProcurementService {
  /**
   * Determine supplier performance level based on score.
   */
  static getSupplierRatingBadge(score: number): "Tier 1 - Preferred" | "Tier 2 - Verified" | "Under Review" {
    if (score >= 4.5) return "Tier 1 - Preferred";
    if (score >= 3.5) return "Tier 2 - Verified";
    return "Under Review";
  }
}
