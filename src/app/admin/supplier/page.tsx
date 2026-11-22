import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { SuppliersView } from "@/modules/supplier/components/SuppliersView";

export const metadata: Metadata = {
  title: "Supplier | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Supplier" description="Daftar pemasok bahan, kontak, dan ketepatan pengiriman.">
      <SuppliersView />
    </AdminPage>
  );
}
