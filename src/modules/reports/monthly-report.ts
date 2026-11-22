/** Monthly report figures, computed from plain rows so the arithmetic can be unit tested. */

export interface ReportOrder {
  status: string;
  customerName: string;
  totalPcs: number;
  totalAmount: number | null;
  subtotal: number;
  items: { packageName: string; quantity: number; subtotal: number }[];
}

export interface MonthlyReport {
  orders: number;
  portions: number;
  orderValue: number;
  averageOrderValue: number;
  received: number;
  cancelled: number;
  cancelRate: number;
  packages: { name: string; portions: number; value: number }[];
  topCustomers: { name: string; orders: number; value: number }[];
}

/** Orders that went ahead (paid, cooked, delivered); the rest of a month's orders did not. */
export const CONFIRMED_STATUSES = ["DP_PAID", "FULLY_PAID", "IN_PREPARATION", "IN_DELIVERY", "COMPLETED"];
export const CANCELLED_STATUSES = [
  "EXPIRED_UNCONFIRMED_BY_ADMIN",
  "EXPIRED_PAYMENT_TIMEOUT",
  "REJECTED_BY_ADMIN",
  "CANCELLED_BY_ADMIN_REFUND_REQ",
  "CANCELLED_BY_CUSTOMER",
  "CANCELLED_DP_FORFEITED",
  "CANCELLED_FULL_REFUND_PENDING",
  "REFUNDED",
];

const TOP_CUSTOMERS = 5;

export function buildMonthlyReport(orders: ReportOrder[], receivedPayments: number[]): MonthlyReport {
  const confirmed = orders.filter((o) => CONFIRMED_STATUSES.includes(o.status));
  const cancelled = orders.filter((o) => CANCELLED_STATUSES.includes(o.status)).length;
  const valueOf = (o: ReportOrder) => o.totalAmount ?? o.subtotal;
  const orderValue = confirmed.reduce((sum, o) => sum + valueOf(o), 0);
  const decided = confirmed.length + cancelled;

  const packages = new Map<string, { portions: number; value: number }>();
  for (const order of confirmed) {
    for (const item of order.items) {
      const current = packages.get(item.packageName) ?? { portions: 0, value: 0 };
      packages.set(item.packageName, { portions: current.portions + item.quantity, value: current.value + item.subtotal });
    }
  }

  const customers = new Map<string, { orders: number; value: number }>();
  for (const order of confirmed) {
    const current = customers.get(order.customerName) ?? { orders: 0, value: 0 };
    customers.set(order.customerName, { orders: current.orders + 1, value: current.value + valueOf(order) });
  }

  return {
    orders: confirmed.length,
    portions: confirmed.reduce((sum, o) => sum + o.totalPcs, 0),
    orderValue,
    averageOrderValue: confirmed.length > 0 ? Math.round(orderValue / confirmed.length) : 0,
    received: receivedPayments.reduce((sum, amount) => sum + amount, 0),
    cancelled,
    cancelRate: decided > 0 ? cancelled / decided : 0,
    packages: [...packages.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.portions - a.portions),
    topCustomers: [...customers.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.value - a.value)
      .slice(0, TOP_CUSTOMERS),
  };
}
