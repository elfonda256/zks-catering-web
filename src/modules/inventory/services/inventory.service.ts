import type { InventoryItem } from "../types/item.types";

export class InventoryService {
  /**
   * Determine stock status based on current stock, safety stock, and reorder point.
   */
  static evaluateStockStatus(item: Pick<InventoryItem, "currentStock" | "safetyStock" | "reorderPoint" | "parLevel">) {
    if (item.currentStock <= 0) return "OUT_OF_STOCK";
    if (item.currentStock <= item.safetyStock) return "CRITICAL";
    if (item.currentStock <= item.reorderPoint) return "LOW_STOCK";
    if (item.currentStock > item.parLevel * 1.2) return "OVERSTOCK";
    return "OPTIMAL";
  }

  /**
   * Calculate total valuation of an inventory item list.
   */
  static calculateTotalValuation(items: InventoryItem[]): number {
    return items.reduce((sum, item) => sum + item.unitCost * item.currentStock, 0);
  }

  /**
   * Filter inventory items by search query and category.
   */
  static filterItems(items: InventoryItem[], category: string, search: string): InventoryItem[] {
    return items.filter((item) => {
      const matchCat = category === "ALL" || item.category === category;
      const q = search.toLowerCase().trim();
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }
}
