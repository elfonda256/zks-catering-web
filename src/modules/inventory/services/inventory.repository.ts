/** Database reads for the inventory pages. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import { OPNAME_PREFIX } from "../opname";
import type {
  BatchStockRow,
  CatalogCategory,
  CatalogItem,
  InventoryFormOptions,
  LocationStock,
  MovementRow,
  MovementType,
  OpnameRecord,
} from "../types";

/** Stock per ingredient across all locations: quantity moved in minus quantity moved out. */
export async function getStockTotals(): Promise<Map<number, number>> {
  const [incoming, outgoing] = await Promise.all([
    prisma.stockMovement.groupBy({ by: ["ingredientId"], where: { toLocationId: { not: null } }, _sum: { quantity: true } }),
    prisma.stockMovement.groupBy({ by: ["ingredientId"], where: { fromLocationId: { not: null } }, _sum: { quantity: true } }),
  ]);
  const totals = new Map<number, number>();
  for (const row of incoming) totals.set(row.ingredientId, Number(row._sum.quantity ?? 0));
  for (const row of outgoing) totals.set(row.ingredientId, (totals.get(row.ingredientId) ?? 0) - Number(row._sum.quantity ?? 0));
  return totals;
}

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const categories = await prisma.ingredientCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { types: { orderBy: { sortOrder: "asc" }, select: { id: true, name: true } } },
  });
  return categories.map((c) => ({ slug: c.slug, name: c.name, types: c.types }));
}

export async function getCatalogItems(): Promise<CatalogItem[]> {
  const [ingredients, totals, batches] = await Promise.all([
    prisma.ingredient.findMany({
      include: { type: { include: { category: true } }, defaultLocation: true, supplier: true },
      orderBy: [{ type: { category: { sortOrder: "asc" } } }, { type: { sortOrder: "asc" } }, { name: "asc" }],
    }),
    getStockTotals(),
    getBatchStock(),
  ]);
  const nearestExpiry = new Map<number, string>();
  for (const batch of batches) {
    if (!batch.expiresAt) continue;
    const current = nearestExpiry.get(batch.ingredientId);
    if (!current || batch.expiresAt < current) nearestExpiry.set(batch.ingredientId, batch.expiresAt);
  }

  return ingredients.map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    categorySlug: item.type.category.slug,
    categoryName: item.type.category.name,
    typeId: item.typeId,
    typeName: item.type.name,
    unit: item.unit,
    locationId: item.defaultLocationId,
    locationName: item.defaultLocation.name,
    minStock: Number(item.minStock),
    lastPrice: item.lastPrice,
    supplierId: item.supplierId,
    supplierName: item.supplier?.name ?? null,
    isActive: item.isActive,
    stock: Math.round((totals.get(item.id) ?? 0) * 1000) / 1000,
    nearestExpiry: nearestExpiry.get(item.id) ?? null,
  }));
}

export async function getFormOptions(): Promise<InventoryFormOptions> {
  const [categories, locations, suppliers] = await Promise.all([
    getCatalogCategories(),
    prisma.storageLocation.findMany({ orderBy: { id: "asc" }, select: { id: true, name: true } }),
    prisma.supplier.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return { categories, locations, suppliers };
}

const MOVEMENT_PAGE_SIZE = 200;

/** Newest movements first, optionally only one type (for example the Transfer page). */
export async function getRecentMovements(type?: MovementType): Promise<MovementRow[]> {
  const rows = await prisma.stockMovement.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
    take: MOVEMENT_PAGE_SIZE,
    include: {
      ingredient: { select: { name: true, unit: true } },
      fromLocation: { select: { name: true } },
      toLocation: { select: { name: true } },
      createdBy: { select: { username: true } },
      batch: { select: { batchCode: true } },
    },
  });
  return rows.map((m) => ({
    id: m.id,
    createdAt: m.createdAt.toISOString(),
    ingredientName: m.ingredient.name,
    unit: m.ingredient.unit,
    type: m.type as MovementType,
    quantity: Number(m.quantity),
    fromName: m.fromLocation?.name ?? null,
    toName: m.toLocation?.name ?? null,
    reference: m.reference,
    note: m.note,
    createdBy: m.createdBy?.username ?? null,
    batchCode: m.batch?.batchCode ?? null,
  }));
}

