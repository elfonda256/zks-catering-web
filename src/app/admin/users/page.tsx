import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { AdminUsersView } from "@/modules/users/components/AdminUsersView";

export const metadata: Metadata = {
  title: "Pengguna admin | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

async function Content() {
  const current = await requireAdmin();
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, username: true, createdAt: true } });
  return (
    <AdminUsersView
      admins={admins.map((a) => ({ id: a.id, username: a.username, createdAt: a.createdAt.toISOString() }))}
      currentAdminId={Number(current.id)}
    />
  );
}

export default function Page() {
  return (
    <AdminPage title="Pengguna admin" description="Akun yang bisa masuk ke panel admin.">
      <Content />
    </AdminPage>
  );
}
