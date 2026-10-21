export interface RecipeBOM {
  id: string;
  recipeCode: string;
  name: string;
  category: string;
  yieldPortions: number;
  ingredients: {
    sku: string;
    name: string;
    grammagePerPortion: number;
    unit: string;
  }[];
}
