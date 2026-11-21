/**
 * What the customer can pay right now, derived from the order and its settled payments.
 * Shared by the order page (to show the payment panel) and the upload action (to price it).
 */

interface OrderForDue {
  status: string;
  totalAmount: number | null;
  dpAmount: number | null;
  payments: { status: string; amount: number }[];
}

export type AmountDue =
  | { kind: "initial"; totalAmount: number; dpAmount: number | null }
  | { kind: "settlement"; remaining: number };

/** Statuses after a DP in which the remaining balance is still payable (the kitchen may start on a DP). */
const SETTLEMENT_STATUSES = ["DP_PAID", "IN_PREPARATION", "IN_DELIVERY"];

export function getPaidAmount(order: Pick<OrderForDue, "payments">): number {
  return order.payments.filter((p) => p.status === "SETTLED").reduce((sum, p) => sum + p.amount, 0);
}

export function getAmountDue(order: OrderForDue): AmountDue | null {
  if (order.totalAmount === null) return null;

  if (order.status === "CONFIRMED_AWAITING_PAYMENT") {
    return { kind: "initial", totalAmount: order.totalAmount, dpAmount: order.dpAmount };
  }

  if (SETTLEMENT_STATUSES.includes(order.status)) {
    const remaining = order.totalAmount - getPaidAmount(order);
    return remaining > 0 ? { kind: "settlement", remaining } : null;
  }

  return null;
}

/** ISO time of the deadline for the amount due, or null when there is none or it has passed. */
export function getPaymentDueAt(
  due: AmountDue | null,
  deadlines: { initial: Date | null; settlement: Date },
  now: Date = new Date()
): string | null {
  if (!due) return null;
  const deadline = due.kind === "settlement" ? deadlines.settlement : deadlines.initial;
  return deadline && deadline.getTime() > now.getTime() ? deadline.toISOString() : null;
}
