import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockOpnameView } from "@/modules/inventory/components/StockOpnameView";

export const metadata: Metadata = {
  title: "Stock opname | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Stock opname" description="Hitung fisik stok dan selisihnya dengan catatan sistem.">
      <StockOpnameView />
    </AdminPage>
  );
}
