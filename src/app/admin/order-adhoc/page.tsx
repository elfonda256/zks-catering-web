import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { DirectOrdersView } from "@/modules/sales/components/DirectOrdersView";
import { getDirectOrders } from "@/modules/sales/services/direct-orders.repository";

export const metadata: Metadata = {
  title: "Pesanan langsung | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const orders = await getDirectOrders();
  return <DirectOrdersView orders={orders} />;
}

export default function Page() {
  return (
    <AdminPage title="Pesanan langsung" description="Pesanan lewat telepon, WhatsApp, atau datang langsung yang dicatat admin.">
      <Content />
    </AdminPage>
  );
}
