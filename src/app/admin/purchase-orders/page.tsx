import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { PurchaseOrdersView } from "@/modules/procurement/components/PurchaseOrdersView";

export const metadata: Metadata = {
  title: "Pembelian (PO) | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Pembelian (PO)" description="Pesanan bahan ke supplier dan status pengirimannya.">
      <PurchaseOrdersView />
    </AdminPage>
  );
}
