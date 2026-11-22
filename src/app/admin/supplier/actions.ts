"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { parseSupplierInput } from "@/modules/supplier/validation";

export interface SupplierActionResult {
  error?: string;
  success?: boolean;
}

/** Creates a supplier, or updates it when `supplierId` is given. */
export async function saveSupplierAction(supplierId: number | null, form: FormData): Promise<SupplierActionResult> {
  try {
    await requireAdmin();
    const parsed = parseSupplierInput(form);
    if (!parsed.ok) return { error: parsed.error };

    if (supplierId === null) {
      await prisma.supplier.create({ data: parsed.value });
    } else {
      await prisma.supplier.update({ where: { id: supplierId }, data: parsed.value });
    }

    // Supplier names appear on this page and in the ingredient form's supplier list.
    revalidatePath("/admin/supplier");
    revalidatePath("/admin/inventory/items");
    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "Nama supplier sudah terdaftar." };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return { error: "Supplier tidak ditemukan. Muat ulang halaman." };
    }
    console.error("Gagal menyimpan supplier:", err);
    return { error: "Supplier belum tersimpan karena kendala sistem. Silakan coba lagi." };
  }
}
