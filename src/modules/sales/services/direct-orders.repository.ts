/** Database reads for the direct orders page. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import type { DirectOrderRow } from "../types";

const LIST_LIMIT = 200;

/** Orders the admin entered for phone, WhatsApp, or walk-in customers, newest first. */
export async function getDirectOrders(): Promise<DirectOrderRow[]> {
  const orders = await prisma.order.findMany({
    where: { source: { not: "ONLINE" } },
    orderBy: { createdAt: "desc" },
    take: LIST_LIMIT,
    include: {
      items: { include: { menuItem: { select: { name: true } } } },
      createdBy: { select: { username: true } },
    },
  });
  return orders.map((o) => ({
    id: o.id,
    orderCode: o.orderCode,
    source: o.source as DirectOrderRow["source"],
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerAddress: o.customerAddress,
    eventDate: o.eventDate.toISOString(),
    packages: o.items.map((item) => `${item.menuItem.name} × ${item.quantity}`).join(", "),
    totalPcs: o.totalPcs,
    subtotal: o.subtotal,
    notes: o.notes,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    createdBy: o.createdBy?.username ?? null,
  }));
}
