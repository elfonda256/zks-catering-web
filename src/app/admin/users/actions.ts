"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { canDeleteAdmin, validateNewPassword, validateUsername } from "@/modules/users/validation";

export interface UserActionResult {
  error?: string;
  success?: boolean;
}

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "");
}

export async function createAdminAction(form: FormData): Promise<UserActionResult> {
  try {
    await requireAdmin();
    const username = validateUsername(text(form, "username"));
    if (!username.ok) return { error: username.error };
    const password = validateNewPassword(text(form, "password"), text(form, "confirmPassword"));
    if (!password.ok) return { error: password.error };

    await prisma.admin.create({ data: { username: username.value, passwordHash: await hashPassword(password.value) } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { error: "Username sudah dipakai." };
    }
    console.error("Gagal membuat admin:", err);
    return { error: "Admin belum tersimpan karena kendala sistem." };
  }
}

export async function resetAdminPasswordAction(adminId: number, form: FormData): Promise<UserActionResult> {
  try {
    await requireAdmin();
    const password = validateNewPassword(text(form, "password"), text(form, "confirmPassword"));
    if (!password.ok) return { error: password.error };

    await prisma.admin.update({ where: { id: adminId }, data: { passwordHash: await hashPassword(password.value) } });
    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return { error: "Admin tidak ditemukan. Muat ulang halaman." };
    }
    console.error("Gagal mengganti kata sandi admin:", err);
    return { error: "Kata sandi belum diganti karena kendala sistem." };
  }
}

export async function deleteAdminAction(adminId: number): Promise<UserActionResult> {
  try {
    const current = await requireAdmin();
    // Serializable so two admins deleting each other at once cannot leave zero admins.
    const deleted = await prisma.$transaction(
      async (tx) => {
        const currentId = Number(current.id);
        if (!(await tx.admin.findUnique({ where: { id: currentId }, select: { id: true } }))) {
          return "Akun Anda sudah tidak aktif. Silakan masuk ulang.";
        }
        const allowed = canDeleteAdmin(adminId, currentId, await tx.admin.count());
        if (!allowed.ok) return allowed.error;
        await tx.admin.delete({ where: { id: adminId } });
        return null;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    if (deleted) return { error: deleted };
    revalidatePath("/admin/users");
    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return { error: "Admin sudah dihapus. Muat ulang halaman." };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2034") {
      return { error: "Ada perubahan admin lain di saat yang sama. Coba lagi." };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return { error: "Admin ini punya riwayat pencatatan, jadi akunnya tidak bisa dihapus." };
    }
    console.error("Gagal menghapus admin:", err);
    return { error: "Admin belum terhapus karena kendala sistem." };
  }
}
