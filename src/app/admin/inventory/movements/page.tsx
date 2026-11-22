import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockMovementsView } from "@/modules/inventory/components/StockMovementsView";
import { getRecentMovements } from "@/modules/inventory/services/inventory.repository";

export const metadata: Metadata = {
  title: "Mutasi stok | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const movements = await getRecentMovements();
  return <StockMovementsView movements={movements} />;
}

export default function Page() {
  return (
    <AdminPage title="Mutasi stok" description="Catatan setiap bahan masuk, keluar, dipindah, dan disesuaikan.">
      <Content />
    </AdminPage>
  );
}
