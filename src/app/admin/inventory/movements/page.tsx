import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockMovementsView } from "@/modules/inventory/components/StockMovementsView";

export const metadata: Metadata = {
  title: "Mutasi stok | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Mutasi stok" description="Catatan setiap bahan masuk, keluar, dipindah, dan disesuaikan.">
      <StockMovementsView />
    </AdminPage>
  );
}
