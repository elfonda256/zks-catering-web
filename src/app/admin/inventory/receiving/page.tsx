import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { GoodsReceivingView } from "@/modules/warehouse/components/GoodsReceivingView";

export const metadata: Metadata = {
  title: "Penerimaan barang | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Penerimaan barang" description="Barang masuk dari supplier beserta hasil cek kualitas.">
      <GoodsReceivingView />
    </AdminPage>
  );
}