/** Positive stock per batch and location, earliest expiry first. Unbatched stock is not listed. */
export async function getBatchStock(): Promise<BatchStockRow[]> {
  const [incoming, outgoing] = await Promise.all([
    prisma.stockMovement.groupBy({ by: ["batchId", "toLocationId"], where: { batchId: { not: null }, toLocationId: { not: null } }, _sum: { quantity: true } }),
    prisma.stockMovement.groupBy({ by: ["batchId", "fromLocationId"], where: { batchId: { not: null }, fromLocationId: { not: null } }, _sum: { quantity: true } }),
  ]);
  const totals = new Map<string, { batchId: number; locationId: number; quantity: number }>();
  const add = (batchId: number, locationId: number, delta: number) => {
    const key = `${batchId}:${locationId}`;
    const row = totals.get(key) ?? { batchId, locationId, quantity: 0 };
    row.quantity += delta;
    totals.set(key, row);
  };
  for (const row of incoming) add(row.batchId!, row.toLocationId!, Number(row._sum.quantity ?? 0));
  for (const row of outgoing) add(row.batchId!, row.fromLocationId!, -Number(row._sum.quantity ?? 0));

  const positive = [...totals.values()].filter((row) => row.quantity > 1e-9);
  const [batches, locations] = await Promise.all([
    prisma.stockBatch.findMany({
      where: { id: { in: positive.map((row) => row.batchId) } },
      select: { id: true, batchCode: true, expiresAt: true, ingredient: { select: { id: true, name: true, unit: true } } },
    }),
    prisma.storageLocation.findMany({ select: { id: true, name: true } }),
  ]);
  type BatchMeta = { id: number; batchCode: string; expiresAt: Date | null; ingredient: { id: number; name: string; unit: string } };
  const batchById = new Map<number, BatchMeta>(batches.map((b: BatchMeta) => [b.id, b]));
  const locationName = new Map<number, string>(locations.map((l) => [l.id, l.name]));

  return positive
    .map((row) => {
      const batch = batchById.get(row.batchId)!;
      return {
        batchId: row.batchId,
        batchCode: batch.batchCode,
        expiresAt: batch.expiresAt?.toISOString() ?? null,
        ingredientId: batch.ingredient.id,
        ingredientName: batch.ingredient.name,
        unit: batch.ingredient.unit,
        locationId: row.locationId,
        locationName: locationName.get(row.locationId) ?? "—",
        quantity: Math.round(row.quantity * 1000) / 1000,
      };
    })
    .sort((a, b) => (a.expiresAt ?? "9999") < (b.expiresAt ?? "9999") ? -1 : 1);
}

/** Quantity of every ingredient at every location that has stock there (non-zero rows only). */
export async function getStockByLocation(): Promise<LocationStock[]> {
  const [incoming, outgoing] = await Promise.all([
    prisma.stockMovement.groupBy({ by: ["ingredientId", "toLocationId"], where: { toLocationId: { not: null } }, _sum: { quantity: true } }),
    prisma.stockMovement.groupBy({ by: ["ingredientId", "fromLocationId"], where: { fromLocationId: { not: null } }, _sum: { quantity: true } }),
  ]);
  const totals = new Map<string, LocationStock>();
  const add = (ingredientId: number, locationId: number, delta: number) => {
    const key = `${ingredientId}:${locationId}`;
    const row = totals.get(key) ?? { ingredientId, locationId, quantity: 0 };
    row.quantity += delta;
    totals.set(key, row);
  };
  for (const row of incoming) add(row.ingredientId, row.toLocationId!, Number(row._sum.quantity ?? 0));
  for (const row of outgoing) add(row.ingredientId, row.fromLocationId!, -Number(row._sum.quantity ?? 0));
  return [...totals.values()]
    .map((row) => ({ ...row, quantity: Math.round(row.quantity * 1000) / 1000 }))
    .filter((row) => row.quantity !== 0);
}

const OPNAME_MOVEMENT_LIMIT = 1000;

/** Past stock opnames, newest first, rebuilt from the adjustments they created. */
export async function getOpnameHistory(): Promise<OpnameRecord[]> {
  const rows = await prisma.stockMovement.findMany({
    where: { type: "ADJUSTMENT", reference: { startsWith: OPNAME_PREFIX } },
    orderBy: { createdAt: "desc" },
    take: OPNAME_MOVEMENT_LIMIT,
    include: {
      ingredient: { select: { name: true, unit: true, lastPrice: true } },
      fromLocation: { select: { name: true } },
      toLocation: { select: { name: true } },
      createdBy: { select: { username: true } },
    },
  });

  const records = new Map<string, OpnameRecord>();
  for (const m of rows) {
    const reference = m.reference!;
    const signed = m.toLocationId !== null ? Number(m.quantity) : -Number(m.quantity);
    const record: OpnameRecord = records.get(reference) ?? {
      reference,
      createdAt: m.createdAt.toISOString(),
      locationName: m.toLocation?.name ?? m.fromLocation?.name ?? "—",
      createdBy: m.createdBy?.username ?? null,
      note: m.note,
      lines: [],
      varianceValue: 0,
    };
    record.lines.push({ ingredientName: m.ingredient.name, unit: m.ingredient.unit, difference: signed });
    record.varianceValue += Math.round(signed * m.ingredient.lastPrice);
    records.set(reference, record);
  }
  return [...records.values()];
}
