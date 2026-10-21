"use client";

import { useState } from "react";

export function useWarehouse() {
  const [selectedZone, setSelectedZone] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return {
    selectedZone,
    setSelectedZone,
    searchQuery,
    setSearchQuery,
  };
}
