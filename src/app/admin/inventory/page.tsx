import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockOverviewView } from "@/modules/inventory/components/StockOverviewView";
import { getBatchStock, getCatalogItems, getFormOptions } from "@/modules/inventory/services/inventory.repository";

export const metadata: Metadata = {
  title: "Stok | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [items, options, batches] = await Promise.all([getCatalogItems(), getFormOptions(), getBatchStock()]);
  return <StockOverviewView items={items} options={options} batches={batches} now={new Date().toISOString()} />;
}

export default function Page() {
  return (
    <AdminPage title="Stok" description="Stok bahan per kategori, yang perlu dibeli, dan yang segera kedaluwarsa.">
      <Content />
    </AdminPage>
  );
}
