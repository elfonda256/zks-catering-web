import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { DirectOrdersView } from "@/modules/sales/components/DirectOrdersView";

export const metadata: Metadata = {
  title: "Pesanan langsung | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Pesanan langsung" description="Pesanan lewat telepon, WhatsApp, atau datang langsung yang dicatat admin.">
      <DirectOrdersView />
    </AdminPage>
  );
}
