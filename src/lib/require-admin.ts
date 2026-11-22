import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export interface AdminUser {
  id: string;
  name?: string | null;
  role?: string;
}

/**
 * Memverifikasi sesi admin yang sedang aktif.
 * Melempar galat bila tidak ada sesi atau pengguna tidak memiliki hak akses admin.
 * WAJIB dipanggil di baris pertama setiap Server Action dan fungsi akses data admin.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: Sesi admin tidak valid atau telah kedaluwarsa");
  }

  // The session is a signed JWT, so a deleted admin's token stays valid until it
  // expires. Checking the row ends that access on the next request.
  const id = (session.user as { id?: string }).id || "";
  const adminId = Number(id);
  const exists =
    Number.isInteger(adminId) &&
    (await prisma.admin.findUnique({ where: { id: adminId }, select: { id: true } }));
  if (!exists) {
    throw new Error("UNAUTHORIZED: Akun admin sudah tidak aktif");
  }

  return {
    id,
    name: session.user.name,
    role: (session.user as unknown as { role?: string }).role || "admin",
  };
}
