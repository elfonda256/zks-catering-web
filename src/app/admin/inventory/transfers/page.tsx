import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockTransfersView } from "@/modules/warehouse/components/StockTransfersView";
import { getCatalogItems, getFormOptions, getRecentMovements } from "@/modules/inventory/services/inventory.repository";

export const metadata: Metadata = {
  title: "Transfer | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [transfers, items, options] = await Promise.all([getRecentMovements("TRANSFER"), getCatalogItems(), getFormOptions()]);
  return <StockTransfersView transfers={transfers} items={items} options={options} />;
}

export default function Page() {
  return (
    <AdminPage title="Transfer" description="Perpindahan bahan antar gudang, chiller, freezer, dan dapur.">
      <Content />
    </AdminPage>
  );
}
