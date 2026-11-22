import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { SuppliersView } from "@/modules/supplier/components/SuppliersView";
import { getSuppliers } from "@/modules/supplier/services/supplier.repository";

export const metadata: Metadata = {
  title: "Supplier | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

/** Rendered inside AdminPage, so it only runs after the admin session is checked. */
async function Content() {
  const suppliers = await getSuppliers();
  return <SuppliersView suppliers={suppliers} />;
}

export default function Page() {
  return (
    <AdminPage title="Supplier" description="Daftar pemasok bahan, kontak, dan ketentuan pembayaran.">
      <Content />
    </AdminPage>
  );
}
