import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { IngredientCatalogView } from "@/modules/inventory/components/IngredientCatalogView";

export const metadata: Metadata = {
  title: "Katalog bahan | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Katalog bahan" description="Data induk bahan baku per kategori dan jenis.">
      <IngredientCatalogView />
    </AdminPage>
  );
}
