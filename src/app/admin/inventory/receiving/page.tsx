import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import GoodsReceivingClient from "./GoodsReceivingClient";

export const metadata: Metadata = {
  title: "Penerimaan Barang & QC | PT. Zahdan Kamal Sentosa",
  description:
    "Industrial goods receiving, inbound shipment inspection, and quality control verification workstation.",
  robots: {
    index: false,
    follow: false,
  },
};

async function GoodsReceivingContent() {
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
        category="INBOUND LOGISTICS & QUALITY CONTROL"
        title="Penerimaan Barang & Inspeksi Mutu (QC)"
        description="Verifikasi penerimaan dock, penimbangan bruto/netto, uji sensorik/suhu cold-chain, dan rilis lot."
        actions={
          <Link
            href="/admin/purchase-orders"
            className="text-[12px] font-medium text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Cek PO Rekanan →</span>
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
        <GoodsReceivingClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminReceivingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat pos penerimaan barang & QC..." rows={6} />
        </div>
      }
    >
      <GoodsReceivingContent />
    </Suspense>
  );
}
