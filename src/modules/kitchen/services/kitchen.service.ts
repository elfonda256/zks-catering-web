import type { RecipeBOM } from "../types";

export class KitchenService {
  static scaleRecipeIngredients(recipe: RecipeBOM, targetPortions: number) {
    const factor = targetPortions / recipe.yieldPortions;
    return recipe.ingredients.map((ing) => ({
      ...ing,
      totalQty: Math.round(ing.grammagePerPortion * factor * 100) / 100,
    }));
  }
}
