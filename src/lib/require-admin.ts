import { auth } from "@/auth";

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

  return {
    id: (session.user as { id?: string }).id || "",
    name: session.user.name,
    role: (session.user as unknown as { role?: string }).role || "admin",
  };
}
