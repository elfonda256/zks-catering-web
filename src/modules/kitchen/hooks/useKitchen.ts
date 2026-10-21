"use client";

import { useState } from "react";

export function useKitchen() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  return { activeCategory, setActiveCategory };
}
