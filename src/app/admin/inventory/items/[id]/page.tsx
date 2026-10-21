import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
import ItemDetailClient from "./ItemDetailClient";

export const metadata: Metadata = {
  title: "Item Digital Asset Passport | PT. Zahdan Kamal Sentosa",
  description: "Digital Asset Passport untuk pengawasan spesifikasi, batch, dan pergerakan persediaan bahan baku.",
  robots: {
    index: false,
    follow: false,
  },
};

async function ItemDetailContent() {
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
        category="INVENTORY ASSET PASSPORT"
        title="Digital Passport Item & Batch"
        description="Spesifikasi detail, lokasi penyimpanan fisik, riwayat suhu, dan log batch FEFO."
        actions={
          <Link
            href="/admin/inventory/items"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors"
          >
            ← Kembali ke Katalog
          </Link>
        }
      >
        <ItemDetailClient />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminItemDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat passport bahan baku..." rows={6} />
        </div>
      }
    >
      <ItemDetailContent />
    </Suspense>
  );
}
