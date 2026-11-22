/**
 * Daily menu rules built on the public package schedule (src/data/catering-data.ts).
 * Pure functions: safe for the browser, the server, and tests.
 */

import { MENU_PACKAGES } from "@/data/catering-data";

const WEEKDAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

/** Indonesian weekday name of a WIB calendar day. */
export function wibWeekday(date: Date): (typeof WEEKDAYS)[number] {
  return WEEKDAYS[new Date(date.getTime() + 7 * 60 * 60 * 1000).getUTCDay()];
}

/** The menu variations a package serves on a weekday (empty when there is none, e.g. Sunday). */
export function menuVariations(packagePrice: number, weekday: string): string[][] {
  return MENU_PACKAGES[packagePrice]?.schedule[weekday] ?? [];
}

/** Dishes of one variation (1-based), or null when that variation does not exist. */
export function menuDishes(packagePrice: number, weekday: string, variation: number): string[] | null {
  return menuVariations(packagePrice, weekday)[variation - 1] ?? null;
}

/** Every dish name in every package schedule, sorted, without duplicates. */
export function allScheduledDishes(): string[] {
  const names = new Set<string>();
  for (const pkg of Object.values(MENU_PACKAGES)) {
    for (const variations of Object.values(pkg.schedule)) {
      for (const dishes of variations) for (const dish of dishes) names.add(dish);
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, "id"));
}

/** Adds up several recipes into one per-portion list; the same ingredient is summed. */
export function combineRecipes(recipes: { ingredientId: number; quantityPerPortion: number }[][]): { ingredientId: number; quantityPerPortion: number }[] {
  const totals = new Map<number, number>();
  for (const recipe of recipes) {
    for (const line of recipe) totals.set(line.ingredientId, (totals.get(line.ingredientId) ?? 0) + line.quantityPerPortion);
  }
  return [...totals.entries()].map(([ingredientId, quantityPerPortion]) => ({ ingredientId, quantityPerPortion: Math.round(quantityPerPortion * 1000) / 1000 }));
}
