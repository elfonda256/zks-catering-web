import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { startOfWibDay } from "@/lib/wib-date";
import { KitchenBoardView } from "@/modules/kitchen/components/KitchenBoardView";
import { getProductionOrders, getTodaySafetyChecks } from "@/modules/production/services/production.repository";

export const metadata: Metadata = {
  title: "Layar dapur | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [orders, checks] = await Promise.all([getProductionOrders({ onlyDay: startOfWibDay(new Date()) }), getTodaySafetyChecks()]);
  return <KitchenBoardView orders={orders} checks={checks} />;
}

export default function Page() {
  return (
    <AdminPage title="Layar dapur" description="Antrean masak hari ini dan cek keamanan pangan.">
      <Content />
    </AdminPage>
  );
}
