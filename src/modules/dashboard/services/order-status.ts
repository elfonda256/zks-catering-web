import { NEXT_OPERATIONAL_STATUS, OPERATIONAL_STATUSES, type OrderStatusValue } from "../constants";

/** Order statuses in which a pending payment proof may still be approved. */
const PAYABLE_STATUSES: readonly OrderStatusValue[] = [
  "CONFIRMED_AWAITING_PAYMENT",
  "DP_PAID",
  "FULLY_PAID",
  ...OPERATIONAL_STATUSES,
];

/**
 * Order status after an admin approves a payment, or null when the order can no longer be paid.
 * Status only moves forward: a settlement on an order already in the kitchen, or a DP on an
 * order that is already fully paid, keeps the current status.
 */
export function statusAfterPaymentApproval(
  current: OrderStatusValue,
  paymentType: "DP" | "SETTLEMENT" | "FULL"
): OrderStatusValue | null {
  if (!PAYABLE_STATUSES.includes(current)) return null;
  const keep =
    OPERATIONAL_STATUSES.includes(current) ||
    current === "FULLY_PAID" ||
    (current === "DP_PAID" && paymentType === "DP");
  if (keep) return current;
  return paymentType === "DP" ? "DP_PAID" : "FULLY_PAID";
}

/** True when an admin may move an order from `current` to `next` by hand. */
export function canAdvanceStatus(current: OrderStatusValue, next: OrderStatusValue): boolean {
  return NEXT_OPERATIONAL_STATUS[current] === next;
}
