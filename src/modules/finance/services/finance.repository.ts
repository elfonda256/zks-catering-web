/** Payment, receivable and refund data for the finance page. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import { wibMonthRange } from "@/lib/wib-date";
import type { FinanceSummary, PaymentRow } from "../types";

/** Orders that owe a balance once the kitchen may start (a DP was paid). */
const RECEIVABLE_STATUSES = ["DP_PAID", "IN_PREPARATION", "IN_DELIVERY", "COMPLETED"] as const;
const REFUND_STATUSES = ["CANCELLED_BY_ADMIN_REFUND_REQ", "CANCELLED_FULL_REFUND_PENDING"] as const;

const paymentInclude = { order: { select: { orderCode: true, customerName: true } } } as const;

function toRow(p: {
  id: number;
  paymentType: string;
  amount: number;
  paymentChannel: string | null;
  createdAt: Date;
  settledAt: Date | null;
  order: { orderCode: string; customerName: string };
}): PaymentRow {
  return {
    id: p.id,
    orderCode: p.order.orderCode,
    customerName: p.order.customerName,
    paymentType: p.paymentType,
    amount: p.amount,
    channel: p.paymentChannel,
    createdAt: p.createdAt.toISOString(),
    settledAt: p.settledAt?.toISOString() ?? null,
  };
}

/** Payments received (settled) in a WIB month, oldest first. */
export async function getSettledPayments(month: string): Promise<PaymentRow[]> {
  const range = wibMonthRange(month);
  if (!range) return [];
  const rows = await prisma.payment.findMany({
    where: { status: "SETTLED", settledAt: { gte: range.start, lt: range.end } },
    orderBy: { settledAt: "asc" },
    include: paymentInclude,
  });
  return rows.map(toRow);
}

export async function getFinanceSummary(month: string): Promise<FinanceSummary> {
  const [received, pending, receivableOrders, refundOrders] = await Promise.all([
    getSettledPayments(month),
    prisma.payment.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" }, include: paymentInclude }),
    prisma.order.findMany({
      where: { status: { in: [...RECEIVABLE_STATUSES] }, totalAmount: { not: null } },
      orderBy: { eventDate: "asc" },
      include: { payments: { where: { status: "SETTLED" }, select: { amount: true } } },
    }),
    prisma.order.findMany({
      where: { status: { in: [...REFUND_STATUSES] }, refundedAt: null },
      orderBy: { cancelledAt: "asc" },
    }),
  ]);

  const receivables = receivableOrders
    .map((order) => ({
      orderCode: order.orderCode,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      eventDate: order.eventDate.toISOString(),
      status: order.status,
      totalAmount: order.totalAmount ?? 0,
      paidAmount: order.payments.reduce((sum, p) => sum + p.amount, 0),
    }))
    .filter((row) => row.paidAmount < row.totalAmount);

  return {
    month,
    received,
    pending: pending.map(toRow),
    receivables,
    refunds: refundOrders.map((order) => ({
      orderCode: order.orderCode,
      customerName: order.customerName,
      status: order.status,
      refundAmount: order.refundAmount,
      cancelledAt: order.cancelledAt?.toISOString() ?? null,
    })),
  };
}
