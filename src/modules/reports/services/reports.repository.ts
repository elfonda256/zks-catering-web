/** Rows for the monthly report. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import { wibMonthRange } from "@/lib/wib-date";
import { buildMonthlyReport, type MonthlyReport } from "../monthly-report";

/** Orders are counted in the month of their event; money in the month it was received. */
export async function getMonthlyReport(month: string): Promise<MonthlyReport> {
  const range = wibMonthRange(month);
  if (!range) return buildMonthlyReport([], []);

  const [orders, payments] = await Promise.all([
    prisma.order.findMany({
      where: { eventDate: { gte: range.start, lt: range.end } },
      include: { items: { include: { menuItem: { select: { name: true } } } } },
    }),
    prisma.payment.findMany({
      where: { status: "SETTLED", settledAt: { gte: range.start, lt: range.end } },
      select: { amount: true },
    }),
  ]);

  return buildMonthlyReport(
    orders.map((o) => ({
      status: o.status,
      customerName: o.customerName,
      totalPcs: o.totalPcs,
      totalAmount: o.totalAmount,
      subtotal: o.subtotal,
      items: o.items.map((item) => ({ packageName: item.menuItem.name, quantity: item.quantity, subtotal: item.subtotal })),
    })),
    payments.map((p) => p.amount)
  );
}
