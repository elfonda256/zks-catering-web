import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { PurchaseRequestsView } from "@/modules/procurement/components/PurchaseRequestsView";

export const metadata: Metadata = {
  title: "Permintaan pembelian (PR) | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Permintaan pembelian (PR)" description="Permintaan bahan dari dapur dan gudang sebelum dibelikan.">
      <PurchaseRequestsView />
    </AdminPage>
  );
}
