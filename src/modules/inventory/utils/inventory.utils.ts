import { formatRupiah, formatNumber, formatDate, formatDateTime } from "@/shared/utils/formatters";

export { formatRupiah, formatNumber, formatDate, formatDateTime };

export function calculateStockAccuracy(systemCount: number, physicalCount: number): number {
  if (systemCount === 0 && physicalCount === 0) return 100;
  if (systemCount === 0) return 0;
  const variance = Math.abs(systemCount - physicalCount);
  const accuracy = Math.max(0, 100 - (variance / systemCount) * 100);
  return Math.round(accuracy * 10) / 10;
}
