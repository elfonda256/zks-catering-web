"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { lockIngredients, quantitiesAt } from "@/modules/inventory/services/stock-ledger";
import { parseIngredientInput, parseMovementInput, parseOpnameInput } from "@/modules/inventory/validation";
import { opnameAdjustments, opnameReference } from "@/modules/inventory/opname";

export interface InventoryActionResult {
  error?: string;
  success?: boolean;
}

const INVENTORY_PATHS = [
  "/admin/inventory",
  "/admin/inventory/items",
  "/admin/inventory/movements",
  "/admin/inventory/transfers",
  "/admin/inventory/opname",
];

function revalidateInventory() {
  for (const path of INVENTORY_PATHS) revalidatePath(path);
}

class InsufficientStockError extends Error {
  constructor(public readonly available: number) {
    super("insufficient stock");
  }
}

/** Creates an ingredient, or updates it when `ingredientId` is given. */
export async function saveIngredientAction(ingredientId: number | null, form: FormData): Promise<InventoryActionResult> {
  try {
    await requireAdmin();
    const parsed = parseIngredientInput(form);
    if (!parsed.ok) return { error: parsed.error };
    const { locationId, ...rest } = parsed.value;
    const payload = { ...rest, defaultLocationId: locationId };

    if (ingredientId === null) {
      await prisma.ingredient.create({ data: payload });
    } else {
      await prisma.ingredient.update({ where: { id: ingredientId }, data: payload });
    }

    revalidateInventory();
    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "Kode bahan sudah dipakai bahan lain." };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return { error: "Jenis, lokasi, atau supplier yang dipilih tidak ditemukan. Muat ulang halaman." };
    }
    console.error("Gagal menyimpan bahan:", err);
    return { error: "Bahan belum tersimpan karena kendala sistem. Silakan coba lagi." };
  }
}

/**
 * Records a stock movement. Stock leaving a location is checked against what is there,
 * under a per-ingredient lock so two movements at once cannot both pass the check.
 */
export async function recordMovementAction(form: FormData): Promise<InventoryActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = parseMovementInput(form);
    if (!parsed.ok) return { error: parsed.error };
    const movement = parsed.value;
    const createdById = Number(admin.id) || null;

    await prisma.$transaction(async (tx) => {
      await lockIngredients(tx, [movement.ingredientId]);

      if (movement.fromLocationId !== null) {
        const stock = await quantitiesAt(tx, movement.fromLocationId, [movement.ingredientId]);
        const available = stock.get(movement.ingredientId) ?? 0;
        if (movement.quantity > available + 1e-9) throw new InsufficientStockError(available);
      }

      await tx.stockMovement.create({ data: { ...movement, createdById } });
    });

    revalidateInventory();
    return { success: true };
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return {
        error: `Stok di lokasi asal tidak cukup (tersedia ${err.available.toLocaleString("id-ID", { maximumFractionDigits: 3 })}).`,
      };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return { error: "Bahan atau lokasi tidak ditemukan. Muat ulang halaman." };
    }
    console.error("Gagal mencatat mutasi stok:", err);
    return { error: "Mutasi belum tercatat karena kendala sistem. Silakan coba lagi." };
  }
}

export interface OpnameActionResult extends InventoryActionResult {
  /** Number of ingredients whose stock was corrected. */
  adjusted?: number;
  reference?: string;
}

/**
 * Saves a physical count for one location. System stock is read under the same locks the
 * other movements use, so the correction is exact even if stock moved while counting.
 */
export async function recordOpnameAction(form: FormData): Promise<OpnameActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = parseOpnameInput(form);
    if (!parsed.ok) return { error: parsed.error };
    const { locationId, note, counts } = parsed.value;
    const createdById = Number(admin.id) || null;

    const location = await prisma.storageLocation.findUnique({ where: { id: locationId }, select: { code: true, name: true } });
    if (!location) return { error: "Lokasi tidak ditemukan. Muat ulang halaman." };
    const reference = opnameReference(new Date(), location.code);
    const ingredientIds = counts.map((c) => c.ingredientId);

    const adjusted = await prisma.$transaction(async (tx) => {
      await lockIngredients(tx, ingredientIds);
      const system = await quantitiesAt(tx, locationId, ingredientIds);
      const adjustments = opnameAdjustments(counts, system);
      if (adjustments.length === 0) return 0;

      await tx.stockMovement.createMany({
        data: adjustments.map((a) => ({
          ingredientId: a.ingredientId,
          type: "ADJUSTMENT" as const,
          quantity: a.quantity,
          toLocationId: a.direction === "plus" ? locationId : null,
          fromLocationId: a.direction === "minus" ? locationId : null,
          reference,
          note: note ?? `Stock opname ${location.name}`,
          createdById,
        })),
      });
      return adjustments.length;
    });

    revalidateInventory();
    return { success: true, adjusted, reference: adjusted > 0 ? reference : undefined };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return { error: "Ada bahan yang tidak ditemukan. Muat ulang halaman." };
    }
    console.error("Gagal menyimpan stock opname:", err);
    return { error: "Stock opname belum tersimpan karena kendala sistem. Silakan coba lagi." };
  }
}
