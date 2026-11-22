/** Database reads for the recipe, production schedule and kitchen pages. Server only: imports Prisma. */

import { MENU_PACKAGES } from "@/data/catering-data";
import { prisma } from "@/lib/prisma";
import { startOfWibDay } from "@/lib/wib-date";
import { getStockByLocation } from "@/modules/inventory/services/inventory.repository";
import { allScheduledDishes, combineRecipes } from "../menu";
import { materialRequirements, productionCode } from "../rules";
import type { DishRow, FoodSampleRow, MaterialNeed, ProductionRow, RecipeRow, SafetyCheckRow, SchedulableOrder } from "../types";

const PACKAGE_CATEGORY_SLUG = "paket-katering";
const LIST_LIMIT = 200;

const RECIPE_LINE_SELECT = {
  ingredientId: true,
  quantityPerPortion: true,
  ingredient: { select: { name: true, unit: true, lastPrice: true, defaultLocationId: true, defaultLocation: { select: { name: true } } } },
} as const;

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
      recipeLines: { orderBy: { id: "asc" }, select: RECIPE_LINE_SELECT },
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
      include: {
        menuItem: { select: { name: true, price: true } },
        order: { select: { orderCode: true } },
        sample: { select: { storageLocation: true, storedAt: true, keepUntil: true, disposedAt: true } },
        dishes: { orderBy: { id: "asc" }, select: { dish: { select: { name: true, lines: { select: RECIPE_LINE_SELECT } } } } },
      },
    }),
    recipeLinesByPrice(),
    getStockByLocation(),
  ]);

  const available = new Map<string, number>(stock.map((row) => [`${row.ingredientId}:${row.locationId}`, row.quantity]));

  type Issued = ProductionRow["issued"][number];
  const issuedRows = await prisma.stockMovement.findMany({
    where: { type: "OUT", reference: { in: orders.filter((o) => o.materialsIssuedAt).map((o) => productionCode(o.id)) } },
    orderBy: { id: "asc" },
    select: {
      reference: true,
      quantity: true,
      ingredient: { select: { name: true, unit: true } },
      batch: { select: { batchCode: true, expiresAt: true } },
      fromLocation: { select: { name: true } },
    },
  });
  const issuedByCode = new Map<string, Issued[]>();
  for (const m of issuedRows) {
    const list = issuedByCode.get(m.reference!) ?? [];
    list.push({
      ingredientName: m.ingredient.name,
      unit: m.ingredient.unit,
      quantity: Number(m.quantity),
      batchCode: m.batch?.batchCode ?? null,
      expiresAt: m.batch?.expiresAt?.toISOString() ?? null,
      locationName: m.fromLocation?.name ?? "—",
    });
    issuedByCode.set(m.reference!, list);
  }

  return orders.map((o) => {
    // A daily menu needs the sum of its dishes' recipes; otherwise the package recipe.
    const dishes: { dish: { name: string; lines: RecipeLineData[] } }[] = o.dishes;
    const recipeSets: RecipeLineData[][] = dishes.length > 0 ? dishes.map((d) => d.dish.lines) : [recipes.get(o.menuItem.price)?.recipeLines ?? []];
    const lineById = new Map<number, RecipeLineData>(recipeSets.flat().map((line) => [line.ingredientId, line]));
    const needs: MaterialNeed[] = materialRequirements(
      combineRecipes(recipeSets.map((r) => r.map((line) => ({ ingredientId: line.ingredientId, quantityPerPortion: Number(line.quantityPerPortion) })))),
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
      menu:
        dishes.length > 0 && o.menuVariation
          ? {
              variation: o.menuVariation,
              dishes: dishes.map((d) => d.dish.name),
              missingRecipes: dishes.filter((d) => d.dish.lines.length === 0).map((d) => d.dish.name),
            }
          : null,
      needs,
      issued: issuedByCode.get(productionCode(o.id)) ?? [],
      sample: o.sample
        ? {
            storageLocation: o.sample.storageLocation,
            storedAt: o.sample.storedAt.toISOString(),
            keepUntil: o.sample.keepUntil.toISOString(),
            disposedAt: o.sample.disposedAt?.toISOString() ?? null,
          }
        : null,
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
      correctiveAction: true,
    },
  });
  return rows.map(({ productionOrderId, createdAt, ...row }) => ({
    ...row,
    createdAt: createdAt.toISOString(),
    productionCode: productionOrderId ? productionCode(productionOrderId) : null,
  }));
}

const DISPOSED_HISTORY_DAYS = 7;

/** Samples still kept, plus those disposed in the last week, soonest-due first. */
export async function getFoodSamples(): Promise<FoodSampleRow[]> {
  const rows = await prisma.foodSample.findMany({
    where: { OR: [{ disposedAt: null }, { disposedAt: { gte: startOfWibDay(new Date(), -DISPOSED_HISTORY_DAYS) } }] },
    orderBy: [{ disposedAt: { sort: "desc", nulls: "first" } }, { keepUntil: "asc" }],
    take: LIST_LIMIT,
    include: {
      productionOrder: { select: { id: true, menuItem: { select: { name: true } } } },
      storedBy: { select: { username: true } },
    },
  });
  return rows.map((s) => ({
    id: s.id,
    productionCode: productionCode(s.productionOrder.id),
    packageName: s.productionOrder.menuItem.name,
    storageLocation: s.storageLocation,
    note: s.note,
    storedAt: s.storedAt.toISOString(),
    keepUntil: s.keepUntil.toISOString(),
    storedBy: s.storedBy?.username ?? null,
    disposedAt: s.disposedAt?.toISOString() ?? null,
  }));
}

/** Every dish in the public schedule (plus any saved earlier), with its recipe and where it is served. */
export async function getDishes(): Promise<DishRow[]> {
  const saved = await prisma.dish.findMany({
    select: { name: true, lines: { orderBy: { id: "asc" }, select: RECIPE_LINE_SELECT } },
  });
  const byName = new Map<string, { lines: RecipeLineData[] }>(saved.map((dish: { name: string; lines: RecipeLineData[] }) => [dish.name, dish]));

  const usedIn = new Map<string, string[]>();
  for (const pkg of Object.values(MENU_PACKAGES).sort((a, b) => a.price - b.price)) {
    for (const [day, variations] of Object.entries(pkg.schedule)) {
      variations.forEach((dishes, index) => {
        for (const name of dishes) usedIn.set(name, [...(usedIn.get(name) ?? []), `${pkg.name} · ${day} #${index + 1}`]);
      });
    }
  }

  const names = [...new Set([...allScheduledDishes(), ...byName.keys()])].sort((a, b) => a.localeCompare(b, "id"));
  return names.map((name) => ({
    name,
    usedIn: usedIn.get(name) ?? [],
    lines: (byName.get(name)?.lines ?? []).map((line) => ({
      ingredientId: line.ingredientId,
      ingredientName: line.ingredient.name,
      unit: line.ingredient.unit,
      quantityPerPortion: Number(line.quantityPerPortion),
      lastPrice: line.ingredient.lastPrice,
    })),
  }));
}
