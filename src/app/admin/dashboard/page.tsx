import { Suspense } from "react";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";

async function DashboardContent() {
  // Pengecekan sesi langsung di komponen server (defense in depth), tidak hanya mengandalkan proxy
  const admin = await requireAdmin();

  async function handleLogout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Panel Kendali Admin
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Zahdan Kamal Sentosa Catering — Selamat datang,{" "}
            <span className="font-semibold text-neutral-900">{admin.name}</span>
          </p>
        </div>

        <form action={handleLogout}>
          <button
            type="submit"
            className="rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
          >
            Keluar (Logout)
          </button>
        </form>
      </header>

      <section className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">
          Status Autentikasi Admin
        </h2>
        <p className="text-sm text-neutral-600 mb-4">
          Kerangka dashboard Fase 4 telah diamankan dengan autentikasi sesi NextAuth v5,
          strategi JWT 8 jam, proteksi proxy, dan verifikasi sesi server di tingkat Server Component.
        </p>

        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 text-xs font-mono space-y-1">
          <p>ID Admin: {admin.id}</p>
          <p>Nama Pengguna: {admin.name}</p>
          <p>Peran: {admin.role}</p>
          <p>Status Sesi: Terverifikasi Aktif</p>
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-100 p-8 text-neutral-900">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto text-sm text-neutral-500">
            Memverifikasi sesi admin...
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </main>
  );
}
