import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import SupplierClient from "./SupplierClient";

export const metadata: Metadata = {
  title: "Supplier Management (SRM) | PT. Zahdan Kamal Sentosa",
  description:
    "Enterprise Supplier Relationship Management, kepatuhan sertifikasi halal/ISO, penilaian kinerja rekanan, dan audit rantai pasok.",
  robots: {
    index: false,
    follow: false,
  },
};

async function SupplierManagementContent() {
  await connection();
  const admin = await requireAdmin();

  async function handleLogout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Navigation Bar matching the exact admin layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141413]/10 pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/admin/inventory"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all"
          >
            ← Inventory
          </Link>
          <Link
            href="/admin/purchase-requests"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all"
          >
            Purchase Requests
          </Link>
          <Link
            href="/admin/purchase-orders"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all"
          >
            Purchase Orders (PO)
          </Link>
          <span className="font-mono text-xs text-[#141413] font-bold px-3 py-1.5 bg-white border border-[#141413]/20 shadow-2xs">
            Supplier Management (SRM)
          </span>
          <Link
            href="/admin/dashboard"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all"
          >
            Pesanan &amp; Logistik →
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#626058] hidden md:inline">
            Vendor Auditor: <strong className="text-[#141413]">{admin.name}</strong>
          </span>

          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs"
          >
            Website Utama ↗
          </Link>

          <form action={handleLogout}>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-rose-50 text-rose-700 border border-rose-200 transition-all cursor-pointer"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>

      {/* Main SRM View */}
      <SupplierClient />
    </div>
  );
}

export default function SupplierManagementPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#141413] py-8 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto py-20 text-center font-mono text-xs text-[#626058]">
            Memuat konsol Supplier Relationship Management (SRM)...
          </div>
        }
      >
        <SupplierManagementContent />
      </Suspense>
    </main>
  );
}
