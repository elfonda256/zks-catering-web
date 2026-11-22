import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { RecipesView } from "@/modules/production/components/RecipesView";
import { getProcurementOptions } from "@/modules/procurement/services/procurement.repository";
import { getRecipes } from "@/modules/production/services/production.repository";

export const metadata: Metadata = {
  title: "Resep & bahan | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [recipes, options] = await Promise.all([getRecipes(), getProcurementOptions()]);
  return <RecipesView recipes={recipes} items={options.items} />;
}

export default function Page() {
  return (
    <AdminPage title="Resep & bahan" description="Komposisi bahan per porsi untuk setiap paket dan biaya bahannya.">
      <Content />
    </AdminPage>
  );
}
