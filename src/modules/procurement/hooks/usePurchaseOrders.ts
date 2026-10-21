"use client";

import { useState } from "react";

export function usePurchaseOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
  };
}
