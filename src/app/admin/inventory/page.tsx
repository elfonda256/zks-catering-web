import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockOverviewView } from "@/modules/inventory/components/StockOverviewView";
import { getCatalogItems, getFormOptions } from "@/modules/inventory/services/inventory.repository";

export const metadata: Metadata = {
  title: "Stok | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [items, options] = await Promise.all([getCatalogItems(), getFormOptions()]);
  return <StockOverviewView items={items} options={options} />;
}

export default function Page() {
  return (
    <AdminPage title="Stok" description="Stok bahan per kategori dan bahan yang perlu dibeli.">
      <Content />
    </AdminPage>
  );
}
