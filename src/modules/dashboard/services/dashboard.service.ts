import type { AdminOrderData } from "../types";

export class DashboardService {
  /**
   * Filter orders by status and search keyword.
   */
  static filterOrders(orders: AdminOrderData[], filterStatus: string, searchKeyword: string): AdminOrderData[] {
    return orders.filter((order) => {
      const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
      const q = searchKeyword.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderCode.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }

  /**
   * Calculate summary metrics from an order list.
   */
  static calculateMetrics(orders: AdminOrderData[]) {
    const totalOrders = orders.length;
    const submittedCount = orders.filter((o) => o.status === "SUBMITTED").length;
    const confirmedCount = orders.filter((o) => o.status === "AWAITING_PAYMENT" || o.status === "PAID_DP" || o.status === "PAID_FULL").length;
    const totalRevenue = orders
      .filter((o) => o.status === "PAID_DP" || o.status === "PAID_FULL")
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    return {
      totalOrders,
      submittedCount,
      confirmedCount,
      totalRevenue,
    };
  }
}
