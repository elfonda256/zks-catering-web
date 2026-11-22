import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { startOfWibDay } from "@/lib/wib-date";
import { KitchenBoardView } from "@/modules/kitchen/components/KitchenBoardView";
import { getFoodSamples, getProductionOrders, getTodaySafetyChecks } from "@/modules/production/services/production.repository";

export const metadata: Metadata = {
  title: "Layar dapur | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const now = new Date();
  const [orders, checks, samples] = await Promise.all([
    getProductionOrders({ onlyDay: startOfWibDay(now) }),
    getTodaySafetyChecks(),
    getFoodSamples(),
  ]);
  return <KitchenBoardView orders={orders} checks={checks} samples={samples} now={now.toISOString()} />;
}

export default function Page() {
  return (
    <AdminPage title="Layar dapur" description="Antrean masak hari ini, cek titik kendali kritis, dan sampel makanan.">
      <Content />
    </AdminPage>
  );
}
