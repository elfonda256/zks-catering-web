import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { RecipesView } from "@/modules/production/components/RecipesView";

export const metadata: Metadata = {
  title: "Resep & bahan | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Resep & bahan" description="Komposisi bahan per porsi untuk setiap paket dan biaya bahannya.">
      <RecipesView />
    </AdminPage>
  );
}
