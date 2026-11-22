"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { lockIngredients, planWithdrawals } from "@/modules/inventory/services/stock-ledger";
import { ensurePackageMenuItem } from "@/modules/menu/package-menu-item";
import { materialRequirements, nextProductionStatus, productionCode } from "@/modules/production/rules";
import { parseProductionInput, parseRecipeInput, parseSafetyCheckInput } from "@/modules/production/validation";

export interface ProductionActionResult {
  error?: string;
  success?: boolean;
}

interface RecipeIngredient {
  ingredientId: number;
  ingredient: { name: string; unit: string; defaultLocationId: number };
}

/** Thrown inside a transaction to roll it back and show the message to the admin. */
class RejectedError extends Error {}

const PRODUCTION_PATHS = [
  "/admin/production",
  "/admin/production/recipes",
  "/admin/kitchen",
  "/admin/inventory",
  "/admin/inventory/items",
  "/admin/inventory/movements",
];

function revalidateProduction() {
  for (const path of PRODUCTION_PATHS) revalidatePath(path);
}

function failure(err: unknown, action: string): ProductionActionResult {
  if (err instanceof RejectedError) return { error: err.message };
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
    return { error: "Data yang dipilih tidak ditemukan. Muat ulang halaman." };
  }
  console.error(`Gagal ${action}:`, err);
  return { error: `Gagal ${action} karena kendala sistem. Silakan coba lagi.` };
}

/** Replaces a package's recipe with the submitted lines. */
export async function saveRecipeAction(form: FormData): Promise<ProductionActionResult> {
  try {
    await requireAdmin();
    const parsed = parseRecipeInput(form);
    if (!parsed.ok) return { error: parsed.error };
    const { price, lines } = parsed.value;

    await prisma.$transaction(async (tx) => {
      const menuItem = await ensurePackageMenuItem(tx, price);
      await tx.recipeLine.deleteMany({ where: { menuItemId: menuItem.id } });
      await tx.recipeLine.createMany({ data: lines.map((line) => ({ ...line, menuItemId: menuItem.id })) });
    });
    revalidateProduction();
    return { success: true };
  } catch (err) {
    return failure(err, "menyimpan resep");
  }
}

export async function createProductionOrderAction(form: FormData): Promise<ProductionActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = parseProductionInput(form, new Date());
    if (!parsed.ok) return { error: parsed.error };
    const { price, ...order } = parsed.value;

    await prisma.$transaction(async (tx) => {
      const menuItem = await ensurePackageMenuItem(tx, price);
      await tx.productionOrder.create({
        data: { ...order, menuItemId: menuItem.id, createdById: Number(admin.id) || null },
      });
    });
    revalidateProduction();
    return { success: true };
  } catch (err) {
    return failure(err, "menjadwalkan produksi");
  }
}

/**
 * Moves a production order one step forward. Starting to cook takes the recipe's ingredients
 * out of stock (from each ingredient's storage location) and fails if anything is short.
 */
export async function advanceProductionAction(productionOrderId: number): Promise<ProductionActionResult> {
  try {
    const admin = await requireAdmin();
    const adminId = Number(admin.id) || null;

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT 1 FROM "ProductionOrder" WHERE "id" = ${productionOrderId} FOR UPDATE`;
      const order = await tx.productionOrder.findUnique({
        where: { id: productionOrderId },
        include: {
          menuItem: {
            select: {
              name: true,
              recipeLines: {
                select: {
                  ingredientId: true,
                  quantityPerPortion: true,
                  ingredient: { select: { name: true, unit: true, defaultLocationId: true } },
                },
              },
            },
          },
        },
      });
      if (!order) throw new RejectedError("Perintah produksi tidak ditemukan. Muat ulang halaman.");
      const next = nextProductionStatus(order.status);
      if (!next) throw new RejectedError("Perintah produksi ini sudah selesai atau dibatalkan.");

      if (next === "COOKING") {
        const recipe = order.menuItem.recipeLines;
        if (recipe.length === 0) throw new RejectedError(`Resep ${order.menuItem.name} belum diisi. Lengkapi di Resep & bahan.`);

        const needs = materialRequirements(
          recipe.map((line) => ({ ingredientId: line.ingredientId, quantityPerPortion: Number(line.quantityPerPortion) })),
          order.portions
        );
        const lineById = new Map<number, RecipeIngredient>(recipe.map((line: RecipeIngredient) => [line.ingredientId, line]));
        await lockIngredients(tx, needs.map((need) => need.ingredientId));

        // Each ingredient is taken from its storage location, batch by batch, earliest expiry first.
        const byLocation = new Map<number, { ingredientId: number; quantity: number }[]>();
        for (const need of needs) {
          const locationId = lineById.get(need.ingredientId)!.ingredient.defaultLocationId;
          byLocation.set(locationId, [...(byLocation.get(locationId) ?? []), need]);
        }

        const reference = productionCode(order.id);
        const note = `Produksi ${reference} · ${order.menuItem.name} ${order.portions} porsi`;
        const shortages: string[] = [];
        const movements: Prisma.StockMovementCreateManyInput[] = [];
        for (const [locationId, locationNeeds] of byLocation) {
          const result = await planWithdrawals(tx, locationId, locationNeeds);
          for (const short of result.shortages) {
            const { ingredient } = lineById.get(short.ingredientId)!;
            shortages.push(`${ingredient.name} (perlu ${short.required.toLocaleString("id-ID")}, ada ${short.available.toLocaleString("id-ID")} ${ingredient.unit})`);
          }
          for (const [ingredientId, allocations] of result.plans) {
            for (const a of allocations) {
              movements.push({ ingredientId, type: "OUT", quantity: a.quantity, fromLocationId: locationId, batchId: a.batchId, reference, note, createdById: adminId });
            }
          }
        }
        if (shortages.length > 0) throw new RejectedError(`Stok belum cukup: ${shortages.join("; ")}.`);
        await tx.stockMovement.createMany({ data: movements });
      }

      await tx.productionOrder.update({
        where: { id: order.id },
        data: { status: next, ...(next === "COOKING" ? { materialsIssuedAt: new Date() } : {}) },
      });
    });

    revalidateProduction();
    return { success: true };
  } catch (err) {
    return failure(err, "memperbarui status produksi");
  }
}

/** Cancels a production order that has not taken any ingredients yet. */
export async function cancelProductionAction(productionOrderId: number): Promise<ProductionActionResult> {
  try {
    await requireAdmin();
    const { count } = await prisma.productionOrder.updateMany({
      where: { id: productionOrderId, status: { in: ["SCHEDULED", "PREPARING"] } },
      data: { status: "CANCELLED" },
    });
    if (count === 0) return { error: "Produksi yang sudah dimasak tidak bisa dibatalkan." };
    revalidateProduction();
    return { success: true };
  } catch (err) {
    return failure(err, "membatalkan produksi");
  }
}

export async function recordSafetyCheckAction(form: FormData): Promise<ProductionActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = parseSafetyCheckInput(form);
    if (!parsed.ok) return { error: parsed.error };
    await prisma.foodSafetyCheck.create({ data: { ...parsed.value, createdById: Number(admin.id) || null } });
    revalidatePath("/admin/kitchen");
    return { success: true };
  } catch (err) {
    return failure(err, "menyimpan cek keamanan pangan");
  }
}

