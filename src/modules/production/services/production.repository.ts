/** Database reads for the recipe, production schedule and kitchen pages. Server only: imports Prisma. */

import { MENU_PACKAGES } from "@/data/catering-data";
import { prisma } from "@/lib/prisma";
import { startOfWibDay } from "@/lib/wib-date";
import { getStockByLocation } from "@/modules/inventory/services/inventory.repository";
import { materialRequirements, productionCode } from "../rules";
import type { MaterialNeed, ProductionRow, RecipeRow, SafetyCheckRow, SchedulableOrder } from "../types";

const PACKAGE_CATEGORY_SLUG = "paket-katering";
const LIST_LIMIT = 200;

interface RecipeLineData {
  ingredientId: number;
  quantityPerPortion: unknown;
  ingredient: { name: string; unit: string; lastPrice: number; defaultLocationId: number; defaultLocation: { name: string } };
}

/** Recipe lines of every package that has a MenuItem, keyed by package price. */
async function recipeLinesByPrice(): Promise<Map<number, { id: number; price: number; recipeLines: RecipeLineData[] }>> {
  const items = await prisma.menuItem.findMany({
    where: { category: { slug: PACKAGE_CATEGORY_SLUG } },
    select: {
      id: true,
      price: true,
      recipeLines: {
        orderBy: { id: "asc" },
        select: {
          ingredientId: true,
          quantityPerPortion: true,
          ingredient: {
            select: { name: true, unit: true, lastPrice: true, defaultLocationId: true, defaultLocation: { select: { name: true } } },
          },
        },
      },
    },
  });
  return new Map(items.map((item) => [item.price, item]));
}

export async function getRecipes(): Promise<RecipeRow[]> {
  const byPrice = await recipeLinesByPrice();
  return Object.values(MENU_PACKAGES)
    .sort((a, b) => a.price - b.price)
    .map((pkg) => ({
      price: pkg.price,
      name: pkg.name,
      description: pkg.description,
      lines: (byPrice.get(pkg.price)?.recipeLines ?? []).map((line) => ({
        ingredientId: line.ingredientId,
        ingredientName: line.ingredient.name,
        unit: line.ingredient.unit,
        quantityPerPortion: Number(line.quantityPerPortion),
        lastPrice: line.ingredient.lastPrice,
      })),
    }));
}

/**
 * Production orders from yesterday onwards, with what each needs from stock. Optionally
 * only one WIB day (the kitchen board shows today).
 */
export async function getProductionOrders({ onlyDay }: { onlyDay?: Date } = {}): Promise<ProductionRow[]> {
  const now = new Date();
  const where = onlyDay
    ? { productionDate: onlyDay, status: { not: "CANCELLED" as const } }
    : { productionDate: { gte: startOfWibDay(now, -1) } };

  const [orders, recipes, stock] = await Promise.all([
    prisma.productionOrder.findMany({
      where,
      orderBy: [{ productionDate: "asc" }, { shift: "asc" }, { deliveryTime: "asc" }],
      take: LIST_LIMIT,
      include: { menuItem: { select: { name: true, price: true } }, order: { select: { orderCode: true } } },
    }),
    recipeLinesByPrice(),
    getStockByLocation(),
  ]);

  const available = new Map<string, number>(stock.map((row) => [`${row.ingredientId}:${row.locationId}`, row.quantity]));

  return orders.map((o) => {
    const recipe: RecipeLineData[] = recipes.get(o.menuItem.price)?.recipeLines ?? [];
    const lineById = new Map<number, RecipeLineData>(recipe.map((line) => [line.ingredientId, line]));
    const needs: MaterialNeed[] = materialRequirements(
      recipe.map((line) => ({ ingredientId: line.ingredientId, quantityPerPortion: Number(line.quantityPerPortion) })),
      o.portions
    ).map((req) => {
      const line = lineById.get(req.ingredientId)!;
      return {
        ingredientId: req.ingredientId,
        ingredientName: line.ingredient.name,
        unit: line.ingredient.unit,
        required: req.quantity,
        available: available.get(`${req.ingredientId}:${line.ingredient.defaultLocationId}`) ?? 0,
        locationName: line.ingredient.defaultLocation.name,
      };
    });

    return {
      id: o.id,
      code: productionCode(o.id),
      packageName: o.menuItem.name,
      portions: o.portions,
      productionDate: o.productionDate.toISOString(),
      shift: o.shift,
      deliveryTime: o.deliveryTime,
      destination: o.destination,
      note: o.note,
      status: o.status,
      materialsIssuedAt: o.materialsIssuedAt?.toISOString() ?? null,
      orderCode: o.order?.orderCode ?? null,
      needs,
    };
  });
}

/** Paid customer orders for today onwards, one entry per package line, to schedule from. */
export async function getSchedulableOrders(): Promise<SchedulableOrder[]> {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["DP_PAID", "FULLY_PAID", "IN_PREPARATION"] },
      eventDate: { gte: startOfWibDay(new Date()) },
    },
    orderBy: { eventDate: "asc" },
    take: LIST_LIMIT,
    include: { items: { include: { menuItem: { select: { name: true, price: true } } } } },
  });
  return orders.flatMap((o) =>
    o.items.map((item) => ({
      orderId: o.id,
      orderCode: o.orderCode,
      customerName: o.customerName,
      customerAddress: o.customerAddress,
      eventDate: o.eventDate.toISOString(),
      packagePrice: item.menuItem.price,
      packageName: item.menuItem.name,
      portions: item.quantity,
    }))
  );
}

/** Food-safety checks recorded today (WIB). */
export async function getTodaySafetyChecks(): Promise<SafetyCheckRow[]> {
  const rows = await prisma.foodSafetyCheck.findMany({
    where: { createdAt: { gte: startOfWibDay(new Date()) } },
    orderBy: { createdAt: "desc" },
    take: LIST_LIMIT,
    select: {
      id: true,
      createdAt: true,
      point: true,
      reading: true,
      limit: true,
      ok: true,
      checkedBy: true,
      productionOrderId: true,
    },
  });
  return rows.map(({ productionOrderId, createdAt, ...row }) => ({
    ...row,
    createdAt: createdAt.toISOString(),
    productionCode: productionOrderId ? productionCode(productionOrderId) : null,
  }));
}
