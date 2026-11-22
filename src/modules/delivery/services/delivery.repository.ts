/** Orders to deliver over the next days. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import { startOfWibDay, wibDateKey } from "@/lib/wib-date";
import type { DeliveryStop } from "../types";

/** Paid or in-progress orders are on the delivery list; unpaid or cancelled ones are not. */
const DELIVERABLE_STATUSES = ["DP_PAID", "FULLY_PAID", "IN_PREPARATION", "IN_DELIVERY", "COMPLETED"] as const;

export const DELIVERY_DAYS = 3;

export async function getDeliveryStops(now: Date = new Date()): Promise<DeliveryStop[]> {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: [...DELIVERABLE_STATUSES] },
      eventDate: { gte: startOfWibDay(now), lt: startOfWibDay(now, DELIVERY_DAYS) },
    },
    orderBy: { eventDate: "asc" },
    include: {
      items: { include: { menuItem: { select: { name: true } } } },
      payments: { where: { status: "SETTLED" }, select: { amount: true } },
    },
  });

  return orders.map((order) => ({
    orderId: order.id,
    orderCode: order.orderCode,
    dateKey: wibDateKey(order.eventDate),
    eventDate: order.eventDate.toISOString(),
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    notes: order.notes,
    totalPcs: order.totalPcs,
    packages: order.items.map((item) => `${item.menuItem.name} × ${item.quantity}`).join(", "),
    status: order.status,
    totalAmount: order.totalAmount,
    paidAmount: order.payments.reduce((sum, p) => sum + p.amount, 0),
  }));
}
