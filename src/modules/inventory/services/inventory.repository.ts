/** Database reads for the inventory pages. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import type { CatalogCategory, CatalogItem, InventoryFormOptions, MovementRow, MovementType } from "../types";

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
  const [ingredients, totals] = await Promise.all([
    prisma.ingredient.findMany({
      include: { type: { include: { category: true } }, defaultLocation: true, supplier: true },
      orderBy: [{ type: { category: { sortOrder: "asc" } } }, { type: { sortOrder: "asc" } }, { name: "asc" }],
    }),
    getStockTotals(),
  ]);

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

export async function getRecentMovements(): Promise<MovementRow[]> {
  const rows = await prisma.stockMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: MOVEMENT_PAGE_SIZE,
    include: {
      ingredient: { select: { name: true, unit: true } },
      fromLocation: { select: { name: true } },
      toLocation: { select: { name: true } },
      createdBy: { select: { username: true } },
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
  }));
}
