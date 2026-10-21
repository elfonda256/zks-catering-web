import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import WarehouseTransferClient from "./WarehouseTransferClient";

export const metadata: Metadata = {
  title: "Transfer Antar Gudang | PT. Zahdan Kamal Sentosa",
  description:
    "Enterprise internal stock transfer, inter-warehouse logistics routing, and material allocation dispatch.",
  robots: {
    index: false,
    follow: false,
  },
};

async function WarehouseTransferContent() {
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
        category="INTERNAL LOGISTICS"
        title="Transfer Antar Gudang & Dapur Sentral"
        description="Perpindahan bahan baku antar gudang kering, cold room, dan staging area stasiun produksi."
        actions={
          <Link
            href="/admin/inventory"
            className="text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5"
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
        <WarehouseTransferClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminTransfersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat modul transfer gudang..." rows={6} />
        </div>
      }
    >
      <WarehouseTransferContent />
    </Suspense>
  );
}
