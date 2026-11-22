import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { PurchaseOrdersView } from "@/modules/procurement/components/PurchaseOrdersView";
import { getOrders, getProcurementOptions } from "@/modules/procurement/services/procurement.repository";

export const metadata: Metadata = {
  title: "Pembelian (PO) | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [orders, options] = await Promise.all([getOrders(), getProcurementOptions()]);
  return <PurchaseOrdersView orders={orders} options={options} />;
}

export default function Page() {
  return (
    <AdminPage title="Pembelian (PO)" description="Pesanan bahan ke supplier dan status pengirimannya.">
      <Content />
    </AdminPage>
  );
}
