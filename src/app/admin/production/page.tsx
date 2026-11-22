import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { ProductionScheduleView } from "@/modules/production/components/ProductionScheduleView";
import { getProductionOrders, getSchedulableOrders } from "@/modules/production/services/production.repository";

export const metadata: Metadata = {
  title: "Jadwal produksi | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [orders, schedulable] = await Promise.all([getProductionOrders(), getSchedulableOrders()]);
  return <ProductionScheduleView orders={orders} schedulable={schedulable} />;
}

export default function Page() {
  return (
    <AdminPage title="Jadwal produksi" description="Perintah produksi per hari dan kebutuhan bahannya.">
      <Content />
    </AdminPage>
  );
}
