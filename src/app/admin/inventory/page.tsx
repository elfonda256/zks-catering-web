import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockOverviewView } from "@/modules/inventory/components/StockOverviewView";

export const metadata: Metadata = {
  title: "Stok | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Stok" description="Stok bahan per kategori, yang perlu dibeli, dan yang segera kedaluwarsa.">
      <StockOverviewView />
    </AdminPage>
  );
}
