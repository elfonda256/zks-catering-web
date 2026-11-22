import { RECIPES, getIngredient, type Recipe, type WorkOrder } from "@/modules/sample-data";

export function getRecipe(id: string): Recipe {
  const recipe = RECIPES.find((r) => r.id === id);
  if (!recipe) throw new Error(`Unknown sample recipe ${id}`);
  return recipe;
}

/** Ingredient cost of one portion, at last purchase prices. */
export function costPerPortion(recipe: Recipe): number {
  return recipe.perPortion.reduce((sum, line) => sum + line.qty * getIngredient(line.code).price, 0);
}

export interface MaterialNeed {
  code: string;
  required: number;
  stock: number;
  short: boolean;
}

/** Total ingredients for a set of work orders, compared with current stock. */
export function materialNeeds(orders: WorkOrder[]): MaterialNeed[] {
  const totals = new Map<string, number>();
  for (const order of orders) {
    for (const line of getRecipe(order.recipeId).perPortion) {
      totals.set(line.code, (totals.get(line.code) ?? 0) + line.qty * order.portions);
    }
  }
  return [...totals.entries()].map(([code, required]) => {
    const stock = getIngredient(code).stock;
    return { code, required, stock, short: required > stock };
  });
}
