import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockTransfersView } from "@/modules/warehouse/components/StockTransfersView";

export const metadata: Metadata = {
  title: "Transfer | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Transfer" description="Perpindahan bahan antar gudang, chiller, freezer, dan dapur.">
      <StockTransfersView />
    </AdminPage>
  );
}
