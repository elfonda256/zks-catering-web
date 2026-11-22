/**
 * Stock arithmetic inside a database transaction. Server only.
 * Stock is never stored: it is the sum of movements into a location minus movements out of it.
 */

import type { Prisma } from "@/generated/prisma/client";
import { allocateFefo, type Allocation, type BatchBucket } from "../fefo";

type Tx = Prisma.TransactionClient;

/**
 * Locks the given ingredients until the transaction ends, so two writers cannot both read
 * the same stock and both pass a check. Locks are taken in id order to avoid deadlocks.
 */
export async function lockIngredients(tx: Tx, ingredientIds: number[]): Promise<void> {
  const ids = [...new Set(ingredientIds)].sort((a, b) => a - b);
  for (const id of ids) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${id})`;
  }
}

/** Current quantity of each ingredient at one location. Ingredients with no movements are 0. */
export async function quantitiesAt(tx: Tx, locationId: number, ingredientIds: number[]): Promise<Map<number, number>> {
  const [incoming, outgoing] = await Promise.all([
    tx.stockMovement.groupBy({
      by: ["ingredientId"],
      where: { ingredientId: { in: ingredientIds }, toLocationId: locationId },
      _sum: { quantity: true },
    }),
    tx.stockMovement.groupBy({
      by: ["ingredientId"],
      where: { ingredientId: { in: ingredientIds }, fromLocationId: locationId },
      _sum: { quantity: true },
    }),
  ]);

  const result = new Map<number, number>(ingredientIds.map((id) => [id, 0]));
  for (const row of incoming) result.set(row.ingredientId, (result.get(row.ingredientId) ?? 0) + Number(row._sum.quantity ?? 0));
  for (const row of outgoing) result.set(row.ingredientId, (result.get(row.ingredientId) ?? 0) - Number(row._sum.quantity ?? 0));
  return result;
}

/** Stock of each ingredient at one location, split by batch (unbatched stock has batchId null). */
export async function batchBucketsAt(tx: Tx, locationId: number, ingredientIds: number[]): Promise<Map<number, BatchBucket[]>> {
  const [incoming, outgoing] = await Promise.all([
    tx.stockMovement.groupBy({
      by: ["ingredientId", "batchId"],
      where: { ingredientId: { in: ingredientIds }, toLocationId: locationId },
      _sum: { quantity: true },
    }),
    tx.stockMovement.groupBy({
      by: ["ingredientId", "batchId"],
      where: { ingredientId: { in: ingredientIds }, fromLocationId: locationId },
      _sum: { quantity: true },
    }),
  ]);

  const totals = new Map<string, { ingredientId: number; batchId: number | null; quantity: number }>();
  const add = (ingredientId: number, batchId: number | null, delta: number) => {
    const key = `${ingredientId}:${batchId ?? "-"}`;
    const row = totals.get(key) ?? { ingredientId, batchId, quantity: 0 };
    row.quantity += delta;
    totals.set(key, row);
  };
  for (const row of incoming) add(row.ingredientId, row.batchId, Number(row._sum.quantity ?? 0));
  for (const row of outgoing) add(row.ingredientId, row.batchId, -Number(row._sum.quantity ?? 0));

  const batchIds = [...totals.values()].map((r) => r.batchId).filter((id): id is number => id !== null);
  const batches = await tx.stockBatch.findMany({ where: { id: { in: batchIds } }, select: { id: true, expiresAt: true, createdAt: true } });
  const meta = new Map<number, { expiresAt: Date | null; createdAt: Date }>(batches.map((b) => [b.id, b]));

  const result = new Map<number, BatchBucket[]>(ingredientIds.map((id) => [id, []]));
  for (const row of totals.values()) {
    const info = row.batchId === null ? undefined : meta.get(row.batchId);
    result.get(row.ingredientId)?.push({
      batchId: row.batchId,
      quantity: Math.round(row.quantity * 1000) / 1000,
      expiresAt: info?.expiresAt?.toISOString() ?? null,
      createdAt: (info?.createdAt ?? new Date(0)).toISOString(),
    });
  }
  return result;
}

export interface WithdrawalPlan {
  plans: Map<number, Allocation[]>;
  shortages: { ingredientId: number; required: number; available: number }[];
}

/**
 * FEFO split of several withdrawals from one location. Call under lockIngredients so the
 * balances cannot change before the movements are written.
 */
export async function planWithdrawals(tx: Tx, locationId: number, needs: { ingredientId: number; quantity: number }[]): Promise<WithdrawalPlan> {
  const buckets = await batchBucketsAt(tx, locationId, needs.map((n) => n.ingredientId));
  const plans = new Map<number, Allocation[]>();
  const shortages: WithdrawalPlan["shortages"] = [];
  for (const need of needs) {
    const result = allocateFefo(buckets.get(need.ingredientId) ?? [], need.quantity);
    if (result.ok) plans.set(need.ingredientId, result.allocations);
    else shortages.push({ ingredientId: need.ingredientId, required: need.quantity, available: result.available });
  }
  return { plans, shortages };
}
