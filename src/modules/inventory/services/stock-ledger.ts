/**
 * Stock arithmetic inside a database transaction. Server only.
 * Stock is never stored: it is the sum of movements into a location minus movements out of it.
 */

import type { Prisma } from "@/generated/prisma/client";

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
