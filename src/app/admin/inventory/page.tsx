import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import InventoryDashboardClient from "./InventoryDashboardClient";

export const metadata: Metadata = {
  title: "Inventory Command Center | PT. Zahdan Kamal Sentosa",
  description: "Enterprise Inventory Command Center untuk pengawasan logistik bahan baku katering industri.",
  robots: {
    index: false,
    follow: false,
  },
};

async function InventoryDashboardContent() {
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
        category="SUPPLY CHAIN & WAREHOUSE"
        title="Command Center Stok & Gudang"
        description="Pusat kendali inventaris bahan baku, okupansi ruang pendingin, dan peringatan kritis expired."
        actions={
          <Link
            href="/admin/inventory/items"
            className="text-[12px] font-medium text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Buka Katalog SKU</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/admin/inventory/receiving"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Pos Receiving &amp; QC</span>
          </Link>
        }
      >
        {/* Enterprise Inventory Command Center Component */}
        <InventoryDashboardClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat Enterprise Inventory Command Center..." rows={6} />
        </div>
      }
    >
      <InventoryDashboardContent />
    </Suspense>
  );
}
