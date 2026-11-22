import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { GoodsReceivingView } from "@/modules/warehouse/components/GoodsReceivingView";
import { getOrders, getProcurementOptions, getReceipts } from "@/modules/procurement/services/procurement.repository";

export const metadata: Metadata = {
  title: "Penerimaan barang | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [receipts, orders, options] = await Promise.all([getReceipts(), getOrders(), getProcurementOptions()]);
  return <GoodsReceivingView receipts={receipts} orders={orders} options={options} />;
}

export default function Page() {
  return (
    <AdminPage title="Penerimaan barang" description="Barang masuk dari supplier beserta hasil cek kualitas.">
      <Content />
    </AdminPage>
  );
}
