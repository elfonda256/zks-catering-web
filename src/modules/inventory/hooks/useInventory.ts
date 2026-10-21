"use client";

import { useState, useMemo } from "react";
import type { InventoryItem } from "../types/item.types";
import { InventoryService } from "../services/inventory.service";

export function useInventory(initialItems: InventoryItem[]) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [category, setCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = useMemo(() => {
    return InventoryService.filterItems(items, category, searchQuery);
  }, [items, category, searchQuery]);

  const totalValuation = useMemo(() => {
    return InventoryService.calculateTotalValuation(items);
  }, [items]);

  return {
    items,
    setItems,
    filteredItems,
    totalValuation,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
  };
}
