import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { PurchaseRequestsView } from "@/modules/procurement/components/PurchaseRequestsView";
import { getProcurementOptions, getRequests } from "@/modules/procurement/services/procurement.repository";

export const metadata: Metadata = {
  title: "Permintaan pembelian (PR) | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [requests, options] = await Promise.all([getRequests(), getProcurementOptions()]);
  return <PurchaseRequestsView requests={requests} options={options} />;
}

export default function Page() {
  return (
    <AdminPage title="Permintaan pembelian (PR)" description="Permintaan bahan dari dapur dan gudang sebelum dibelikan.">
      <Content />
    </AdminPage>
  );
}
