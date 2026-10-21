import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import Link from "next/link";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import InventoryItemsClient from "./InventoryItemsClient";

export const metadata: Metadata = {
  title: "Katalog Master Items | PT. Zahdan Kamal Sentosa",
  description: "Master list of all raw materials, ingredients, and packaging across warehouses.",
  robots: {
    index: false,
    follow: false,
  },
};

async function MasterItemsContent() {
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
        category="INVENTORY MANAGEMENT"
        title="Katalog Master Items Bahan Baku"
        description="Daftar induk seluruh bahan baku, bumbu, protein, dan packaging lintas gudang & cold storage."
        actions={
          <Link
            href="/admin/inventory/receiving"
            className="text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <span>+ Penerimaan Barang</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/admin/inventory"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Command Center</span>
          </Link>
        }
      >
        <InventoryItemsClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminItemsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat katalog master items..." rows={6} />
        </div>
      }
    >
      <MasterItemsContent />
    </Suspense>
  );
}
