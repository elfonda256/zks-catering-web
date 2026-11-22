/**
 * When an order that never received money stops being valid (docs/agent/decisions.md, sections 2 and 4).
 * Pure functions with relative imports only, so node:test can import them.
 *
 * - Not confirmed by the admin by H-1 23:59 WIB of the event: EXPIRED_UNCONFIRMED_BY_ADMIN.
 * - Total locked but nothing paid by the initial payment deadline: EXPIRED_PAYMENT_TIMEOUT.
 *
 * Both wait a grace period past the deadline, and an order with a transfer proof still waiting
 * for verification never expires: the admin decides it.
 *
 * Orders that already paid a DP are left alone on purpose: since Nov 2026 the kitchen may cook on
 * a DP and the balance can be collected later, so forfeiting it automatically would be wrong.
 */

import { startOfWibDay } from "./wib-date";

export const EXPIRY_GRACE_MS = 2 * 60 * 60 * 1000;

export interface ExpiryCutoffs {
  /** Unconfirmed orders whose event is before this instant are past their H-1 deadline plus grace. */
  unconfirmedEventBefore: Date;
  /** Unpaid orders whose initial payment deadline is before this instant are past it plus grace. */
  paymentDueBefore: Date;
}

export function expiryCutoffs(now: Date): ExpiryCutoffs {
  const graceAgo = new Date(now.getTime() - EXPIRY_GRACE_MS);
  // The H-1 deadline ends where the event's WIB day starts, so an event is past it (plus grace)
  // when its WIB day began at or before `graceAgo`, i.e. it is before the next WIB midnight.
  return { unconfirmedEventBefore: startOfWibDay(graceAgo, 1), paymentDueBefore: graceAgo };
}

export const EXPIRY_REASONS = {
  unconfirmed: "Kedaluwarsa otomatis: belum dikonfirmasi admin sampai batas H-1 pukul 23.59 WIB.",
  unpaid: "Kedaluwarsa otomatis: belum ada pembayaran sampai batas bayar.",
} as const;
