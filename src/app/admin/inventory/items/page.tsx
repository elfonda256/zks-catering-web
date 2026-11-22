import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { IngredientCatalogView } from "@/modules/inventory/components/IngredientCatalogView";
import { getCatalogItems, getFormOptions } from "@/modules/inventory/services/inventory.repository";

export const metadata: Metadata = {
  title: "Katalog bahan | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [items, options] = await Promise.all([getCatalogItems(), getFormOptions()]);
  return <IngredientCatalogView items={items} options={options} />;
}

export default function Page() {
  return (
    <AdminPage title="Katalog bahan" description="Data induk bahan baku per kategori dan jenis.">
      <Content />
    </AdminPage>
  );
}
