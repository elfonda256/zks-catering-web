/** Display helpers for sample data whose dates are stored relative to today. */

export function relativeDay(day: number): string {
  if (day === 0) return "Hari ini";
  if (day === -1) return "Kemarin";
  if (day === 1) return "Besok";
  return day < 0 ? `${-day} hari lalu` : `${day} hari lagi`;
}

/** Quantities keep up to 2 decimals, Indonesian style (1,5 kg). */
export function formatQty(qty: number, unit: string): string {
  return `${qty.toLocaleString("id-ID", { maximumFractionDigits: 2 })} ${unit}`;
}

/** Signed quantity for a stock movement; transfers move stock without changing the total. */
export function formatMovementQty(type: string, qty: number, unit: string): string {
  if (type === "transfer") return `${formatQty(qty, unit)} dipindah`;
  return `${qty > 0 ? "+" : ""}${formatQty(qty, unit)}`;
}
