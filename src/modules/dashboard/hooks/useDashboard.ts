"use client";

import { useMemo, useState } from "react";
import type { AdminOrderData } from "../types";
import type { OrderTab } from "../constants";
import { DashboardService } from "../services/dashboard.service";

export function useDashboard(orders: AdminOrderData[]) {
  const counts = useMemo(() => DashboardService.countByTab(orders), [orders]);
  const [tab, setTab] = useState<OrderTab>(() => (counts.proof > 0 ? "proof" : counts.shipping > 0 ? "shipping" : "all"));
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(
    () => DashboardService.filterOrders(orders, tab, query),
    [orders, tab, query]
  );

  return { counts, tab, setTab, query, setQuery, filteredOrders };
}
