import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { DishesView } from "@/modules/production/components/DishesView";
import { getProcurementOptions } from "@/modules/procurement/services/procurement.repository";
import { getDishes } from "@/modules/production/services/production.repository";

export const metadata: Metadata = {
  title: "Hidangan | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [dishes, options] = await Promise.all([getDishes(), getProcurementOptions()]);
  return <DishesView dishes={dishes} items={options.items} />;
}

export default function Page() {
  return (
    <AdminPage title="Hidangan" description="Resep per hidangan dari jadwal menu harian, untuk kebutuhan bahan dan food cost yang akurat.">
      <Content />
    </AdminPage>
  );
}
