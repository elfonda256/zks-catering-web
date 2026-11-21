/**
 * Order rules shared by the order form (browser) and the server.
 * Pure functions only: this file must not import Node-only modules.
 */

export const MIN_ORDER_PCS = 20;
export const LARGE_ORDER_PCS = 500;

/** Minimum calendar days (WIB) between ordering and the event: H-3 from 500 pcs, otherwise H-1. */
export function minLeadDays(totalPcs: number): number {
  return totalPcs >= LARGE_ORDER_PCS ? 3 : 1;
}

/** Earliest event date (YYYY-MM-DD, WIB calendar) allowed for an order of `totalPcs`. */
export function earliestEventDateWib(totalPcs: number, now: Date = new Date()): string {
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  wib.setUTCDate(wib.getUTCDate() + minLeadDays(totalPcs));
  return wib.toISOString().slice(0, 10);
}
