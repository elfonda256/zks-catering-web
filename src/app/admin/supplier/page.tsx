import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import SupplierClient from "./SupplierClient";

export const metadata: Metadata = {
  title: "Manajemen Supplier (SRM) | PT. Zahdan Kamal Sentosa",
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
    <EnterpriseShell
      user={{ name: admin.name, role: admin.role }}
      onLogout={handleLogout}
    >
      <ErpPageTemplate
        category="SUPPLIER RELATIONSHIP MANAGEMENT (SRM)"
        title="Manajemen & Kemitraan Supplier"
        description="Direktori rekanan, kepatuhan sertifikasi Halal & ISO, evaluasi scorecard mutu, dan mitigasi risiko pasokan."
        actions={
          <Link
            href="/admin/purchase-orders"
            className="text-[12px] font-medium text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ke Purchase Orders (PO) →</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/admin/inventory/receiving"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Pos Inspeksi QC Dock</span>
          </Link>
        }
      >
        <SupplierClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminSupplierPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat modul supplier management..." rows={6} />
        </div>
      }
    >
      <SupplierManagementContent />
    </Suspense>
  );
}
