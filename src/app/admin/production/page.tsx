import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import ProductionClient from "./ProductionClient";

export const metadata: Metadata = {
  title: "Perencanaan Produksi & Dapur Sentral | PT. Zahdan Kamal Sentosa",
  description:
    "Manajemen Work Order batching, scaling resep BOM bahan baku, dan pengawasan mutu sanitasi HACCP Dapur Sentral Ciampel.",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProductionContent() {
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
        category="CENTRAL KITCHEN & BATCHING"
        title="Jadwal Produksi & Bill of Materials (BOM)"
        description="Perencanaan batch masak harian, kalkulator scaling resep bahan baku, dan inspeksi suhu inti pangan standar ISO 22000."
        actions={
          <Link
            href="/admin/order-adhoc"
            className="text-[12px] font-medium text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Order Lembur Ad-Hoc</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/admin/inventory"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Cek Stok Gudang</span>
          </Link>
        }
      >
        <ProductionClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function ProductionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat modul manajemen produksi ZKS..." rows={6} />
        </div>
      }
    >
      <ProductionContent />
    </Suspense>
  );
}

