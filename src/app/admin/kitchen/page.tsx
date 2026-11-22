import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { KitchenBoardView } from "@/modules/kitchen/components/KitchenBoardView";

export const metadata: Metadata = {
  title: "Layar dapur | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AdminPage title="Layar dapur" description="Antrean masak hari ini dan cek keamanan pangan.">
      <KitchenBoardView />
    </AdminPage>
  );
}
