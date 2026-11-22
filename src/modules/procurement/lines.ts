import { getIngredient, type Line } from "@/modules/sample-data";

/** A line with an agreed price (PO); without one, the last purchase price is the estimate (PR). */
export type PricedLine = Line & { price?: number };

export function lineTotal(lines: PricedLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty * (line.price ?? getIngredient(line.code).price), 0);
}
