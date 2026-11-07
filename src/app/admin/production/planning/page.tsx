import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import ProductionManagementView from "@/modules/production/components/ProductionManagementView";

export const metadata: Metadata = {
  title: "Perencanaan Batch Produksi | PT. Zahdan Kamal Sentosa",
  description: "Peta stasiun kerja dapur sentral, jalur sanitasi satu arah, dan kapasitas batching uap boiler Ciampel.",
  robots: {
    index: false,
    follow: false,
  },
};

async function PlanningContent() {
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
        title="Perencanaan Batch & Stasiun Dapur"
        description="Peta stasiun kerja higienis (Butcher, Steamer, Hot Wok, Assembly, Bakery) dengan alur sanitasi satu arah ISO 22000."
        actions={
          <Link
            href="/admin/production"
            className="text-[12px] font-medium text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Antrean Jadwal Masak</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/admin/production/recipes"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Katalog Resep & BOM</span>
          </Link>
        }
      >
        <ProductionManagementView initialTab="STATIONS" />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function PlanningPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat perencanaan stasiun dapur..." rows={6} />
        </div>
      }
    >
      <PlanningContent />
    </Suspense>
  );
}

