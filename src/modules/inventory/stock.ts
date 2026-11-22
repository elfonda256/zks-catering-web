import type { BadgeVariant } from "@/shared/components/ui/Badge";
import type { StockLevel } from "@/modules/sample-data";

export const STOCK_LEVEL_BADGE: Record<StockLevel, { label: string; variant: BadgeVariant }> = {
  aman: { label: "Aman", variant: "completed" },
  kurang: { label: "Di bawah minimum", variant: "low_stock" },
  habis: { label: "Habis", variant: "critical" },
};

/** Fresh goods whose oldest batch expires within this many days are flagged. */
export const EXPIRY_WARNING_DAYS = 2;
