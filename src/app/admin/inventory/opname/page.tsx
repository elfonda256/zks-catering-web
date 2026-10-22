import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import StockOpnameClient from "./StockOpnameClient";

export const metadata: Metadata = {
  title: "Stock Opname & Audit Fisik | PT. Zahdan Kamal Sentosa",
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
    <EnterpriseShell
      user={{ name: admin.name, role: admin.role }}
      onLogout={handleLogout}
    >
      <ErpPageTemplate
        category="PHYSICAL INVENTORY AUDIT"
        title="Stock Opname & Rekonsiliasi Varians"
        description="Verifikasi stok fisik, penghitungan siklus berkala, dan penyesuaian selisih gudang."
        actions={
          <Link
            href="/admin/inventory"
            className="text-[12px] font-medium text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Command Center</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/admin/inventory/movements"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Ledger Mutasi</span>
          </Link>
        }
      >
        <StockOpnameClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminOpnamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat sesi stock opname..." rows={6} />
        </div>
      }
    >
      <StockOpnameContent />
    </Suspense>
  );
}
