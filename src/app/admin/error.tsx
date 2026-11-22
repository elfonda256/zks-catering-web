"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";

/**
 * Shown when an admin page fails to load: an expired or deactivated account,
 * or the database being unreachable. Offers both ways forward.
 */
export default function AdminError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-md rounded-[16px] border border-stone-200/80 bg-white p-8 text-center shadow-[0_12px_32px_-12px_rgba(26,31,34,0.18)]">
        <h1 className="text-[20px] font-bold tracking-tight text-ink">Halaman belum bisa dibuka</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-stone-600">
          Sesi Anda mungkin sudah berakhir atau akun ini dinonaktifkan. Bisa juga koneksi ke server sedang terganggu.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={retry}>
            Coba lagi
          </Button>
          <Link
            href="/admin/login"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Masuk ulang
          </Link>
        </div>
      </div>
    </main>
  );
}
