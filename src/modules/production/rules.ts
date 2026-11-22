/** Production rules shared by the server actions and the views. Pure functions. */

import type { ProductionShift, ProductionStatus } from "./types";

/** The kitchen moves an order forward one step at a time. */
const NEXT_STATUS: Partial<Record<ProductionStatus, ProductionStatus>> = {
  SCHEDULED: "PREPARING",
  PREPARING: "COOKING",
  COOKING: "PACKING",
  PACKING: "READY",
};

export function nextProductionStatus(status: ProductionStatus): ProductionStatus | null {
  return NEXT_STATUS[status] ?? null;
}

/** Before cooking starts, nothing has left stock, so the order can still be cancelled. */
export function isBeforeCooking(status: ProductionStatus): boolean {
  return status === "SCHEDULED" || status === "PREPARING";
}

export function productionCode(id: number): string {
  return `WO-${String(id).padStart(4, "0")}`;
}

/** Total of each ingredient for a number of portions, rounded to the 3 decimals stock keeps. */
export function materialRequirements(
  recipe: { ingredientId: number; quantityPerPortion: number }[],
  portions: number
): { ingredientId: number; quantity: number }[] {
  return recipe
    .map((line) => ({ ingredientId: line.ingredientId, quantity: Math.round(line.quantityPerPortion * portions * 1000) / 1000 }))
    .filter((line) => line.quantity > 0);
}

export function costPerPortion(lines: { quantityPerPortion: number; lastPrice: number }[]): number {
  return lines.reduce((sum, line) => sum + line.quantityPerPortion * line.lastPrice, 0);
}

export const SHIFT_LABELS: Record<ProductionShift, string> = {
  MORNING: "Pagi",
  AFTERNOON: "Siang",
  NIGHT: "Malam",
};
