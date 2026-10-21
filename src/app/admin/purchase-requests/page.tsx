import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import PurchaseRequestClient from "./PurchaseRequestClient";

export const metadata: Metadata = {
  title: "Purchase Request (PR) | PT. Zahdan Kamal Sentosa",
  description:
    "Enterprise procurement workspace, automated inventory depletion forecasting, and purchase requisition approval.",
  robots: {
    index: false,
    follow: false,
  },
};

async function PurchaseRequestContent() {
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
        category="PROCUREMENT & SOURCING"
        title="Permintaan Pengadaan (Purchase Request)"
        description="Rekomendasi otomatis berbasis stok kritis, pengajuan manual departemen, dan alur persetujuan bertingkat."
        actions={
          <Link
            href="/admin/purchase-orders"
            className="text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <span>Ke Purchase Orders (PO) →</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/admin/supplier"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Direktori Supplier</span>
          </Link>
        }
      >
        <PurchaseRequestClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminPRPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat modul purchase request..." rows={6} />
        </div>
      }
    >
      <PurchaseRequestContent />
    </Suspense>
  );
}
