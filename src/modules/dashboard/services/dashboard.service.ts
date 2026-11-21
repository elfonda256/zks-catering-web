import type { AdminOrderData } from "../types";
import { ORDER_TAB_STATUSES, type OrderStatusValue, type OrderTab } from "../constants";

function hasPendingProof(order: AdminOrderData): boolean {
  return order.payments.some((p) => p.status === "PENDING");
}

function matchesTab(order: AdminOrderData, tab: OrderTab): boolean {
  if (tab === "all") return true;
  if (tab === "proof") return hasPendingProof(order);
  return ORDER_TAB_STATUSES[tab].includes(order.status as OrderStatusValue);
}

function matchesSearch(order: AdminOrderData, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return [order.orderCode, order.customerName, order.customerPhone, order.customerAddress].some((field) =>
    field.toLowerCase().includes(q)
  );
}

export const DashboardService = {
  hasPendingProof,

  filterOrders(orders: AdminOrderData[], tab: OrderTab, query: string): AdminOrderData[] {
    return orders.filter((order) => matchesTab(order, tab) && matchesSearch(order, query));
  },

  countByTab(orders: AdminOrderData[]): Record<OrderTab, number> {
    const tabs: OrderTab[] = ["proof", "shipping", "payment", "active", "archived", "all"];
    return Object.fromEntries(
      tabs.map((tab) => [tab, orders.filter((order) => matchesTab(order, tab)).length])
    ) as Record<OrderTab, number>;
  },
};
