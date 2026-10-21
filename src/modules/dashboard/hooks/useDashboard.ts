"use client";

import { useState, useMemo } from "react";
import type { AdminOrderData } from "../types";
import { DashboardService } from "../services/dashboard.service";

export function useDashboard(initialOrders: AdminOrderData[]) {
  const [orders] = useState<AdminOrderData[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const filteredOrders = useMemo(() => {
    return DashboardService.filterOrders(orders, filterStatus, searchKeyword);
  }, [orders, filterStatus, searchKeyword]);

  const metrics = useMemo(() => {
    return DashboardService.calculateMetrics(orders);
  }, [orders]);

  return {
    orders,
    filteredOrders,
    metrics,
    filterStatus,
    setFilterStatus,
    searchKeyword,
    setSearchKeyword,
  };
}
