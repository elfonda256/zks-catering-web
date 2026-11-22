import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { ProductionScheduleView } from "@/modules/production/components/ProductionScheduleView";

export const metadata: Metadata = {
  title: "Jadwal produksi | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Jadwal produksi" description="Perintah produksi per hari dan kebutuhan bahannya.">
      <ProductionScheduleView />
    </AdminPage>
  );
}
