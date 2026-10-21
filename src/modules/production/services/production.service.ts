import type { WorkOrder } from "../types";

export class ProductionService {
  static filterWorkOrders(orders: WorkOrder[], status: string): WorkOrder[] {
    if (status === "ALL") return orders;
    return orders.filter((o) => o.status === status);
  }
}
