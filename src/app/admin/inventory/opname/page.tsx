import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import StockOpnameClient from "./StockOpnameClient";

export const metadata: Metadata = {
  title: "Stock Opname & Physical Inventory Audit | PT. Zahdan Kamal Sentosa",
  description:
    "Enterprise physical inventory verification, cycle counts, variance investigation, and stock reconciliation.",
  robots: {
    index: false,
    follow: false,
  },
};

async function StockOpnameContent() {
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
            href="/admin/inventory/items"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all"
          >
            Items Catalog
          </Link>
          <Link
            href="/admin/inventory/receiving"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all"
          >
            Receiving &amp; QC
          </Link>
          <Link
            href="/admin/inventory/movements"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all"
          >
            Stock Movement
          </Link>
          <span className="font-mono text-xs text-[#141413] font-bold px-3 py-1.5 bg-white border border-[#141413]/20 shadow-2xs">
            Stock Opname
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
            Auditor / Lead: <strong className="text-[#141413]">{admin.name}</strong>
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
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all cursor-pointer"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>

      {/* Enterprise Stock Opname Client */}
      <StockOpnameClient />
    </div>
  );
}

export default function AdminStockOpnamePage() {
  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#141413] p-6 sm:p-10 selection:bg-[#D96B27]/20 selection:text-[#141413]">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto py-24 text-center text-xs font-mono uppercase tracking-widest text-[#8E8B81]">
            Memuat Modul Stock Opname &amp; Audit Fisik...
          </div>
        }
      >
        <StockOpnameContent />
      </Suspense>
    </main>
  );
}
