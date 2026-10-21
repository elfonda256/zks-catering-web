import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import StockMovementClient from "./StockMovementClient";

export const metadata: Metadata = {
  title: "Ledger Mutasi Stok | PT. Zahdan Kamal Sentosa",
  description:
    "Enterprise stock movement audit trail, transaction history, and inventory ledger reconciliation.",
  robots: {
    index: false,
    follow: false,
  },
};

async function StockMovementContent() {
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
        category="INVENTORY AUDIT TRAIL"
        title="Buku Besar Mutasi Stok (Ledger)"
        description="Jejak audit transaksi mutasi masuk, keluar, transfer antar gudang, dan penyesuaian opname."
        actions={
          <Link
            href="/admin/inventory/opname"
            className="text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <span>Audit Stock Opname →</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/admin/inventory/transfers"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Transfer Antar Gudang</span>
          </Link>
        }
      >
        <StockMovementClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminMovementsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat ledger mutasi stok..." rows={6} />
        </div>
      }
    >
      <StockMovementContent />
    </Suspense>
  );
}
