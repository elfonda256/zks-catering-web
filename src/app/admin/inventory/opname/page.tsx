import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { StockOpnameView } from "@/modules/inventory/components/StockOpnameView";
import {
  getCatalogItems,
  getFormOptions,
  getOpnameHistory,
  getStockByLocation,
} from "@/modules/inventory/services/inventory.repository";

export const metadata: Metadata = {
  title: "Stock opname | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const [items, options, stock, history] = await Promise.all([
    getCatalogItems(),
    getFormOptions(),
    getStockByLocation(),
    getOpnameHistory(),
  ]);
  return <StockOpnameView items={items} options={options} stock={stock} history={history} />;
}

export default function Page() {
  return (
    <AdminPage title="Stock opname" description="Hitung fisik stok dan selisihnya dengan catatan sistem.">
      <Content />
    </AdminPage>
  );
}
