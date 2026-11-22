/** First-expired-first-out allocation. Pure functions: safe for the browser, the server, and tests. */

export interface BatchBucket {
  /** null = stock recorded before batches existed, or added by a plus adjustment. */
  batchId: number | null;
  quantity: number;
  /** ISO instant; null = no expiry date known. */
  expiresAt: string | null;
  /** ISO instant the batch was received; used to break ties. */
  createdAt: string;
}

export interface Allocation {
  batchId: number | null;
  quantity: number;
}

const EPSILON = 1e-9;

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/**
 * Order stock is taken in: earliest expiry first, then batches without a date, oldest first.
 * Unbatched stock counts as the oldest stock without a date.
 */
export function fefoCompare(a: BatchBucket, b: BatchBucket): number {
  if (a.expiresAt && b.expiresAt && a.expiresAt !== b.expiresAt) return a.expiresAt < b.expiresAt ? -1 : 1;
  if (a.expiresAt && !b.expiresAt) return -1;
  if (!a.expiresAt && b.expiresAt) return 1;
  if (a.batchId === null && b.batchId !== null) return -1;
  if (a.batchId !== null && b.batchId === null) return 1;
  return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
}

/** Splits a withdrawal across batches in FEFO order, or reports how much is available. */
export function allocateFefo(
  buckets: BatchBucket[],
  quantity: number
): { ok: true; allocations: Allocation[] } | { ok: false; available: number } {
  const usable = buckets.filter((b) => b.quantity > EPSILON).sort(fefoCompare);
  const available = round3(usable.reduce((sum, b) => sum + b.quantity, 0));
  if (quantity > available + EPSILON) return { ok: false, available };

  const allocations: Allocation[] = [];
  let remaining = quantity;
  for (const bucket of usable) {
    if (remaining <= EPSILON) break;
    const take = round3(Math.min(bucket.quantity, remaining));
    if (take > 0) allocations.push({ batchId: bucket.batchId, quantity: take });
    remaining = round3(remaining - take);
  }
  return { ok: true, allocations };
}

/** Whole days from the start of today (WIB) until a batch expires; negative = already expired. */
export function daysUntilExpiry(expiresAt: string, now: Date): number {
  const WIB = 7 * 60 * 60 * 1000;
  const today = Math.floor((now.getTime() + WIB) / 86_400_000);
  const expiry = Math.floor((new Date(expiresAt).getTime() + WIB) / 86_400_000);
  return expiry - today;
}
