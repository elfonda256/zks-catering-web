"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { parseIngredientInput, parseMovementInput } from "@/modules/inventory/validation";

export interface InventoryActionResult {
  error?: string;
  success?: boolean;
}

const INVENTORY_PATHS = ["/admin/inventory", "/admin/inventory/items", "/admin/inventory/movements"];

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
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${movement.ingredientId})`;

      if (movement.fromLocationId !== null) {
        const [incoming, outgoing] = await Promise.all([
          tx.stockMovement.aggregate({
            where: { ingredientId: movement.ingredientId, toLocationId: movement.fromLocationId },
            _sum: { quantity: true },
          }),
          tx.stockMovement.aggregate({
            where: { ingredientId: movement.ingredientId, fromLocationId: movement.fromLocationId },
            _sum: { quantity: true },
          }),
        ]);
        const available = Number(incoming._sum.quantity ?? 0) - Number(outgoing._sum.quantity ?? 0);
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
