/** Applies the order expiry rules to the database. Server only: imports Prisma. */

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { EXPIRY_REASONS, expiryCutoffs } from "@/lib/order-expiry";

/**
 * Expires every overdue order inside `scope` (all orders by default) and returns how many changed.
 * Every update re-checks the status in its WHERE clause, so it never overrides an admin action
 * and running it twice changes nothing the second time.
 */
export async function expireOverdueOrders(
  scope: Prisma.OrderWhereInput = {},
  now: Date = new Date(),
): Promise<number> {
  const cutoffs = expiryCutoffs(now);

  const unpaidWhere: Prisma.OrderWhereInput = {
    AND: [
      scope,
      { status: "CONFIRMED_AWAITING_PAYMENT", payments: { none: { status: "PENDING" } } },
      {
        OR: [
          { initialPaymentDueAt: { lt: cutoffs.paymentDueBefore } },
          // Orders locked before the deadline was stored fall back to the H-1 rule.
          { initialPaymentDueAt: null, eventDate: { lt: cutoffs.unconfirmedEventBefore } },
        ],
      },
    ],
  };

  return prisma.$transaction(async (tx) => {
    const unconfirmed = await tx.order.updateMany({
      where: {
        AND: [scope, { status: "WAITING_ADMIN_CONFIRMATION", eventDate: { lt: cutoffs.unconfirmedEventBefore } }],
      },
      data: { status: "EXPIRED_UNCONFIRMED_BY_ADMIN", cancelledAt: now, cancellationReason: EXPIRY_REASONS.unconfirmed },
    });

    const candidates = await tx.order.findMany({ where: unpaidWhere, select: { id: true } });
    if (candidates.length === 0) return unconfirmed.count;

    // A proof upload locks the same row (see submitPaymentProofAction). Waiting for that lock and
    // then re-running the filter in a new statement means a proof committed meanwhile is seen,
    // so an order with a proof waiting for verification is never expired.
    const ids = candidates.map((c) => c.id);
    await tx.$queryRaw`SELECT id FROM "Order" WHERE id = ANY(${ids}) FOR UPDATE`;
    const unpaid = await tx.order.updateMany({
      where: { AND: [{ id: { in: ids } }, unpaidWhere] },
      data: { status: "EXPIRED_PAYMENT_TIMEOUT", cancelledAt: now, cancellationReason: EXPIRY_REASONS.unpaid },
    });

    return unconfirmed.count + unpaid.count;
  });
}

/**
 * The on-access variant: a failed sweep is logged and ignored, so customers and admins can still
 * read their orders; the daily cron and the next page load try again.
 */
export async function expireOverdueOrdersOnAccess(scope: Prisma.OrderWhereInput = {}): Promise<void> {
  try {
    await expireOverdueOrders(scope);
  } catch (err) {
    console.error("Gagal menjalankan kedaluwarsa pesanan:", err);
  }
}
